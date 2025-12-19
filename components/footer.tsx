import { Instagram } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.jpg" alt="Barceló Rugby" width={48} height={48} className="object-contain" />
              <span className="font-semibold text-lg">Barceló Rugby</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Rugby, universidad y comunidad. Formamos jugadores y personas.
            </p>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-gold mb-4">Seguinos</h3>
            <div className="flex gap-3 mb-6">
              <a
                href="https://www.instagram.com/br.officielle/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-fuchsia/20 hover:bg-fuchsia rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
            <p className="text-white/60 text-xs">
              © 2025 Fundación Barceló Rugby
              <br />
              Todos los derechos reservados
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
