"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X, Sparkles, Shield, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "R$ 0",
    period: "para sempre",
    description: "Perfeito para conhecer a plataforma",
    badge: "7 DIAS GRÁTIS",
    badgeColor: "bg-neutral-600",
    highlight: false,
    features: [
      { text: "Anamnese completa de 7 seções", included: true },
      { text: "Até 10 pacientes", included: true },
      { text: "Presets básicos", included: true },
      { text: "Banco de alimentos TACO", included: true },
      { text: "Agenda básica", included: true },
      { text: "Suporte por email", included: true },
      { text: "Pacientes ilimitados", included: false },
      { text: "Presets inteligentes (100+)", included: false },
      { text: "Banco de suplementos (500+)", included: false },
      { text: "Substituição automática", included: false },
      { text: "Xpert Messenger", included: false },
      { text: "Relatórios de evolução", included: false },
      { text: "Suporte prioritário", included: false },
    ],
    cta: "Começar Trial Grátis",
    ctaVariant: "outline"
  },
  {
    name: "Professional",
    price: "R$ 59,90",
    period: "/mês",
    originalPrice: "R$ 89,90",
    promoText: "Primeiros 3 meses",
    description: "Ideal para nutricionistas em crescimento",
    badge: "ESPECIAL 3 MESES",
    badgeColor: "bg-emerald-500",
    highlight: true,
    features: [
      { text: "Anamnese completa de 7 seções", included: true },
      { text: "Pacientes ilimitados", included: true },
      { text: "Presets inteligentes (100+)", included: true },
      { text: "Banco de suplementos (500+)", included: true },
      { text: "Substituição automática", included: true },
      { text: "Xpert Messenger", included: true },
      { text: "Relatórios de evolução", included: true },
      { text: "Agenda completa", included: true },
      { text: "Suporte prioritário", included: true },
      { text: "Integração Google Calendar", included: true },
      { text: "Dietas ilimitadas", included: true },
      { text: "Relatórios visuais", included: true },
    ],
    cta: "Garantir Oferta Especial",
    ctaVariant: "premium"
  },
  {
    name: "Annual",
    price: "R$ 49,90",
    period: "/mês",
    originalPrice: "R$ 89,90",
    promoText: "Cobrado anualmente",
    description: "Melhor custo-benefício",
    badge: "ECONOMIZE 44%",
    badgeColor: "bg-purple-500",
    highlight: false,
    features: [
      { text: "Tudo do Professional", included: true },
      { text: "2 meses gratuitos", included: true },
      { text: "Treinamento exclusivo", included: true },
      { text: "Prioridade máxima", included: true },
      { text: "Consultoria estratégica", included: true },
      { text: "Migrations gratuitas", included: true },
    ],
    cta: "Economizar 44% - Escolher Anual",
    ctaVariant: "secondary"
  }
];

const guarantees = [
  { icon: Shield, text: "Garantia de 7 dias" },
  { icon: Zap, text: "Cancele quando quiser" },
  { icon: Check, text: "Segurança LGPD" }
];

export default function PricingV4() {
  return (
    <section className="py-24 md:py-32 bg-[#020804] relative overflow-hidden" id="pricing">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-bold tracking-widest">PLANOS E PREÇOS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            Escolha o Plano <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Perfeito</span> <br />
            para Sua Carreira
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Investimento que se paga sozinho com a economia de tempo e aumento de produtividade.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative p-6 md:p-8 rounded-2xl border ${
                plan.highlight 
                  ? 'bg-gradient-to-b from-emerald-500/10 to-[#0A0A0A] border-emerald-500/30 shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]' 
                  : 'bg-[#0A0A0A] border-white/10'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${plan.badgeColor} text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg`}>
                  {plan.badge}
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-neutral-500 text-sm mb-4">{plan.description}</p>
                
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-4xl md:text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-neutral-500 text-sm">{plan.period}</span>
                </div>
                
                {plan.originalPrice && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-neutral-500 line-through text-sm">{plan.originalPrice}</span>
                    {plan.promoText && (
                      <span className="text-emerald-400 text-xs font-medium">{plan.promoText}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3 text-sm">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-neutral-600 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? "text-neutral-300" : "text-neutral-600"}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button 
                className={`w-full h-12 ${
                  plan.ctaVariant === 'premium' 
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)]'
                    : plan.ctaVariant === 'secondary'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20'
                }`}
                asChild
              >
                <Link href="/auth?tab=register">
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Guarantees */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-6 md:gap-12 mt-12"
        >
          {guarantees.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-neutral-400">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <item.icon className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-neutral-500 text-sm mt-8"
        >
          * Após o período promocional, o plano mensal retorna para R$ 69,90/mês
        </motion.p>
      </div>
    </section>
  );
}
