"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { sponsors, products, membershipPlans } from "@/lib/data"
import {
  Users,
  Video,
  Star,
  Heart,
  Target,
  Trophy,
  TrendingUp,
  MapPin,
  Clock,
  Calendar,
  ShoppingCart,
} from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const heroImages = ["/hero-rugby.png", "/hero-rugby-2.jpg"]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  const values = [
    {
      icon: Heart,
      title: "Pasión",
      description: "Amamos el rugby y lo transmitimos en cada entrenamiento y partido",
    },
    {
      icon: Users,
      title: "Comunidad",
      description: "Somos una familia que se apoya dentro y fuera de la cancha",
    },
    {
      icon: Target,
      title: "Excelencia",
      description: "Buscamos ser mejores cada día en lo deportivo y lo humano",
    },
    {
      icon: Trophy,
      title: "Compromiso",
      description: "Dedicación total con el club, los compañeros y la sociedad",
    },
  ]

  const achievements = [
    { year: "2023", title: "Campeones del Torneo Regional" },
    { year: "2022", title: "Subcampeones Liga Metropolitana" },
    { year: "2021", title: "Mejor Club Formativo del Año" },
    { year: "2020", title: "Premio Fair Play UAR" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative h-[600px] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-navy">
          {heroImages.map((image, index) => (
            <Image
              key={image}
              src={image || "/placeholder.svg"}
              alt="Rugby action"
              fill
              className={`object-cover opacity-40 transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-40" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/40 to-navy" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-gold/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            {[...Array(3)].map((_, i) => (
              <Star key={i} size={16} className="text-gold fill-gold" />
            ))}
          </div>
          <h1
            className="text-5xl md:text-7xl font-bold text-white mb-4 text-balance"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            Barceló Rugby
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto text-balance">
            Rugby, universidad y comunidad
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-fuchsia hover:bg-fuchsia-dark text-white text-lg">
              <a href="#unete">Sumate al Plantel</a>
            </Button>
            <Button
              size="lg"
              asChild
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-navy text-lg bg-transparent"
            >
              <a href="#membresia">Membresía de Familia</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Unete Section */}
      <section id="unete" className="py-16 bg-white scroll-mt-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-fuchsia text-white">Unite al Club</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4" style={{ fontFamily: "var(--font-oswald)" }}>
              Sumate al Plantel
            </h2>
            <div className="inline-flex items-center gap-2 mb-6">
              {[...Array(3)].map((_, i) => (
                <Star key={i} size={16} className="text-gold fill-gold" />
              ))}
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Conocé dónde y cuándo entrenamos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Where */}
            <Card className="border-2 border-fuchsia/20 hover:border-fuchsia transition-all">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-fuchsia/10 rounded-full flex items-center justify-center mb-6">
                  <MapPin className="text-fuchsia" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-navy mb-4" style={{ fontFamily: "var(--font-oswald)" }}>
                  ¿Dónde Entrenamos?
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Nuestro campo de entrenamiento está ubicado en una zona accesible y cuenta con todas las instalaciones
                  necesarias para practicar rugby de forma profesional.
                </p>
                <Button asChild className="w-full bg-fuchsia hover:bg-fuchsia-dark">
                  <a href="https://maps.app.goo.gl/G2K6msdoabDT7Yx36" target="_blank" rel="noopener noreferrer">
                    <MapPin className="mr-2" size={18} />
                    Ver en Google Maps
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* When */}
            <Card className="border-2 border-fuchsia/20 hover:border-fuchsia transition-all">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-fuchsia/10 rounded-full flex items-center justify-center mb-6">
                  <Clock className="text-fuchsia" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-navy mb-4" style={{ fontFamily: "var(--font-oswald)" }}>
                  ¿Cuándo Entrenamos?
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="text-fuchsia flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-navy">Martes y Jueves</p>
                      <p className="text-muted-foreground">21:00 a 23:00 hs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="text-fuchsia flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-navy">Domingos</p>
                      <p className="text-muted-foreground">Partidos oficiales</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="bg-navy text-white rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-oswald)" }}>
              ¿Listo para empezar?
            </h3>
            <p className="text-white/80 mb-8 text-balance max-w-2xl mx-auto">
              Contactanos por Instagram y unite a la familia de Barceló Rugby. Te esperamos en el campo de juego.
            </p>
            <Button size="lg" asChild className="bg-fuchsia hover:bg-fuchsia-dark">
              <a href="https://ig.me/m/br.officielle" target="_blank" rel="noopener noreferrer">
                Contactar por Instagram
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Membresia Section */}
      <section id="membresia" className="py-16 bg-muted scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gold text-navy">Beneficios Exclusivos</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4" style={{ fontFamily: "var(--font-oswald)" }}>
              Membresía de Familia
            </h2>
            <div className="inline-flex items-center gap-2 mb-6">
              {[...Array(3)].map((_, i) => (
                <Star key={i} size={16} className="text-gold fill-gold" />
              ))}
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
              Formá parte de la familia Barceló Rugby y disfrutá de beneficios exclusivos
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
            {membershipPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`flex-1 min-w-[280px] max-w-md border-2 flex flex-col ${
                  plan.featured ? "border-gold shadow-lg" : "border-gray-200"
                }`}
              >
                <CardContent className="p-8 flex flex-col flex-1">
                  <h3 className="text-3xl font-bold text-navy mb-2" style={{ fontFamily: "var(--font-oswald)" }}>
                    {plan.name}
                  </h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-fuchsia">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">/ {plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Heart className="text-fuchsia flex-shrink-0 mt-1" size={18} />
                        <span className="text-muted-foreground leading-relaxed">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.featured ? "bg-gold hover:bg-gold-dark text-navy" : "bg-fuchsia hover:bg-fuchsia-dark"
                    }`}
                    size="lg"
                    asChild
                  >
                    <a href="https://ig.me/m/br.officielle" target="_blank" rel="noopener noreferrer">
                      Hacerse {plan.name}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="max-w-3xl mx-auto border-2 border-fuchsia/20">
              <CardContent className="p-8">
                <Users className="text-fuchsia mx-auto mb-4" size={48} />
                <h3 className="text-2xl font-bold text-navy mb-4">Beneficios para Toda la Familia</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Nuestras membresías son ideales para familias que quieren ser parte activa del club. Los miembros
                  tienen acceso a eventos exclusivos, descuentos en productos oficiales y la posibilidad de participar
                  en la vida social del club.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Streaming Section */}
      <section id="streaming" className="py-16 bg-white scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-fuchsia text-white">En Vivo</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4" style={{ fontFamily: "var(--font-oswald)" }}>
              Streaming
            </h2>
            <div className="inline-flex items-center gap-2 mb-6">
              {[...Array(3)].map((_, i) => (
                <Star key={i} size={16} className="text-gold fill-gold" />
              ))}
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
              Mirá todos nuestros partidos en vivo desde cualquier lugar
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-2 overflow-hidden">
              <div className="relative w-full bg-navy" style={{ paddingBottom: "56.25%" }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Video className="mx-auto mb-4 text-fuchsia" size={64} />
                    <h3 className="text-2xl font-bold mb-2">Próximo Partido en Vivo</h3>
                    <p className="text-white/80">Domingo 15:00 hs - vs Club Rival</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Tienda Section */}
      <section id="tienda" className="py-16 bg-muted scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-fuchsia text-white">Tienda Oficial</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4" style={{ fontFamily: "var(--font-oswald)" }}>
              Tienda
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
              Conseguí toda la indumentaria y accesorios oficiales del club
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {products.map((product) => (
              <Card key={product.id} className="border-2 hover:border-fuchsia transition-all overflow-hidden">
                <div className="relative aspect-square bg-gray-100">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-navy mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-fuchsia mb-4">{product.price}</p>
                  <Button className="w-full bg-fuchsia hover:bg-fuchsia-dark">
                    <ShoppingCart className="mr-2" size={18} />
                    Comprar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-fuchsia text-fuchsia hover:bg-fuchsia hover:text-white bg-transparent"
            >
              Ver toda la tienda
            </Button>
          </div>
        </div>
      </section>

      {/* Club Section */}
      <section id="club" className="py-16 bg-muted scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gold text-navy">Sobre Nosotros</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4" style={{ fontFamily: "var(--font-oswald)" }}>
              El Club
            </h2>
            <div className="inline-flex items-center gap-2 mb-6">
              {[...Array(3)].map((_, i) => (
                <Star key={i} size={16} className="text-gold fill-gold" />
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto mb-12">
            <div className="space-y-4 text-muted-foreground leading-relaxed text-center">
              <p>
                Fundación Barceló Rugby nació en 1995 como un proyecto deportivo-educativo, con la visión de formar
                jugadores de rugby que también fueran excelentes personas y profesionales.
              </p>
              <p>
                Hoy somos más que un club de rugby: somos una comunidad que reúne a más de 500 familias, con jugadores
                desde los 6 hasta los 40 años, en categorías infantiles, juveniles, primera división, rugby femenino y
                veteranos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
            <Card className="border-2">
              <CardContent className="p-6 text-center">
                <p className="text-4xl font-bold text-fuchsia mb-2">500+</p>
                <p className="text-sm text-muted-foreground">Jugadores</p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="p-6 text-center">
                <p className="text-4xl font-bold text-fuchsia mb-2">30</p>
                <p className="text-sm text-muted-foreground">Años</p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="p-6 text-center">
                <p className="text-4xl font-bold text-fuchsia mb-2">15</p>
                <p className="text-sm text-muted-foreground">Categorías</p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="p-6 text-center">
                <p className="text-4xl font-bold text-fuchsia mb-2">8</p>
                <p className="text-sm text-muted-foreground">Títulos</p>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-navy mb-8 text-center">Nuestros Valores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <Card key={index} className="border-2 hover:border-fuchsia transition-all text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-fuchsia/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="text-fuchsia" size={28} />
                    </div>
                    <h3 className="text-xl font-semibold text-navy mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-navy text-white rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Trophy className="text-gold mx-auto mb-4" size={48} />
              <h3 className="text-2xl md:text-3xl font-bold mb-2">Logros Recientes</h3>
            </div>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-6 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-gold/20"
                >
                  <div className="w-16 h-16 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-gold">{achievement.year}</span>
                  </div>
                  <h4 className="text-lg font-semibold">{achievement.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section id="sponsors" className="py-16 bg-navy text-white scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <TrendingUp className="mx-auto mb-4 text-gold" size={48} />
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-oswald)" }}>
              Sponsors
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto text-balance">Asociá tu marca con los valores del rugby</p>
          </div>

          {/* Macro Sponsor */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 mb-8 text-center border border-gold/30">
            <p className="text-gold text-sm font-semibold mb-4 flex items-center justify-center gap-2">
              <Star size={16} className="fill-gold" />
              MAIN SPONSOR
              <Star size={16} className="fill-gold" />
            </p>
            <div className="flex justify-center">
              <Image
                src={sponsors[0].logo || "/placeholder.svg"}
                alt={sponsors[0].name}
                width={300}
                height={150}
                className="opacity-90"
              />
            </div>
          </div>

          <div className="flex justify-center gap-6 mb-12">
            {sponsors.slice(1).map((sponsor) => (
              <div
                key={sponsor.id}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-8 w-64 h-64 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Image
                  src={sponsor.logo || "/placeholder.svg"}
                  alt={sponsor.name}
                  width={200}
                  height={200}
                  className="opacity-80 object-contain"
                />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-fuchsia hover:bg-fuchsia-dark" asChild>
              <a href="https://www.instagram.com/m/br.officielle" target="_blank" rel="noopener noreferrer">
                Quiero ser Sponsor
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section id="instagram" className="py-16 bg-background scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4" style={{ fontFamily: "var(--font-oswald)" }}>
              Seguinos en Instagram
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Mantente al día con todas nuestras actividades, eventos y partidos
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative w-full" style={{ paddingBottom: "125%" }}>
              <iframe
                src="https://www.instagram.com/br.officielle/embed"
                className="absolute inset-0 w-full h-full border-0 rounded-lg"
                title="Instagram Feed"
              />
            </div>
            <div className="text-center mt-4">
              <Button size="lg" asChild className="bg-fuchsia hover:bg-fuchsia-dark">
                <a href="https://www.instagram.com/br.officielle/" target="_blank" rel="noopener noreferrer">
                  Ver perfil completo
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
