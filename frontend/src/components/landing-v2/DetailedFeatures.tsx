"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HeartPulse, Brain, Apple, Droplets, Scale, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Anamnese Completa com 7 Seções",
    subtitle: "AUTORIDADE PROFISSIONAL",
    description: "Domine o diagnóstico com nossa anamnese completa dividida em 7 seções detalhadas. Capture todos os dados essenciais para aumentar sua autoridade profissional e garantir diagnósticos mais precisos.",
    points: ["Identificação Completa", "Rotina e Estilo de Vida", "Hábitos Alimentares Detalhados", "Histórico Clínico", "Objetivos Específicos", "Medidas Antropométricas", "Fotos de Acompanhamento"],
    icon: Stethoscope,
    color: "text-emerald-400",
    gradient: "from-emerald-500/20 to-teal-500/20"
  },
  {
    title: "Presets de Refeições Inteligentes",
    subtitle: "ECONOMIA DE TEMPO",
    description: "Crie dietas em segundos com presets inteligentes pré-configurados. Mais de 100 combinações prontas que economizam horas de planejamento e garantem consistência nas prescrições.",
    points: ["Combinações Pré-configuradas", "Economia de 80% do Tempo", "Equilíbrio Nutricional", "Adaptação Rápida", "Biblioteca Expansiva", "Personalização Avançada"],
    icon: Apple,
    color: "text-purple-400",
    gradient: "from-purple-500/20 to-pink-500/20"
  },
  {
    title: "Substituição Inteligente de Alimentos",
    subtitle: "PRECISÃO NUTRICIONAL",
    description: "Substitua alimentos com precisão absoluta através do nosso motor de equivalência nutricional. Garanta que as trocas mantenham os objetivos da dieta sem sacrificar a adesão do paciente.",
    points: ["Equivalência Nutricional Exata", "Base de Dados TACO/TBCA/USDA", "Substituição por Grupos", "Manutenção de Macros e Micros", "Adaptação Instantânea", "Segurança Nutricional"],
    icon: Scale,
    color: "text-emerald-400",
    gradient: "from-emerald-500/20 to-teal-500/20"
  }
];

export default function DetailedFeatures() {
  return (
    <section className="py-32 bg-[#050505] relative overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto">

        <div className="mb-24 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Recursos que <br />
            <span className="text-emerald-500">Multiplicam Sua Autoridade</span>
          </h2>
          <p className="text-neutral-400 text-lg">
            Plataforma completa para nutricionistas que desejam dominar a prática clínica com inteligência nutricional e autoridade profissional.
          </p>
        </div>

        <div className="space-y-32">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 md:gap-12 lg:gap-20 ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'}`}
            >
              {/* Content Side */}
              <div className="flex-1 space-y-8 min-h-[350px]">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 ${feature.color} text-xs font-bold tracking-widest uppercase`}>
                  <feature.icon className="w-4 h-4" />
                  {feature.subtitle}
                </div>

                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
                  {feature.title}
                </h3>

                <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
                  {feature.description}
                </p>

                <ul className="space-y-3 sm:space-y-4">
                  {feature.points.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-3 text-neutral-200 font-medium sm:items-center">
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center bg-white/5 ${feature.color} flex-shrink-0 mt-0.5 sm:mt-0`}>
                        <HeartPulse className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </div>
                      <span className="text-sm sm:text-base">{point}</span>
                    </li>
                  ))}
                </ul>
                
                {/* CTA para cada recurso */}
                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    className={`border ${feature.color.replace('text-', 'border-')} text-${feature.color.replace('text-', '')} hover:bg-${feature.color.replace('text-', '')}/10`}
                  >
                    Saiba como isso transforma sua prática
                  </Button>
                </div>
              </div>

              {/* Visual Side (Mockup Placeholder) */}
              <div className="flex-1 w-full relative group">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} blur-[80px] rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-1000`} />

                <div className="relative z-10 bg-[#0a0a0a] border border-white/10 rounded-2xl p-2 shadow-2xl overflow-hidden aspect-video flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
                  {/* Aqui entrariam os screenshots reais. Usando abstração geométrica por enquanto */}
                  <div className="w-full h-full bg-[#111] rounded-xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite]" />

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                      <feature.icon className={`w-16 h-16 ${feature.color} opacity-20 mx-auto mb-4`} />
                      <p className="text-neutral-600 text-sm font-mono uppercase tracking-widest">Demonstração do Recurso</p>
                    </div>

                    {/* Mock UI Elements */}
                    <div className="absolute top-4 left-4 right-4 h-4 bg-white/5 rounded w-1/3" />
                    <div className="absolute top-12 left-4 right-4 bottom-4 grid grid-cols-3 gap-4">
                      <div className="bg-white/5 rounded h-full col-span-2" />
                      <div className="bg-white/5 rounded h-full col-span-1" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Call-to-Action Final */}
        <div className="text-center mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <Button size="lg" className="h-14 px-8 text-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold" asChild>
              <Link href="/auth?tab=register">
                Comece a Multiplicar Sua Autoridade Hoje
              </Link>
            </Button>
          </motion.div>
          <p className="text-neutral-500 mt-4 text-sm">
            Setup instantâneo. Acesso total liberado imediatamente após o cadastro.
          </p>
        </div>
      </div>
    </section>
  );
}