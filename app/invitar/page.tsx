"use client"

import Image from "next/image"
import { useState } from "react"

export default function InvitarPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [referralLink, setReferralLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

  async function handleGenerate() {
    setError(null)
    setCopied(false)
    setReferralLink(null)

    const clean = email.trim().toLowerCase()
    if (!clean) {
      setError("Ingresá un email válido.")
      return
    }

    try {
      setLoading(true)

      const res = await fetch(`${BACKEND_URL}/referrals/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviter_email: clean }),
      })

      const text = await res.text().catch(() => "")
      if (!res.ok) throw new Error(text || "No se pudo generar el link.")

      const data = JSON.parse(text) as { code: string; url: string }

      // data.url viene tipo "/referido/ABC123..."
      const full = `${window.location.origin}${data.url}`
      setReferralLink(full)
    } catch (e: any) {
      setError(e?.message || "Error generando el link.")
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!referralLink) return
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function handleReset() {
    setEmail("")
    setError(null)
    setReferralLink(null)
    setCopied(false)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <Image src="/logo.jpg" alt="Logo" width={150} height={150} className="mx-auto" />

        <h1 className="text-3xl font-bold text-center">Invitá a un amigo</h1>
        <p className="text-center text-gray-600">
          Ingresá tu email para generar tu link único de invitación.
        </p>

        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && (
          <div className="w-full p-3 rounded-lg border border-red-200 bg-red-50 text-red-700">
            {error}
          </div>
        )}

        {!referralLink ? (
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-blue-600 disabled:opacity-50 text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Generando..." : "Generar link"}
          </button>
        ) : (
          <div className="w-full p-4 rounded-lg border border-green-200 bg-green-50 space-y-3">
            <div className="text-green-700 font-semibold">Link generado</div>

            <div className="text-sm text-gray-700">Tu link de invitación</div>
            <div className="flex gap-2">
              <input
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white"
                value={referralLink}
                readOnly
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold"
              >
                {copied ? "Copiado" : "Copiar"}
              </button>
            </div>

            <p className="text-sm text-gray-600">
              Compartilo con tus amigos para que se sumen.
            </p>

            <button
              onClick={handleReset}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold"
            >
              Generar otro link
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
