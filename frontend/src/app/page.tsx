"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MousePointer2, CheckCircle2, LineChart, Activity, Sparkles, Smartphone, Volume2, VolumeX } from "lucide-react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  teal: "#0D9488",
  tealDark: "#0A7A70",
  tealDeep: "#065F55",
  lime: "#8BC34A",
  limeDark: "#6EA832",
  cyan: "#00BCD4",
  cyanLight: "#4DD9EC",
  dark: "#0D1F1E",
  darkMid: "#132926",
  cream: "#F0F7F6",
  creamWarm: "#EDF5F4",
  white: "#FFFFFF",
  text: "#1A2E2C",
  textMuted: "#4A6B68",
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=JetBrains+Mono:wght@400;500&family=Mrs+Saint+Delafield&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; }

    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: ${C.white};
      color: ${C.text};
      overflow-x: hidden;
    }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: ${C.dark}; }
    ::-webkit-scrollbar-thumb { background: ${C.teal}; border-radius: 3px; }

    .noise-overlay {
      position: fixed; inset: 0; pointer-events: none; z-index: 9999;
      opacity: 0.03;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }

    .reveal-hidden { opacity: 0; transform: translateY(40px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
    .reveal-visible { opacity: 1; transform: translateY(0); }

    .btn-magnetic {
      position: relative; overflow: hidden; cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      display: inline-flex; align-items: center; justify-content: center;
    }
    .btn-magnetic:hover { transform: scale(1.04); box-shadow: 0 8px 30px rgba(13,148,136,0.2); }

    .tag {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 4px 12px; border-radius: 999px;
      font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
    }
    
    @media (max-width: 991px) {
      .hero-split { flex-direction: column !important; text-align: center; padding-top: 140px !important; }
      .hero-text { padding-right: 0 !important; margin-bottom: 40px; }
      .hero-image { width: 100% !important; height: auto !important; min-height: 300px !important; max-height: 50vh !important; border-radius: 20px !important; }
      .responsive-grid { grid-template-columns: 1fr !important; }
      .hide-mobile { display: none !important; }
    }
  `}</style>
);

// ─── HOOK: INTERSECTION OBSERVER ─────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible] as const;
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      padding: "20px 6%", display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(255,255,255,0.9)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid #eee" : "none",
      transition: "all 0.3s ease"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        {/* LOGO E NOME - VISIVEL EM MOBILE E DESKTOP */}
        <Image src="/imagem/logo_final.svg" alt="Logo" width={240} height={65} style={{ height: "50px", width: "auto" }} priority />
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <span style={{ fontWeight: 800, fontSize: "clamp(14px, 3vw, 20px)", color: C.text, letterSpacing: "-0.02em", lineHeight: 1 }}>
            Nutri <span style={{ color: C.teal }}>Xpert</span> Pro
          </span>
        </div>
      </div>

      <div className="hide-mobile" style={{ display: "flex", gap: 32 }}>
        {["Recursos", "Protocolo", "Preços", "Depoimentos"].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} style={{ textDecoration: "none", color: C.text, fontSize: "14px", fontWeight: 600 }}>{l}</a>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <Link href="/login" style={{ textDecoration: "none", color: C.text, fontSize: "14px", fontWeight: 700, padding: "10px 20px" }} className="hide-mobile">Login</Link>
        <Link href="/register" className="btn-magnetic" style={{
          background: C.teal, color: "white", padding: "12px 28px", borderRadius: "10px",
          textDecoration: "none", fontWeight: 800, fontSize: "14px"
        }}>
          TESTE AGORA
        </Link>
      </div>
    </nav>
  );
}

// ─── HERO (Ajustes de Texto e Foto de Nutricionista de Elite Real) ───────────
function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => console.log("Autoplay bloqueado pelo navegador"));
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="hero-split" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: "80px 6% 0", background: C.white, position: "relative", overflow: "hidden"
    }}>
      <div className="hero-text" style={{ flex: 1.1, paddingRight: "4%", zIndex: 2 }}>
        <div style={{ opacity: 1 }}>
          <span className="tag" style={{ background: `${C.teal}10`, color: C.teal, marginBottom: "20px" }}>
            Ecossistema de Elite para Nutricionistas
          </span>

          <h1 style={{
            fontSize: "clamp(38px, 5vw, 72px)", fontWeight: 800, color: "#0f172a",
            lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: "28px"
          }}>
            MULTIPLIQUE SUA AUTORIDADE<br />
            <span style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
              fontWeight: 600, color: C.teal, display: "inline-block"
            }}>
              E ESCALE ATÉ 7X.
            </span>
          </h1>

          <p style={{
            fontSize: "clamp(16px, 1.2vw, 20px)", color: "#475569", lineHeight: 1.6,
            marginBottom: "44px", maxWidth: "580px", fontWeight: 500
          }}>
            Pare de perder tempo com processos manuais e softwares lentos. Domine a prática clínica com inteligência automatizada e transforme seu consultório em uma referência de elite.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link href="/register" className="btn-magnetic" style={{
              background: C.teal, color: "white", padding: "18px 36px", borderRadius: "12px",
              fontSize: "16px", fontWeight: 800, textDecoration: "none"
            }}>
              TESTE GRÁTIS POR 7 DIAS
            </Link>
            <a href="#features" className="btn-magnetic" style={{
              background: "#f1f5f9", color: "#0f172a", padding: "18px 36px", borderRadius: "12px",
              fontSize: "16px", fontWeight: 700, textDecoration: "none"
            }}>
              SAIBA MAIS ↓
            </a>
          </div>
        </div>
      </div>

      <div className="hero-image" style={{
        flex: 0.9, height: "85vh", position: "relative",
        background: "#f8fafc", borderRadius: "30px 0 0 30px", overflow: "hidden",
        display: "flex"
      }}>
        {/* VIDEO DE ALTA CONVERSAO - AUTOPLAY FUNCIONA COM MUTED EM MOBILE */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
          src="/imagem/hero-video.mp4"
        />

        {/* BOTAO DE CONTROLE DE SOM */}
        <button
          onClick={toggleMute}
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.6)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.8)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.6)"}
        >
          {isMuted ? (
            <VolumeX style={{ width: 24, height: 24, color: "white" }} />
          ) : (
            <Volume2 style={{ width: 24, height: 24, color: "white" }} />
          )}
        </button>

        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(to right, white, transparent 15%)"
        }} />
      </div>
    </section>
  );
}

// ─── ELITE SPECS (Novo Lugar para Detalhes Técnicos) ──────────────────────────
function EliteSpecs() {
  const specs = [
    { label: "Alimentos", val: "6.000+", icon: "🍎" },
    { label: "Suplementos", val: "1.000+", icon: "💊" },
    { label: "Marcas Elite", val: "20+", icon: "🏢" },
    { label: "Privacidade", val: "Xpert", icon: "🔒" }
  ];

  return (
    <div style={{ background: C.dark, padding: "30px 6%", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 30 }}>
      {specs.map(s => (
        <div key={s.label} style={{ flex: 1, minWidth: "150px", textAlign: "center" }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>{s.icon}</div>
          <div style={{ color: C.teal, fontWeight: 800, fontSize: "22px" }}>{s.val}</div>
          <div style={{ color: "white", fontSize: "12px", opacity: 0.6, textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</div>
        </div>
      ))}
      <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.1)", margin: "20px 0" }} />
      <div style={{
        maxWidth: "900px", margin: "0 auto", padding: "20px 30px", borderRadius: "20px",
        background: `linear-gradient(90deg, transparent, ${C.teal}15, transparent)`,
        border: `1px solid ${C.teal}20`,
        boxShadow: `0 0 30px ${C.teal}05`
      }}>
        <p style={{ color: "white", fontSize: "16px", textAlign: "center", fontWeight: 500, lineHeight: 1.6 }}>
          Acesse o banco de dados mais completo do mercado. <span style={{ color: C.teal, fontWeight: 700 }}>Presets infinitos</span>, automação de lembretes (24h e Follow-up) e o <strong>Xpert Messenger</strong> para total privacidade do seu número.
        </p>
      </div>
    </div>
  );
}

// ─── COMPONENTES INTERATIVOS (PRESERVADOS) ────────────────────────────────────
function DiagnosticShuffler() {
  const cards = [
    { label: "Evolução Física", sub: "Fotos de Antes & Depois", val: "Elite", color: C.teal },
    { label: "Exames Laboratoriais", sub: "Integração completa", val: "Pro", color: C.lime },
    { label: "Dobras Cutâneas", sub: "Protocolo Pollock/etc", val: "Rigor", color: C.cyan },
  ];
  const [order, setOrder] = useState([0, 1, 2]);
  useEffect(() => {
    const t = setInterval(() => {
      setOrder(prev => {
        const next = [...prev];
        next.unshift(next.pop()!);
        return next;
      });
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ position: "relative", height: 180, width: "100%" }}>
      {order.map((idx, pos) => {
        const card = cards[idx];
        const offsets = [0, 12, 24];
        const scales = [1, 0.97, 0.94];
        const opacities = [1, 0.7, 0.45];
        return (
          <div key={idx} style={{
            position: "absolute", left: 0, right: 0, top: offsets[pos],
            transform: `scale(${scales[pos]})`, opacity: opacities[pos],
            zIndex: 10 - pos, background: pos === 0 ? C.white : `rgba(240,247,246,0.8)`,
            borderRadius: "1.25rem", padding: "16px 20px",
            border: pos === 0 ? `2px solid ${card.color}30` : "1px solid rgba(13,148,136,0.1)",
            transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
            boxShadow: pos === 0 ? "0 8px 32px rgba(13,148,136,0.12)" : "none",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 14, color: C.text }}>{card.label}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: C.textMuted, marginTop: 2 }}>{card.sub}</div>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 500, fontSize: 22, color: card.color, background: `${card.color}15`, borderRadius: 8, padding: "4px 10px" }}>{card.val}</div>
            </div>
            {pos === 0 && (
              <div style={{ marginTop: 12, height: 4, borderRadius: 999, background: `${C.teal}15`, overflow: "hidden" }}>
                <div style={{ height: "100%", width: "78%", borderRadius: 999, background: `linear-gradient(90deg, ${card.color}, ${C.cyan})`, transition: "width 0.8s" }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TelemetryTypewriter() {
  const messages = ["Sincronizando 6.000+ alimentos...", "Acessando 1.000+ suplementos elite...", "Xpert Messenger: Privacidade ativa...", "Enviando link de anamnese remota...", "Gerando relatório de dobras cutâneas...", "Sincronizando com Patient App..."];
  const [msgIdx, setMsgIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [charIdx, setCharIdx] = useState(0);
  useEffect(() => {
    const msg = messages[msgIdx];
    if (charIdx < msg.length) {
      const t = setTimeout(() => { setDisplayed(msg.slice(0, charIdx + 1)); setCharIdx(c => c + 1); }, 45);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => { setMsgIdx(m => (m + 1) % messages.length); setCharIdx(0); setDisplayed(""); }, 1800);
      return () => clearTimeout(t);
    }
  }, [charIdx, msgIdx]);

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.lime }} />
        <span style={{ fontSize: 10, color: C.lime, letterSpacing: "0.1em", textTransform: "uppercase" }}>Live Feed</span>
      </div>
      <div style={{ background: "#0f172a", borderRadius: "0.75rem", padding: "12px 14px", border: `1px solid rgba(13,148,136,0.25)` }}>
        <span style={{ fontSize: 11, color: C.white }}>&gt; {displayed}</span>
        <span style={{ fontSize: 11, color: C.teal }}>█</span>
      </div>
    </div>
  );
}

function CursorScheduler() {
  const labels = ["Confirmação", "Lembrete 24h", "Follow-up", "Aniversário"];
  const [activeIdx, setActiveIdx] = useState(0);
  const [sent, setSent] = useState(false);
  useEffect(() => {
    const t = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % labels.length);
      setTimeout(() => { setSent(true); setTimeout(() => { setSent(false); }, 1500); }, 800);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {labels.map((l, i) => (
          <div key={i} style={{
            padding: "8px", borderRadius: 8, textAlign: "center",
            background: activeIdx === i ? C.teal : "#f1f5f9", color: activeIdx === i ? "white" : "#64748b",
            fontSize: "10px", fontWeight: 700, transition: "all 0.3s"
          }}>{l}</div>
        ))}
      </div>
      <button style={{
        width: "100%", padding: "10px", borderRadius: "8px", border: "none",
        background: sent ? C.lime : C.teal, color: "white", fontWeight: 700, fontSize: "12px", transition: "all 0.3s"
      }}>
        {sent ? "✓ Automação Enviada!" : "Enviar Lembrete"}
      </button>
    </div>
  );
}

function XpertChat() {
  const [step, setStep] = useState(0);
  const messages = [
    { sender: "nutri", text: "Olá! Já atualizei seu plano com os novos presets de hoje. 🥗✨" },
    { sender: "patient", text: "Vi aqui no App! Ficou muito mais prático pra minha rotina, obrigado! 🙌" },
    { sender: "nutri", text: "Fico feliz! Qualquer dúvida sobre as substituições, me chama por aqui. 📲" },
    { sender: "nutri", text: "Bom treino e foco na meta! 💪🍎" }
  ];

  useEffect(() => {
    let timers: NodeJS.Timeout[] = [];

    const run = () => {
      setStep(0);
      timers.push(setTimeout(() => setStep(1), 500));   // 1st Nutri
      timers.push(setTimeout(() => setStep(2), 2000));  // Patient
      timers.push(setTimeout(() => setStep(3), 3500));  // 2nd Nutri
      timers.push(setTimeout(() => setStep(4), 5000));  // 3rd Nutri
      timers.push(setTimeout(run, 10000));              // Reset loop
    };

    run();
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "10px" }}>
      {messages.map((m, i) => (
        <div key={i} style={{
          alignSelf: m.sender === "nutri" ? "flex-start" : "flex-end",
          background: m.sender === "nutri" ? C.teal : "#f1f5f9",
          color: m.sender === "nutri" ? "white" : C.text,
          padding: "10px 14px", borderRadius: "14px", fontSize: "12px", maxWidth: "85%",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          opacity: step > i ? 1 : 0,
          transform: step > i ? "translateY(0)" : "translateY(10px)",
          transition: "all 0.5s ease"
        }}>
          {m.text}
        </div>
      ))}
    </div>
  );
}

function PresetsInfinitos() {
  const [phase, setPhase] = useState("idle");
  const foods = [
    "150g Arroz Integral",
    "100g Feijão Preto",
    "140g Filé de Frango Grelhado",
    "2 Ovos Cozidos",
    "Salada à vontade"
  ];

  useEffect(() => {
    let timers: NodeJS.Timeout[] = [];
    const runSequence = () => {
      setPhase("idle");
      timers.push(setTimeout(() => setPhase("moving"), 400));
      timers.push(setTimeout(() => setPhase("clicking"), 1600));
      timers.push(setTimeout(() => setPhase("active"), 1900));
      timers.push(setTimeout(() => setPhase("showing"), 2100));
      timers.push(setTimeout(runSequence, 8000));
    };
    runSequence();
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "260px", padding: "10px", background: "#fcfdfe", borderRadius: "16px" }}>
      {/* MOUSE CURSOR (MOTION) */}
      <motion.div
        animate={{
          top: (phase === "clicking" || phase === "active" || phase === "showing") ? 22 : 140,
          left: (phase === "clicking" || phase === "active" || phase === "showing") ? "50%" : "85%",
          opacity: (phase === "moving" || phase === "clicking") ? 1 : 0,
          scale: phase === "clicking" ? 0.8 : 1
        }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "absolute", zIndex: 30, pointerEvents: "none", color: "#000" }}
      >
        <MousePointer2 size={24} fill="black" />
      </motion.div>

      {/* PRESET BUTTON (MOTION) */}
      <motion.div
        animate={{
          backgroundColor: (phase === "active" || phase === "showing") ? C.teal : "#f1f5f9",
          color: (phase === "active" || phase === "showing") ? "#fff" : "#64748b",
          scale: phase === "clicking" ? 0.94 : 1,
          boxShadow: (phase === "active" || phase === "showing") ? "0 10px 20px -5px rgba(13,148,136,0.3)" : "none"
        }}
        style={{
          padding: "14px", borderRadius: "12px", fontSize: "13px", fontWeight: 800,
          textAlign: "center", marginBottom: "20px", border: "1px solid #e2e8f0"
        }}
      >
        🎯 Almoço / high carb
      </motion.div>

      {/* LIST OF FOODS (MOTION) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <AnimatePresence>
          {phase === "showing" && foods.map((food, i) => (
            <motion.div
              key={food}
              initial={{ opacity: 0, x: -15, y: 5 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.4, ease: "easeOut" }}
              style={{
                fontSize: "12px", color: C.text, padding: "10px 14px",
                background: "#fff", border: "1px solid #f1f5f9", borderRadius: "10px",
                display: "flex", alignItems: "center", gap: 10,
                boxShadow: "0 2px 6px rgba(0,0,0,0.02)"
              }}
            >
              <CheckCircle2 size={14} color={C.teal} /> {food}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {phase === "showing" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{
            marginTop: "16px", padding: "8px", borderRadius: "8px",
            background: `${C.teal}10`, border: `1px solid ${C.teal}20`,
            fontSize: "11px", textAlign: "center", color: C.teal, fontWeight: 700
          }}
        >
          +6.000 alimentos & Favoritos
        </motion.div>
      )}
    </div>
  );
}

function Features() {
  const [ref, visible] = useReveal(0.1);
  const cards = [
    { tag: "Privacy First", title: "Xpert Messenger\nPrivado", desc: "Comunique-se com seus pacientes sem expor seu WhatsApp pessoal.", component: <XpertChat /> },
    { tag: "One-Click Ecosystem", title: "Presets Infinitos\nde Refeições", desc: "Favoritos e 6.000+ alimentos para prescrição instantânea.", component: <PresetsInfinitos /> },
    { tag: "Smart Flow", title: "Automação\nInteligente", desc: "Confirmação, lembretes de 24h e follow-up automáticos.", component: <CursorScheduler /> }
  ];

  return (
    <section id="recursos" ref={ref} style={{ padding: "120px 6%", background: C.creamWarm }}>
      <div className={`reveal-hidden ${visible ? "reveal-visible" : ""}`} style={{ textAlign: "center", marginBottom: 60 }}>
        <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.02em" }}>O Ecossistema da Elite</h2>
        <p style={{ color: C.textMuted, marginTop: "12px", fontSize: "18px" }}>Tudo em uma única tela, sem cliques desnecessários.</p>
      </div>
      <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 1200, margin: "0 auto" }}>
        {cards.map((card, i) => (
          <div key={i} className={`reveal-hidden ${visible ? "reveal-visible" : ""}`} style={{
            transitionDelay: `${i * 0.1}s`, background: C.white, borderRadius: "2rem", padding: "32px",
            border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", gap: 24
          }}>
            <div>
              <span className="tag" style={{ background: `${C.teal}10`, color: C.teal, marginBottom: "12px" }}>{card.tag}</span>
              <h3 style={{ fontSize: "22px", fontWeight: 800, lineHeight: 1.2 }}>{card.title}</h3>
              <p style={{ color: "#64748b", fontSize: "14px", marginTop: "8px" }}>{card.desc}</p>
            </div>
            <div style={{ background: C.creamWarm, borderRadius: "1.25rem", padding: "20px", border: "1px solid #eee" }}>{card.component}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Stats() {
  const stats = [{ val: "80%", label: "Economia de Tempo" }, { val: "3×", label: "Criação Rápida" }, { val: "99%", label: "Precisão" }, { val: "+60%", label: "Produtividade" }];
  return (
    <section style={{ background: "#0f172a", padding: "80px 6%" }}>
      <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, maxWidth: 1200, margin: "0 auto" }}>
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", fontWeight: 800, color: C.lime }}>{s.val}</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "white", marginTop: "12px", textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const reviews = [
    { name: "Dra. Mariana Silva", role: "Nutricionista Esportiva", text: "O NutriXpert mudou minha rotina. Resolvo tudo em 20 minutos com precisão absurda.", img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop" },
    { name: "Dr. Roberto Costa", role: "Nutrição Clínica", text: "A integração TACO/TBCA e o cálculo automático fizeram meus pacientes aderirem 40% mais.", img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop" },
    { name: "Dra. Camila Fernandes", role: "Especialista em Emagrecimento", text: "O design dos PDFs é impecável. A percepção de valor do meu trabalho subiu 300%.", img: "https://images.unsplash.com/photo-1559839734-2b71f1e59816?w=400&h=400&fit=crop" },
    { name: "Dra. Beatriz Nunes", role: "Nutrição Funcional", text: "O Xpert Messenger me devolveu a paz. Privacidade total e organização impecável do consultório.", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop" },
    { name: "Dr. Henrique Souza", role: "Alta Performance", text: "Presets infinitos são um divisor de águas. Prescrevo dietas complexas em segundos agora.", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop" },
    { name: "Dra. Letícia Oliveira", role: "Materno-Infantil", text: "O App do paciente é lindo e as fotos de evolução encantam os pais. Retenção total.", img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop" },
    { name: "Dr. Gustavo Meira", role: "Nutrologia Esportiva", text: "A análise de exames e dobras no mesmo lugar facilita o raciocínio clínico de elite.", img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop" },
    { name: "Dra. Juliana Paes", role: "Nutrição Estética", text: "Minha autoridade subiu de nível. O sistema transmite o profissionalismo que eu sempre quis.", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop" },
    { name: "Dr. Felipe Alencar", role: "Nutrição Comportamental", text: "Lembretes automáticos e follow-up garantem que nenhum paciente se sinta esquecido.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" }
  ];
  return (
    <section id="depoimentos" style={{ padding: "120px 6%", background: C.white }}>
      <div style={{ textAlign: "center", marginBottom: "64px" }}>
        <span className="tag" style={{ background: `${C.teal}10`, color: C.teal, marginBottom: "20px" }}>Prova de Elite</span>
        <h2 style={{ fontSize: "42px", fontWeight: 800 }}>Quem usa, <span style={{ color: C.teal }}>domina o mercado.</span></h2>
      </div>
      <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 1200, margin: "0 auto" }}>
        {reviews.map((r, i) => (
          <div key={i} style={{
            background: C.white, borderRadius: "1.5rem", padding: "32px", border: "1px solid #f1f5f9",
            display: "flex", flexDirection: "column", gap: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
            transition: "transform 0.3s ease"
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <div style={{ color: "#fbbf24", fontSize: "14px", letterSpacing: "2px" }}>★★★★★</div>
            <p style={{ color: "#334155", flex: 1, lineHeight: 1.6, fontWeight: 500 }}>"{r.text}"</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: "20px", borderTop: "1px solid #f1f5f9" }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "50%",
                backgroundImage: `url('${r.img}')`, backgroundSize: "cover", backgroundPosition: "center",
                border: `2px solid ${C.teal}30`
              }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: "14px", color: C.text }}>{r.name}</div>
                <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>{r.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Grátis 7 dias",
      price: "R$ 0",
      priceSub: "sem compromisso",
      features: [
        { title: "Dashboard Clínico PWA", desc: "Acesse nos celulares e web rapidamente." },
        { title: "Banco TACO e TBCA", desc: "Acesso total aos +6.000 itens validados." },
        { title: "Criador de Dietas VIP", desc: "Geração de layout limpo em formato PDF." },
        { title: "Avaliação Antropométrica", desc: "Protocolos exatos de dobras cutâneas." }
      ],
      highlight: false,
      buttonText: "Começar Teste Sem Compromisso"
    },
    {
      name: "Plano Mensal Xpert",
      price: "R$ 49,90",
      oldPrice: "R$ 89,90",
      priceSub: "/mês (nos 3 primeiros meses)",
      explainText: "Após 3 meses, apenas R$ 69,90 mensal (Totalmente completo)",
      features: [
        { title: "Pacientes Ilimitados", desc: "Evolua suas consultas sem limitações." },
        { title: "Agenda Inteligente", desc: "Notificações e lembretes totalmente automáticos." },
        { title: "Análise de Exames", desc: "Painel de exames laboratoriais." },
        { title: "Chat Integrado (Xpert)", desc: "Comunicação privada paciente-nutri." },
        { title: "Estilização Própria", desc: "Sua própria Logo, identidade e assinatura." }
      ],
      highlight: false,
      buttonText: "Assinar o Mensal Completo"
    },
    {
      name: "Plano Anual Pro",
      badge: "⭐ O MAIS ESCOLHIDO",
      price: "R$ 49,90",
      priceSub: "/mês",
      explainText: "Pagamento único anual de R$ 598,80. Seu consultório operando por 12 meses.",
      features: [
        { title: "Tudo do Plano Mensal", desc: "Acesso total e absoluto a todos módulos." },
        { title: "Pagamento Simplificado", desc: "Economia garantida e zero taxa extra." },
        { title: "Suporte Personalizado", desc: "Prioridade VIP no nosso atendimento." },
        { title: "Estabilidade Total", desc: "Consultório backup 100% blindado e online." }
      ],
      highlight: true,
      buttonText: "Assinar o Anual VIP"
    }
  ];

  return (
    <section id="preços" style={{ padding: "140px 6%", background: C.creamWarm, position: "relative", overflow: "hidden" }}>
      <div style={{ textAlign: "center", marginBottom: "80px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="tag"
          style={{ background: `${C.teal}15`, color: C.tealDark, marginBottom: "20px" }}
        >
          O Melhor Investimento
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 800, color: C.text, letterSpacing: "-0.03em", lineHeight: 1.1 }}
        >
          Estrutura de Elite.<br /> <span style={{ color: C.teal }}>Preço Transparente.</span>
        </motion.h2>
      </div>

      <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, maxWidth: 1240, margin: "0 auto", alignItems: "stretch" }}>
        <AnimatePresence>
          {plans.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
              style={{
                position: "relative",
                background: p.highlight ? "#0f172a" : "white",
                padding: "48px 36px",
                borderRadius: "2.5rem",
                border: p.highlight ? `2px solid ${C.teal}` : "1px solid #e2e8f0",
                color: p.highlight ? "white" : C.text,
                boxShadow: p.highlight ? "0 40px 80px -10px rgba(13, 148, 136, 0.4)" : "0 20px 40px -10px rgba(0,0,0,0.05)",
                zIndex: p.highlight ? 2 : 1,
                display: "flex", flexDirection: "column", height: "100%",
                overflow: "hidden"
              }}
            >
              {p.badge && (
                <div style={{
                  position: "absolute", top: "-18px", left: "50%", transform: "translateX(-50%)",
                  background: "#f59e0b", color: "white", padding: "8px 16px", borderRadius: "20px",
                  fontSize: "12px", fontWeight: 800, letterSpacing: "1px", whiteSpace: "nowrap",
                  boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)"
                }}>
                  {p.badge}
                </div>
              )}

              <div style={{ fontWeight: 800, fontSize: "24px", marginBottom: "16px", color: p.highlight ? "white" : C.text }}>{p.name}</div>

              <div style={{ marginBottom: "24px", minHeight: "85px" }}>
                {p.oldPrice && <div style={{ textDecoration: "line-through", color: p.highlight ? "#94a3b8" : "#94a3b8", fontSize: "16px", fontWeight: 600, marginBottom: "4px" }}>{p.oldPrice}</div>}
                <div style={{ fontSize: "clamp(46px, 4vw, 56px)", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em", color: p.highlight ? "white" : C.text }}>{p.price}</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: p.highlight ? "#cbd5e1" : "#64748b", marginTop: "8px" }}>{p.priceSub}</div>
              </div>

              {p.explainText && (
                <div style={{
                  fontSize: "13px", fontWeight: 600, color: p.highlight ? C.cyanLight : C.teal,
                  marginBottom: "32px", background: p.highlight ? "rgba(13,148,136,0.15)" : "rgba(13,148,136,0.05)",
                  padding: "16px", borderRadius: "12px", border: `1px solid rgba(13,148,136,0.2)`
                }}>
                  {p.explainText}
                </div>
              )}
              {!p.explainText && <div style={{ height: "66px", marginBottom: "32px" }} />}

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "20px", color: p.highlight ? C.teal : C.text }}>Composição do Plano</div>
                <ul style={{ listStyle: "none", padding: 0, textAlign: "left", marginBottom: "40px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  {p.features.map((f, idx) => (
                    <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                      <div style={{
                        marginTop: "2px", width: "24px", height: "24px", borderRadius: "50%",
                        background: p.highlight ? "rgba(13,148,136,0.2)" : `${C.teal}15`,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                      }}>
                        <CheckCircle2 size={14} color={p.highlight ? "#4fd1c5" : C.teal} strokeWidth={3} />
                      </div>
                      <div>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: p.highlight ? "white" : C.text, marginBottom: "2px" }}>{f.title}</div>
                        <div style={{ fontSize: "13px", fontWeight: 500, color: p.highlight ? "#94a3b8" : "#64748b", lineHeight: 1.4 }}>{f.desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                style={{
                  width: "100%", padding: "18px", borderRadius: "16px",
                  border: i === 0 ? `2px solid ${C.teal}30` : "none",
                  background: p.highlight ? C.teal : (i === 0 ? "#f8fafc" : C.teal),
                  color: p.highlight ? "white" : (i === 0 ? C.teal : "white"),
                  fontWeight: 800, cursor: "pointer", fontSize: "16px",
                  boxShadow: (p.highlight || i !== 0) ? "0 10px 20px -5px rgba(13,148,136,0.3)" : "none",
                  transition: "background 0.3s"
                }}
              >
                {p.buttonText}
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ padding: "60px 6%", textAlign: "center", borderTop: "1px solid #eee" }}>
      <Image src="/imagem/logo_final.svg" alt="Logo" width={140} height={40} style={{ marginBottom: "24px" }} />
      <p style={{ color: "#64748b", fontSize: "14px" }}>© 2026 Nutri Xpert Pro. Todos os direitos reservados.</p>
    </footer>
  );
}

function ProfessionalBrand() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <section style={{ padding: "120px 6%", background: C.white }}>
      <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 64, maxWidth: 1200, margin: "0 auto", alignItems: "center" }}>
        <div>
          <span className="tag" style={{ background: `${C.teal}10`, color: C.teal, marginBottom: "20px" }}>Identidade Profissional</span>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, marginBottom: "24px", lineHeight: 1.1 }}>Sua Marca, <span style={{ color: C.teal }}>Sua Autoridade.</span></h2>
          <p style={{ color: "#64748b", fontSize: "18px", lineHeight: 1.6, marginBottom: "32px" }}>
            Configure seu consultório com sua própria logo, assinatura digital para receitas, título profissional e endereço. Escolha entre <strong>Modo Claro ou Escuro</strong> para sua melhor experiência.
          </p>

          {/* TOGGLE MODO DARK/LIGHT */}
          <div style={{ marginBottom: "40px", display: "flex", alignItems: "center", gap: 15 }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: C.text }}>Mudar Tema:</span>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                width: 60, height: 32, borderRadius: 20, background: isDarkMode ? C.teal : "#cbd5e1",
                border: "none", position: "relative", cursor: "pointer", transition: "all 0.3s"
              }}
            >
              <div style={{
                width: 24, height: 24, borderRadius: "50%", background: "white",
                position: "absolute", top: 4, left: isDarkMode ? 32 : 4, transition: "all 0.3s",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
              }} />
            </button>
            <span style={{ fontSize: "12px", fontWeight: 800, color: C.teal }}>{isDarkMode ? "DARK MODE ACTIVE" : "LIGHT MODE ACTIVE"}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              "Assinatura Digital", "Logo do Consultório", "Modo Dark & Light", "Título Profissional", "Assinatura de E-mail", "Endereço Personalizado"
            ].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "14px", fontWeight: 600, color: C.text }}>
                <span style={{ color: C.teal }}>✓</span> {f}
              </div>
            ))}
          </div>
        </div>
        <div style={{
          background: isDarkMode ? C.dark : "#f8fafc",
          borderRadius: "2rem", padding: "40px",
          boxShadow: isDarkMode ? "0 20px 50px rgba(0,0,0,0.2)" : "0 20px 50px rgba(0,0,0,0.05)",
          border: isDarkMode ? "none" : "1px solid #e2e8f0",
          transition: "all 0.5s ease"
        }}>
          <div style={{
            border: isDarkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid #ddd",
            borderRadius: "1rem", padding: "24px",
            background: isDarkMode ? "rgba(255,255,255,0.03)" : "white",
            transition: "all 0.5s ease"
          }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
              {/* FOTO DA NUTRICIONISTA LOIRA DE JALECO - DIV COM BACKGROUND PARA GARANTIR CARREGAMENTO */}
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                backgroundImage: "url('https://images.unsplash.com/photo-1559839734-2b71f1e59816?w=400&auto=format&fit=crop&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                border: `2px solid ${C.teal}`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }} />
              <div>
                <div style={{ color: isDarkMode ? "white" : C.text, fontWeight: 800, fontSize: "15px" }}>Dra. Ana Beatriz Silva</div>
                <div style={{ color: C.teal, fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Nutricionista Esportiva Elite</div>
              </div>
            </div>

            <div style={{ height: 1, background: isDarkMode ? "rgba(255,255,255,0.1)" : "#eee", marginBottom: 24 }} />

            <div style={{ color: isDarkMode ? "rgba(255,255,255,0.5)" : "#64748b", fontSize: "10px", marginBottom: 12, fontWeight: 700 }}>ASSINATURA DIGITAL</div>
            <div style={{
              fontFamily: "'Mrs Saint Delafield', cursive", fontSize: "48px",
              color: isDarkMode ? "white" : C.text, display: "inline-block",
              lineHeight: 1, marginBottom: 20
            }}>
              Ana Beatriz Silva
            </div>

            <div style={{ height: 1, background: isDarkMode ? "rgba(255,255,255,0.1)" : "#eee", marginBottom: 20 }} />

            <div>
              <div style={{ color: isDarkMode ? "rgba(255,255,255,0.5)" : "#64748b", fontSize: "9px", marginBottom: 6, textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>Endereço de Atendimento (Zona Sul)</div>
              <div style={{ color: isDarkMode ? "white" : C.text, fontSize: "12px", fontWeight: 600, lineHeight: 1.4 }}>
                Av. Brig. Faria Lima, 1485 - Itaim Bibi<br />
                São Paulo - SP, 01452-002
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function Sparkline({ data, color }: { data: number[], color: string }) {
  const max = Math.max(...data), min = Math.min(...data);
  const w = 80, h = 28;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={`${color}20`} stroke="none" />
    </svg>
  );
}

function DonutChart({ pct, color, size = 44, label }: { pct: number, color: string, size?: number, label?: string }) {
  const r = 16, circ = 2 * Math.PI * r;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={size} height={size} viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="5" />
        <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${circ * pct / 100} ${circ}`}
          strokeLinecap="round" transform="rotate(-90 22 22)" />
        <text x="22" y="26" textAnchor="middle" fill={color} fontSize="9"
          fontFamily="'JetBrains Mono',monospace" fontWeight="600">{pct}%</text>
      </svg>
      {label && <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 9, color: C.textMuted, fontWeight: 600 }}>{label}</span>}
    </div>
  );
}

// ─── PHONE SCREENS ────────────────────────────────────────────────────────────

function ScreenExames() {
  const exams = [
    { name: "Glicose", val: "92", unit: "mg/dL", status: "Normal", ok: true, data: [98, 95, 93, 90, 92, 91, 92] },
    { name: "HbA1c", val: "5.1", unit: "%", status: "Ótimo", ok: true, data: [5.6, 5.4, 5.3, 5.2, 5.1, 5.1, 5.1] },
    { name: "Vitamina D", val: "38", unit: "ng/mL", status: "Normal", ok: true, data: [18, 22, 28, 32, 35, 37, 38] },
    { name: "TSH", val: "2.1", unit: "mUI/L", status: "Normal", ok: true, data: [3.2, 2.9, 2.6, 2.4, 2.2, 2.1, 2.1] },
    { name: "Ferritina", val: "87", unit: "ng/mL", status: "Normal", ok: true, data: [42, 55, 65, 72, 80, 84, 87] },
    { name: "LDL-c", val: "98", unit: "mg/dL", status: "Ótimo", ok: true, data: [134, 125, 118, 110, 104, 100, 98] },
    { name: "PCR-us", val: "0.4", unit: "mg/L", status: "Ótimo", ok: true, data: [1.8, 1.4, 1.0, 0.8, 0.6, 0.5, 0.4] },
    { name: "Insulina", val: "7.2", unit: "μUI/mL", status: "Normal", ok: true, data: [12, 10.5, 9, 8.4, 7.9, 7.4, 7.2] },
  ];

  return (
    <div style={{ height: "100%", overflowY: "auto", paddingBottom: 8 }}>
      <div style={{ padding: "10px 14px 8px", borderBottom: "1px solid rgba(13,148,136,0.12)", marginBottom: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 13, color: C.text }}>Lucas Silva</div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: C.textMuted }}>14 fev 2026 · Consulta de retorno</div>
          </div>
          <div style={{ background: `linear-gradient(135deg,${C.teal},${C.cyan})`, borderRadius: 8, padding: "4px 9px" }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "white", fontWeight: 600 }}>Score 87</span>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 14px 5px" }}>
        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 10, color: C.teal, textTransform: "uppercase", letterSpacing: "0.07em" }}>📋 Exames Laboratoriais</div>
      </div>

      {exams.map((e, i) => (
        <div key={i} style={{ margin: "0 8px 5px", background: "#F0F7F6", borderRadius: 10, padding: "8px 10px", border: "1px solid rgba(13,148,136,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 11, color: C.text }}>{e.name}</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: e.ok ? C.teal : "#e05c2e", fontWeight: 600 }}>✓ {e.status}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontStyle: "italic", fontSize: 20, color: C.teal }}>{e.val}</span>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 9, color: C.textMuted, marginLeft: 3 }}>{e.unit}</span>
            </div>
            <Sparkline data={e.data} color={e.ok ? C.lime : "#e05c2e"} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ScreenSubstituicao() {
  const sub = {
    from: { name: "Arroz Branco", g: 100, kcal: 128, carb: 28.1, prot: 2.5, fat: 0.2 },
    to: { name: "Batata Inglesa", g: 158, kcal: 128, carb: 28.1, prot: 2.5, fat: 0.2 },
  };
  const alternativas = [
    { g: "134g", name: "Mandioca cozida", kcal: "130", carb: "31.2g" },
    { g: "180g", name: "Inhame cozido", kcal: "129", carb: "28.3g" },
    { g: "200g", name: "Cará cozido", kcal: "128", carb: "28.0g" },
    { g: "148g", name: "Batata-doce cozida", kcal: "127", carb: "27.9g" },
  ];

  const MacroCell = ({ label, value, light }: { label: string, value: string | number, light?: boolean }) => (
    <div style={{ background: light ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.75)", borderRadius: 7, padding: "4px 5px", textAlign: "center" }}>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: light ? C.teal : C.text, fontWeight: 600 }}>{value}</div>
      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 8, color: C.textMuted }}>{label}</div>
    </div>
  );

  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <div style={{ padding: "10px 14px 8px", borderBottom: "1px solid rgba(13,148,136,0.12)", marginBottom: 8 }}>
        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 13, color: C.text }}>Substituição Automática</div>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: C.textMuted }}>Motor de equivalência nutricional</div>
      </div>

      <div style={{ padding: "0 10px" }}>
        {/* FROM */}
        <div style={{ background: "rgba(224,92,46,0.07)", border: "1px solid rgba(224,92,46,0.22)", borderRadius: 13, padding: "11px 13px", marginBottom: 6 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: "#e05c2e", fontWeight: 700, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>⊖ Remover</div>
          <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 14, color: C.text, marginBottom: 7 }}>
            {sub.from.g}g de {sub.from.name}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
            <MacroCell label="Kcal" value={sub.from.kcal} />
            <MacroCell label="Carb" value={sub.from.carb + "g"} />
            <MacroCell label="Prot" value={sub.from.prot + "g"} />
            <MacroCell label="Gord" value={sub.from.fat + "g"} />
          </div>
        </div>

        {/* ARROW */}
        <div style={{ textAlign: "center", margin: "4px 0", position: "relative" }}>
          <div style={{ display: "inline-block", background: `linear-gradient(135deg,${C.teal},${C.lime})`, borderRadius: "50%", width: 24, height: 24, lineHeight: "24px", fontSize: 13, color: "white", fontWeight: 700 }}>↕</div>
        </div>

        {/* TO */}
        <div style={{ background: "rgba(13,148,136,0.08)", border: "1px solid rgba(13,148,136,0.28)", borderRadius: 13, padding: "11px 13px", marginBottom: 10 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: C.teal, fontWeight: 700, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>⊕ Equivalente</div>
          <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 14, color: C.text, marginBottom: 7 }}>
            {sub.to.g}g de {sub.to.name}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
            <MacroCell label="Kcal" value={sub.to.kcal} light />
            <MacroCell label="Carb" value={sub.to.carb + "g"} light />
            <MacroCell label="Prot" value={sub.to.prot + "g"} light />
            <MacroCell label="Gord" value={sub.to.fat + "g"} light />
          </div>
        </div>

        {/* BADGE */}
        <div style={{ background: `linear-gradient(135deg,${C.teal},${C.lime})`, borderRadius: 10, padding: "9px 13px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 11, color: "white" }}>Δ Macros 100% preservados</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "white", fontWeight: 700 }}>✓</span>
        </div>

        {/* ALTERNATIVAS */}
        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 10, color: C.teal, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
          Outras opções equivalentes
        </div>
        {alternativas.map((a, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < alternativas.length - 1 ? "1px solid rgba(13,148,136,0.08)" : "none" }}>
            <div>
              <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, fontSize: 11, color: C.text }}>{a.g} </span>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: C.textMuted }}>{a.name}</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: C.teal, fontWeight: 600 }}>{a.kcal}kcal</span>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 9, color: C.textMuted, display: "block" }}>{a.carb} carb</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenAnamnese() {
  const sections = [
    { sec: "01", title: "Identificação & Histórico", done: true, active: false },
    { sec: "02", title: "Avaliação Antropométrica", done: true, active: false },
    { sec: "03", title: "Exames Bioquímicos", done: true, active: false },
    { sec: "04", title: "Hábitos Alimentares", done: true, active: false },
    { sec: "05", title: "Estilo de Vida & Sono", done: true, active: false },
    { sec: "06", title: "Queixa & Objetivos", done: false, active: true },
    { sec: "07", title: "Suplementação Atual", done: false, active: false },
  ];

  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <div style={{ padding: "10px 14px 8px", borderBottom: "1px solid rgba(13,148,136,0.12)", marginBottom: 8 }}>
        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 13, color: C.text }}>Anamnese Digital</div>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: C.textMuted, marginBottom: 6 }}>7 seções · Progresso 5/7</div>
        <div style={{ height: 5, background: "rgba(13,148,136,0.1)", borderRadius: 999, overflow: "hidden" }}>
          <div style={{ height: "100%", width: "71%", background: `linear-gradient(90deg,${C.teal},${C.lime})`, borderRadius: 999 }} />
        </div>
      </div>
      <div style={{ padding: "0 10px" }}>
        {sections.map((s) => (
          <div key={s.sec} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 10px", marginBottom: 5, borderRadius: 11,
            background: s.active ? "rgba(13,148,136,0.1)" : s.done ? "rgba(139,195,74,0.06)" : "rgba(240,247,246,0.8)",
            border: s.active ? `1px solid rgba(13,148,136,0.3)` : "1px solid transparent",
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: s.done ? `linear-gradient(135deg,${C.lime},${C.teal})` : s.active ? C.teal : "rgba(13,148,136,0.15)",
            }}>
              <span style={{ fontSize: 10, color: s.done || s.active ? "white" : C.teal, fontWeight: 800 }}>
                {s.done ? "✓" : s.sec}
              </span>
            </div>
            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: s.active ? 700 : 500, fontSize: 11, color: s.active ? C.teal : s.done ? C.text : C.textMuted, flex: 1 }}>
              {s.title}
            </span>
            {s.active && (
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: C.teal, background: "rgba(13,148,136,0.15)", borderRadius: 5, padding: "2px 6px", fontWeight: 700 }}>EM CURSO</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FLOATING CARDS DATA ──────────────────────────────────────────────────────
function FloatingCardBioquimico() {
  return (
    <div style={{ width: 185 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
        <span style={{ fontSize: 15 }}>🧬</span>
        <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 12, color: C.text }}>Painel Bioquímico</span>
      </div>
      {[["Glicose", "92 mg/dL"], ["HbA1c", "5.1%"], ["Vit. D", "38 ng/mL"], ["TSH", "2.1 mUI/L"]].map(([n, v]) => (
        <div key={n} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(13,148,136,0.08)" }}>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: C.textMuted }}>{n}</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: C.teal, fontWeight: 600 }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

function FloatingCardSubstituicao() {
  return (
    <div style={{ width: 178 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
        <span style={{ fontSize: 15 }}>🔄</span>
        <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 11, color: C.text }}>Substituição Ativa</span>
      </div>
      <div style={{ background: `${C.teal}0F`, borderRadius: 10, padding: "8px 10px" }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#e05c2e" }}>100g Arroz Branco</div>
        <div style={{ textAlign: "center", margin: "3px 0", color: C.teal, fontWeight: 700 }}>↕</div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: C.lime, fontWeight: 700 }}>158g Batata Inglesa</div>
        <div style={{ marginTop: 5, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: C.textMuted }}>Δ Macros</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: C.teal, fontWeight: 700 }}>0 kcal ✓</span>
        </div>
      </div>
    </div>
  );
}

function FloatingCardMacros() {
  return (
    <div style={{ width: 170 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
        <span style={{ fontSize: 15 }}>📊</span>
        <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 11, color: C.text }}>Macros do Dia</span>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <DonutChart pct={42} color={C.teal} size={42} label="Carb" />
        <DonutChart pct={33} color={C.lime} size={42} label="Prot" />
        <DonutChart pct={25} color={C.cyan} size={42} label="Gord" />
      </div>
      <div style={{ marginTop: 8, fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: C.textMuted, textAlign: "center" }}>1.840 kcal · Meta: 1.900</div>
    </div>
  );
}

function FloatingCardAderencia() {
  return (
    <div style={{ width: 178 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
        <span style={{ fontSize: 15 }}>⚡</span>
        <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 11, color: C.text }}>Aderência ao Plano</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <DonutChart pct={87} color={C.lime} size={52} />
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontStyle: "italic", fontSize: 32, color: C.teal, lineHeight: 1 }}>87%</div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: C.textMuted, lineHeight: 1.5 }}>Semana atual<br /><span style={{ color: C.lime, fontWeight: 700 }}>↑ 12%</span> vs anterior</div>
        </div>
      </div>
    </div>
  );
}

function FloatingCardConsulta() {
  return (
    <div style={{ width: 180 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
        <span style={{ fontSize: 15 }}>📅</span>
        <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 11, color: C.text }}>Próxima Consulta</span>
      </div>
      <div style={{ background: `linear-gradient(135deg,${C.teal}15,${C.cyan}10)`, borderRadius: 10, padding: "9px 11px", border: `1px solid ${C.teal}20` }}>
        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 13, color: C.text }}>Lucas Silva</div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: C.teal, margin: "3px 0" }}>24 fev · 14:30</div>
        <div style={{ display: "flex", gap: 4, marginTop: 5 }}>
          {["Retorno", "Evolução"].map(t => (
            <span key={t} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 9, background: `${C.teal}20`, color: C.teal, borderRadius: 5, padding: "2px 7px", fontWeight: 600 }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FloatingCardDobras() {
  const bars = [60, 72, 68, 80, 75, 88, 85];
  return (
    <div style={{ width: 170 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
        <span style={{ fontSize: 15 }}>📐</span>
        <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 11, color: C.text }}>Dobras Pollock</span>
      </div>
      <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 38, marginBottom: 7 }}>
        {bars.map((v, i) => (
          <div key={i} style={{
            flex: 1, height: `${v}%`, borderRadius: "3px 3px 0 0",
            background: i === bars.length - 1 ? `linear-gradient(to top,${C.teal},${C.lime})` : `rgba(13,148,136,0.22)`,
          }} />
        ))}
      </div>
      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: C.textMuted }}>
        7 dobras · %G: <strong style={{ color: C.teal }}>18.4%</strong> · IMC: <strong style={{ color: C.lime }}>23.1</strong>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
function ClinicalEvolution() {
  const [activeScreen, setActiveScreen] = React.useState(0);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const t = setInterval(() => setActiveScreen(s => (s + 1) % 3), 5000);
    return () => clearInterval(t);
  }, []);

  const handleMouseMove = React.useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: (e.clientX - rect.left - rect.width / 2) / 45,
      y: (e.clientY - rect.top - rect.height / 2) / 45,
    });
  }, []);

  const screens = [
    { label: "Exames Lab", icon: "🧬", component: <ScreenExames /> },
    { label: "Substituição", icon: "🔄", component: <ScreenSubstituicao /> },
    { label: "Anamnese", icon: "📋", component: <ScreenAnamnese /> },
  ];

  const leftCards = [
    { pos: { top: "8%", left: "10%" }, delay: 0, dur: 3.5, Component: FloatingCardBioquimico },
    { pos: { top: "37%", left: "4%" }, delay: 0.3, dur: 4.0, Component: FloatingCardSubstituicao },
    { pos: { top: "66%", left: "11%" }, delay: 0.6, dur: 3.8, Component: FloatingCardMacros },
  ];
  const rightCards = [
    { pos: { top: "8%", right: "8%" }, delay: 0.15, dur: 4.2, Component: FloatingCardAderencia },
    { pos: { top: "40%", right: "4%" }, delay: 0.45, dur: 3.6, Component: FloatingCardConsulta },
    { pos: { top: "67%", right: "10%" }, delay: 0.75, dur: 4.4, Component: FloatingCardDobras },
  ];

  return (
    <>
      <style>{`
        @keyframes card-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }
        .showcase-section {
          padding: 100px 5%;
          position: relative;
          background: linear-gradient(160deg, #0D1F1E 0%, #132926 55%, #065F55 100%);
          overflow: hidden;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .dot-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(circle, rgba(13,148,136,0.28) 1px, transparent 1px);
          background-size: 30px 30px;
          opacity: 0.45;
        }
        .center-glow {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 700px; height: 700px; border-radius: 50%;
          background: radial-gradient(circle, rgba(13,148,136,0.15) 0%, transparent 65%);
          pointer-events: none;
        }
        .screen-btn {
          padding: 10px 22px; border-radius: 999px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700; font-size: 13px; cursor: pointer;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .screen-btn:hover { transform: scale(1.04); }
        .float-card {
          position: absolute;
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 18px;
          padding: 14px 16px;
          border: 1px solid rgba(13,148,136,0.18);
          box-shadow: 0 16px 48px rgba(13,31,30,0.28), 0 2px 8px rgba(13,148,136,0.12);
          transition: box-shadow 0.3s, transform 0.15s;
        }
        .float-card:hover {
          box-shadow: 0 24px 70px rgba(13,31,30,0.4), 0 4px 16px rgba(13,148,136,0.22);
        }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .serif-italic { font-family: 'Cormorant Garamond', serif; font-style: italic; }
      `}</style>
      <section
        ref={containerRef}
        className="showcase-section"
        onMouseMove={handleMouseMove}
      >
        <div className="dot-grid" />
        <div className="center-glow" />

        {/* ── HEADER ── */}
        <div style={{
          textAlign: "center", marginBottom: 72,
        }}>
          <span className="tag" style={{ background: "rgba(139,195,74,0.15)", color: C.lime, border: "1px solid rgba(139,195,74,0.32)", marginBottom: 18, display: "inline-flex" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.lime, animation: "pulse-dot 2s infinite" }} />
            Centro de Comando Clínico
          </span>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: "clamp(30px,4.5vw,56px)", color: "white", letterSpacing: "-0.03em", lineHeight: 1.1, margin: 0 }}>
            O app na palma da<br />
            <span className="serif-italic" style={{ color: C.lime }}>sua mão</span>
          </h2>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 17, color: "rgba(255,255,255,0.5)", marginTop: 16, maxWidth: 480, margin: "16px auto 0", lineHeight: 1.65 }}>
            Clínica de elite no bolso. Exames, substituições e protocolos — tudo em tempo real.
          </p>
        </div>

        {/* ── COMPOSITION ── */}
        <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", minHeight: 660 }}>

          {/* LEFT CARDS */}
          {leftCards.map(({ pos, delay, dur, Component }, i) => (
            <div key={i} className="float-card" style={{
              ...pos,
              transform: `translate(${mousePos.x * (i % 2 === 0 ? 0.6 : -0.4)}px, ${mousePos.y * 0.35}px)`,
              animation: `card-float ${dur}s ease-in-out infinite ${delay}s`,
              zIndex: 10,
            }}>
              <Component />
            </div>
          ))}

          {/* IPHONE */}
          <div style={{
            position: "relative", zIndex: 20,
            transform: `perspective(1400px) rotateX(${-mousePos.y * 0.6}deg) rotateY(${mousePos.x * 0.6}deg)`,
            transition: "transform 0.12s ease",
            filter: "drop-shadow(0 50px 90px rgba(13,31,30,0.65)) drop-shadow(0 0 1px rgba(255,255,255,0.08))",
          }}>
            {/* PHONE BODY */}
            <div style={{
              width: 290, height: 596,
              background: "linear-gradient(155deg, #323232, #111111)",
              borderRadius: 46, padding: 4,
              boxShadow: "0 0 0 1px rgba(255,255,255,0.13), inset 0 0 0 1px rgba(255,255,255,0.06)",
            }}>
              {/* SCREEN */}
              <div style={{ width: "100%", height: "100%", background: "#F0F7F6", borderRadius: 42, overflow: "hidden", position: "relative", display: "flex", flexDirection: "column" }}>

                {/* STATUS BAR */}
                <div style={{ flexShrink: 0, height: 44, background: C.tealDeep, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 22px 8px", position: "relative" }}>
                  <span className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>9:41</span>
                  <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 110, height: 26, background: "#111", borderRadius: "0 0 18px 18px" }} />
                  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    <div style={{ width: 14, height: 8, border: "1.5px solid rgba(255,255,255,0.6)", borderRadius: 2, position: "relative" }}>
                      <div style={{ position: "absolute", inset: 1.5, right: 2, background: C.lime, borderRadius: 1 }} />
                    </div>
                  </div>
                </div>

                {/* APP HEADER */}
                <div style={{ flexShrink: 0, background: C.tealDeep, padding: "5px 18px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 16, color: "white" }}>
                      NutriXpert<span style={{ color: C.lime }}>Pro</span>
                    </div>
                    <div className="mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>v2.4.1 · LGPD ✓</div>
                  </div>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${C.lime},${C.teal})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, boxShadow: `0 4px 12px rgba(13,148,136,0.35)` }}>👤</div>
                </div>

                {/* SCREEN CONTENT AREA */}
                <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
                  {screens[activeScreen].component}
                </div>

                {/* BOTTOM NAV */}
                <div style={{ flexShrink: 0, height: 58, background: "white", borderTop: "1px solid rgba(13,148,136,0.1)", display: "flex", alignItems: "center", justifyContent: "space-around", paddingBottom: 4 }}>
                  {[["🏠", "Início", 0], ["👥", "Pacientes", 1], ["📋", "Protocolos", 2], ["📊", "Relatórios", 3]].map(([ic, lb, idx]) => (
                    <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, opacity: idx === 1 ? 1 : 0.38 }}>
                      <span style={{ fontSize: 17 }}>{ic}</span>
                      <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 8, color: idx === 1 ? C.teal : C.textMuted, fontWeight: idx === 1 ? 700 : 400 }}>{lb}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PHONE SIDE BUTTONS */}
            <div style={{ position: "absolute", right: -3, top: 100, width: 3, height: 32, background: "rgba(255,255,255,0.15)", borderRadius: "0 2px 2px 0" }} />
            <div style={{ position: "absolute", left: -3, top: 88, width: 3, height: 24, background: "rgba(255,255,255,0.12)", borderRadius: "2px 0 0 2px" }} />
            <div style={{ position: "absolute", left: -3, top: 122, width: 3, height: 24, background: "rgba(255,255,255,0.12)", borderRadius: "2px 0 0 2px" }} />
            <div style={{ position: "absolute", left: -3, top: 155, width: 3, height: 24, background: "rgba(255,255,255,0.12)", borderRadius: "2px 0 0 2px" }} />
          </div>

          {/* RIGHT CARDS */}
          {rightCards.map(({ pos, delay, dur, Component }, i) => (
            <div key={i} className="float-card" style={{
              ...pos,
              transform: `translate(${mousePos.x * 0.45}px, ${mousePos.y * 0.3}px)`,
              animation: `card-float ${dur}s ease-in-out infinite ${delay}s`,
              zIndex: 10,
            }}>
              <Component />
            </div>
          ))}
        </div>

        {/* ── SCREEN SELECTOR ── */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 56 }}>
          {screens.map((s, i) => (
            <button key={i} className="screen-btn" onClick={() => setActiveScreen(i)} style={{
              background: activeScreen === i ? `linear-gradient(135deg,${C.teal},${C.cyan})` : "rgba(255,255,255,0.06)",
              border: activeScreen === i ? "none" : "1px solid rgba(255,255,255,0.12)",
              color: activeScreen === i ? "white" : "rgba(255,255,255,0.42)",
              boxShadow: activeScreen === i ? `0 8px 28px rgba(13,148,136,0.45)` : "none",
              transform: activeScreen === i ? "scale(1.06)" : "scale(1)",
            }}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        {/* ── BOTTOM METRICS ── */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 48, marginTop: 64,
          paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.07)",
        }}>
          {[["2.500+", "Nutricionistas Ativos"], ["10M+", "Refeições Calculadas"], ["99%", "Precisão Nutricional"], ["<1s", "Tempo de Resposta"]].map(([v, l]) => (
            <div key={l as string} style={{ textAlign: "center" }}>
              <div className="serif-italic" style={{ fontSize: 36, color: C.lime, lineHeight: 1, fontWeight: 600 }}>{v}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.38)", marginTop: 5, textTransform: "uppercase", letterSpacing: "0.07em" }}>{l}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default function NutriXpertLanding() {
  return (
    <main>
      <GlobalStyles />
      <div className="noise-overlay" />
      <Navbar />
      <Hero />
      <EliteSpecs />
      <Features />
      <ClinicalEvolution />
      <ProfessionalBrand />
      <Stats />
      <Testimonials />
      <Pricing />
      <Footer />
    </main>
  );
}
