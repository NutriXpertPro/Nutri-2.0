"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Play, Hexagon, ShieldCheck, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const [logoError, setLogoError] = useState(false);

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050505] text-white pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-emerald-500/20 blur-[150px] rounded-full mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center flex-1 justify-center">

        {/* Headline Principal com Gatilhos Mentais */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 max-w-5xl leading-tight text-center"
        >
          MULTIPLIQUE SUA <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 drop-shadow-[0_0_25px_rgba(16,185,129,0.4)]">
            AUTORIDADE PROFISSIONAL
          </span>
          <br />
          COM INTELIGÊNCIA DE ELITE
        </motion.h1>

        {/* Subheadline com Benefícios Reais */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base md:text-lg lg:text-xl text-neutral-400 max-w-4xl mb-10 leading-relaxed font-light text-center mx-auto px-4"
        >
          Domine a prática clínica com anamnese completa de 7 seções, presets inteligentes e substituição automatizada de alimentos. <strong className="text-white">A tecnologia que transforma nutricionistas em referências de mercado.</strong>
        </motion.p>

        {/* Benefícios com Prova Social */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-wrap justify-center gap-8 mb-12 max-w-4xl"
        >
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Zap className="h-5 w-5 text-emerald-500" />
            <span>Economize até 80% do tempo de planejamento</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <span>Anamnese completa com 7 seções detalhadas</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Hexagon className="h-5 w-5 text-emerald-500" />
            <span>Substituição automática de alimentos</span>
          </div>
        </motion.div>

        {/* CTAs com Urgência e Escassez */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-5 items-center w-full justify-center mb-20 px-4"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group w-full sm:w-auto"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl blur opacity-25 transition duration-1000"></div>
            <Button
              size="lg"
              className="relative h-14 px-6 sm:px-10 text-base sm:text-lg bg-black hover:bg-black text-white border-0 shadow-[0_0_40px_-10px_rgba(0,0,0,0.6)] font-bold tracking-wide overflow-hidden w-full sm:w-auto"
              asChild
            >
              <Link href="/register">
                <span className="relative z-10 flex items-center justify-center sm:justify-start">
                  <span className="text-emerald-500 mr-2">★</span> Torne-se um Especialista
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                {/* Shine Effect with Frame Motion */}
                <motion.span
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-full sm:w-auto"
          >
            <Button
              size="lg"
              variant="outline"
              className="group h-14 px-6 sm:px-8 text-base sm:text-lg border-neutral-700 bg-black/40 text-neutral-300 hover:bg-white/5 hover:text-white transition-all backdrop-blur-sm hover:border-emerald-500/50 overflow-hidden relative w-full sm:w-auto"
              asChild
            >
              <Link href="#tour" className="flex items-center justify-center sm:justify-start">
                <Play className="mr-2 h-4 w-4 fill-current group-hover:scale-125 transition-transform text-emerald-500" />
                Veja Demonstração Completa
                <motion.div
                  className="absolute inset-0 border border-emerald-500/0 group-hover:border-emerald-500/50 rounded-md"
                  initial={false}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Prova Social e Urgência */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-sm text-neutral-500 text-center max-w-2xl"
        >
          <Users className="h-4 w-4 inline mr-2" />
          Junte-se a mais de <span className="text-emerald-500 font-bold">2.500+</span> nutricionistas que já multiplicaram sua autoridade profissional com o NutriXpertPro
        </motion.div>
      </div>

    </section>
  );
}