"use client";

import React from "react";
import { motion } from "framer-motion";
import { HeartPulse, Stethoscope, Apple, Scale, Database, Shield } from "lucide-react";

const ecosystemItems = [
  {
    title: "Anamnese Completa",
    subtitle: "7 SEÇÕES DETALHADAS",
    description: "Capture todos os dados essenciais para diagnósticos precisos.",
    icon: Stethoscope,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10"
  },
  {
    title: "Presets Inteligentes",
    subtitle: "100+ COMBINAÇÕES",
    description: "Crie dietas em segundos com presets pré-configurados.",
    icon: Apple,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10"
  },
  {
    title: "Substituição Automática",
    subtitle: "EQUIVALÊNCIA NUTRICIONAL",
    description: "Motor de precisão que mantém macros ao substituir alimentos.",
    icon: Scale,
    color: "text-teal-400",
    bgColor: "bg-teal-500/10"
  },
  {
    title: "Banco de Dados Premium",
    subtitle: "ALIMENTOS & SUPLEMENTOS",
    description: "Acesso a milhares de alimentos e 500+ suplementos prontos.",
    icon: Database,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10"
  },
  {
    title: "Gestão de Pacientes",
    subtitle: "AGENDA & EVOLUÇÃO",
    description: "Organize sua prática com agenda inteligente e notificações.",
    icon: HeartPulse,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10"
  },
  {
    title: "Segurança LGPD",
    subtitle: "DADOS CRIPTOGRAFADOS",
    description: "Conformidade total com LGPD. Dados criptografados.",
    icon: Shield,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10"
  }
];

export default function EcosystemV3() {
  return (
    <section className="py-32 bg-[#050505] relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[10%] right-[5%] w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="mb-20 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-bold tracking-widest">ECOSSISTEMA COMPLETO</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            Tudo que Você Precisa em <br />
            <span className="text-emerald-500">Uma Única Plataforma</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ecosystemItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative"
            >
              <div className="relative p-8 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-emerald-500/30 transition-all duration-300 h-full">
                <div className={`w-14 h-14 rounded-2xl ${item.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className={`w-7 h-7 ${item.color}`} />
                </div>

                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 ${item.color} text-[10px] font-bold tracking-widest uppercase mb-4`}>
                  {item.subtitle}
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
