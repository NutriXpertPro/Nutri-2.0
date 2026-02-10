import React from "react";
import HeroSection from "@/components/landing-v2/HeroSection";
import DetailedFeatures from "@/components/landing-v2/DetailedFeatures";
import Methodology from "@/components/landing-v2/Methodology";
import TestimonialsSection from "@/components/landing-v2/TestimonialsSection";
import PricingSection from "@/components/landing-v2/PricingSection";
import Logo from "@/components/landing-v2/Logo";
import MobileMenu from "@/components/landing-v2/MobileMenu";
import Link from "next/link";
import { Instagram, Linkedin, Twitter, MapPin, ShieldCheck, Zap, Users } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata = {
  title: "NutriXpertPro | Multiplica sua Autoridade Profissional com Inteligência Nutricional",
  description: "Domine a nutrição com anamnese completa, presets inteligentes e substituição de alimentos baseada em equivalência nutricional. Torne-se o nutricionista mais respeitado da sua região.",
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#050505] selection:bg-emerald-500/30 font-sans">

      {/* Header Premium com Gatilhos Mentais */}
      <header className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center">
          <Link href="/" className="flex items-center gap-0 group translate-x-[-2px]">
            <Logo />
            <div className="text-xl font-bold tracking-tighter text-white ml-[-15px] flex items-center">
              <span className="mr-1" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '1.3em', textShadow: '1px 1px 2px rgba(255,255,255,0.2)' }}>N</span>utri
              </span>
              <span className="text-emerald-500" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.1)' }}>
                <span className="text-[1.3em]" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.2)' }}>X</span>pert
              </span>
              <span className="ml-1 text-white" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.1)' }}>
                <span className="text-[1.3em]" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.2)' }}>P</span>ro
              </span>
            </div>
          </Link>
          <div className="flex-1 flex justify-end items-center gap-2 sm:gap-4">
            <Link href="/login/paciente" className="text-xs sm:text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors hidden md:block">
              Sou Paciente
            </Link>
            <div className="h-4 w-px bg-white/10 hidden md:block"></div>
            <Link
              href="/auth"
              className="px-3 py-2 text-xs sm:text-sm font-bold bg-white text-black rounded-full hover:bg-emerald-400 hover:text-black hover:scale-105 transition-all shadow-lg shadow-white/10 hidden md:block"
            >
              Entrar
            </Link>
            <Link
              href="/auth?tab=register"
              className="px-3 py-2 text-xs sm:text-sm font-medium text-neutral-300 hover:text-white transition-colors hidden md:block"
            >
              Começar Agora
            </Link>
            <MobileMenu />
          </div>
        </div>
      </header>

      <HeroSection />

      {/* Trust Bar Premium */}
      <div className="bg-black/50 border-y border-white/5 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-white text-xs font-bold tracking-widest uppercase">Conforme LGPD</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-500" />
              <span className="text-white text-xs font-bold tracking-widest uppercase">Dados Criptografados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-white text-xs font-bold tracking-widest uppercase">99.9% Disponibilidade</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-500" />
              <span className="text-white text-xs font-bold tracking-widest uppercase">Cloud Nutri-Secure</span>
            </div>
          </div>
        </div>
      </div>

      <div id="features">
        <DetailedFeatures />
      </div>

      <div id="methodology">
        <Methodology />
      </div>

      <div id="testimonials">
        <TestimonialsSection />
      </div>

      <div id="pricing">
        <PricingSection />
      </div>

      {/* FAQ com Benefícios Reais e Prova Social */}
      <section id="faq" className="py-24 bg-[#080808] border-t border-white/5">
        <div className="container px-4 md:px-6 mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">Perguntas Frequentes</h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border border-white/10 rounded-lg px-4 bg-[#111]">
              <AccordionTrigger className="text-white hover:text-emerald-400">Como o NutriXpertPro pode multiplicar minha produtividade?</AccordionTrigger>
              <AccordionContent className="text-neutral-400">
                Com nossos presets de refeições inteligentes, você economiza até 80% do tempo de planejamento de dietas. Nossos presets pré-configurados levam em conta objetivos específicos e restrições alimentares, permitindo que você crie dietas completas em segundos, não minutos. Além disso, nosso sistema de substituição de alimentos mantém equivalência nutricional automaticamente, garantindo que suas prescrições mantenham qualidade mesmo com preferências do paciente.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border border-white/10 rounded-lg px-4 bg-[#111]">
              <AccordionTrigger className="text-white hover:text-emerald-400">Como posso garantir diagnósticos mais precisos?</AccordionTrigger>
              <AccordionContent className="text-neutral-400">
                Nossa anamnese completa com 7 seções detalhadas captura todos os dados essenciais para diagnósticos precisos. Desde dados demográficos até histórico clínico, rotina, hábitos alimentares e objetivos, cada seção foi projetada para maximizar a qualidade das informações coletadas. Isso aumenta sua autoridade profissional e reduz o risco de erros de interpretação que podem comprometer o tratamento.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border border-white/10 rounded-lg px-4 bg-[#111]">
              <AccordionTrigger className="text-white hover:text-emerald-400">A plataforma é compatível com dispositivos móveis?</AccordionTrigger>
              <AccordionContent className="text-neutral-400">
                Sim, a plataforma é totalmente responsiva e funciona perfeitamente em computadores, tablets e smartphones. Isso significa que você pode trabalhar de qualquer lugar, e seus pacientes também têm acesso a um portal otimizado para dispositivos móveis, aumentando o engajamento e a adesão ao tratamento.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border border-white/10 rounded-lg px-4 bg-[#111]">
              <AccordionTrigger className="text-white hover:text-emerald-400">Como o sistema melhora a adesão do paciente?</AccordionTrigger>
              <AccordionContent className="text-neutral-400">
                Com nosso sistema de substituição de alimentos, você pode adaptar dietas às preferências do paciente sem sacrificar objetivos nutricionais. Isso aumenta significativamente a adesão ao tratamento. Além disso, nosso diário alimentar inteligente mantém os pacientes engajados com notificações e lembretes personalizados, transformando a experiência de acompanhamento em algo mais interativo e motivador.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5" className="border border-emerald-500/20 rounded-lg px-4 bg-emerald-950/10">
              <AccordionTrigger className="text-white hover:text-emerald-400 font-bold">Tenho alguma garantia ao assinar?</AccordionTrigger>
              <AccordionContent className="text-neutral-300">
                <span className="text-emerald-400 font-bold">Risco Zero:</span> Oferecemos uma garantia incondicional de 7 dias. Se você sentir que o NutriXpertPro não multiplicou sua produtividade ou não atendeu às suas expectativas, nós devolvemos 100% do seu investimento sem perguntas. Confiamos tanto na nossa plataforma que assumimos todo o risco por você.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer com Autoridade Profissional */}
      <footer className="pt-20 pb-10 bg-black border-t border-white/10">
        <div className="container px-6 mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16">
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center gap-0 mb-6">
                <Logo />
                <div className="text-2xl font-bold tracking-tighter text-white ml-[-15px] flex items-center">
                  <span className="mr-1" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.1)' }}>
                    <span style={{ fontSize: '1.3em', textShadow: '1px 1px 2px rgba(255,255,255,0.2)' }}>N</span>utri
                  </span>
                  <span className="text-emerald-500" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.1)' }}>
                    <span className="text-[1.3em]" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.2)' }}>X</span>pert
                  </span>
                  <span className="ml-1 text-white" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.1)' }}>
                    <span className="text-[1.3em]" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.2)' }}>P</span>ro
                  </span>
                </div>
              </div>
              <p className="text-neutral-500 max-w-sm mb-6">
                Plataforma premium para nutricionistas que desejam multiplicar sua autoridade profissional com inteligência nutricional.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-emerald-500 hover:text-black transition-all">
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-emerald-500 hover:text-black transition-all">
                  <Linkedin className="w-5 h-5" />
                </Link>
                <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-emerald-500 hover:text-black transition-all">
                  <Twitter className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Produto</h4>
              <ul className="space-y-4 text-sm text-neutral-500">
                <li><Link href="#features" className="hover:text-emerald-400 transition-colors">Funcionalidades</Link></li>
                <li><Link href="#pricing" className="hover:text-emerald-400 transition-colors">Planos e Preços</Link></li>
                <li><Link href="/docs" className="hover:text-emerald-400 transition-colors">Documentação</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Suporte</h4>
              <ul className="space-y-4 text-sm text-neutral-500">
                <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contato</Link></li>
                <li><Link href="/help" className="hover:text-emerald-400 transition-colors">Ajuda</Link></li>
                <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacidade</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-600 text-xs">
              © 2026 NutriXpertPro. Multiplicando autoridade profissional desde 2026.
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