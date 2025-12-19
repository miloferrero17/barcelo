"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"

export default function ReferidoCodePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
  const params = useParams()

  const code = useMemo(() => {
    return (
      (params?.code as string) ||
      (Object.values(params || {})[0] as string) ||
      ""
    ).trim()
  }, [params])

  async function goToCheckout() {
    setError(null)
    setIsLoading(true)

    if (!code) {
      setError("No llegó el código en la URL.")
      setIsLoading(false)
      return
    }

    try {
      // (opcional) validar el code
      const vr = await fetch(`${BACKEND_URL}/referrals/resolve?code=${encodeURIComponent(code)}`)
      if (!vr.ok) {
        const t = await vr.text().catch(() => "")
        throw new Error(t || "Código inválido.")
      }

      const res = await fetch(`${BACKEND_URL}/mp/subscription/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })

      const text = await res.text().catch(() => "")
      if (!res.ok) throw new Error(text || "Error iniciando checkout.")

      const data = JSON.parse(text) as { init_point: string }
      window.location.href = data.init_point
    } catch (err: any) {
      setError(err?.message || "Error iniciando checkout")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    goToCheckout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <Image src="/logo.jpg" alt="Barcelo Rugby" width={150} height={150} className="mx-auto" />

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Te estamos redirigiendo</h1>
          <p className="text-gray-600">
            En unos segundos vas a continuar en Mercado Pago para completar el pago.
          </p>
          <p className="text-xs text-gray-400">Código: {code || "(sin código)"}</p>
        </div>

        {error && (
          <div className="w-full p-3 rounded-lg border border-red-200 bg-red-50 text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={goToCheckout}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50"
          >
            {isLoading ? "Redirigiendo..." : "Reintentar"}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Si no se abre Mercado Pago, tocá “Reintentar”.
          </p>
        </div>
      </div>
    </div>
  )
}
