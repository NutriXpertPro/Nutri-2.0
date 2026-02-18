"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Zap, 
  RefreshCw, 
  Database, 
  Users, 
  MessageCircle, 
  Star, 
  BarChart3, 
  Calendar, 
  Shield, 
  ClipboardList,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

const ecosystemItems = [
  {
    title: "Anamnese de Elite",
    subtitle: "7 SEÇÕES COMPLETAS",
    description: "Questionário completo com 7 seções. Perguntas condicionais que se adaptam a cada paciente. O diagnóstico mais preciso começa aqui.",
    icon: FileText,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "hover:border-emerald-500/30"
  },
  {
    title: "Presets Inteligentes",
    subtitle: "100+ COMBINAÇÕES",
    description: "Selecione tipo de refeição + dieta + proteína = cardápio completo gerado automaticamente. Crie dietas em 3 cliques.",
    icon: Zap,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "hover:border-purple-500/30"
  },
  {
    title: "Substituição Inteligente",
    subtitle: "ALGORITMO UUFT",
    description: "Algoritmo que substitui alimentos mantendo equivalência calórica. Frango → Salmão com porção ajustada automaticamente.",
    icon: RefreshCw,
    color: "text-teal-400",
    bgColor: "bg-teal-500/10",
    borderColor: "hover:border-teal-500/30"
  },
  {
    title: "Banco de Dados Premium",
    subtitle: "TACO + TBCA + USDA",
    description: "+10.000 alimentos com dados científicos. A maior base de dados nutricional do Brasil + 500+ suplementos.",
    icon: Database,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "hover:border-amber-500/30"
  },
  {
    title: "Gestão Inteligente",
    subtitle: "CRM COMPLETO",
    description: "Agenda, notificações push, evolução com fotos, histórico. Tudo em um lugar. Esqueça o Excel.",
    icon: Users,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "hover:border-rose-500/30"
  },
  {
    title: "Xpert Messenger",
    subtitle: "SEM EXPOR WHATSAPP",
    description: "Comunique-se sem expor seu número. Mensagens criptografadas, tempo real, LGPD compliant.",
    icon: MessageCircle,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "hover:border-cyan-500/30"
  },
  {
    title: "Sistema de Preferências",
    subtitle: "PERSONALIZAÇÃO",
    description: "O sistema aprende o que cada paciente ama. Sugestões personalizadas que aumentam a aderência ao tratamento.",
    icon: Star,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "hover:border-yellow-500/30"
  },
  {
    title: "Relatórios Visuais",
    subtitle: "EVOLUÇÃO",
    description: "Gráficos de evolução, fotos com timestamps, comparativo de medidas. Mostre resultados ao paciente.",
    icon: BarChart3,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "hover:border-blue-500/30"
  },
  {
    title: "Google Calendar",
    subtitle: "INTEGRAÇÃO",
    description: "Sincronização automática de consultas. Lembretes integrados. Sua agenda sempre atualizada.",
    icon: Calendar,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "hover:border-indigo-500/30"
  },
  {
    title: "Segurança Total",
    subtitle: "LGPD COMPLIANT",
    description: "Criptografia AES-256, LGPD compliant, dados isolados por nutritionist. Proteção que profissionais exigem.",
    icon: Shield,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "hover:border-emerald-500/30"
  },
  {
    title: "Dietas Ilimitadas",
    subtitle: "PLANEJAMENTO",
    description: "Crie planos alimentares sem limites. 10+ tipos de dieta. Instruções personalizadas com alertas automáticos.",
    icon: ClipboardList,
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
    borderColor: "hover:border-pink-500/30"
  }
];

export default function EcosystemV4() {
  return (
    <section className="py-24 md:py-32 bg-[#020804] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[10%] right-[5%] w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10 max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-bold tracking-widest">ECOSSISTEMA COMPLETO</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            Tudo que Você Precisa <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              em Uma Única Plataforma
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto"
          >
            11 recursos powerful que transformam sua prática nutricional. 
            Esqueça planilhas, WhatsApp e planilhas fragmentadas.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ecosystemItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="group relative"
            >
              <div className={`
                relative p-6 md:p-8 rounded-2xl bg-[#0A0A0A] border border-white/10 
                ${item.borderColor} transition-all duration-300 h-full
                hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.15)]
                hover:-translate-y-1
              `}>
                {/* Icon */}
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${item.bgColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className={`w-6 h-6 md:w-7 md:h-7 ${item.color}`} />
                </div>

                {/* Badge */}
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 ${item.color} text-[10px] font-bold tracking-widest uppercase mb-4`}>
                  {item.subtitle}
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {item.description}
                </p>

                {/* Arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <ArrowRight className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-16"
        >
          <Link 
            href="/auth?tab=register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full transition-all shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)] hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.7)]"
          >
            Experimente Todos os Recursos
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-neutral-500 text-sm mt-4">
            7 dias gratuitos • Sem necessidade de cartão
          </p>
        </motion.div>
      </div>
    </section>
  );
}
