"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote, Award, GraduationCap, HeartHandshake } from "lucide-react";

const testimonials = [
  {
    name: "Dra. Mariana Santos",
    role: "Nutricionista Clínica",
    institution: "CRN-3 45.892",
    image: "https://images.pexels.com/photos/7578803/pexels-photo-7578803.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1",
    specialty: "Mestre em Nutrição Humana",
    text: "O NutriXpertPro revolucionou minha prática. Com a anamnese de 7 seções e os presets inteligentes, economizo 80% do tempo. O motor de equivalência nutricional é preciso e seguro.",
    rating: 5,
    result: "+40% Retenção"
  },
  {
    name: "Dr. Ricardo Almeida",
    role: "Nutricionista Esportivo",
    institution: "CRN-4 12.345",
    image: "https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1",
    specialty: "Especialista em Performance",
    text: "Crio protocolos complexos em segundos. O banco de suplementos com 500+ itens me dá uma autoridade incrível nas prescrições para atletas de alto rendimento.",
    rating: 5,
    result: "+60% Produtividade"
  },
  {
    name: "Dra. Camila Ferreira",
    role: "Nutricionista Funcional",
    institution: "CRN-9 33.221",
    image: "https://images.pexels.com/photos/7623267/pexels-photo-7623267.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1",
    specialty: "Pós-graduada em Funcional",
    text: "O sistema de substituição inteligente mantém os objetivos nutricionais mesmo com as preferências do paciente. Transformou minha prática e meus resultados clínicos.",
    rating: 5,
    result: "+35% Eficácia"
  },
  {
    name: "Dra. Beatriz Lima",
    role: "Nutrição Comportamental",
    institution: "CRN-1 22.441",
    image: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1",
    specialty: "Foco em Transtornos Alimentares",
    text: "A interface premium e a facilidade de uso para o paciente no app aumentaram muito a adesão. O diário alimentar integrado é uma ferramenta terapêutica poderosa.",
    rating: 5,
    result: "+50% Adesão"
  },
  {
    name: "Dr. Felipe Castro",
    role: "Nutricionista em Emagrecimento",
    institution: "CRN-2 55.773",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1",
    specialty: "Expert em Fisiologia do Exercício",
    text: "O acompanhamento das medidas antropométricas e fotos no sistema gera um impacto visual enorme para o paciente. Eles amam ver a evolução em gráficos claros.",
    rating: 5,
    result: "10x mais Visual"
  },
  {
    name: "Dra. Juliana Prado",
    role: "Nutrição Materno-Infantil",
    institution: "CRN-5 88.211",
    image: "https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1",
    specialty: "Especialista em Nutrição Pediátrica",
    text: "As bases de dados TACO e TBCA integradas dão a segurança técnica que eu preciso para prescrever dietas infantis com precisão de micro e macronutrientes.",
    rating: 5,
    result: "100% Precisão Técnica"
  },
  {
    name: "Dr. André Volpi",
    role: "Nutricionista Clínico-Hospitalar",
    institution: "CRN-6 19.442",
    image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1",
    specialty: "Especialista em Patologias",
    text: "O upload de exames laboratoriais e a análise comparativa facilitam muito o acompanhamento clínico. É um software robusto para quem busca seriedade.",
    rating: 5,
    result: "Análise Superior"
  },
  {
    name: "Dra. Letícia Mayer",
    role: "Nutrição e Estética",
    institution: "CRN-8 37.119",
    image: "https://images.pexels.com/photos/1181682/pexels-photo-1181682.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1",
    specialty: "Especialista em Fitoterapia",
    text: "O NutriXpertPro é o software mais bonito e funcional que já usei. Transmite um profissionalismo imenso para os meus pacientes de alto valor aquisitivo.",
    rating: 5,
    result: "Posicionamento Premium"
  },
  {
    name: "Dr. Gustavo Mendes",
    role: "Nutrição Oncológica",
    institution: "CRN-3 99.440",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1",
    specialty: "Mestre em Oncologia",
    text: "A capacidade de personalizar cada detalhe da dieta é fundamental no meu nicho. O sistema é flexível e ao mesmo tempo extremamente rigoroso nos cálculos.",
    rating: 5,
    result: "Rigor Científico"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-32 bg-gradient-to-b from-[#050505] to-[#080808] relative border-t border-white/5">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-6 py-2 mb-6">
            <Award className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-400 text-sm font-medium">Reconhecimento Profissional</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Transformação na <span className="text-emerald-500">Prática Clínica</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
            Nutricionistas renomados compartilham como o NutriXpertPro transformou sua autoridade profissional e resultados clínicos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-b from-[#0a0a0a] to-[#080808] border border-white/10 p-8 rounded-2xl relative hover:border-emerald-500/30 transition-all group hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.15)]"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-white/10 group-hover:text-emerald-500/30 transition-colors" />

              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, starI) => (
                  <Star key={starI} className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                ))}
              </div>

              <p className="text-neutral-300 mb-8 leading-relaxed italic text-sm">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-14 h-14 shrink-0">
                  <div className="absolute inset-0 bg-emerald-500 blur-sm opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-full h-full rounded-full object-cover border-2 border-emerald-500/30 relative z-10"
                  />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base leading-tight">{testimonial.name}</h4>
                  <p className="text-emerald-500 text-xs font-medium">{testimonial.role}</p>
                  <p className="text-neutral-500 text-[10px] mt-0.5">{testimonial.institution}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-[11px] text-neutral-500 mb-3">
                <GraduationCap className="w-3 h-3" />
                <span className="truncate">{testimonial.specialty}</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-500/5 px-3 py-1.5 rounded-full w-fit">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>{testimonial.result}</span>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Prova social adicional */}
        <div className="text-center">
          <div className="inline-flex items-center gap-8 bg-white/5 border border-white/10 rounded-2xl px-12 py-8">
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
          </div>
        </div>
      </div>
    </section>
  );
}