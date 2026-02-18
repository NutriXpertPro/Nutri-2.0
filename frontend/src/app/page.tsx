import React from "react";
import HeroV4 from "@/components/landing-v4/HeroV4";
import EcosystemV4 from "@/components/landing-v4/EcosystemV4";
import ProductivityV3 from "@/components/landing-v3/ProductivityV3";
import PerformanceV3 from "@/components/landing-v3/PerformanceV3";
import TestimonialsV3 from "@/components/landing-v3/TestimonialsV3";
import PricingV4 from "@/components/landing-v4/PricingV4";
import Logo from "@/components/landing-v3/Logo";
import MobileMenuV3 from "@/components/landing-v3/MobileMenuV3";
import Link from "next/link";
import { Instagram, Linkedin, Twitter, MapPin } from "lucide-react";

export const metadata = {
  title: "NutriXpertPro | A Nova Era da Nutrição Clínica de Elite",
  description: "Multiplique seu faturamento e recupere seu tempo livre com a inteligência de elite do NutriXpertPro. O ecossistema 360º para nutricionistas de alta performance.",
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#020804] selection:bg-emerald-500/30 font-sans text-white overflow-x-hidden">
      
      {/* Header Sophisticated Glass */}
      <header className="fixed top-0 w-full z-50 bg-[#020804]/40 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="scale-75 origin-left">
              <Logo />
            </div>
            <div className="text-xl font-bold tracking-tighter text-white ml-[-20px]">
              Nutri<span className="text-emerald-500">Xpert</span><span className="text-white/50 font-light ml-1 text-sm uppercase tracking-widest">Pro</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#ecosystem" className="text-sm font-medium text-neutral-400 hover:text-emerald-400 transition-colors">Ecossistema</Link>
            <Link href="#productivity" className="text-sm font-medium text-neutral-400 hover:text-emerald-400 transition-colors">Produtividade</Link>
            <Link href="#performance" className="text-sm font-medium text-neutral-400 hover:text-emerald-400 transition-colors">Performance</Link>
            <Link href="#pricing" className="text-sm font-medium text-neutral-400 hover:text-emerald-400 transition-colors">Planos</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/auth" className="hidden sm:block text-sm font-medium text-neutral-400 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link
              href="/auth?tab=register"
              className="px-6 py-2.5 text-sm font-bold bg-white text-black rounded-full hover:bg-emerald-400 hover:scale-105 transition-all shadow-lg shadow-emerald-500/10"
            >
              Começar Agora
            </Link>
            <MobileMenuV3 />
          </div>
        </div>
      </header>

      <HeroV4 />
      
      <div id="ecosystem">
        <EcosystemV4 />
      </div>

      <div id="productivity">
        <ProductivityV3 />
      </div>

      <div id="performance">
        <PerformanceV3 />
      </div>

      <div id="testimonials">
        <TestimonialsV3 />
      </div>

      <div id="pricing">
        <PricingV4 />
      </div>

      <footer className="pt-24 pb-12 bg-black/50 border-t border-white/5">
        <div className="container px-6 mx-auto text-center">
          <div className="flex flex-col items-center mb-12">
             <Logo />
             <div className="text-2xl font-bold tracking-tighter text-white mt-[-20px]">
              Nutri<span className="text-emerald-500">Xpert</span>Pro
            </div>
            <p className="text-neutral-500 max-w-sm mt-6 text-sm">
              Elevando a autoridade de nutricionistas através da ciência e tecnologia de elite.
            </p>
          </div>

          <div className="flex justify-center gap-6 mb-12">
            <Link href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-emerald-500 hover:text-black transition-all">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-emerald-500 hover:text-black transition-all">
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-emerald-500 hover:text-black transition-all">
              <Twitter className="w-5 h-5" />
            </Link>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-600 text-[10px] uppercase tracking-widest">
              © 2026 NutriXpertPro. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-2 text-neutral-600 text-xs">
              <MapPin className="w-3 h-3" /> Brasil
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
