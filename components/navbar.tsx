"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: "/#club", label: "El Club" },
    { href: "/#sponsors", label: "Sponsors" },
    { href: "/#tienda", label: "Tienda" },
    { href: "/#streaming", label: "Streaming" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.jpg" alt="Barceló Rugby" width={64} height={64} className="object-contain" />
            <span className="text-navy font-semibold text-lg hidden sm:inline">Barceló Rugby</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-navy/80 hover:text-fuchsia transition-colors text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              className="border-fuchsia text-fuchsia hover:bg-fuchsia hover:text-white bg-transparent"
            >
              <a href="/#unete">Sumate</a>
            </Button>
            <Button asChild className="bg-fuchsia hover:bg-fuchsia/90 text-white">
              <a href="/#membresia">Membresía de Familia</a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-navy"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-3 border-t border-gray-200">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-navy/80 hover:text-fuchsia transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              <Button
                asChild
                variant="outline"
                className="border-fuchsia text-fuchsia hover:bg-fuchsia hover:text-white w-full bg-transparent"
              >
                <a href="/#unete" onClick={() => setMobileMenuOpen(false)}>
                  Sumate
                </a>
              </Button>
              <Button asChild className="bg-fuchsia hover:bg-fuchsia/90 text-white w-full">
                <a href="/#membresia" onClick={() => setMobileMenuOpen(false)}>
                  Membresía de Familia
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
