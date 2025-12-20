import os
from typing import Dict
from urllib.parse import quote

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from supabase import create_client

# Carga variables de entorno (Local/EC2)
load_dotenv()

# -----------------------------
# CONFIGURACIÓN DE ENTORNO
# -----------------------------
SUPABASE_URL = os.getenv("SUPABASE_URL")
SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Importante: FRONTEND_ORIGIN debe ser la URL de tu Next.js (ej: https://tudominio.com)
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
FRONTEND_BASE_URL = os.getenv("FRONTEND_BASE_URL", "http://localhost:3000").rstrip("/")

MP_PREAPPROVAL_PLAN_ID = os.getenv("MP_PREAPPROVAL_PLAN_ID")

if not SUPABASE_URL or not SERVICE_ROLE_KEY:
    raise RuntimeError("ERROR: Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el .env")

# Cliente Supabase
supabase = create_client(SUPABASE_URL, SERVICE_ROLE_KEY)

# -----------------------------
# APP + CORS CONFIG
# -----------------------------
app = FastAPI(title="Referral & MP API")

# Lista de orígenes permitidos
origins = [
    FRONTEND_ORIGIN,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# MODELOS DE DATOS (Pydantic)
# -----------------------------
class CreateReq(BaseModel):
    inviter_email: EmailStr

class ClaimReq(BaseModel):
    code: str
    referred_email: EmailStr

class MpInitReq(BaseModel):
    code: str

class MpReturnReq(BaseModel):
    code: str
    params: Dict[str, str] = {}

# -----------------------------
# ENDPOINTS
# -----------------------------

@app.get("/health")
def health():
    return {"status": "online", "environment": "production"}

# --- REFERRALS ---

@app.post("/referrals/create")
def create_referral(req: CreateReq):
    inviter_email = str(req.inviter_email).lower().strip()

    # 1. Buscar si ya tiene un código
    try:
        existing = (
            supabase.table("referral_codes")
            .select("code")
            .eq("inviter_email", inviter_email)
            .limit(1)
            .execute()
        )
        if existing.data:
            code = existing.data[0]["code"]
            return {"code": code, "url": f"/referido/{code}"}

        # 2. Si no existe, crear uno nuevo
        res = (
            supabase.table("referral_codes")
            .insert({"inviter_email": inviter_email})
            .execute()
        )
        code = res.data[0]["code"]
        return {"code": code, "url": f"/referido/{code}"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/referrals/resolve")
def resolve_referral(code: str):
    try:
        res = (
            supabase.table("referral_codes")
            .select("inviter_email, expires_at, uses_count, max_uses")
            .eq("code", code.strip())
            .single() # Trae un solo objeto
            .execute()
        )
        if not res.data:
            raise HTTPException(status_code=404, detail="invalid_code")
        
        return {
            "code": code,
            "inviter": {"email": res.data["inviter_email"]},
            "meta": res.data
        }
    except Exception:
        raise HTTPException(status_code=404, detail="code_not_found")

@app.post("/referrals/claim")
def claim_referral(req: ClaimReq):
    try:
        res = supabase.rpc(
            "claim_referral",
            {"p_code": req.code.strip(), "p_referred_email": req.referred_email.lower().strip()},
        ).execute()
        
        if not res.data:
            raise HTTPException(status_code=400, detail="claim_failed")
            
        return {"ok": True, "inviter": {"email": res.data[0].get("inviter_email")}}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- MERCADO PAGO ---

@app.post("/mp/subscription/init")
def mp_subscription_init(req: MpInitReq):
    if not MP_PREAPPROVAL_PLAN_ID:
        raise HTTPException(status_code=500, detail="MP_PREAPPROVAL_PLAN_ID not configured")

    back_url = f"{FRONTEND_BASE_URL}/mp/return?code={quote(req.code.strip())}"
    
    checkout_url = (
        "https://www.mercadopago.com.ar/subscriptions/checkout"
        f"?preapproval_plan_id={quote(MP_PREAPPROVAL_PLAN_ID)}"
        f"&back_url={quote(back_url, safe='')}"
    )
    return {"init_point": checkout_url}

@app.post("/mp/return")
def mp_return(req: MpReturnReq):
    try:
        supabase.table("referral_returns").insert({
            "code": req.code.strip(),
            "raw_params": req.params,
        }).execute()
        return {"ok": True}
    except Exception:
        return {"ok": False, "detail": "Logging failed but process continues"}

@app.post("/mp/webhook")
async def mp_webhook(request: Request):
    payload = await request.json()
    try:
        supabase.table("mp_webhooks").insert({"payload": payload}).execute()
    except:
        pass
    return {"ok": True}