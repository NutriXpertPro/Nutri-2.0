"use client";

import React from "react";
import { motion } from "framer-motion";
import { Server, Shield, Zap, Activity, Globe, Lock } from "lucide-react";

const performanceFeatures = [
  { icon: Zap, title: "Velocidade Extrema", description: "Páginas carregam em menos de 1 segundo", metric: "< 1s", metricLabel: "Tempo de Carregamento" },
  { icon: Server, title: "Infraestrutura Cloud", description: "Servidores distribuídos globalmente", metric: "99.9%", metricLabel: "Uptime Garantido" },
  { icon: Shield, title: "Segurança Empresarial", description: "Criptografia AES-256 e conformidade LGPD", metric: "256-bit", metricLabel: "Criptografia" },
  { icon: Activity, title: "Monitoramento 24/7", description: "Sistema de monitoramento contínuo", metric: "24/7", metricLabel: "Monitoramento" }
];

export default function PerformanceV3() {
  return (
    <section className="py-32 bg-[#050505] relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[30%] left-[5%] w-[600px] h-[600px] bg-purple-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-bold tracking-widest">PERFORMANCE & SEGURANÇA</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            Tecnologia de <span className="text-emerald-500">Ponta</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-neutral-400 text-lg max-w-2xl mx-auto"
          >
            Infraestrutura robusta e segura para garantir a melhor experiência.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group p-8 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-emerald-500/30 transition-all relative overflow-hidden"
            >
              <div className="relative">
                <feature.icon className="w-10 h-10 text-emerald-400 mb-6" />
                <div className="text-3xl font-bold text-white mb-1">{feature.metric}</div>
                <div className="text-emerald-400 text-sm mb-4">{feature.metricLabel}</div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-neutral-400 text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
