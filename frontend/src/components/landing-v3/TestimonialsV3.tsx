"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote, Award, HeartHandshake } from "lucide-react";

const testimonials = [
  {
    name: "Dra. Mariana Santos",
    role: "Nutricionista Clínica",
    institution: "CRN-3 45.892",
    text: "O NutriXpertPro revolucionou minha prática. Economizo 80% do tempo com os presets inteligentes.",
    rating: 5,
    result: "+40% Retenção"
  },
  {
    name: "Dr. Ricardo Almeida",
    role: "Nutricionista Esportivo",
    institution: "CRN-4 12.345",
    text: "Crio protocolos complexos em segundos. O banco de suplementos com 500+ itens é incrível.",
    rating: 5,
    result: "+60% Produtividade"
  },
  {
    name: "Dra. Camila Ferreira",
    role: "Nutricionista Funcional",
    institution: "CRN-9 33.221",
    text: "O sistema de substituição inteligente mantém os objetivos nutricionais perfeitamente.",
    rating: 5,
    result: "+35% Eficácia"
  },
  {
    name: "Dra. Beatriz Lima",
    role: "Nutrição Comportamental",
    institution: "CRN-1 22.441",
    text: "A interface premium e a facilidade de uso aumentaram muito a adesão dos pacientes.",
    rating: 5,
    result: "+50% Adesão"
  },
  {
    name: "Dr. Felipe Castro",
    role: "Nutricionista em Emagrecimento",
    institution: "CRN-2 55.773",
    text: "O acompanhamento das medidas antropométricas gera um impacto visual enorme.",
    rating: 5,
    result: "10x mais Visual"
  },
  {
    name: "Dra. Juliana Prado",
    role: "Nutrição Materno-Infantil",
    institution: "CRN-5 88.211",
    text: "As bases de dados TACO e TBCA integradas dão a segurança técnica que preciso.",
    rating: 5,
    result: "100% Precisão"
  }
];

export default function TestimonialsV3() {
  return (
    <section className="py-32 bg-gradient-to-b from-[#080808] to-[#050505] relative border-t border-white/5">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-6 py-2 mb-6"
          >
            <Award className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-400 text-sm font-medium">Reconhecimento Profissional</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            Transformação na <span className="text-emerald-500">Prática Clínica</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-b from-[#0a0a0a] to-[#080808] border border-white/10 p-8 rounded-2xl relative hover:border-emerald-500/30 transition-all group"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-white/10 group-hover:text-emerald-500/30 transition-colors" />

              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, starI) => (
                  <Star key={starI} className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                ))}
              </div>

              <p className="text-neutral-300 mb-8 leading-relaxed italic text-sm">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              <div className="flex items-center gap-4 mb-4">
                <div>
                  <h4 className="text-white font-bold text-base leading-tight">{testimonial.name}</h4>
                  <p className="text-emerald-500 text-xs font-medium">{testimonial.role}</p>
                  <p className="text-neutral-500 text-[10px] mt-0.5">{testimonial.institution}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-500/5 px-3 py-1.5 rounded-full w-fit">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>{testimonial.result}</span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-8 bg-white/5 border border-white/10 rounded-2xl px-12 py-8"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white">2.500+</div>
              <div className="text-neutral-400 text-sm">Nutricionistas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">98%</div>
              <div className="text-neutral-400 text-sm">Satisfação</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">10M+</div>
              <div className="text-neutral-400 text-sm">Refeições Criadas</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
