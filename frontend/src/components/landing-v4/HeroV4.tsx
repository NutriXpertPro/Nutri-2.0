"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Zap, ShieldCheck, Scale, Users, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

function AnimatedCounter({ end, duration = 2, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
}

export default function HeroV4() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#020804] text-white pt-20 pb-16">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        {/* Gradient Orbs */}
        <div className="absolute top-[10%] left-[10%] w-[600px] h-[600px] bg-emerald-500/10 blur-[180px] rounded-full mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-purple-600/8 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 blur-[200px] rounded-full mix-blend-screen" />
      </div>

      <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center flex-1 justify-center max-w-6xl mx-auto">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8"
        >
          <Star className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 text-sm font-medium">A escolha de 2.500+ nutricionistas</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl leading-tight text-center"
        >
          Pare de Perder Horas com Planilhas.{/*break*/} 
          <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 drop-shadow-[0_0_25px_rgba(16,185,129,0.4)]">
            Atenda Mais com Qualidade Superior.
          </span>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base md:text-lg lg:text-xl text-neutral-400 max-w-3xl mb-10 leading-relaxed text-center mx-auto px-4"
        >
          Domine a prática clínica com <strong className="text-white">anamnese completa de 7 seções</strong>, 
          <strong className="text-white"> presets inteligentes</strong> e 
          <strong className="text-white"> substituição automatizada</strong> de alimentos. 
          A tecnologia que transforma nutricionistas em referências de mercado.
        </motion.p>

        {/* Benefícios com ícones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-wrap justify-center gap-6 mb-12 max-w-3xl"
        >
          <div className="flex items-center gap-2 text-sm text-neutral-300">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Zap className="h-4 w-4 text-emerald-400" />
            </div>
            <span><strong className="text-emerald-400">Economize 80%</strong> do tempo</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-300">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </div>
            <span><strong className="text-emerald-400">Anamnese</strong> Profissional</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-300">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Scale className="h-4 w-4 text-emerald-400" />
            </div>
            <span><strong className="text-emerald-400">Substituição</strong> Inteligente</span>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-16 w-full max-w-lg"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-full sm:w-auto"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl blur opacity-30 transition duration-1000"></div>
            <Button
              size="lg"
              className="relative h-14 px-8 w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] overflow-hidden"
              asChild
            >
              <Link href="/auth?tab=register">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Star className="w-5 h-5" />
                  Começar Trial Grátis
                  <ArrowRight className="h-5 w-5" />
                </span>
              </Link>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 w-full sm:w-auto border-neutral-700 bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white hover:border-emerald-500/50 transition-all backdrop-blur-sm"
              asChild
            >
              <Link href="#demo" className="flex items-center justify-center gap-2">
                <Play className="h-4 w-4 fill-current text-emerald-400" />
                Ver Como Funciona
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Prova Social - Números */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full max-w-3xl"
        >
          <div className="grid grid-cols-3 gap-4 md:gap-8 p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-1">
                <AnimatedCounter end={2500} suffix="+" />
              </div>
              <div className="text-xs md:text-sm text-neutral-500">Nutricionistas</div>
            </div>
            <div className="text-center border-l border-r border-white/5">
              <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-1">
                <AnimatedCounter end={10} suffix="M" />
              </div>
              <div className="text-xs md:text-sm text-neutral-500">Refeições</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-1">
                <AnimatedCounter end={99} suffix="%" />
              </div>
              <div className="text-xs md:text-sm text-neutral-500">Satisfação</div>
            </div>
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-500"
        >
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>7 dias grátis</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>Sem cartão de crédito</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>LGPD Compliant</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
