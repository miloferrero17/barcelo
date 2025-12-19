// app/mp/return/page.tsx
import Link from "next/link"

export const dynamic = "force-dynamic" // importante: evita prerender estático en Amplify

export default function MpReturnPage({
  searchParams,
}: {
  searchParams: {
    code?: string
    status?: string
    collection_status?: string
    preapproval_id?: string
  }
}) {
  const code = searchParams.code ?? ""
  const status = searchParams.status ?? searchParams.collection_status ?? ""
  const preapprovalId = searchParams.preapproval_id ?? ""

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">¡Listo!</h1>
        <p className="text-gray-600">Volviste desde Mercado Pago.</p>

        {status && (
          <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-sm">
            Estado: <span className="font-semibold">{status}</span>
          </div>
        )}

        {code ? (
          <div className="p-3 rounded-lg border border-green-200 bg-green-50 text-green-700 text-sm">
            Código de referido: <span className="font-mono font-semibold">{code}</span>
          </div>
        ) : (
          <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
            No llegó el código de referido.
          </div>
        )}

        {preapprovalId && (
          <div className="text-xs text-gray-500">
            preapproval_id: <span className="font-mono">{preapprovalId}</span>
          </div>
        )}

        <div className="pt-2 space-y-2">
          <Link
            href="/"
            className="inline-block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  )
}
