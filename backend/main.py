import os
import json
from typing import Any, Dict
from urllib.parse import quote

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from supabase import create_client

# Local dev only (en Lambda no hace falta)
load_dotenv()

# -----------------------------
# ENV
# -----------------------------
SUPABASE_URL = os.getenv("SUPABASE_URL")
SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
FRONTEND_BASE_URL = os.getenv("FRONTEND_BASE_URL", "http://localhost:3000").rstrip("/")

MP_PREAPPROVAL_PLAN_ID = os.getenv("MP_PREAPPROVAL_PLAN_ID")

if not SUPABASE_URL or not SERVICE_ROLE_KEY:
    raise RuntimeError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(SUPABASE_URL, SERVICE_ROLE_KEY)

# -----------------------------
# APP + CORS
# -----------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_ORIGIN,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# MODELS
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
# HEALTH
# -----------------------------
@app.get("/health")
def health():
    return {"ok": True}


# -----------------------------
# REFERRALS
# -----------------------------
@app.post("/referrals/create")
def create_referral(req: CreateReq):
    """
    Código único por inviter_email (get-or-create).
    Recomendado en DB: UNIQUE(inviter_email) y UNIQUE(code).
    """
    inviter_email = str(req.inviter_email).lower().strip()

    # 1) buscar existente
    try:
        existing = (
            supabase.table("referral_codes")
            .select("code")
            .eq("inviter_email", inviter_email)
            .limit(1)
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"supabase_error: {e}")

    if isinstance(existing.data, list) and len(existing.data) > 0:
        code = existing.data[0]["code"]
        return {"code": code, "url": f"/referido/{code}"}

    # 2) crear (si hay race y choca unique, re-leemos)
    try:
        res = (
            supabase.table("referral_codes")
            .insert({"inviter_email": inviter_email}, returning="representation")
            .execute()
        )
    except Exception:
        # race condition -> re-leer
        try:
            existing2 = (
                supabase.table("referral_codes")
                .select("code")
                .eq("inviter_email", inviter_email)
                .limit(1)
                .execute()
            )
            if isinstance(existing2.data, list) and len(existing2.data) > 0:
                code = existing2.data[0]["code"]
                return {"code": code, "url": f"/referido/{code}"}
        except Exception as e2:
            raise HTTPException(status_code=500, detail=f"supabase_error: {e2}")

        raise HTTPException(status_code=500, detail="could_not_create_code")

    if not res.data or not isinstance(res.data, list) or "code" not in res.data[0]:
        raise HTTPException(status_code=500, detail="could_not_create_code")

    code = res.data[0]["code"]
    return {"code": code, "url": f"/referido/{code}"}


@app.get("/referrals/resolve")
def resolve_referral(code: str):
    code = code.strip()

    try:
        res = (
            supabase.table("referral_codes")
            .select("inviter_email, expires_at, uses_count, max_uses")
            .eq("code", code)
            .limit(1)
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"supabase_error: {e}")

    row = res.data[0] if isinstance(res.data, list) and len(res.data) else None
    if not row:
        raise HTTPException(status_code=404, detail="invalid_code")

    return {
        "code": code,
        "inviter": {"email": row["inviter_email"]},
        "meta": {
            "expires_at": row.get("expires_at"),
            "uses_count": row.get("uses_count"),
            "max_uses": row.get("max_uses"),
        },
    }


@app.post("/referrals/claim")
def claim_referral(req: ClaimReq):
    """
    Si lo usás: RPC transaccional en DB: claim_referral(p_code, p_referred_email)
    """
    code = req.code.strip()
    referred_email = str(req.referred_email).lower().strip()

    try:
        res = supabase.rpc(
            "claim_referral",
            {"p_code": code, "p_referred_email": referred_email},
        ).execute()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"claim_failed: {e}")

    data = res.data[0] if isinstance(res.data, list) and len(res.data) else None
    if not data:
        raise HTTPException(status_code=400, detail="claim_failed")

    return {"ok": True, "inviter": {"email": data.get("inviter_email")}}


# -----------------------------
# MERCADO PAGO - OPTION A
# -----------------------------
@app.post("/mp/subscription/init")
def mp_subscription_init(req: MpInitReq):
    """
    Opción A:
    - No llama a la API de MP
    - Devuelve el link al checkout del plan
    - Lleva el code en back_url para retorno a tu sitio
    """
    code = req.code.strip()
    if not code:
        raise HTTPException(status_code=400, detail="missing_code")

    if not MP_PREAPPROVAL_PLAN_ID:
        raise HTTPException(status_code=500, detail="missing_mp_plan_id")

    back_url = f"{FRONTEND_BASE_URL}/mp/return?code={quote(code)}"

    checkout = (
        "https://www.mercadopago.com.ar/subscriptions/checkout"
        f"?preapproval_plan_id={quote(MP_PREAPPROVAL_PLAN_ID)}"
        f"&back_url={quote(back_url, safe='')}"
    )

    return {"init_point": checkout}


@app.post("/mp/return")
def mp_return(req: MpReturnReq):
    """
    Llamado por tu página /mp/return (front) para registrar que volvió.
    Esto es LOG/UX. La acreditación real idealmente viene por webhook.
    """
    code = req.code.strip()
    if not code:
        raise HTTPException(status_code=400, detail="missing_code")

    params = req.params or {}

    # Guardar evento de retorno (si tenés tabla)
    # Tabla sugerida: referral_returns(code, raw_params jsonb, created_at)
    try:
        supabase.table("referral_returns").insert(
            {
                "code": code,
                "raw_params": params,  # jsonb en supabase
            },
            returning="minimal",
        ).execute()
    except Exception:
        # No frenamos UX por un fallo de logging
        pass

    return {"ok": True, "message": "Retorno registrado. Gracias."}


@app.post("/mp/webhook")
async def mp_webhook(request: Request):
    """
    Placeholder webhook.
    Para acreditar de verdad: guardar payload y consultar a MP con MP_ACCESS_TOKEN.
    """
    try:
        payload = await request.json()
    except Exception:
        payload = {}

    # Log mínimo (si tenés tabla mp_webhooks)
    try:
        supabase.table("mp_webhooks").insert(
            {"payload": payload},
            returning="minimal",
        ).execute()
    except Exception:
        pass

    return {"ok": True}
