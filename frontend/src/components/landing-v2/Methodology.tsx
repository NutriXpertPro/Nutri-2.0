"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Brain, Target, Clock, BarChart3, Users, Zap, FileText, Activity, Ruler, Calendar, TestTube } from "lucide-react";

const steps = [
  {
    title: "Domínio da Anamnese Completa",
    desc: "Capture todos os dados essenciais com nossa anamnese de 7 seções. Torne-se o nutricionista que seus pacientes confiam por sua autoridade profissional.",
    icon: FileText,
    color: "bg-blue-500"
  },
  {
    title: "Presets Inteligentes de Refeições",
    desc: "Crie dietas em segundos, não minutos. Economize até 80% do tempo de planejamento com presets inteligentes pré-configurados.",
    icon: Target,
    color: "bg-emerald-500"
  },
  {
    title: "Substituição Inteligente de Alimentos",
    desc: "Substitua alimentos mantendo equivalência nutricional exata por meio do nosso motor de precisão. Aumente a adesão do paciente sem sacrificar objetivos.",
    icon: Activity,
    color: "bg-purple-500"
  },
  {
    title: "Avaliação Corporal Avançada",
    desc: "Registre medidas corporais, evolução e transformações. Transforme dados em conquistas visíveis para seus pacientes.",
    icon: Ruler,
    color: "bg-teal-500"
  },
  {
    title: "Gestão de Pacientes Inteligente",
    desc: "Organize sua agenda, acompanhe evolução e mantenha seus pacientes engajados com notificações inteligentes.",
    icon: Users,
    color: "bg-teal-500"
  },
  {
    title: "Suplementação Personalizada",
    desc: "Mais de 500 suplementos prontos para prescrição. Torne-se o especialista em suplementação que seus pacientes procuram.",
    icon: TestTube,
    color: "bg-amber-500"
  }
];

export default function Methodology() {
  return (
    <section className="py-24 bg-[#080808] relative">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Multiplicador de <span className="text-emerald-500">Autoridade Profissional</span>
          </h2>
          <p className="text-neutral-500 max-w-2xl mx-auto text-lg">
            Um sistema completo que transforma sua prática clínica em uma experiência de autoridade nutricional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group"
            >
              <div className={`w-12 h-12 rounded-2xl ${step.color} flex items-center justify-center mb-6 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
                <step.icon className="text-white w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{step.desc}</p>
              
              {/* Elemento de benefício adicional */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-emerald-400 text-xs font-semibold">RECURSO PREMIUM LIBERADO</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Call-to-Action Final */}
        <div className="text-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-block"
          >
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Transforme sua Carreira Hoje</h3>
              <p className="text-neutral-400 mb-6">
                Acesse todos os recursos do NutriXpertPro por apenas R$ 49,90 nos primeiros 3 meses.
              </p>
              <Button className="h-14 px-10 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl" asChild>
                <Link href="/auth?tab=register">
                  Começar Agora
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}