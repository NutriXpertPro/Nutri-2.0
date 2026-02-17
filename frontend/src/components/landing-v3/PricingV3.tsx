"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "R$ 49,90",
    period: "/mês",
    description: "Perfeito para nutricionistas que estão começando",
    features: [
      "Anamnese completa de 7 seções",
      "Até 50 pacientes",
      "Presets de refeições básicos",
      "Banco de alimentos TACO",
      "Agenda básica",
      "Suporte por email"
    ],
    highlighted: false,
    cta: "Começar Agora"
  },
  {
    name: "Professional",
    price: "R$ 89,90",
    period: "/mês",
    description: "Ideal para nutricionistas em crescimento",
    features: [
      "Tudo do Starter +",
      "Pacientes ilimitados",
      "Presets inteligentes (100+)",
      "Banco de suplementos (500+)",
      "Substituição automática",
      "Agenda avançada",
      "Relatórios de evolução",
      "Suporte prioritário"
    ],
    highlighted: true,
    cta: "Tornar-se Professional"
  },
  {
    name: "Enterprise",
    price: "R$ 149,90",
    period: "/mês",
    description: "Para clínicas e consultórios",
    features: [
      "Tudo do Professional +",
      "Múltiplos profissionais",
      "App white-label",
      "API de integração",
      "Analytics avançado",
      "Gestão financeira",
      "Treinamento personalizado",
      "Suporte dedicado 24/7"
    ],
    highlighted: false,
    cta: "Falar com Consultor"
  }
];

export default function PricingV3() {
  return (
    <section className="py-32 bg-[#080808] relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="text-center mb-20">
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
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            Escolha o Plano <span className="text-emerald-500">Perfeito</span> <br />
            para Sua Carreira
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-neutral-400 text-lg max-w-2xl mx-auto"
          >
            Investimento que se paga sozinho com a economia de tempo e aumento de produtividade.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative p-8 rounded-2xl border ${
                plan.highlighted 
                  ? 'bg-gradient-to-b from-emerald-500/10 to-[#0a0a0a] border-emerald-500/30' 
                  : 'bg-[#0a0a0a] border-white/10'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-xs font-bold px-4 py-1 rounded-full">
                  MAIS POPULAR
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-neutral-500 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-neutral-500">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3 text-neutral-300 text-sm">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full ${plan.highlighted ? 'bg-emerald-500 hover:bg-emerald-600 text-black' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                asChild
              >
                <Link href="/auth?tab=register">
                  {plan.cta}
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-neutral-500 text-sm">
            Todos os planos com garantia de 7 dias. Cancele quando quiser.
          </p>
        </div>
      </div>
    </section>
  );
}
