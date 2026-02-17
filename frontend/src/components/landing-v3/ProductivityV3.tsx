"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, Zap, Target, TrendingUp, Calendar, FileText, BarChart3, CheckCircle2 } from "lucide-react";

const productivityFeatures = [
  { icon: Clock, title: "Economia de Tempo", value: "80%", description: "Reduza o tempo de planejamento", color: "text-blue-400" },
  { icon: Zap, title: "Criação Rápida", value: "3x", description: "Crie dietas 3x mais rápido", color: "text-yellow-400" },
  { icon: Target, title: "Precisão", value: "99%", description: "Cálculos nutricionais precisos", color: "text-emerald-400" },
  { icon: TrendingUp, title: "Produtividade", value: "+60%", description: "Aumente sua capacidade", color: "text-purple-400" }
];

const workflowSteps = [
  { number: "01", title: "Anamnese Digital", description: "Capture dados completos em minutos", icon: FileText },
  { number: "02", title: "Presets Personalizados", description: "Escolha entre 100+ presets", icon: Target },
  { number: "03", title: "Ajustes Automáticos", description: "Sistema calcula automaticamente", icon: BarChart3 },
  { number: "04", title: "Acompanhamento", description: "Monitore evolução com relatórios", icon: Calendar }
];

export default function ProductivityV3() {
  return (
    <section className="py-32 bg-[#080808] relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-blue-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-bold tracking-widest">PRODUTIVIDADE MÁXIMA</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            Trabalhe <span className="text-emerald-500">Menos</span>, <br />
            Alcance <span className="text-emerald-500">Mais</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {productivityFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all group"
            >
              <feature.icon className={`w-8 h-8 ${feature.color} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
              <div className={`text-4xl font-bold ${feature.color} mb-2`}>{feature.value}</div>
              <div className="text-white font-semibold mb-2">{feature.title}</div>
              <div className="text-neutral-500 text-sm">{feature.description}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10"
            >
              <div className="text-5xl font-bold text-emerald-500/20 mb-4">{step.number}</div>
              <step.icon className="w-8 h-8 text-emerald-400 mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
              <p className="text-neutral-400 text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
