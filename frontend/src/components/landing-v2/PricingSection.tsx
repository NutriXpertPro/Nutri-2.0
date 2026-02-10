"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Star, Zap, Crown, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true); // Mudança: Anual como padrão

  return (
    <section className="py-32 bg-[#080808] border-t border-white/5 relative overflow-hidden">
      {/* Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-400 text-sm font-medium">Melhor Valor</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Escale Sua <span className="text-emerald-500">Autoridade Profissional</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg mb-10">
            Invista na plataforma que já transformou a prática de mais de 2.500 nutricionistas em todo o Brasil
          </p>

          <div className="flex items-center justify-center gap-4 text-white mb-12">
            <span className={`text-sm ${!isAnnual ? 'text-neutral-400' : 'text-white font-bold'}`}>Mensal</span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-emerald-500"
            />
            <span className={`text-sm ${isAnnual ? 'text-white font-bold' : 'text-neutral-400'}`}>
              Anual <span className="text-emerald-400 text-xs ml-1 font-normal">(Economize 25%)</span>
            </span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-stretch">
            {/* Plano Mensal - Com mais vida */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-[#111] to-[#050505] flex flex-col shadow-[0_0_30px_-15px_rgba(16,185,129,0.1)] relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Zap className="w-20 h-20 text-emerald-500" />
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Plano <span className="text-emerald-500">NutriXpert</span> Mensal</h3>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">Flexível</span>
                </div>
                <p className="text-neutral-400 text-sm mb-6 h-10">
                    Acesso total a todos os recursos. Cancele quando quiser.
                </p>

                <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-white">R$ 49,90</span>
                        <span className="text-neutral-500">/mês</span>
                    </div>
                    <p className="text-emerald-400 text-sm mt-2 font-medium">Nos 3 primeiros meses</p>
                    <p className="text-neutral-500 text-xs mt-1">Após o 3º mês: R$ 69,90/mês</p>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                    {[
                        'Acesso Total e Ilimitado',
                        'Anamnese Completa (7 Seções)',
                        'Presets de Refeições Inteligentes',
                        'Motor de Equivalência Nutricional',
                        'Avaliações Corporais e Fotos',
                        'Gestão Completa de Pacientes',
                        'App do Paciente Incluso',
                        'Suporte Humanizado'
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-neutral-300">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span className="text-sm">{item}</span>
                        </li>
                    ))}
                </ul>

                <Button 
                  className="w-full h-14 bg-white text-black hover:bg-emerald-400 hover:text-black font-bold transition-all"
                  asChild
                >
                    <Link href="/auth?tab=register&plan=monthly">
                        Começar Agora
                    </Link>
                </Button>
            </motion.div>

            {/* Plano Anual - Destaque Máximo */}
            <motion.div
              whileHover={{ y: -10 }}
              className="p-8 rounded-3xl border-2 border-emerald-500 bg-gradient-to-b from-[#111] to-[#0a0a0a] relative flex flex-col shadow-[0_0_60px_-15px_rgba(16,185,129,0.3)]"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-black px-6 py-1 rounded-full text-xs font-bold">
                MELHOR CUSTO-BENEFÍCIO
              </div>
              
              <div className="flex items-center justify-between mb-4 pt-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-emerald-500">NutriXpert</span> Anual 
                  <Crown className="w-5 h-5 fill-current text-emerald-500" />
                </h3>
              </div>
              
              <p className="text-neutral-400 text-sm mb-6 h-10">
                  Economia máxima com todos os recursos liberados por 12 meses.
              </p>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-white">R$ 49,90</span>
                  <span className="text-neutral-400">/mês</span>
                </div>
                <p className="text-emerald-400 text-sm mt-2 font-medium">
                  Preço fixo garantido por 1 ano
                </p>
                <p className="text-neutral-500 text-xs mt-1">
                  Faturado anualmente R$ 598,80
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {[
                    'Tudo do Plano Mensal',
                    'Acesso Ilimitado a Novos Recursos',
                    'Selo de Autoridade Premium',
                    'Prioridade Total no Suporte',
                    'Exportação de Relatórios PDF Customizados',
                    'Backup em Nuvem Nutri-Secure'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white">
                    <div className="p-1 rounded-full bg-emerald-500/20 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                    </div>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-center gap-2 mt-5 py-2 px-4 bg-emerald-500/5 rounded-full border border-emerald-500/10">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-semibold text-neutral-300">
                  Garantia incondicional de <span className="text-emerald-400">7 dias</span>
                </span>
              </div>
            </motion.div>
        </div>
        
        {/* Prova social */}
        <div className="text-center mt-16">
          <p className="text-neutral-500 text-sm">
            Junte-se a <span className="text-emerald-500 font-bold">2.500+ nutricionistas</span> que já transformaram sua prática
          </p>
        </div>
      </div>
    </section>
  );
}