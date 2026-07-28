import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "motion/react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router";
import {
  Shield, Mic, MapPin, Phone, Clock, Cloud, ChevronDown,
  Check, X, Star, Download, Play, Menu as MenuIcon,
  MessageSquare, Bell, History, Settings, Lock, Zap,
  Share2, Volume2, Eye, CheckCircle, AlertCircle,
  Globe, Mail, Signal, Wifi, Battery, ChevronRight, Users,
  Backpack, GraduationCap, Car, TrainFront, Camera,
  Moon, Briefcase, HeartPulse, UserCheck, Newspaper, Truck,
  Timer, Infinity as InfinityIcon, SlidersHorizontal, Map as MapIcon, MessageCircle,
  Activity, WifiOff, BatteryCharging, EyeOff, KeyRound, FileCheck,
  Github, Linkedin, FileText, Smartphone, ArrowDown, ArrowLeft,
} from "lucide-react";
// ── Design tokens ─────────────────────────────────────────────────────────────
const neu: React.CSSProperties = {
  background: "linear-gradient(145deg, #0f0f22, #080810)",
  boxShadow: "8px 8px 28px rgba(0,0,0,0.75), -4px -4px 16px rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.06)",
};

const glass: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const redGlow: React.CSSProperties = {
  boxShadow: "0 0 28px rgba(255,23,68,0.42), 0 0 60px rgba(255,23,68,0.16)",
};

const gradientText: React.CSSProperties = {
  background: "linear-gradient(135deg, #ff1744 0%, #ff6b8a 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

// ── Support contact config — swap this for a real inbox once one exists ────────
const SUPPORT_EMAIL = "ers.iuxoa@gmail.com";
const SUPPORT_BUSINESS_HOURS = "Mon–Fri, 9:00 AM – 6:00 PM IST";
const SUPPORT_LOCATION = "Remote-first · India";
const SUPPORT_RESPONSE_TIME = "Within 24 hours";


const inViewFade = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 } as { opacity: number; y: number },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" },
};

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothScrollTo(id: string, duration = 550) {
  const NAVBAR_OFFSET = 88;

  let targetY: number;
  if (id === "home") {
    targetY = 0;
  } else {
    const el = document.getElementById(id);
    if (!el) return;
    targetY = el.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
  }

  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  function step(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 mb-5">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#ff1744" }} />
      <span className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "#ff4d6d" }}>
        {children}
      </span>
    </div>
  );
}

function PhoneMockup({ children, size = "md" }: { children: React.ReactNode; size?: "sm" | "md" | "lg" }) {
  const [w, h] = size === "sm" ? [220, 440] : size === "lg" ? [300, 610] : [252, 514];
  return (
    <div style={{ width: w, height: h, borderRadius: 44, background: "linear-gradient(160deg, #131328, #06060f)", boxShadow: "0 0 55px rgba(255,23,68,0.14), 18px 18px 55px rgba(0,0,0,0.9), -5px -5px 18px rgba(255,255,255,0.03)", border: "1.5px solid rgba(255,255,255,0.09)", position: "relative", overflow: "hidden", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", width: 78, height: 22, background: "#000", borderRadius: 13, zIndex: 10 }} />
      <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>{children}</div>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} style={neu} className="rounded-2xl p-6 text-center flex flex-col items-center gap-2"
      initial={{ opacity: 0, scale: 0.88 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5 }}>
      <span className="font-display text-2xl font-bold" style={{ color: "#ff1744" }}>{value}</span>
      <span className="text-xs text-gray-500 tracking-wide">{label}</span>
    </motion.div>
  );
}

// ── Navbar ───────────────────────────────────────────────────────────────
function NavBar() {
  const sections = [
    { id: "home", label: "Home" },
    { id: "why-ers", label: "Why ERS" },
    { id: "features", label: "Features" },
    { id: "how-it-works", label: "How It Works" },
    { id: "app-screens", label: "App Screens" },
    { id: "use-cases", label: "Who It's For" },
    { id: "comparison", label: "Comparison" },
    { id: "faq", label: "FAQ" },
  ];

  const navigate = useNavigate();
  const location = useLocation();
  const onHome = location.pathname === "/";

  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  // Persists across every IntersectionObserver callback so the active section is always
  // computed from the FULL current visibility picture, not just whichever entries changed
  // in that particular batch — this is what prevents flicker/incorrect highlighting when
  // one section's ratio updates independently of its still-visible neighbor's.
  const visibilityRef = useRef<Map<string, { ratio: number; top: number }>>(new Map());

  useEffect(() => {
    // rAF-throttled: collapse bursty scroll events to at most one state check per
    // frame so the header's blur/shadow toggle never competes with scroll work.
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 16);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Observe every section — including Home — so the active item is always driven
    // by IntersectionObserver alone, never by a parallel scroll-position calculation.
    // The band sits at ~35–45% of the viewport: a section is marked active as soon
    // as it crosses that line, matching how Linear/Vercel-style nav highlighting feels.
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const map = visibilityRef.current;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            map.set(entry.target.id, { ratio: entry.intersectionRatio, top: entry.boundingClientRect.top });
          } else {
            map.delete(entry.target.id);
          }
        });
        // Recompute from the full persisted picture (not just this batch) — the section
        // with the highest visibility in the band wins; ties broken by whichever sits
        // closest to (or above) the detection line. Exactly one item is ever active.
        let bestId = "";
        let bestRatio = -1;
        let bestTop = Infinity;
        map.forEach((v, id) => {
          if (v.ratio > bestRatio || (v.ratio === bestRatio && v.top < bestTop)) {
            bestRatio = v.ratio;
            bestTop = v.top;
            bestId = id;
          }
        });
        if (bestId) {
          setActive((prev) => (prev === bestId ? prev : bestId));
        } else if (window.scrollY < window.innerHeight * 0.5) {
          // Nothing has crossed the detection band yet (e.g. right at page load) — default to Home.
          setActive((prev) => (prev === "home" ? prev : "home"));
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const scrollToId = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    if (!onHome) {
      // Coming from a legal page (or anywhere off "/") — hand the target section off to
      // the home page via sessionStorage, then navigate there. HomePage's mount effect
      // picks this up and performs the smooth scroll once its sections exist in the DOM.
      sessionStorage.setItem("ers-scroll-target", id);
      navigate("/");
      return;
    }
    smoothScrollTo(id, 550);
    setActive(id);
  };

  // Optical horizontal padding — scaled gently by label length so the row reads as
  // hand-set type rather than a rigid, equal-width grid of links.
  const opticalPadX = (label: string) => Math.round(Math.max(11, Math.min(20, 7 + label.length * 0.62)));

  // Desktop link — pure color + sliding underline active state (no background pill),
  // matching the ERS accent-red brand color with a soft text glow when active.
  const NavLink = ({ s, size, group }: { s: { id: string; label: string }; size: number; group: string }) => {
    const isActive = active === s.id;
    const isHovered = hoveredId === s.id && !isActive;
    const padX = opticalPadX(s.label);
    const underlineWidth = Math.max(18, Math.min(34, Math.round(s.label.length * 1.8)));
    return (
      <a
        href={`#${s.id}`}
        onClick={scrollToId(s.id)}
        onMouseEnter={() => setHoveredId(s.id)}
        onMouseLeave={() => setHoveredId((v) => (v === s.id ? null : v))}
        className="relative whitespace-nowrap select-none font-nav"
        style={{
          fontSize: size,
          fontWeight: isActive ? 600 : 500,
          letterSpacing: "-0.2px",
          lineHeight: 1.2,
          padding: `9px ${padX}px`,
          display: "inline-flex",
          alignItems: "center",
          color: isActive ? "#ff4d6d" : isHovered ? "#ffffff" : "#82829a",
          textShadow: isActive ? "0 0 14px rgba(255,23,68,0.38)" : "0 0 0 rgba(255,23,68,0)",
          transition: "color 250ms ease, text-shadow 250ms ease, font-weight 250ms ease",
        }}
      >
        <span className="relative z-10">{s.label}</span>
        {isActive && (
          <motion.span
            layoutId={`nav-active-underline-${group}`}
            className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
            style={{
              bottom: 4,
              width: underlineWidth,
              height: 2.5,
              background: "linear-gradient(90deg,#ff1744,#ff4d6d)",
              boxShadow: "0 0 8px rgba(255,23,68,0.6), 0 0 16px rgba(255,23,68,0.3)",
            }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          />
        )}
      </a>
    );
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="lg:fixed lg:top-0 lg:left-0 lg:right-0 relative z-50"
        style={{
          background: scrolled ? "rgba(7,7,17,0.78)" : "rgba(7,7,17,0.28)",
          backdropFilter: scrolled ? "blur(26px)" : "blur(16px)",
          WebkitBackdropFilter: scrolled ? "blur(26px)" : "blur(16px)",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,255,255,0)",
          boxShadow: scrolled ? "0 10px 34px rgba(0,0,0,0.32)" : "0 0 0 rgba(0,0,0,0)",
          transition: "background 0.45s ease, backdrop-filter 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease",
        }}
        onMouseLeave={() => setHoveredId(null)}
      >
        <div
          className="ers-container hidden lg:grid items-center"
          style={{ height: 72, gridTemplateColumns: "1fr auto 1fr", columnGap: 16 }}
        >
          {/* Logo (left) */}
          <a href="#home" onClick={scrollToId("home")} className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer group justify-self-start">
            <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.25 }}
              className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#ff1744,#ff4d6d)", ...redGlow }}>
              <Shield className="w-4 h-4 text-white" />
            </motion.div>
            <span className="font-display text-lg font-bold text-white tracking-widest inline">ERS</span>
          </a>

          {/* Center nav — truly centered on the viewport via the middle grid column, not just
              centered within whatever space is left between the logo and the CTA. */}
          <nav className="hidden xl:flex items-center justify-self-center" style={{ gap: 2 }}>
            {sections.map((s) => <NavLink key={s.id} s={s} size={15.5} group="xl" />)}
          </nav>
          <nav className="flex xl:hidden items-center justify-self-center" style={{ gap: 0 }}>
            {sections.map((s) => <NavLink key={s.id} s={s} size={15} group="lg" />)}
          </nav>
        </div>

        {/* Tablet & mobile bar (<1024px) — logo only, no menu button */}
        <div className="ers-container flex lg:hidden items-center justify-between" style={{ height: 72 }}>
          <a href="#home" onClick={scrollToId("home")} className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer group">
            <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.25 }}
              className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#ff1744,#ff4d6d)", ...redGlow }}>
              <Shield className="w-4 h-4 text-white" />
            </motion.div>
            <span className="font-display text-lg font-bold text-white tracking-widest inline">ERS</span>
          </a>
          <a href="https://github.com/kvalecha186-dot/ers-app/releases/download/v1.0/app-debug.apk"
            download
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#ff1744,#ff4d6d)" }}
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </a>
        </div>
      </motion.header>
    </>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function HeroSection() {
  const trustIndicators = [
    { icon: <Lock className="w-3.5 h-3.5" />, label: "Works with Screen Locked" },
    { icon: <MapPin className="w-3.5 h-3.5" />, label: "Live GPS Alerts" },
    { icon: <Shield className="w-3.5 h-3.5" />, label: "Privacy First" },
  ];

  const particles = [
    { top: "14%", left: "10%", size: 3, dur: 22, delay: 0 },
    { top: "64%", left: "6%", size: 2, dur: 28, delay: 3 },
    { top: "28%", left: "88%", size: 2, dur: 25, delay: 1.5 },
    { top: "78%", left: "82%", size: 3, dur: 30, delay: 4 },
    { top: "46%", left: "52%", size: 2, dur: 26, delay: 2 },
  ];

  return (
    <section id="home" className="relative lg:min-h-screen flex items-start lg:items-center overflow-hidden pt-8 lg:pt-24 pb-16">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.033]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.2) 1px,transparent 1px)", backgroundSize: "72px 72px" }} />
        <div className="absolute rounded-full blur-3xl" style={{ top: "0%", left: "-5%", width: 620, height: 620, background: "radial-gradient(circle,rgba(255,23,68,0.14),transparent 70%)" }} />
        <div className="absolute rounded-full blur-3xl" style={{ bottom: "-10%", right: "-5%", width: 520, height: 520, background: "radial-gradient(circle,rgba(255,77,109,0.09),transparent 70%)" }} />
        <div className="absolute rounded-full blur-3xl" style={{ top: "32%", left: "40%", width: 400, height: 400, background: "radial-gradient(circle,rgba(255,23,68,0.05),transparent 70%)" }} />
        {particles.map((p, i) => (
          <motion.div key={i} className="absolute rounded-full" style={{ top: p.top, left: p.left, width: p.size, height: p.size, background: "#ff1744" }}
            animate={{ x: [0, 70, 0], opacity: [0.08, 0.32, 0.08] }} transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }} />
        ))}
      </div>
      <div className="relative z-10 ers-container grid md:grid-cols-2 gap-20 items-center py-16">
        <div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <SectionLabel>Emergency Recording System</SectionLabel>
          </motion.div>
          <div className="mb-9">
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}
              className="text-gray-600 font-medium leading-none" style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)", letterSpacing: "-0.01em" }}>Your</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.14 }}
              className="font-display font-bold text-white leading-[0.88]" style={{ fontSize: "clamp(3.2rem, 7.5vw, 5.8rem)", letterSpacing: "-0.04em" }}>Emergency.</motion.h1>
            <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="font-display font-bold leading-[0.86]" style={{ fontSize: "clamp(4.4rem, 10.5vw, 8.2rem)", letterSpacing: "-0.045em", ...gradientText, filter: "drop-shadow(0 0 34px rgba(255,23,68,0.28))" }}>Recorded.</motion.h1>
            <motion.h2 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.28 }}
              className="font-display font-normal text-gray-400 mt-3" style={{ fontSize: "clamp(1.35rem, 3.2vw, 2.4rem)", letterSpacing: "-0.02em", lineHeight: 1.15 }}>Protected. Instantly.</motion.h2>
          </div>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.36 }}
            className="text-gray-500 mb-6" style={{ fontSize: "15.5px", maxWidth: "46ch", lineHeight: 1.8 }}>
            ERS instantly records evidence and alerts your trusted contacts with your live location — even when your phone is locked.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.42 }}
            className="flex items-center gap-3 mb-10">
            <div className="flex -space-x-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(255,23,68,0.12)", border: "1.5px solid rgba(8,8,16,0.9)" }}>
                  <Users className="w-3 h-3" style={{ color: "#ff4d6d" }} />
                </div>
              ))}
            </div>
            <span className="text-xs text-gray-600 tracking-wide">Trusted by students, travellers & families</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.58 }}
            className="flex flex-wrap items-center gap-x-5 gap-y-3 mt-4">
            {trustIndicators.map((t, i) => (
              <div key={i} className="flex items-center gap-5">
                <div className="flex items-center gap-2 text-gray-500">
                  <span style={{ color: "#ff4d6d" }}>{t.icon}</span>
                  <span className="text-[11.5px] font-medium tracking-wide">{t.label}</span>
                </div>
                {i < trustIndicators.length - 1 && <span className="w-px h-3.5" style={{ background: "rgba(255,255,255,0.12)" }} />}
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:flex justify-center items-center">
          <div className="relative" style={{ width: 480, height: 660 }}>
            <div className="absolute rounded-full blur-3xl" style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 360, height: 400, background: "radial-gradient(ellipse,rgba(255,23,68,0.24),transparent 70%)" }} />

            {/* Radar pulse rings */}
            {[0, 1, 2].map((i) => (
              <motion.div key={i} className="absolute rounded-full pointer-events-none"
                style={{ top: "50%", left: "50%", width: 260, height: 260, marginTop: -130, marginLeft: -130, border: "1px solid rgba(255,23,68,0.22)" }}
                animate={{ scale: [1, 2.3, 2.3], opacity: [0.5, 0, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeOut", delay: i * 1.6 }} />
            ))}
            <motion.div className="absolute rounded-full pointer-events-none"
              style={{ top: "50%", left: "50%", width: 300, height: 300, marginTop: -150, marginLeft: -150, background: "conic-gradient(from 0deg, rgba(255,23,68,0.14) 0deg, transparent 70deg, transparent 360deg)" }}
              animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />

            <motion.div animate={{ y: [-11, 11, -11] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute" style={{ top: 28, left: 96 }}>
              <PhoneMockup size="lg">
                <div className="h-full flex flex-col bg-[#050510] px-5 pt-14 pb-6">
                  <div className="flex justify-between items-center mb-5 text-[10px] text-gray-700">
                    <span>9:41</span>
                    <div className="flex gap-1 items-center"><Signal className="w-2.5 h-2.5" /><Wifi className="w-2.5 h-2.5" /><Battery className="w-2.5 h-2.5" /></div>
                  </div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#ff1744,#ff4d6d)" }}><Shield className="w-4 h-4 text-white" /></div>
                      <span className="font-display text-white font-bold text-sm tracking-widest">ERS</span>
                    </div>
                    <Settings className="w-4 h-4 text-gray-700" />
                  </div>
                  <div className="rounded-2xl p-3.5 mb-7" style={{ background: "rgba(255,23,68,0.08)", border: "1px solid rgba(255,23,68,0.18)" }}>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#ff1744] animate-pulse" /><span className="text-[#ff4d6d] text-[10px] font-semibold uppercase tracking-widest">Protected & Active</span></div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full animate-ping opacity-[0.18]" style={{ background: "#ff1744", transform: "scale(1.35)" }} />
                      <div className="w-24 h-24 rounded-full flex items-center justify-center relative z-10" style={{ background: "linear-gradient(135deg,#ff1744,#ff4d6d)", boxShadow: "0 0 36px rgba(255,23,68,0.55),0 0 80px rgba(255,23,68,0.2)" }}>
                        <Mic className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-700 text-center">Hold Volume button for 3s</p>
                  </div>
                  <div className="flex justify-around">
                    {[{ icon: <Bell className="w-4 h-4" />, label: "Alerts" }, { icon: <History className="w-4 h-4" />, label: "History" }, { icon: <Settings className="w-4 h-4" />, label: "Settings" }].map((item) => (
                      <div key={item.label} className="flex flex-col items-center gap-1 text-gray-700">{item.icon}<span className="text-[9px]">{item.label}</span></div>
                    ))}
                  </div>
                </div>
              </PhoneMockup>
            </motion.div>

            {/* Floating cards — connected to the phone with subtle lead-lines */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.5 }} className="absolute" style={{ top: 44, right: -8 }}>
              <div className="absolute pointer-events-none" style={{ top: "50%", left: -34, width: 34, height: 1, background: "linear-gradient(to right, rgba(255,23,68,0.35), rgba(255,23,68,0))" }} />
              <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{ ...glass, borderRadius: 14, padding: "10px 14px", border: "1px solid rgba(255,23,68,0.22)", minWidth: 148 }}>
                <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-[#ff1744] animate-pulse" /><span className="text-white text-[11px] font-semibold">Recording Active</span></div>
                <p className="text-gray-500 text-[10px] font-mono">04:32 elapsed</p>
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.05, duration: 0.5 }} className="absolute" style={{ top: "46%", left: -8 }}>
              <div className="absolute pointer-events-none" style={{ top: "50%", right: -34, width: 34, height: 1, background: "linear-gradient(to left, rgba(255,23,68,0.35), rgba(255,23,68,0))" }} />
              <motion.div animate={{ y: [-6, 6, -6] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                style={{ ...glass, borderRadius: 14, padding: "10px 14px", minWidth: 138 }}>
                <div className="flex items-center gap-2 mb-1"><MapPin className="w-3.5 h-3.5" style={{ color: "#ff4d6d" }} /><span className="text-white text-[11px] font-semibold">Live Location</span></div>
                <p className="text-gray-500 text-[10px]">Sent to 2 contacts</p>
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2, duration: 0.5 }} className="absolute" style={{ bottom: 70, right: -6 }}>
              <div className="absolute pointer-events-none" style={{ top: "50%", left: -32, width: 32, height: 1, background: "linear-gradient(to right, rgba(255,23,68,0.35), rgba(255,23,68,0))" }} />
              <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                style={{ ...glass, borderRadius: 14, padding: "10px 14px", minWidth: 154 }}>
                <div className="flex items-center gap-2 mb-1"><CheckCircle className="w-3.5 h-3.5 text-green-400" /><span className="text-white text-[11px] font-semibold">SMS Delivered</span></div>
                <p className="text-gray-500 text-[10px]">Both contacts received</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Why ERS ───────────────────────────────────────────────────────────────────
function WhyERSSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  const problems = [
    { icon: <Phone className="w-6 h-6" />, title: "Can't unlock your phone", keyword: "Locked Screen", desc: "Traditional apps become useless when you're under threat — the ", descEnd: " barrier makes every second lethal.", delay: 0.1, offset: 40 },
    { icon: <Eye className="w-6 h-6" />, title: "Evidence disappears", keyword: "Evidence Lost", desc: "Without automatic recording, critical audio is gone forever. ", descEnd: " means no proof when it matters most.", delay: 0.2, offset: 0, featured: true },
    { icon: <Bell className="w-6 h-6" />, title: "Contacts stay unaware", keyword: "No Alert Sent", desc: "Your trusted people remain uninformed until it's far too late. ", descEnd: " is the gap ERS closes instantly.", delay: 0.3, offset: 40 },
  ];

  return (
    <section ref={sectionRef} id="why-ers" className="relative py-32 px-6 overflow-hidden">
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <div className="absolute inset-0 opacity-[0.028]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.18) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.18) 1px,transparent 1px)", backgroundSize: "56px 56px" }} />
        <div className="absolute rounded-full blur-3xl" style={{ top: "-10%", left: "5%", width: 560, height: 480, background: "radial-gradient(ellipse,rgba(255,23,68,0.09),transparent 70%)" }} />
        <div className="absolute rounded-full blur-3xl" style={{ bottom: "-5%", right: "8%", width: 420, height: 360, background: "radial-gradient(ellipse,rgba(255,77,109,0.07),transparent 70%)" }} />
        {[{ top: "18%", left: "12%", size: 3, op: 0.18 }, { top: "72%", left: "8%", size: 2, op: 0.12 }, { top: "30%", right: "10%", size: 3, op: 0.16 }, { top: "60%", right: "6%", size: 2, op: 0.10 }, { top: "50%", left: "25%", size: 2, op: 0.10 }, { top: "20%", right: "28%", size: 2, op: 0.12 }].map((p, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{ top: p.top, left: (p as {left?:string}).left, right: (p as {right?:string}).right, width: p.size, height: p.size, background: "#ff1744", opacity: p.op }}
            animate={{ scale: [1, 1.6, 1], opacity: [p.op, p.op * 2, p.op] }}
            transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }} />
        ))}
      </motion.div>

      <div className="relative z-10 ers-container">
        <motion.div {...inViewFade} className="text-center mb-20">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-7" style={{ ...glass, border: "1px solid rgba(255,23,68,0.22)" }}>
            <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full" style={{ background: "#ff1744", boxShadow: "0 0 6px rgba(255,23,68,0.8)" }} />
            <span className="text-xs font-semibold uppercase tracking-[0.13em]" style={{ color: "#ff4d6d" }}>Why Emergency Recording Matters</span>
          </motion.div>
          <h2 className="font-display font-bold text-white leading-tight mb-5" style={{ fontSize: "clamp(2.4rem, 5.5vw, 4rem)", letterSpacing: "-0.03em" }}>
            Why <span className="relative inline-block">
              <span style={gradientText}>ERS?</span>
              <span className="absolute inset-0 blur-2xl -z-10 scale-150" style={{ background: "radial-gradient(ellipse,rgba(255,23,68,0.35),transparent 70%)" }} />
            </span>
          </h2>
          <p className="text-gray-500 mx-auto" style={{ fontSize: "15px", lineHeight: 1.75, maxWidth: "46ch" }}>Every second in an emergency is irreplaceable. Traditional methods fail at the worst possible moment.</p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute" style={{ top: "50%", left: "10%", right: "6%", transform: "translateY(-50%)", zIndex: 0 }}>
            <svg width="100%" height="2" style={{ overflow: "visible" }}>
              <motion.line x1="0" y1="1" x2="100%" y2="1" stroke="rgba(255,23,68,0.22)" strokeWidth="1.5" strokeDasharray="5 8"
                initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: "easeOut", delay: 0.4 }} />
              <motion.line x1="0" y1="1" x2="100%" y2="1" stroke="rgba(255,23,68,0.08)" strokeWidth="6" strokeDasharray="5 8"
                initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: "easeOut", delay: 0.4 }} />
            </svg>
            <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1.8 }}
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#ff1744,#ff4d6d)", ...redGlow }}>
              <Shield className="w-4 h-4 text-white" />
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-5 items-start relative z-10">
            {problems.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: p.delay, ease: [0.16, 1, 0.3, 1] }} style={{ marginTop: p.offset }}>
                <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3, ease: "easeOut" }}
                  className="group relative rounded-2xl overflow-hidden cursor-default"
                  style={{ ...neu, ...(p.featured ? { border: "1px solid rgba(255,23,68,0.18)", boxShadow: "8px 8px 28px rgba(0,0,0,0.8),-4px -4px 16px rgba(255,255,255,0.03),0 0 20px rgba(255,23,68,0.1)" } : {}), padding: p.featured ? "36px 28px" : "28px 24px" }}>
                  {p.featured && <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(255,23,68,0.07),transparent 70%)" }} />}
                  <div className="absolute top-0 left-0 right-0 h-px overflow-hidden rounded-t-2xl">
                    <div className="h-full w-0 group-hover:w-full transition-all duration-500 ease-out" style={{ background: "linear-gradient(90deg,#ff1744,#ff4d6d,transparent)" }} />
                  </div>
                  <div className="relative mb-6 inline-flex">
                    <motion.div whileHover={{ rotate: 8 }} transition={{ duration: 0.3 }}
                      className="w-14 h-14 rounded-2xl flex items-center justify-center relative z-10 [&_svg]:w-6 [&_svg]:h-6"
                      style={{ background: "rgba(255,23,68,0.1)", border: "1px solid rgba(255,23,68,0.18)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06),inset 0 -1px 0 rgba(0,0,0,0.3)", color: "#ff4d6d" }}>
                      {p.icon}
                    </motion.div>
                    <motion.div className="absolute inset-0 rounded-2xl" animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }} style={{ border: "1px solid rgba(255,23,68,0.4)" }} />
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" style={{ background: "rgba(255,23,68,0.2)" }} />
                  </div>
                  <h3 className="font-display font-bold text-white mb-3" style={{ fontSize: p.featured ? "1.25rem" : "1.05rem", letterSpacing: "-0.015em" }}>{p.title}</h3>
                  <p className="text-gray-500 leading-relaxed" style={{ fontSize: "13.5px", lineHeight: 1.72 }}>
                    {p.desc}<span style={{ color: "#ff4d6d", fontWeight: 600 }}>{p.keyword}</span>{p.descEnd}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────
interface FeatData {
  icon: React.ReactNode;
  title: string;
  desc: string;
  keyword?: string;
  descEnd?: string;
  large?: boolean;
}

function FeatureCard({ icon, title, desc, keyword, descEnd, large = false, side = "none", delay = 0 }: FeatData & { side?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -18 : side === "right" ? 18 : 0, y: side === "none" ? 14 : 0 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative cursor-default rounded-2xl overflow-hidden"
      style={{ ...neu, padding: large ? "18px 18px" : "14px 16px" }}
    >
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
        <div className="h-full w-0 group-hover:w-full transition-all duration-500"
          style={{ background: "linear-gradient(90deg,#ff1744,#ff4d6d,transparent)" }} />
      </div>
      <div className="flex items-center gap-3.5">
        <div className="relative flex-shrink-0">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ duration: 0.22 }}
            className="rounded-xl flex items-center justify-center [&_svg]:w-4 [&_svg]:h-4 relative z-10"
            style={{ width: large ? 46 : 40, height: large ? 46 : 40, background: "rgba(255,23,68,0.09)", border: "1px solid rgba(255,23,68,0.16)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)", color: "#ff4d6d" }}
          >
            {icon}
          </motion.div>
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"
            style={{ background: "rgba(255,23,68,0.26)" }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-white leading-tight mb-1" style={{ fontSize: "13px" }}>{title}</h3>
          <p className="text-gray-600 leading-relaxed" style={{ fontSize: "11.5px", lineHeight: 1.62 }}>
            {desc}
            {keyword && <span style={{ color: "#ff4d6d", fontWeight: 600 }}>{keyword}</span>}
            {descEnd}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ErsShieldHub() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-5">
      <div className="relative flex items-center justify-center" style={{ width: 264, height: 264 }}>
        {/* Background bloom */}
        <div className="absolute inset-0 rounded-full blur-3xl opacity-35" style={{ background: "radial-gradient(circle,rgba(255,23,68,0.6),transparent 65%)" }} />

        {/* Tick-mark ring (SVG) */}
        <svg width="242" height="242" viewBox="0 0 242 242" className="absolute">
          {Array.from({ length: 36 }, (_, i) => {
            const angle = (i * 360) / 36;
            const rad = (angle * Math.PI) / 180;
            const isMajor = i % 9 === 0;
            const inner = isMajor ? 107 : 111;
            const outer = 118;
            return (
              <line key={i}
                x1={121 + inner * Math.sin(rad)} y1={121 - inner * Math.cos(rad)}
                x2={121 + outer * Math.sin(rad)} y2={121 - outer * Math.cos(rad)}
                stroke={`rgba(255,23,68,${isMajor ? 0.45 : 0.14})`}
                strokeWidth={isMajor ? 1.5 : 0.8}
              />
            );
          })}
        </svg>

        {/* Outer dashed ring */}
        <motion.div className="absolute rounded-full" style={{ width: 236, height: 236, border: "1px dashed rgba(255,23,68,0.15)" }}
          animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} />

        {/* Radar sweep */}
        <motion.div className="absolute rounded-full" style={{ width: 196, height: 196, background: "conic-gradient(from 0deg, rgba(255,23,68,0.2) 0deg, rgba(255,23,68,0.06) 55deg, transparent 95deg)" }}
          animate={{ rotate: 360 }} transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }} />

        {/* Concentric rings */}
        {[196, 152, 110].map((sz, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{ width: sz, height: sz, border: `1px solid rgba(255,23,68,${0.2 - i * 0.055})` }}
            animate={{ scale: [1, 1.035, 1], opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 2.6 + i * 0.65, repeat: Infinity, ease: "easeInOut", delay: i * 0.45 }} />
        ))}

        {/* Connection dots (left / right edges of outermost ring) */}
        {[{ left: 0, top: "50%" }, { right: 0, top: "50%" }].map((pos, i) => (
          <motion.div key={i} className="absolute w-2 h-2 rounded-full -translate-y-1/2"
            style={{ ...pos, background: "#ff1744", boxShadow: "0 0 8px rgba(255,23,68,0.9)", zIndex: 20 }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }} />
        ))}

        {/* Shield */}
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 flex items-center justify-center rounded-full"
          style={{ width: 90, height: 90, background: "linear-gradient(135deg,#ff1744,#ff4d6d)", boxShadow: "0 0 38px rgba(255,23,68,0.65), 0 0 80px rgba(255,23,68,0.28)" }}
        >
          <Shield className="w-11 h-11 text-white" />
        </motion.div>
      </div>

      {/* Label */}
      <div className="text-center">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">ERS Core System</p>
        <p className="text-[10px] text-gray-700 mt-0.5">All features powered by one trigger</p>
      </div>
    </div>
  );
}

function FeaturesSection() {
  const GAP = 28;

  const leftFeatures: FeatData[] = [
    {
      icon: <Volume2 />, title: "Hardware Trigger",
      desc: "Hold any Volume button for ", keyword: "3 seconds",
      descEnd: " to activate — no unlock, no delay.", large: true,
    },
    {
      icon: <Mic />, title: "Auto Recording",
      desc: "High-quality audio starts immediately and runs silently in the background.",
    },
    {
      icon: <Cloud />, title: "Google Drive Backup",
      desc: "Optional ", keyword: "Google Drive",
      descEnd: " upload secures every recording in your personal cloud.", large: true,
    },
  ];

  const rightFeatures: FeatData[] = [
    {
      icon: <MapPin />, title: "Live Location SMS",
      desc: "Sends your ", keyword: "live Google Maps link",
      descEnd: " to all contacts the instant recording starts.", large: true,
    },
    {
      icon: <Phone />, title: "Dual-SIM Support",
      desc: "Full ", keyword: "Dual-SIM",
      descEnd: " compatibility — alerts reach contacts on any network.",
    },
    {
      icon: <MessageSquare />, title: "WhatsApp Integration",
      desc: "Quick alerts and completed recordings auto-shared via ", keyword: "WhatsApp",
      descEnd: " instantly.", large: true,
    },
  ];

  const bottomCard: FeatData = {
    icon: <History />, title: "Recordings History",
    desc: "Full chronological log with color-coded status — red for pending, green for shared.",
  };


  return (
    <section id="features" className="py-28 px-6 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.022]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)", backgroundSize: "56px 56px" }} />
        <div className="absolute rounded-full blur-3xl"
          style={{ top: "8%", left: "4%", width: 440, height: 360, background: "radial-gradient(ellipse,rgba(255,23,68,0.07),transparent 70%)" }} />
        <div className="absolute rounded-full blur-3xl"
          style={{ bottom: "4%", right: "4%", width: 360, height: 300, background: "radial-gradient(ellipse,rgba(255,77,109,0.05),transparent 70%)" }} />
        {[{ top: "20%", left: "14%", op: 0.10 }, { top: "70%", left: "10%", op: 0.07 }, { top: "30%", right: "12%", op: 0.08 }, { top: "68%", right: "8%", op: 0.06 }].map((p, i) => (
          <motion.div key={i} className="absolute w-1 h-1 rounded-full"
            style={{ top: p.top, left: (p as {left?:string}).left, right: (p as {right?:string}).right, background: "#ff1744", opacity: p.op }}
            animate={{ scale: [1, 2.2, 1], opacity: [p.op, p.op * 2.8, p.op] }}
            transition={{ duration: 4.5 + i * 0.9, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }} />
        ))}
      </div>

      <div className="relative z-10 ers-container">
        <motion.div {...inViewFade} className="text-center mb-16">
          <SectionLabel>Core Capabilities</SectionLabel>
          <h2 className="font-display font-bold text-white mb-4"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", letterSpacing: "-0.03em" }}>
            Seven Features. <span style={gradientText}>One Trigger.</span>
          </h2>
          <p className="text-gray-500 mx-auto" style={{ fontSize: "15px", lineHeight: 1.75, maxWidth: "42ch" }}>
            The strongest capabilities of ERS — all connected by a single hardware button press.
          </p>
        </motion.div>

        {/* ── Desktop: hub layout ── */}
        <div className="hidden lg:grid items-stretch mb-8"
          style={{ gridTemplateColumns: "1fr 276px 1fr", gap: GAP }}>

          {/* Left 3 */}
          <div className="flex flex-col gap-5">
            {leftFeatures.map((f, i) => (
              <div key={i} className="relative">
                <FeatureCard {...f} side="left" delay={0.08 + i * 0.1} />
                {/* Connector → shield */}
                <motion.div className="absolute top-1/2 pointer-events-none flex items-center"
                  style={{ right: -GAP, width: GAP, transform: "translateY(-50%)" }}
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.12 }}>
                  <motion.div className="flex-1"
                    style={{ height: "0.5px", background: "linear-gradient(to right,rgba(255,23,68,0.04),rgba(255,23,68,0.3))", transformOrigin: "left" }}
                    initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.6 + i * 0.12 }} />
                  <motion.div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "#ff1744", boxShadow: "0 0 5px rgba(255,23,68,0.75)" }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.4 }} />
                </motion.div>
              </div>
            ))}
          </div>

          {/* Center shield */}
          <ErsShieldHub />

          {/* Right 3 */}
          <div className="flex flex-col gap-5">
            {rightFeatures.map((f, i) => (
              <div key={i} className="relative">
                {/* Connector shield → */}
                <motion.div className="absolute top-1/2 pointer-events-none flex items-center"
                  style={{ left: -GAP, width: GAP, transform: "translateY(-50%)" }}
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.12 }}>
                  <motion.div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "#ff1744", boxShadow: "0 0 5px rgba(255,23,68,0.75)" }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.4 + 0.8 }} />
                  <motion.div className="flex-1"
                    style={{ height: "0.5px", background: "linear-gradient(to left,rgba(255,23,68,0.04),rgba(255,23,68,0.3))", transformOrigin: "right" }}
                    initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.6 + i * 0.12 }} />
                </motion.div>
                <FeatureCard {...f} side="right" delay={0.08 + i * 0.1} />
              </div>
            ))}
          </div>
        </div>

        {/* 7th card: Recordings History — centered below hub */}
        <motion.div className="hidden lg:flex justify-center mb-0"
          initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.28 }}>
          <div style={{ width: "clamp(260px, 36%, 400px)" }}>
            <FeatureCard {...bottomCard} side="none" delay={0} />
          </div>
        </motion.div>

        {/* ── Mobile ── */}
        <div className="lg:hidden">
          <div className="flex justify-center py-6"><ErsShieldHub /></div>
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {[...leftFeatures, ...rightFeatures, bottomCard].map((f, i) => (
              <FeatureCard key={i} {...f} delay={i * 0.06} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

// ── How It Works ──────────────────────────────────────────────────────────────
function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  const steps = [
    {
      num: "01", icon: <Volume2 />, title: "Hold Volume Button",
      desc: "Press and hold either Volume button for ", keyword: "3 seconds",
      descEnd: " — works instantly, even with a locked screen.",
    },
    {
      num: "02", icon: <Clock />, title: "Safety Countdown",
      desc: "A ", keyword: "5-second countdown",
      descEnd: " appears with a large Cancel — no accidental triggers.",
    },
    {
      num: "03", icon: <Mic />, title: "Recording Begins",
      desc: "High-quality audio ", keyword: "recording",
      descEnd: " starts automatically and runs silently in the background.",
    },
    {
      num: "04", icon: <MapPin />, title: "Location Alert Sent",
      desc: "Emergency SMS with your ", keyword: "live location",
      descEnd: " delivered to all trusted contacts the instant it starts.",
    },
    {
      num: "05", icon: <Bell />, title: "Live Timer Runs",
      desc: "A persistent notification tracks your active ", keyword: "recording",
      descEnd: " in real time until completion.",
    },
    {
      num: "06", icon: <Share2 />, title: "Auto Share & Backup",
      desc: "Recording auto-shared via ", keyword: "WhatsApp",
      descEnd: " and optionally backed up securely to Google Drive.",
    },
  ];

  // Step card — glassmorphism, circular icon, step badge
  function StepCard({ step, align, hideBadge }: { step: typeof steps[0]; align: "left" | "right"; hideBadge?: boolean }) {
    return (
      <div className="relative group cursor-default">
        {/* Step badge */}
        {!hideBadge && (
          <div
            className="absolute -top-3 z-20 flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold text-white"
            style={{
              [align === "left" ? "right" : "left"]: -10,
              background: "linear-gradient(135deg,#ff1744,#ff4d6d)",
              boxShadow: "0 0 12px rgba(255,23,68,0.6)",
            }}
          >
            {parseInt(step.num)}
          </div>
        )}

        <motion.div
          whileHover={{ y: -6, scale: 1.025 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            ...glass,
            border: "1px solid rgba(255,255,255,0.09)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
            <div className="h-full w-0 group-hover:w-full transition-all duration-500"
              style={{ background: "linear-gradient(90deg,#ff1744,#ff4d6d,transparent)" }} />
          </div>

          {/* Hover border glow */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
            style={{ boxShadow: "inset 0 0 0 1px rgba(255,23,68,0.22)" }} />

          {/* Circular glass icon */}
          <div className="relative mb-4 inline-flex items-center justify-center">
            {/* Outer pulse ring */}
            <motion.div
              className="absolute rounded-full"
              style={{ width: 52, height: 52, border: "1px solid rgba(255,23,68,0.22)" }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.75, 0.3] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Inner ring */}
            <div className="absolute rounded-full"
              style={{ width: 40, height: 40, border: "1px solid rgba(255,23,68,0.14)" }} />
            {/* Icon circle */}
            <motion.div
              whileHover={{ rotate: 8, scale: 1.1 }}
              transition={{ duration: 0.22 }}
              className="w-10 h-10 rounded-full flex items-center justify-center [&_svg]:w-4 [&_svg]:h-4 relative z-10"
              style={{
                background: "rgba(255,23,68,0.12)",
                border: "1px solid rgba(255,23,68,0.22)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                color: "#ff4d6d",
              }}
            >
              {step.icon}
            </motion.div>
            {/* Hover icon glow */}
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"
              style={{ background: "rgba(255,23,68,0.25)" }} />
          </div>

          <h3 className="font-display font-bold text-white mb-1.5" style={{ fontSize: "14px", letterSpacing: "-0.01em" }}>{step.title}</h3>
          <p className="text-gray-500 leading-relaxed" style={{ fontSize: "12px", lineHeight: 1.68 }}>
            {step.desc}
            {step.keyword && <span style={{ color: "#ff4d6d", fontWeight: 600 }}>{step.keyword}</span>}
            {step.descEnd}
          </p>
        </motion.div>
      </div>
    );
  }

  // Center connection node
  function CenterNode({ isLast }: { isLast: boolean }) {
    return (
      <div className="flex flex-col items-center h-full relative z-10">
        <div className="relative flex items-center justify-center mt-8 flex-shrink-0">
          <motion.div
            className="absolute rounded-full"
            style={{ width: 22, height: 22, border: "1px solid rgba(255,23,68,0.4)" }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.35, 0.9, 0.35] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="w-3 h-3 rounded-full relative z-10"
            style={{ background: "#ff1744", boxShadow: "0 0 10px rgba(255,23,68,0.9)" }} />
        </div>
        {!isLast && <div className="flex-1 w-px mt-3" style={{ background: "linear-gradient(to bottom,rgba(255,23,68,0.35),rgba(255,23,68,0.1))", minHeight: 32 }} />}
      </div>
    );
  }

  return (
    <section id="how-it-works" ref={sectionRef} className="relative py-32 px-6 overflow-hidden">
      {/* Parallax background */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <div className="absolute inset-0 opacity-[0.022]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute rounded-full blur-3xl"
          style={{ top: "-5%", right: "5%", width: 480, height: 420, background: "radial-gradient(ellipse,rgba(255,23,68,0.08),transparent 70%)" }} />
        <div className="absolute rounded-full blur-3xl"
          style={{ bottom: "0%", left: "5%", width: 380, height: 340, background: "radial-gradient(ellipse,rgba(255,77,109,0.06),transparent 70%)" }} />
        {/* Floating particles */}
        {[{ top: "15%", left: "8%", op: 0.10 }, { top: "55%", left: "6%", op: 0.07 }, { top: "25%", right: "7%", op: 0.09 }, { top: "70%", right: "5%", op: 0.06 }].map((p, i) => (
          <motion.div key={i} className="absolute w-1 h-1 rounded-full"
            style={{ top: p.top, left: (p as {left?:string}).left, right: (p as {right?:string}).right, background: "#ff1744", opacity: p.op }}
            animate={{ scale: [1, 2.5, 1], opacity: [p.op, p.op * 3, p.op] }}
            transition={{ duration: 5 + i * 0.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }} />
        ))}
      </motion.div>

      {/* Large watermark shield behind timeline */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{ opacity: 0.035, color: "#ff1744" }}
        animate={{ scale: [1, 1.06, 1], rotate: [0, 2, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <Shield style={{ width: 320, height: 320 }} />
      </motion.div>

      <div className="relative z-10 ers-container">
        {/* Heading */}
        <motion.div {...inViewFade} className="text-center mb-20">
          <SectionLabel>How It Works</SectionLabel>
          <h2 className="font-display font-bold text-white mb-5"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", letterSpacing: "-0.03em" }}>
            Six Steps. <span style={gradientText}>Zero Effort.</span>
          </h2>
          <p className="text-gray-500 mx-auto" style={{ fontSize: "15px", lineHeight: 1.75, maxWidth: "44ch" }}>
            One trigger starts an intelligent emergency response in seconds.
          </p>
        </motion.div>

        {/* ── Desktop zig-zag timeline ── */}
        <div className="hidden lg:block relative">
          {/* Vertical center line */}
          <div className="absolute left-1/2 -translate-x-1/2 inset-y-0 pointer-events-none" style={{ width: "0.5px", background: "linear-gradient(to bottom,transparent,rgba(255,23,68,0.28) 8%,rgba(255,23,68,0.28) 92%,transparent)" }} />

          {/* Moving particle down the line */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full z-20 pointer-events-none"
            style={{ background: "#ff1744", boxShadow: "0 0 8px rgba(255,23,68,0.95)" }}
            animate={{ top: ["2%", "98%"] }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear", repeatDelay: 0.5 }}
          />

          {steps.map((step, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: isLeft ? -28 : 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: i * 0.11, ease: [0.16, 1, 0.3, 1] }}
                className="grid items-start"
                style={{ gridTemplateColumns: "1fr 56px 1fr", marginBottom: i < steps.length - 1 ? 32 : 0 }}
              >
                {/* Left slot */}
                <div className={isLeft ? "pr-8" : ""}>
                  {isLeft && <StepCard step={step} align="left" />}
                </div>

                {/* Center: node */}
                <CenterNode isLast={i === steps.length - 1} />

                {/* Right slot */}
                <div className={!isLeft ? "pl-8" : ""}>
                  {!isLeft && <StepCard step={step} align="right" />}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Mobile: left-border stack ── */}
        <div className="lg:hidden relative pl-8">
          {/* Left border line */}
          <div className="absolute left-3 top-2 bottom-2 w-px pointer-events-none"
            style={{ background: "linear-gradient(to bottom,transparent,rgba(255,23,68,0.3) 5%,rgba(255,23,68,0.3) 95%,transparent)" }} />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-7"
            >
              {/* Numbered dot on the line */}
              <div className="absolute -left-8 top-6 w-6 h-6 rounded-full z-10 flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: "linear-gradient(135deg,#ff1744,#ff4d6d)", boxShadow: "0 0 10px rgba(255,23,68,0.8)" }}>
                {parseInt(step.num)}
              </div>
              <StepCard step={step} align="right" hideBadge />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── App Screens ───────────────────────────────────────────────────────────────
function AppScreensSection() {
  const [active, setActive] = useState(0);

  const screens = [
    {
      tab: "Home", name: "Home Screen",
      desc: "A single-purpose home screen keeps the emergency trigger one tap away — zero clutter, zero delay.",
      features: [
        { icon: <Zap className="w-3.5 h-3.5" />, label: "Instant one-tap activation" },
        { icon: <Lock className="w-3.5 h-3.5" />, label: "Works even when locked" },
      ],
      content: (<div className="h-full flex flex-col bg-[#050510] px-5 pt-14 pb-6"><div className="flex items-center justify-between mb-6"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#ff1744,#ff4d6d)" }}><Shield className="w-4 h-4 text-white" /></div><span className="font-display text-white font-bold text-sm tracking-wider">ERS</span></div><Settings className="w-4 h-4 text-gray-700" /></div><div className="flex-1 flex items-center justify-center"><div className="relative"><div className="absolute inset-0 rounded-full" style={{ background: "rgba(255,23,68,0.12)", transform: "scale(1.5)", filter: "blur(18px)" }} /><div className="w-24 h-24 rounded-full flex items-center justify-center relative z-10" style={{ background: "linear-gradient(135deg,#ff1744,#ff4d6d)", boxShadow: "0 0 30px rgba(255,23,68,0.55)" }}><Mic className="w-10 h-10 text-white" /></div></div></div><p className="text-center text-[10px] text-gray-700">Hold Volume button for 3s</p></div>),
    },
    {
      tab: "Countdown", name: "Emergency Countdown",
      desc: "A high-visibility countdown with a prominent Cancel prevents accidental triggers without losing speed.",
      features: [
        { icon: <Clock className="w-3.5 h-3.5" />, label: "5-second safety window" },
        { icon: <X className="w-3.5 h-3.5" />, label: "One-tap cancel" },
      ],
      content: (<div className="h-full flex flex-col items-center justify-center bg-[#050510] px-5 gap-5"><div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(255,23,68,0.12)" }}><AlertCircle className="w-6 h-6 text-[#ff1744]" /></div><p className="text-[#ff4d6d] text-[10px] uppercase tracking-widest font-semibold">Activating ERS in</p><div className="font-display text-8xl font-bold text-white leading-none">3</div><button className="px-8 py-2.5 rounded-xl text-sm font-semibold text-white mt-2" style={{ background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.14)" }}>Cancel</button></div>),
    },
    {
      tab: "Recording", name: "Recording Screen",
      desc: "A live waveform and elapsed timer confirm recording is active — no ambiguity about status.",
      features: [
        { icon: <Mic className="w-3.5 h-3.5" />, label: "Live audio waveform" },
        { icon: <MessageSquare className="w-3.5 h-3.5" />, label: "Delivery confirmation" },
      ],
      content: (<div className="h-full flex flex-col items-center justify-center bg-[#050510] px-5 gap-4"><div className="flex items-center gap-2 mb-2"><div className="w-2.5 h-2.5 rounded-full bg-[#ff1744] animate-pulse" /><span className="text-[#ff4d6d] text-xs font-semibold uppercase tracking-widest">Recording</span></div><div className="font-display text-5xl font-bold text-white">04:32</div><div className="flex items-end gap-0.5 mt-2">{Array.from({ length: 18 }, (_, i) => (<div key={i} className="w-1 rounded-full" style={{ height: `${6 + ((i * 7 + 11) % 26)}px`, background: i % 3 === 0 ? "#ff1744" : "rgba(255,23,68,0.35)" }} />))}</div><div className="mt-4 rounded-xl px-5 py-2.5 text-xs font-semibold text-white" style={{ background: "rgba(255,23,68,0.13)", border: "1px solid rgba(255,23,68,0.22)" }}>SMS sent to 2 contacts</div></div>),
    },
    {
      tab: "History", name: "Recordings History",
      desc: "A complete chronological log with clear status indicators — nothing is ever misplaced.",
      features: [
        { icon: <History className="w-3.5 h-3.5" />, label: "Full timestamped log" },
        { icon: <CheckCircle className="w-3.5 h-3.5" />, label: "Shared vs. pending status" },
      ],
      content: (<div className="h-full flex flex-col bg-[#050510] px-5 pt-14 pb-6"><p className="font-display text-white font-bold text-sm mb-4 tracking-wide">Recordings</p>{[{ name: "Emergency — 14 Jun, 22:14", dur: "8:42", status: "shared" }, { name: "Emergency — 08 Jun, 18:30", dur: "12:05", status: "shared" }, { name: "Emergency — 02 Jun, 09:11", dur: "4:18", status: "pending" }].map((r, i) => (<div key={i} className="flex items-center gap-3 mb-2.5 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.05)" }}><div className={`w-2 h-2 rounded-full flex-shrink-0 ${r.status === "shared" ? "bg-green-400" : "bg-[#ff1744]"}`} /><div className="flex-1 min-w-0"><p className="text-white text-[10px] truncate">{r.name}</p><p className="text-gray-600 text-[9px]">{r.dur} · {r.status === "shared" ? "Shared" : "Pending"}</p></div><Share2 className="w-3 h-3 text-gray-700 flex-shrink-0" /></div>))}</div>),
    },
    {
      tab: "Settings", name: "Settings",
      desc: "Every configuration lives on one screen — duration, backup, contacts, and sharing.",
      features: [
        { icon: <Cloud className="w-3.5 h-3.5" />, label: "Optional Drive backup" },
        { icon: <Users className="w-3.5 h-3.5" />, label: "Manage trusted contacts" },
      ],
      content: (<div className="h-full flex flex-col bg-[#050510] px-5 pt-14 pb-6"><p className="font-display text-white font-bold text-sm mb-4 tracking-wide">Settings</p>{[{ label: "Recording Duration", value: "15 min" }, { label: "Drive Backup", value: "On" }, { label: "WhatsApp Share", value: "On" }, { label: "SMS Alerts", value: "On" }, { label: "Emergency Contacts", value: "3" }].map((item, i) => (<div key={i} className="flex justify-between items-center py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}><span className="text-gray-500 text-[10px]">{item.label}</span><span className="text-[#ff4d6d] text-[10px] font-semibold">{item.value}</span></div>))}</div>),
    },
  ];

  const current = screens[active];

  return (
    <section id="app-screens" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />
        <div className="absolute rounded-full blur-3xl" style={{ top: "18%", left: "36%", width: 480, height: 480, background: "radial-gradient(circle,rgba(255,23,68,0.07),transparent 70%)" }} />
      </div>

      <div className="relative z-10 ers-container">
        <motion.div {...inViewFade} className="text-center mb-14">
          <SectionLabel>App Screens</SectionLabel>
          <h2 className="font-display font-bold text-white mb-4" style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", letterSpacing: "-0.03em" }}>Designed for <span style={gradientText}>Instant Access</span></h2>
          <p className="text-gray-500 mx-auto" style={{ fontSize: "15px", lineHeight: 1.75, maxWidth: "44ch" }}>A premium dark interface built for rapid use under extreme stress.</p>
        </motion.div>

        {/* Slim horizontal tab bar */}
        <motion.div {...inViewFade} className="flex justify-center mb-20">
          <div className="flex items-center gap-9 overflow-x-auto px-2" style={{ scrollSnapType: "x mandatory" }}>
            {screens.map((s, i) => {
              const isActive = active === i;
              return (
                <button key={s.tab} onClick={() => setActive(i)}
                  className="relative pb-3 text-sm whitespace-nowrap transition-colors duration-300 flex-shrink-0"
                  style={{ scrollSnapAlign: "center", color: isActive ? "#ff4d6d" : "#71717a", fontWeight: isActive ? 600 : 500 }}>
                  {s.tab}
                  {isActive && (
                    <motion.span layoutId="app-screens-underline" className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                      style={{ background: "linear-gradient(90deg,#ff1744,#ff4d6d)", boxShadow: "0 0 10px rgba(255,23,68,0.65)" }}
                      transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Phone + description */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-10">
          <div className="flex-shrink-0 lg:-ml-6">
            <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.4, ease: "easeOut" }} className="relative">
              <div className="absolute rounded-full blur-3xl pointer-events-none" style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 300, height: 340, background: "radial-gradient(ellipse,rgba(255,23,68,0.16),transparent 70%)" }} />
              <AnimatePresence mode="wait">
                <motion.div key={active} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35, ease: "easeOut" }} className="relative">
                  <PhoneMockup size="lg">{current.content}</PhoneMockup>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="flex-1 max-w-md w-full">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} transition={{ duration: 0.35, ease: "easeOut" }}>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4" style={{ letterSpacing: "-0.025em" }}>{current.name}</h3>
                <p className="text-gray-500 mb-9" style={{ fontSize: "15px", lineHeight: 1.8, maxWidth: "40ch" }}>{current.desc}</p>
                <div className="flex flex-col gap-4">
                  {current.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,23,68,0.1)", color: "#ff4d6d" }}>
                        {f.icon}
                      </div>
                      <span className="text-sm text-gray-400">{f.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Use Cases ─────────────────────────────────────────────────────────────────
function UseCasesSection() {
  const cases = [
    {
      icon: <Backpack className="w-full h-full" />, title: "Personal Safety While Travelling Alone",
      desc: "Solo trips and late walks feel safer when ", keyword: "live location sharing", descEnd: " is always one tap away.",
      featured: true,
    },
    {
      icon: <Shield className="w-full h-full" />, title: "Women's Safety",
      desc: "Immediate ", keyword: "evidence and alerts", descEnd: " for safer commutes and public spaces.",
    },
    {
      icon: <GraduationCap className="w-full h-full" />, title: "Student Protection",
      desc: "Campus walks and late study nights stay ", keyword: "protected", descEnd: " with one hidden trigger.",
    },
    {
      icon: <Car className="w-full h-full" />, title: "Road Rage Incidents",
      desc: "Confrontations on the road get ", keyword: "recorded automatically", descEnd: " the moment things escalate.",
    },
    {
      icon: <TrainFront className="w-full h-full" />, title: "Public Transport Emergencies",
      desc: "Crowded platforms and late trains are safer with ", keyword: "instant alerts", descEnd: " to people who can help.",
    },
    {
      icon: <Camera className="w-full h-full" />, title: "Emergency Evidence Collection",
      desc: "Every incident is ", keyword: "documented and time-stamped", descEnd: " — proof you can rely on.",
    },
  ];

  const particles = [
    { top: "12%", left: "8%", size: 2, dur: 24, delay: 0 },
    { top: "68%", left: "5%", size: 3, dur: 30, delay: 2 },
    { top: "22%", right: "6%", size: 2, dur: 26, delay: 1 },
    { top: "78%", right: "10%", size: 2, dur: 28, delay: 3.5 },
  ];

  return (
    <section id="use-cases" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.022]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute rounded-full blur-3xl" style={{ top: "-8%", left: "8%", width: 500, height: 440, background: "radial-gradient(ellipse,rgba(255,23,68,0.08),transparent 70%)" }} />
        <div className="absolute rounded-full blur-3xl" style={{ bottom: "-10%", right: "6%", width: 440, height: 380, background: "radial-gradient(ellipse,rgba(255,77,109,0.06),transparent 70%)" }} />
        {particles.map((p, i) => (
          <motion.div key={i} className="absolute rounded-full" style={{ top: p.top, left: (p as { left?: string }).left, right: (p as { right?: string }).right, width: p.size, height: p.size, background: "#ff1744" }}
            animate={{ scale: [1, 1.8, 1], opacity: [0.08, 0.28, 0.08] }} transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }} />
        ))}
      </div>

      <div className="relative z-10 ers-container">
        <motion.div {...inViewFade} className="text-center mb-20">
          <SectionLabel>Real Emergencies</SectionLabel>
          <h2 className="font-display font-bold text-white mb-5" style={{ fontSize: "clamp(2.1rem, 4.8vw, 3.5rem)", letterSpacing: "-0.03em" }}>
            Ready When <span style={gradientText}>Life Is Unexpected.</span>
          </h2>
          <p className="text-gray-500 mx-auto" style={{ fontSize: "15px", lineHeight: 1.75, maxWidth: "48ch" }}>
            ERS is built for the everyday moments that matter most — where instant evidence and a trusted alert can change everything.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-flow-dense gap-6 lg:auto-rows-[190px]">
          {cases.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className={`group relative rounded-3xl overflow-hidden cursor-default ${c.featured ? "sm:col-span-2 lg:col-span-2 lg:row-span-2 p-8 md:p-10" : "p-6"}`}
              style={{
                background: "rgba(255,255,255,0.025)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "8px 8px 24px rgba(0,0,0,0.55), -3px -3px 12px rgba(255,255,255,0.02)",
              }}
            >
              {/* Hover ambient glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: c.featured ? "radial-gradient(ellipse at 30% 20%,rgba(255,23,68,0.16),transparent 65%)" : "radial-gradient(ellipse at 50% 0%,rgba(255,23,68,0.1),transparent 70%)" }} />
              {/* Border brighten on hover */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{ boxShadow: "inset 0 0 0 1px rgba(255,23,68,0.28)" }} />
              {/* Featured-only persistent ambient glow */}
              {c.featured && (
                <div className="absolute rounded-full blur-3xl pointer-events-none" style={{ top: "-10%", left: "55%", width: 320, height: 320, background: "radial-gradient(circle,rgba(255,23,68,0.1),transparent 70%)" }} />
              )}

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <motion.div
                    whileHover={{ rotate: 8, scale: 1.08 }}
                    transition={{ duration: 0.3 }}
                    className={`rounded-2xl flex items-center justify-center mb-5 ${c.featured ? "w-14 h-14 p-3.5" : "w-11 h-11 p-2.5"}`}
                    style={{ background: "rgba(255,23,68,0.1)", border: "1px solid rgba(255,23,68,0.18)", color: "#ff4d6d" }}
                  >
                    {c.icon}
                  </motion.div>
                  <h3 className="font-display font-bold text-white leading-snug mb-2.5"
                    style={{ fontSize: c.featured ? "clamp(1.3rem, 2.4vw, 1.7rem)" : "0.98rem", letterSpacing: "-0.015em", maxWidth: c.featured ? "22ch" : undefined }}>
                    {c.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed" style={{ fontSize: c.featured ? "14.5px" : "12.5px", lineHeight: 1.7, maxWidth: c.featured ? "38ch" : undefined }}>
                    {c.desc}<span style={{ color: "#ff4d6d", fontWeight: 600 }}>{c.keyword}</span>{c.descEnd}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Comparison ────────────────────────────────────────────────────────────────
function ComparisonSection() {
  const items = [
    {
      icon: <Volume2 className="w-5 h-5" />,
      title: "Hardware Button Trigger",
      ers: "Activate instantly using Volume Up or Down.",
      others: "Require unlocking the phone and opening the app.",
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Locked Screen Ready",
      ers: "Works even when your phone is locked.",
      others: "Cannot start recording immediately.",
    },
    {
      icon: <Mic className="w-5 h-5" />,
      title: "Automatic Recording",
      ers: "Evidence starts recording automatically.",
      others: "Manual recording wastes valuable time.",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Live GPS Alerts",
      ers: "Sends your live location instantly.",
      others: "Usually only notify without real-time tracking.",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Built-in Safety Countdown",
      ers: "Prevents accidental activation with a cancel option.",
      others: "Often trigger immediately or lack confirmation.",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Complete Emergency Workflow",
      ers: "Trigger → Record → Alert → Backup.",
      others: "Require multiple manual steps.",
    },
  ];

  return (
    <section id="comparison" className="relative py-32 px-6 overflow-hidden">
      {/* Soft ambient red lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.022]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute rounded-full blur-3xl" style={{ top: "-6%", left: "50%", transform: "translateX(-50%)", width: 700, height: 460, background: "radial-gradient(ellipse,rgba(255,23,68,0.1),transparent 70%)" }} />
        <div className="absolute rounded-full blur-3xl" style={{ bottom: "-8%", right: "6%", width: 420, height: 380, background: "radial-gradient(ellipse,rgba(255,77,109,0.06),transparent 70%)" }} />
      </div>

      <div className="relative z-10 ers-container">
        <motion.div {...inViewFade} className="text-center mb-16">
          <SectionLabel>Comparison</SectionLabel>
          <h2 className="font-display font-bold text-white mb-4" style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", letterSpacing: "-0.03em" }}>
            Why <span style={gradientText}>ERS</span> is Different
          </h2>
          <p className="text-gray-500 mx-auto" style={{ fontSize: "15px", lineHeight: 1.75, maxWidth: "42ch" }}>
            Built for emergencies where every second matters.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: (i % 2) * 0.08 + Math.floor(i / 2) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -5 }}
              className="group relative rounded-[22px] overflow-hidden cursor-default p-7"
              style={{
                background: "rgba(255,255,255,0.035)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                transition: "border-color 0.35s ease, box-shadow 0.35s ease",
              }}
            >
              {/* Hover red border glow */}
              <div className="absolute inset-0 rounded-[22px] opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{ boxShadow: "inset 0 0 0 1px rgba(255,23,68,0.4), 0 0 34px rgba(255,23,68,0.16)" }} />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 20% 0%,rgba(255,23,68,0.08),transparent 65%)" }} />

              {/* Icon + title */}
              <div className="relative z-10 flex items-center gap-3.5 mb-6">
                <motion.div whileHover={{ rotate: 8, scale: 1.08 }} transition={{ duration: 0.25 }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,23,68,0.1)", border: "1px solid rgba(255,23,68,0.2)", color: "#ff4d6d" }}>
                  {item.icon}
                </motion.div>
                <h3 className="font-display font-bold text-white leading-snug" style={{ fontSize: "15.5px", letterSpacing: "-0.01em" }}>
                  {item.title}
                </h3>
              </div>

              {/* Two-column comparison */}
              <div className="relative z-10 grid grid-cols-2 gap-4">
                <div className="rounded-xl p-3.5" style={{ background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.14)" }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <CheckCircle className="w-3.5 h-3.5 text-green-400" style={{ filter: "drop-shadow(0 0 5px rgba(52,211,153,0.7))" }} />
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-green-400">ERS</span>
                  </div>
                  <p className="text-gray-300" style={{ fontSize: "12px", lineHeight: 1.55 }}>{item.ers}</p>
                </div>
                <div className="rounded-xl p-3.5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <X className="w-3.5 h-3.5" style={{ color: "rgba(255,90,90,0.55)" }} />
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-gray-600">Others</span>
                  </div>
                  <p className="text-gray-600" style={{ fontSize: "12px", lineHeight: 1.55 }}>{item.others}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQSection() {
  const faqs = [
    { q: "Why does ERS need Accessibility permissions?", a: "Accessibility Service is required to detect hardware Volume button presses while the screen is locked or the app is in the background. Without it, the emergency trigger cannot function reliably." },
    { q: "Does ERS work without an internet connection?", a: "Yes. Emergency SMS alerts are sent via your cellular network — no internet required. Internet is only needed for location links, WhatsApp sharing, and Google Drive backup." },
    { q: "Can I configure the recording duration?", a: "Yes. Choose 5, 15, or 30 minutes, or set it to Unlimited. The default is 15 minutes, which suits most emergency scenarios." },
    { q: "How does Google Drive backup work?", a: "Completely optional. When enabled, ERS automatically uploads completed recordings to your personal Google Drive. Your credentials are never stored by the app." },
    { q: "Does ERS drain my battery significantly?", a: "No. ERS is optimized for low battery consumption and uses efficient background monitoring with negligible impact on battery life." },
    { q: "Which Android versions are supported?", a: "ERS supports Android 8.0 (Oreo) and above. Dual-SIM selection requires Android 10 or later." },
    { q: "Are my recordings completely private?", a: "Completely. Recordings are stored locally on your device only. ERS has no backend servers and never accesses, transmits, or stores your recordings." },
  ];
  return (
    <section id="faq" className="py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div {...inViewFade} className="text-center mb-16">
          <h2 className="font-display font-bold text-white" style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", letterSpacing: "-0.03em" }}><span style={gradientText}>FAQ</span></h2>
        </motion.div>
        <AccordionPrimitive.Root type="single" collapsible className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}>
              <AccordionPrimitive.Item value={`item-${i}`} className="rounded-2xl overflow-hidden" style={neu}>
                <AccordionPrimitive.Trigger className="group w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer">
                  <span className="text-sm font-semibold text-white group-data-[state=open]:text-[#ff4d6d] transition-colors pr-6 leading-snug">{faq.q}</span>
                  <ChevronDown className="w-4 h-4 text-gray-600 flex-shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </AccordionPrimitive.Trigger>
                <AccordionPrimitive.Content className="data-[state=closed]:hidden">
                  <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", lineHeight: 1.75 }}>
                    <div className="pt-4">{faq.a}</div>
                  </div>
                </AccordionPrimitive.Content>
              </AccordionPrimitive.Item>
            </motion.div>
          ))}
        </AccordionPrimitive.Root>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function CTASection() {
  const trustIndicators = [
    { icon: <Zap className="w-4 h-4" />, label: "No Sign-Up Required" },
    { icon: <Lock className="w-4 h-4" />, label: "Works Even When Locked" },
    { icon: <Shield className="w-4 h-4" />, label: "Privacy First" },
  ];

  const staggerContainer = {
    initial: {},
    whileInView: {},
    viewport: { once: true },
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  };
  const staggerItem = {
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  };

  return (
    <section id="download" className="relative py-36 px-6 overflow-hidden">
      {/* Ambient background depth — soft glow + faint grid, no cards/borders */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.022]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.16) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.16) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />
        <motion.div className="absolute rounded-full blur-3xl"
          style={{ top: "50%", left: "50%", width: 640, height: 520, marginTop: -260, marginLeft: -320, background: "radial-gradient(ellipse,rgba(255,23,68,0.16),transparent 68%)" }}
          animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.08, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />
        <div className="absolute rounded-full blur-3xl" style={{ top: "18%", left: "12%", width: 260, height: 260, background: "radial-gradient(circle,rgba(255,77,109,0.08),transparent 70%)" }} />
        <div className="absolute rounded-full blur-3xl" style={{ bottom: "12%", right: "10%", width: 300, height: 300, background: "radial-gradient(circle,rgba(255,23,68,0.07),transparent 70%)" }} />
      </div>

      <motion.div {...staggerContainer} className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center">
        {/* Softly glowing animated logo */}
        <motion.div variants={staggerItem} className="relative mb-10 flex items-center justify-center">
          <motion.div className="absolute rounded-full" style={{ width: 96, height: 96, background: "radial-gradient(circle,rgba(255,23,68,0.45),transparent 70%)", filter: "blur(18px)" }}
            animate={{ scale: [1, 1.35, 1], opacity: [0.55, 0.95, 0.55] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="w-[72px] h-[72px] rounded-[22px] flex items-center justify-center relative z-10"
            style={{ background: "linear-gradient(135deg,#ff1744,#ff4d6d)" }}
            animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 24px rgba(255,23,68,0.4), 0 0 50px rgba(255,23,68,0.15)", "0 0 40px rgba(255,23,68,0.7), 0 0 90px rgba(255,23,68,0.3)", "0 0 24px rgba(255,23,68,0.4), 0 0 50px rgba(255,23,68,0.15)"] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}>
            <Shield className="w-9 h-9 text-white" />
          </motion.div>
        </motion.div>

        {/* Headline — primary focus */}
        <motion.h2 variants={staggerItem} className="font-display font-bold text-white mb-5 leading-[1.05]"
          style={{ fontSize: "clamp(2.25rem, 5.5vw, 4rem)", letterSpacing: "-0.035em" }}>
          Be Prepared Before<br />an <span style={gradientText}>Emergency</span> Happens.
        </motion.h2>

        {/* Concise supporting line */}
        <motion.p variants={staggerItem} className="text-gray-500 mb-14 mx-auto" style={{ fontSize: "16px", lineHeight: 1.75, maxWidth: "38ch" }}>
          One tap, fully protected — no setup required at the scene.
        </motion.p>

        {/* Trust indicators */}
        <motion.div variants={staggerItem} className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-14">
          {trustIndicators.map((t, i) => (
            <div key={i} className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-500">
                <span style={{ color: "#ff4d6d" }}>{t.icon}</span>
                <span className="text-[12.5px] font-medium tracking-wide">{t.label}</span>
              </div>
              {i < trustIndicators.length - 1 && <span className="w-px h-3.5" style={{ background: "rgba(255,255,255,0.12)" }} />}
            </div>
          ))}
        </motion.div>

        {/* Primary CTA button with shine sweep */}
        <motion.div variants={staggerItem} className="flex flex-col items-center gap-4">
          <motion.a
            href="https://github.com/kvalecha186-dot/ers-app/releases/download/v1.0/app-debug.apk"
            download
            whileHover={{ scale: 1.045, y: -3, boxShadow: "0 0 50px rgba(255,23,68,0.6), 0 16px 36px rgba(0,0,0,0.45)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative flex items-center gap-3 px-10 py-5 rounded-2xl text-white font-semibold text-base overflow-hidden"
            style={{ background: "linear-gradient(135deg,#ff1744,#e8102f)", boxShadow: "0 0 32px rgba(255,23,68,0.5), 0 8px 28px rgba(0,0,0,0.4)" }}
          >
            <motion.span className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.28) 50%, transparent 80%)", width: "60%" }}
              animate={{ left: ["-60%", "120%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }} />
            <Download className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Download ERS for Android</span>
          </motion.a>

          <p className="text-[11.5px] text-gray-600 tracking-wide">Free · No Ads · Instant Setup</p>

          <p className="text-[11px] text-gray-700 mt-1 text-center leading-relaxed" style={{ maxWidth: "36ch" }}>
            By downloading and using ERS, you agree to our{" "}
            <Link to="/terms" onClick={() => window.scrollTo(0,0)} className="transition-colors duration-200" style={{ color: "#ff4d6d" }}>Terms &amp; Conditions</Link>
            {" "}and{" "}
            <Link to="/privacy" onClick={() => window.scrollTo(0,0)} className="transition-colors duration-200" style={{ color: "#ff4d6d" }}>Privacy Policy</Link>.
          </p>

          <a href="#faq" className="text-xs text-gray-600 hover:text-gray-400 transition-colors duration-200 mt-2">
            Have a question? <span style={{ color: "#ff4d6d" }}>Get in touch</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ── Contact Modal ─────────────────────────────────────────────────────────────
function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  const rows = [
    { icon: <Mail className="w-4 h-4" />, label: "Support Email", value: SUPPORT_EMAIL, href: `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("ERS Support Request")}` },
    { icon: <Clock className="w-4 h-4" />, label: "Business Hours", value: SUPPORT_BUSINESS_HOURS },
    { icon: <MapPin className="w-4 h-4" />, label: "Location", value: SUPPORT_LOCATION },
    { icon: <History className="w-4 h-4" />, label: "Response Time", value: SUPPORT_RESPONSE_TIME },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
          style={{ background: "rgba(4,4,10,0.7)", backdropFilter: "blur(6px)" }}
          onClick={onClose}
          role="dialog" aria-modal="true" aria-labelledby="contact-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-sm rounded-2xl p-6"
            style={{ ...glass, border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,0.55)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose} aria-label="Close contact dialog"
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-colors"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg,#ff1744,#ff4d6d)", ...redGlow }}>
              <Mail className="w-5 h-5 text-white" />
            </div>
            <h3 id="contact-modal-title" className="font-display font-bold text-white mb-1.5" style={{ fontSize: 20 }}>Get in Touch</h3>
            <p className="text-sm text-gray-500 mb-6">We're here to help — reach out anytime.</p>

            <div className="space-y-4 mb-6">
              {rows.map((r) => (
                <div key={r.label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(255,23,68,0.1)", color: "#ff4d6d" }}>
                    {r.icon}
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-600 uppercase tracking-wide">{r.label}</p>
                    {r.href ? (
                      <a href={r.href} className="text-sm text-white hover:text-[#ff4d6d] transition-colors duration-200">{r.value}</a>
                    ) : (
                      <p className="text-sm text-gray-300">{r.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("ERS Support Request")}`}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold text-sm transition-transform duration-200 hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg,#ff1744,#e8102f)", boxShadow: "0 8px 24px rgba(255,23,68,0.35)" }}
            >
              <Mail className="w-4 h-4" /> Email Us
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Bug Report Modal ─────────────────────────────────────────────────────────
function BugReportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", device: "", androidVersion: "", description: "" });
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) { setStatus("idle"); setError(""); setForm({ name: "", email: "", device: "", androidVersion: "", description: "" }); setFileName(""); }
  }, [open]);

  const field = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.description.trim()) {
      setError("Please fill in your name, email, and a description of the bug.");
      return;
    }
    setError("");
    setStatus("sending");

    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Device Model: ${form.device || "—"}`,
      `Android Version: ${form.androidVersion || "—"}`,
      fileName ? `Screenshot: ${fileName} (please attach manually — it can't be auto-attached from the browser)` : "",
      "",
      "Bug Description:",
      form.description,
    ].filter(Boolean).join("\n");

    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("ERS Bug Report")}&body=${encodeURIComponent(body)}`;

    // Give the "sending" state a brief, honest beat before handing off to the mail client.
    window.setTimeout(() => {
      window.location.href = mailto;
      setStatus("sent");
    }, 500);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
          style={{ background: "rgba(4,4,10,0.7)", backdropFilter: "blur(6px)" }}
          onClick={onClose}
          role="dialog" aria-modal="true" aria-labelledby="bug-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md rounded-2xl p-6 max-h-[88vh] overflow-y-auto"
            style={{ ...glass, border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,0.55)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose} aria-label="Close bug report dialog"
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-colors"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <X className="w-4 h-4" />
            </button>

            {status === "sent" ? (
              <div className="flex flex-col items-center text-center py-6">
                <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, ease: "easeOut" }}
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(34,197,94,0.14)", border: "1px solid rgba(34,197,94,0.35)" }}>
                  <Check className="w-6 h-6" style={{ color: "#4ade80" }} />
                </motion.div>
                <h3 className="font-display font-bold text-white mb-2" style={{ fontSize: 18 }}>Almost there</h3>
                <p className="text-sm text-gray-500 max-w-[30ch] mb-6">Your email app should now be open with the report pre-filled — just hit send. {fileName && "Don't forget to attach your screenshot."}</p>
                <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg,#ff1744,#e8102f)" }}>Done</button>
              </div>
            ) : (
              <>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg,#ff1744,#ff4d6d)", ...redGlow }}>
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <h3 id="bug-modal-title" className="font-display font-bold text-white mb-1.5" style={{ fontSize: 20 }}>Report a Bug</h3>
                <p className="text-sm text-gray-500 mb-6">Tell us what went wrong — this opens a pre-filled email to our support team.</p>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <label htmlFor="bug-name" className="block text-[11px] text-gray-600 uppercase tracking-wide mb-1.5">Name</label>
                    <input id="bug-name" type="text" value={form.name} onChange={field("name")} required
                      className="w-full rounded-lg px-3.5 py-2.5 text-sm text-white outline-none transition-colors duration-200 focus:border-[#ff1744]/50"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }} placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="bug-email" className="block text-[11px] text-gray-600 uppercase tracking-wide mb-1.5">Email</label>
                    <input id="bug-email" type="email" value={form.email} onChange={field("email")} required
                      className="w-full rounded-lg px-3.5 py-2.5 text-sm text-white outline-none transition-colors duration-200 focus:border-[#ff1744]/50"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }} placeholder="you@example.com" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="bug-device" className="block text-[11px] text-gray-600 uppercase tracking-wide mb-1.5">Device Model</label>
                      <input id="bug-device" type="text" value={form.device} onChange={field("device")}
                        className="w-full rounded-lg px-3.5 py-2.5 text-sm text-white outline-none transition-colors duration-200 focus:border-[#ff1744]/50"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }} placeholder="e.g. Pixel 8" />
                    </div>
                    <div>
                      <label htmlFor="bug-android" className="block text-[11px] text-gray-600 uppercase tracking-wide mb-1.5">Android Version</label>
                      <input id="bug-android" type="text" value={form.androidVersion} onChange={field("androidVersion")}
                        className="w-full rounded-lg px-3.5 py-2.5 text-sm text-white outline-none transition-colors duration-200 focus:border-[#ff1744]/50"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }} placeholder="e.g. 14" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="bug-desc" className="block text-[11px] text-gray-600 uppercase tracking-wide mb-1.5">Bug Description</label>
                    <textarea id="bug-desc" value={form.description} onChange={field("description")} required rows={4}
                      className="w-full rounded-lg px-3.5 py-2.5 text-sm text-white outline-none resize-none transition-colors duration-200 focus:border-[#ff1744]/50"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }} placeholder="What happened? What did you expect instead?" />
                  </div>
                  <div>
                    <label htmlFor="bug-file" className="block text-[11px] text-gray-600 uppercase tracking-wide mb-1.5">Screenshot (optional)</label>
                    <label htmlFor="bug-file"
                      className="flex items-center gap-2 w-full rounded-lg px-3.5 py-2.5 text-sm cursor-pointer transition-colors duration-200 hover:border-[#ff1744]/40"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.16)", color: fileName ? "#fff" : "#6b7280" }}>
                      <FileCheck className="w-4 h-4 flex-shrink-0" style={{ color: "#ff4d6d" }} />
                      {fileName || "Choose a file…"}
                    </label>
                    <input id="bug-file" type="file" accept="image/*" className="sr-only"
                      onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} />
                  </div>

                  {error && <p className="text-xs" style={{ color: "#ff6b8a" }}>{error}</p>}

                  <motion.button
                    type="submit" disabled={status === "sending"}
                    whileHover={status === "idle" ? { scale: 1.02 } : {}} whileTap={status === "idle" ? { scale: 0.98 } : {}}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-70"
                    style={{ background: "linear-gradient(135deg,#ff1744,#e8102f)", boxShadow: "0 8px 24px rgba(255,23,68,0.35)" }}
                  >
                    {status === "sending" ? (
                      <>
                        <motion.span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white inline-block"
                          animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                        Preparing email…
                      </>
                    ) : "Submit Report"}
                  </motion.button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const onHome = location.pathname === "/";
  const [contactOpen, setContactOpen] = useState(false);
  const [bugOpen, setBugOpen] = useState(false);

  const legalLinks: Record<string, string> = { "Privacy Policy": "/privacy", "Terms & Conditions": "/terms" };
  const productLinks = ["Features", "How It Works", "App Screens", "Download"];

  // Shared by the Globe icon and the footer's "FAQ" link — scrolls smoothly if
  // already on the homepage, otherwise navigates home first and hands the target
  // section off via sessionStorage (same pattern NavBar already uses).
  const goToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (!onHome) {
      sessionStorage.setItem("ers-scroll-target", id);
      navigate("/");
      return;
    }
    smoothScrollTo(id, 550);
  };

  return (
    <footer className="py-16 px-6 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
      <div className="ers-container">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4 w-fit">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#ff1744,#ff4d6d)", ...redGlow }}><Shield className="w-5 h-5 text-white" /></div>
              <span className="font-display text-xl font-bold text-white tracking-widest">ERS</span>
            </Link>
            <p className="text-sm text-gray-700 leading-relaxed mb-5 max-w-[190px]">Emergency Recording System. Your protection, activated instantly.</p>
            <div className="flex gap-2">
              <button
                type="button" onClick={goToSection("home")} aria-label="Go to homepage"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-700 hover:text-white transition-colors duration-200"
                style={glass}
              >
                <Globe className="w-3.5 h-3.5" />
              </button>
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("ERS Support Request")}`}
                aria-label="Email ERS support"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-700 hover:text-white transition-colors duration-200"
                style={glass}
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
          {/* Product */}
          <div>
            <h4 className="font-display text-sm font-bold text-white mb-4 tracking-wide">Product</h4>
            <ul className="space-y-2.5">{productLinks.map((item) => (<li key={item}><a href={`#${item.toLowerCase().replace(/ /g, "-")}`} onClick={goToSection(item.toLowerCase().replace(/ /g, "-"))} className="text-sm text-gray-700 hover:text-gray-300 transition-colors duration-200">{item}</a></li>))}</ul>
          </div>
          {/* Legal — uses React Router Link */}
          <div>
            <h4 className="font-display text-sm font-bold text-white mb-4 tracking-wide">Legal</h4>
            <ul className="space-y-2.5">
              {Object.entries(legalLinks).map(([label, path]) => (
                <li key={label}>
                  <Link to={path} onClick={() => window.scrollTo(0, 0)}
                    className="text-sm text-gray-700 hover:text-[#ff4d6d] transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Support */}
          <div>
            <h4 className="font-display text-sm font-bold text-white mb-4 tracking-wide">Support</h4>
            <ul className="space-y-2.5">
              <li><a href="#faq" onClick={goToSection("faq")} className="text-sm text-gray-700 hover:text-gray-300 transition-colors duration-200">FAQ</a></li>
              <li>
                <button type="button" onClick={() => setContactOpen(true)}
                  className="text-sm text-gray-700 hover:text-gray-300 transition-colors duration-200 text-left">
                  Contact
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setBugOpen(true)}
                  className="text-sm text-gray-700 hover:text-gray-300 transition-colors duration-200 text-left">
                  Report a Bug
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="flex flex-col md:grid gap-6 md:gap-3 pt-8 border-t items-center"
          style={{ borderColor: "rgba(255,255,255,0.05)", gridTemplateColumns: "1fr auto 1fr" }}
        >
          <p className="text-xs text-gray-800 text-center md:text-left md:justify-self-start">© 2024 ERS – Emergency Recording System. All rights reserved.</p>
          <div className="text-center md:justify-self-center">
            <p className="font-nav" style={{ fontSize: 15.5, fontWeight: 600, color: "#e4e4ee", letterSpacing: "-0.01em", lineHeight: 1.3 }}>Emergency Recording System</p>
            <p className="font-nav mt-2.5" style={{ fontSize: 12.5, color: "#e4e4ee", opacity: 0.58, letterSpacing: "0.01em" }}>by <span style={{ letterSpacing: "0.06em" }}>IUXOA</span></p>
          </div>
          <p className="text-xs text-gray-800 text-center md:text-right md:justify-self-end">Version 1.0.0 · Android</p>
        </div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      <BugReportModal open={bugOpen} onClose={() => setBugOpen(false)} />
    </footer>
  );
}


// ── Home Page ─────────────────────────────────────────────────────────────────
function HomePage() {
  useEffect(() => {
    // If NavBar sent us here from a legal page targeting a specific section, honor it
    // once this page's sections have actually mounted; otherwise this is a normal
    // visit to "/" and no scroll adjustment is needed.
    const target = sessionStorage.getItem("ers-scroll-target");
    if (target) {
      sessionStorage.removeItem("ers-scroll-target");
      requestAnimationFrame(() => smoothScrollTo(target, 550));
    }
  }, []);

  return (
    <>
      <HeroSection />
      <WhyERSSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AppScreensSection />
      <UseCasesSection />
      <ComparisonSection />
      <FAQSection />
      <CTASection />
    </>
  );
}

// ── Back to Home (legal pages) ──────────────────────────────────────────────
function BackToHomeBar() {
  return (
    <div className="pt-[104px] pb-1 px-6">
      <div className="ers-container">
        <Link
          to="/"
          onClick={() => window.scrollTo(0, 0)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-gray-500 border border-white/10 hover:text-[#ff4d6d] hover:border-[#ff1744]/35 transition-all duration-[250ms]"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

// ── Legal Page Shell ──────────────────────────────────────────────────────────
function LegalLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <NavBar />
      <BackToHomeBar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

// ── Privacy Policy Page ───────────────────────────────────────────────────────
function PrivacyPolicyPage() {
  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "definitions", title: "Definitions" },
    { id: "info-collect", title: "Information We Collect" },
    { id: "how-we-use", title: "How We Use Your Information" },
    { id: "recordings", title: "Emergency Audio Recordings" },
    { id: "location", title: "Location Data" },
    { id: "permissions", title: "Permissions Required" },
    { id: "consent", title: "Consent" },
    { id: "data-retention", title: "Data Retention" },
    { id: "data-sharing", title: "Data Sharing" },
    { id: "security", title: "Data Security" },
    { id: "third-party", title: "Third-Party Services" },
    { id: "user-rights", title: "Your Rights" },
    { id: "children", title: "Children's Privacy" },
    { id: "international", title: "International Users" },
    { id: "changes", title: "Changes to This Policy" },
    { id: "contact", title: "Contact Information" },
  ];

  const [activeSection, setActiveSection] = useState("");
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowBackTop(window.scrollY > 400);
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.getBoundingClientRect().top <= 120) { setActiveSection(sections[i].id); return; }
      }
      setActiveSection("");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) { const y = el.getBoundingClientRect().top + window.scrollY - 100; window.scrollTo({ top: y, behavior: "smooth" }); }
  };

  return (
    <LegalLayout>
      {/* Hero */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute rounded-full blur-3xl" style={{ top: "-10%", left: "50%", transform: "translateX(-50%)", width: 700, height: 400, background: "radial-gradient(ellipse,rgba(255,23,68,0.12),transparent 70%)" }} />
          <div className="absolute inset-0 opacity-[0.022]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-[11px] font-semibold uppercase tracking-wider"
            style={{ background: "rgba(255,23,68,0.1)", border: "1px solid rgba(255,23,68,0.22)", color: "#ff4d6d" }}>
            <Shield className="w-3 h-3" /> Legal Document
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}
            className="font-display font-bold text-white mb-4" style={{ fontSize: "clamp(2.2rem,5vw,3.5rem)", letterSpacing: "-0.03em" }}>
            Privacy <span style={{ background: "linear-gradient(135deg,#ff1744,#ff6b8a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Policy</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.14 }}
            className="text-gray-500 mb-4" style={{ fontSize: "15px", lineHeight: 1.75, maxWidth: "48ch", margin: "0 auto 16px" }}>
            How ERS collects, uses, and protects your personal data and emergency recordings.
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}
            className="text-[12px] font-medium" style={{ color: "#ff4d6d" }}>Last Updated: July 15, 2025</motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pb-28">
        <div className="ers-container">
          <div className="flex gap-12 items-start">

            {/* Sticky TOC — desktop only */}
            <aside className="hidden xl:block w-64 shrink-0 sticky top-28">
              <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "#ff4d6d" }}>Contents</p>
                <nav className="space-y-1">
                  {sections.map((s) => (
                    <button key={s.id} onClick={() => scrollTo(s.id)}
                      className="w-full text-left px-3 py-2 rounded-xl text-[12px] font-medium transition-all duration-200"
                      style={{ color: activeSection === s.id ? "#ff4d6d" : "#6b7280", background: activeSection === s.id ? "rgba(255,23,68,0.1)" : "transparent", borderLeft: activeSection === s.id ? "2px solid #ff1744" : "2px solid transparent" }}>
                      {s.title}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="rounded-3xl p-8 md:p-12" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>

                {sections.map((sec, idx) => (
                  <motion.div key={sec.id} id={sec.id}
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.55, delay: idx * 0.03 }}
                    className={idx < sections.length - 1 ? "mb-12 pb-12" : ""}
                    style={idx < sections.length - 1 ? { borderBottom: "1px solid rgba(255,255,255,0.06)" } : {}}>
                    <div className="flex items-center gap-3 mb-5">
                      <span className="w-1.5 h-6 rounded-full" style={{ background: "linear-gradient(to bottom,#ff1744,#ff4d6d)", flexShrink: 0 }} />
                      <h2 className="font-display font-bold text-white" style={{ fontSize: "1.25rem", letterSpacing: "-0.02em" }}>{sec.title}</h2>
                    </div>
                    <div className="text-gray-500 leading-relaxed space-y-3" style={{ fontSize: "14.5px", lineHeight: 1.8 }}>
                      {sec.id === "introduction" && <>
                        <p>Welcome to the <span className="text-white font-medium">Emergency Recording System (ERS)</span>, developed by IUXOA. This Privacy Policy explains, in plain language, what information ERS handles, why, and what choices you have.</p>
                        <p>ERS is an Android application designed to record audio evidence and alert emergency contacts during critical situations. It's built to work with as little data as possible.</p>
                        <p>By installing and using ERS, you're agreeing to the practices described here. If something doesn't sit right with you, you're free to not use the app.</p>
                      </>}
                      {sec.id === "definitions" && <>
                        <p>A few terms are used consistently throughout this policy:</p>
                        <div className="space-y-3">
                          <div className="rounded-xl p-4" style={{ background: "rgba(255,23,68,0.05)", border: "1px solid rgba(255,23,68,0.12)" }}>
                            <p className="font-semibold text-white mb-1" style={{ fontSize: "13px" }}>ERS</p>
                            <p style={{ fontSize: "13px" }}>Refers to the Emergency Recording System, the Android application this policy applies to, including all of its features and updates.</p>
                          </div>
                          <div className="rounded-xl p-4" style={{ background: "rgba(255,23,68,0.05)", border: "1px solid rgba(255,23,68,0.12)" }}>
                            <p className="font-semibold text-white mb-1" style={{ fontSize: "13px" }}>User / You</p>
                            <p style={{ fontSize: "13px" }}>Refers to any individual who downloads, installs, or otherwise uses ERS.</p>
                          </div>
                          <div className="rounded-xl p-4" style={{ background: "rgba(255,23,68,0.05)", border: "1px solid rgba(255,23,68,0.12)" }}>
                            <p className="font-semibold text-white mb-1" style={{ fontSize: "13px" }}>IUXOA / We / Us / Our</p>
                            <p style={{ fontSize: "13px" }}>Refers to IUXOA, the developer of ERS.</p>
                          </div>
                        </div>
                      </>}
                      {sec.id === "info-collect" && <>
                        <p>ERS is built on a <span className="text-white font-medium">privacy-first architecture</span>. We collect only the minimum data necessary for the application to function during emergencies.</p>
                        <p><span className="text-white font-medium">Information collected locally on your device:</span></p>
                        <ul className="list-none space-y-2 pl-2">
                          {["Emergency audio recordings captured during active sessions","Your device's GPS coordinates at the time of an emergency trigger","Emergency contact names and phone numbers you manually enter","Recording history including timestamps, durations, and sharing status","Application configuration preferences and settings"].map(item => (
                            <li key={item} className="flex items-start gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#ff1744" }} />{item}</li>
                          ))}
                        </ul>
                        <p>ERS does <span className="text-white font-medium">not</span> collect your name, email address, financial information, biometric identifiers, browsing history, contacts beyond those you explicitly add, or any data unrelated to emergency functionality.</p>
                      </>}
                      {sec.id === "how-we-use" && <>
                        <p>All data collected by ERS serves a single purpose: <span className="text-white font-medium">keeping you safer during emergencies.</span> Specifically, your information is used to:</p>
                        <ul className="list-none space-y-2 pl-2">
                          {["Capture and store audio evidence when an emergency is triggered via the hardware Volume button","Determine and transmit your real-time GPS location to your designated emergency contacts via SMS","Deliver emergency SMS alerts to your saved contacts with a live Google Maps link","Maintain a local history log so you can review, share, or delete past recordings"].map(item => (
                            <li key={item} className="flex items-start gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#ff1744" }} />{item}</li>
                          ))}
                        </ul>
                        <p>We do <span className="text-white font-medium">not</span> use your data for advertising, analytics, profiling, or any commercial purpose. ERS has no marketing partners and does not monetize user data in any form.</p>
                      </>}
                      {sec.id === "recordings" && <>
                        <p>Emergency audio recordings are the core feature of ERS and stay entirely under your control at all times.</p>
                        <ul className="list-none space-y-2 pl-2">
                          {["All recordings are stored exclusively in your device's local storage — they never leave your device unless you explicitly choose to share them.","ERS does not have any backend server that receives, stores, or processes your recordings.","Each recording is saved in a standard audio format and named with a timestamp for easy identification.","You have full control to play, share, or permanently delete any recording at any time from the Recordings History screen.","IUXOA never accesses, listens to, or stores your recordings. The only way we ever see a recording is if you personally and explicitly choose to share it with us — for example, to report a bug."].map(item => (
                            <li key={item} className="flex items-start gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#ff1744" }} />{item}</li>
                          ))}
                        </ul>
                      </>}
                      {sec.id === "location" && <>
                        <p>Location data is used exclusively to generate emergency alert messages sent to your trusted contacts.</p>
                        <ul className="list-none space-y-2 pl-2">
                          {["ERS accesses your GPS location only when an emergency session is actively triggered.","Your coordinates are converted into a Google Maps link and included in the emergency SMS sent to your contacts.","ERS does not continuously track your location in the background outside of an active emergency session.","Location data is not stored on our servers and is not retained beyond what is necessary to generate the alert message.","You may revoke Location permission at any time through your device's Settings — note that this will disable location-based alerts."].map(item => (
                            <li key={item} className="flex items-start gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#ff1744" }} />{item}</li>
                          ))}
                        </ul>
                      </>}
                      {sec.id === "permissions" && <>
                        <p>ERS requests the following Android permissions, each strictly necessary for core functionality:</p>
                        {[{name:"Microphone (RECORD_AUDIO)",desc:"Required to capture emergency audio recordings when triggered."},{name:"Location (ACCESS_FINE_LOCATION)",desc:"Required to obtain your GPS coordinates for the emergency location SMS."},{name:"SMS (SEND_SMS)",desc:"Required to send emergency alert messages to your trusted contacts."},{name:"Storage (READ/WRITE_EXTERNAL_STORAGE)",desc:"Required to save recordings to your device storage on Android versions below 10."},{name:"Notifications (POST_NOTIFICATIONS)",desc:"Required to display an active recording notification while ERS is running in the background, as mandated by Android OS foreground service rules."}].map(p => (
                          <div key={p.name} className="rounded-xl p-4 mb-2" style={{ background: "rgba(255,23,68,0.05)", border: "1px solid rgba(255,23,68,0.12)" }}>
                            <p className="font-semibold text-white mb-1" style={{ fontSize: "13px" }}>{p.name}</p>
                            <p style={{ fontSize: "13px" }}>{p.desc}</p>
                          </div>
                        ))}
                      </>}
                      {sec.id === "consent" && <>
                        <p>By using ERS and granting the permissions described above, you consent to the data practices explained in this Privacy Policy.</p>
                        <p>You are not required to grant every permission. You can decline any of them, but the features that depend on that permission — such as recording or emergency SMS alerts — will not work correctly without it.</p>
                        <p>You can review or revoke any permission at any time in your device's Settings.</p>
                      </>}
                      {sec.id === "data-retention" && <>
                        <p>ERS keeps things simple: your recordings, emergency contacts, and settings stay on your device for as long as you keep the app installed.</p>
                        <ul className="list-none space-y-2 pl-2">
                          {["There is no automatic expiry — recordings remain available in your Recordings History until you delete them yourself.","Since ERS has no servers, there is no separate server-side copy to retain or delete.","Uninstalling ERS removes its locally stored data from your device.","If your device is lost, reset, or damaged, any recordings not otherwise saved or shared elsewhere are not recoverable by IUXOA."].map(item => (
                            <li key={item} className="flex items-start gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#ff1744" }} />{item}</li>
                          ))}
                        </ul>
                      </>}
                      {sec.id === "data-sharing" && <>
                        <p>IUXOA does <span className="text-white font-medium">not</span> sell, rent, or share your personal information with advertisers, data brokers, or any other third party.</p>
                        <p>The only sharing that happens is what's necessary for ERS to function: your carrier delivers the emergency SMS you trigger, and a recording only ever reaches anyone else if you personally choose to share it. IUXOA itself never receives or sells this data.</p>
                      </>}
                      {sec.id === "security" && <>
                        <p>Because ERS keeps everything on your device instead of a remote server, most of the usual risks around data breaches and server-side leaks simply don't apply here.</p>
                        <ul className="list-none space-y-2 pl-2">
                          {["All recordings are stored locally on your device and are protected by your device's own security model (screen lock, encryption).","ERS has no external servers, databases, or API endpoints that store personal user data.","We periodically review the app's permission usage to make sure it isn't requesting more access than it needs.","You are responsible for maintaining the physical security of your device and keeping your screen lock enabled — this is your main line of defense, since data lives on the device itself."].map(item => (
                            <li key={item} className="flex items-start gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#ff1744" }} />{item}</li>
                          ))}
                        </ul>
                      </>}
                      {sec.id === "third-party" && <>
                        <p>ERS relies on a small number of third-party services to function. We do not control these services and encourage you to review their respective privacy policies:</p>
                        {[{name:"Google Maps (Location Links)",url:"https://policies.google.com/privacy",desc:"Used to generate location links included in emergency SMS alerts. Your coordinates are formatted into a Maps URL on-device; no data is sent to Google directly by ERS."},{name:"Android Telephony (SMS)",url:"https://www.android.com/intl/en_in/privacy/",desc:"Standard Android SMS functionality used to send emergency alerts. SMS delivery is handled by your mobile carrier and governed by their terms."}].map(s => (
                          <div key={s.name} className="rounded-xl p-4 mb-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                            <p className="font-semibold text-white mb-1" style={{ fontSize: "13px" }}>{s.name}</p>
                            <p style={{ fontSize: "13px" }} className="mb-1">{s.desc}</p>
                            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[12px] hover:underline" style={{ color: "#ff4d6d" }}>View Privacy Policy →</a>
                          </div>
                        ))}
                      </>}
                      {sec.id === "user-rights" && <>
                        <p>As a user of ERS, you have full control over your data at all times:</p>
                        <ul className="list-none space-y-2 pl-2">
                          {["Access: View all recordings and activity history within the app at any time.","Deletion: Delete individual recordings or clear all data from the Recordings History screen.","Correction: Update or remove emergency contact information at any time in Settings.","Portability: Share or export recordings in their original audio format to any service you choose.","Revocation: Revoke any permission (Microphone, Location, SMS, etc.) through Android Settings at any time — note that revoking permissions will disable the related feature.","Uninstall: Removing the ERS app will delete all locally stored application data from your device."].map(item => (
                            <li key={item} className="flex items-start gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#ff1744" }} />{item}</li>
                          ))}
                        </ul>
                        <p>Since ERS does not maintain any server-side databases, there is no additional data to request from us beyond what is stored on your device.</p>
                      </>}
                      {sec.id === "children" && <>
                        <p>ERS is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13.</p>
                        <p>If you are a parent or guardian and believe your child has used ERS or provided personal information through the app, please contact us immediately using the details in the Contact section below. We will take steps to remove any such information.</p>
                        <p>Users between 13 and 18 should use ERS only with the knowledge and consent of a parent or legal guardian.</p>
                      </>}
                      {sec.id === "international" && <>
                        <p>ERS is developed in India, and this policy is written with Indian users in mind. If you use ERS from another country, you're responsible for making sure your use of the app — including recording audio and sharing location — complies with your local privacy and recording laws.</p>
                        <p>Some regions require the consent of all parties before recording audio. Please check the rules that apply where you live before relying on ERS.</p>
                      </>}
                      {sec.id === "changes" && <>
                        <p>We may update this Privacy Policy periodically to reflect changes in the application's functionality, applicable laws, or our privacy practices. When we make material changes, we will:</p>
                        <ul className="list-none space-y-2 pl-2">
                          {["Update the \"Last Updated\" date at the top of this page.","Display an in-app notification or changelog note for significant updates.","Where required by law, obtain renewed consent from users before processing data in new ways."].map(item => (
                            <li key={item} className="flex items-start gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#ff1744" }} />{item}</li>
                          ))}
                        </ul>
                        <p>Continued use of ERS after any changes to this Privacy Policy constitutes acceptance of the updated terms. We encourage you to review this page periodically.</p>
                      </>}
                      {sec.id === "contact" && <>
                        <p>If you have any questions, concerns, or requests regarding this Privacy Policy or your data, please reach out to us:</p>
                        <div className="rounded-2xl p-6 mt-4" style={{ background: "rgba(255,23,68,0.06)", border: "1px solid rgba(255,23,68,0.15)" }}>
                          <p className="font-bold text-white mb-1">IUXOA — ERS Development Team</p>
                          <p>You can reach us through the <span className="text-white">Contact</span> option in the app, or via the contact details on our website.</p>
                          <p>Application: Emergency Recording System (ERS) v1.0.0</p>
                          <p>Platform: Android</p>
                        </div>
                      </>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to top */}
      <AnimatePresence>
        {showBackTop && (
          <motion.button initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-50 w-11 h-11 rounded-full flex items-center justify-center text-white"
            style={{ background: "linear-gradient(135deg,#ff1744,#ff4d6d)", boxShadow: "0 0 20px rgba(255,23,68,0.5)" }}>
            <ChevronRight className="w-5 h-5 -rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>
    </LegalLayout>
  );
}

// ── Terms & Conditions Page ───────────────────────────────────────────────────
function TermsPage() {
  const sections = [
    { id: "definitions", title: "Definitions" },
    { id: "acceptance", title: "Acceptance of Terms" },
    { id: "eligibility", title: "Eligibility" },
    { id: "accounts", title: "User Accounts" },
    { id: "acceptable-use", title: "Acceptable Use" },
    { id: "emergency-disclaimer", title: "Emergency Disclaimer" },
    { id: "responsibilities", title: "User Responsibilities" },
    { id: "ip", title: "Intellectual Property" },
    { id: "warranty", title: "Warranty Disclaimer" },
    { id: "data-storage", title: "Data Storage" },
    { id: "software-updates", title: "Software Updates" },
    { id: "feedback", title: "Feedback" },
    { id: "third-party-libraries", title: "Third-Party Libraries" },
    { id: "availability", title: "Service Availability" },
    { id: "liability", title: "Limitation of Liability" },
    { id: "termination", title: "Account Suspension or Termination" },
    { id: "updates", title: "Updates to the Terms" },
    { id: "governing-law", title: "Governing Law" },
    { id: "severability", title: "Severability" },
    { id: "contact", title: "Contact Information" },
  ];

  const [activeSection, setActiveSection] = useState("");
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowBackTop(window.scrollY > 400);
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.getBoundingClientRect().top <= 120) { setActiveSection(sections[i].id); return; }
      }
      setActiveSection("");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) { const y = el.getBoundingClientRect().top + window.scrollY - 100; window.scrollTo({ top: y, behavior: "smooth" }); }
  };

  return (
    <LegalLayout>
      {/* Hero */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute rounded-full blur-3xl" style={{ top: "-10%", left: "50%", transform: "translateX(-50%)", width: 700, height: 400, background: "radial-gradient(ellipse,rgba(255,23,68,0.12),transparent 70%)" }} />
          <div className="absolute inset-0 opacity-[0.022]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-[11px] font-semibold uppercase tracking-wider"
            style={{ background: "rgba(255,23,68,0.1)", border: "1px solid rgba(255,23,68,0.22)", color: "#ff4d6d" }}>
            <FileText className="w-3 h-3" /> Legal Document
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}
            className="font-display font-bold text-white mb-4" style={{ fontSize: "clamp(2.2rem,5vw,3.5rem)", letterSpacing: "-0.03em" }}>
            Terms &amp; <span style={{ background: "linear-gradient(135deg,#ff1744,#ff6b8a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Conditions</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.14 }}
            className="text-gray-500 mb-4" style={{ fontSize: "15px", lineHeight: 1.75, maxWidth: "48ch", margin: "0 auto 16px" }}>
            The rules, rights, and responsibilities governing your use of the ERS application.
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}
            className="text-[12px] font-medium" style={{ color: "#ff4d6d" }}>Last Updated: July 15, 2025</motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pb-28">
        <div className="ers-container">
          <div className="flex gap-12 items-start">

            {/* Sticky TOC — desktop only */}
            <aside className="hidden xl:block w-64 shrink-0 sticky top-28">
              <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "#ff4d6d" }}>Contents</p>
                <nav className="space-y-1">
                  {sections.map((s) => (
                    <button key={s.id} onClick={() => scrollTo(s.id)}
                      className="w-full text-left px-3 py-2 rounded-xl text-[12px] font-medium transition-all duration-200"
                      style={{ color: activeSection === s.id ? "#ff4d6d" : "#6b7280", background: activeSection === s.id ? "rgba(255,23,68,0.1)" : "transparent", borderLeft: activeSection === s.id ? "2px solid #ff1744" : "2px solid transparent" }}>
                      {s.title}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="rounded-3xl p-8 md:p-12" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>

                {sections.map((sec, idx) => (
                  <motion.div key={sec.id} id={sec.id}
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.55, delay: idx * 0.03 }}
                    className={idx < sections.length - 1 ? "mb-12 pb-12" : ""}
                    style={idx < sections.length - 1 ? { borderBottom: "1px solid rgba(255,255,255,0.06)" } : {}}>
                    <div className="flex items-center gap-3 mb-5">
                      <span className="w-1.5 h-6 rounded-full" style={{ background: "linear-gradient(to bottom,#ff1744,#ff4d6d)", flexShrink: 0 }} />
                      <h2 className="font-display font-bold text-white" style={{ fontSize: "1.25rem", letterSpacing: "-0.02em" }}>{sec.title}</h2>
                    </div>
                    <div className="text-gray-500 leading-relaxed space-y-3" style={{ fontSize: "14.5px", lineHeight: 1.8 }}>
                      {sec.id === "definitions" && <>
                        <p>To keep these Terms clear, a few terms are used consistently throughout this document:</p>
                        <div className="space-y-3">
                          <div className="rounded-xl p-4" style={{ background: "rgba(255,23,68,0.05)", border: "1px solid rgba(255,23,68,0.12)" }}>
                            <p className="font-semibold text-white mb-1" style={{ fontSize: "13px" }}>ERS</p>
                            <p style={{ fontSize: "13px" }}>Refers to the Emergency Recording System, the Android application described on this website, including all its features, updates, and related content.</p>
                          </div>
                          <div className="rounded-xl p-4" style={{ background: "rgba(255,23,68,0.05)", border: "1px solid rgba(255,23,68,0.12)" }}>
                            <p className="font-semibold text-white mb-1" style={{ fontSize: "13px" }}>User / You</p>
                            <p style={{ fontSize: "13px" }}>Refers to any individual who downloads, installs, or otherwise uses the ERS application.</p>
                          </div>
                          <div className="rounded-xl p-4" style={{ background: "rgba(255,23,68,0.05)", border: "1px solid rgba(255,23,68,0.12)" }}>
                            <p className="font-semibold text-white mb-1" style={{ fontSize: "13px" }}>IUXOA / We / Us / Our</p>
                            <p style={{ fontSize: "13px" }}>Refers to IUXOA, the developer of ERS, responsible for building and maintaining the application.</p>
                          </div>
                        </div>
                      </>}
                      {sec.id === "acceptance" && <>
                        <p>These Terms and Conditions ("Terms") explain how you may use the <span className="text-white font-medium">Emergency Recording System (ERS)</span> Android application, developed by IUXOA. They describe what you can expect from ERS and what we ask of you in return.</p>
                        <p>By downloading, installing, or using ERS, you're agreeing to these Terms. If something here doesn't work for you, the best option is to not use the app — you can uninstall it at any time.</p>
                        <p>These Terms apply from the moment you first install or use ERS and continue to apply for as long as you use the application.</p>
                      </>}
                      {sec.id === "eligibility" && <>
                        <p>ERS is intended for individuals who are <span className="text-white font-medium">13 years of age or older</span>. By using ERS, you represent and warrant that you meet this age requirement.</p>
                        <p>Users between the ages of 13 and 18 must have the knowledge and consent of a parent or legal guardian. Parents and guardians are responsible for supervising minors' use of the application and ensuring compliance with these Terms.</p>
                        <p>You must also ensure that your use of ERS complies with all applicable local, state, national, and international laws and regulations, including laws related to audio recording consent in your jurisdiction. Recording laws vary by country and region — in some locations, one-party consent is sufficient; in others, all parties must consent to being recorded.</p>
                      </>}
                      {sec.id === "accounts" && <>
                        <p>ERS does not require account registration or login credentials. The application operates entirely locally on your device without user accounts, cloud authentication, or profile management.</p>
                        <p>Your emergency contacts, recording history, and settings are stored locally on your device and are not associated with any account or identity managed by IUXOA.</p>
                      </>}
                      {sec.id === "acceptable-use" && <>
                        <p>You agree to use ERS only for lawful purposes and in a manner consistent with these Terms. You must <span className="text-white font-medium">not</span> use ERS to:</p>
                        <ul className="list-none space-y-2 pl-2">
                          {["Record audio of other individuals without their knowledge or consent where legally required","Harass, threaten, defame, or harm any individual","Create or distribute false emergency alerts to your contacts","Attempt to reverse-engineer, decompile, or modify the ERS application","Use ERS to facilitate any illegal activity, including unauthorized surveillance","Misuse emergency features in non-emergency situations in a manner that causes distress to emergency contacts","Attempt to exploit any vulnerability in the application"].map(item => (
                            <li key={item} className="flex items-start gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#ff1744" }} />{item}</li>
                          ))}
                        </ul>
                        <p>Violation of this section may result in immediate termination of your right to use ERS and may expose you to legal liability.</p>
                      </>}
                      {sec.id === "emergency-disclaimer" && <>
                        <div className="rounded-2xl p-5" style={{ background: "rgba(255,23,68,0.08)", border: "1px solid rgba(255,23,68,0.25)" }}>
                          <p className="font-bold text-white mb-2">⚠️ Critical Disclaimer — Please Read Carefully</p>
                          <p>ERS is a <span className="text-white font-medium">personal safety tool</span> that records evidence and alerts your chosen contacts. It is <span className="text-white font-medium">not a replacement for police, ambulance, fire, or any other official emergency service</span>, and it is not a certified emergency response system, law enforcement tool, or medical device.</p>
                        </div>
                        <ul className="list-none space-y-2 pl-2 mt-3">
                          {["Always contact official emergency services (such as 100, 101, 108, or 112 in India) as your first response in any life-threatening emergency.","ERS relies on your device's hardware, cellular network, GPS signal, and battery — none of which are guaranteed to function in all emergency scenarios.","SMS delivery and location accuracy depend on network coverage and are not guaranteed.","ERS provides no guarantee that emergency contacts will receive, read, or act upon alerts in time.","IUXOA assumes no liability for outcomes resulting from failure of the application to function as expected during an emergency."].map(item => (
                            <li key={item} className="flex items-start gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#ff1744" }} />{item}</li>
                          ))}
                        </ul>
                      </>}
                      {sec.id === "responsibilities" && <>
                        <p>As a user of ERS, you are solely responsible for:</p>
                        <ul className="list-none space-y-2 pl-2">
                          {["Ensuring ERS is properly configured with accurate emergency contacts before any emergency situation arises.","Verifying that all required permissions (Microphone, Location, SMS) are granted for ERS to function correctly.","Keeping your device charged and maintaining a cellular signal in areas where you may need emergency assistance.","Complying with all applicable laws in your jurisdiction regarding audio recording, consent, and privacy.","Ensuring your emergency contacts are aware they may receive alerts from you and that their phone numbers are current and correct.","Testing ERS functionality periodically to confirm it works on your specific device and Android version.","Understanding that ERS performance may vary across different Android OEM implementations and custom ROMs."].map(item => (
                            <li key={item} className="flex items-start gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#ff1744" }} />{item}</li>
                          ))}
                        </ul>
                      </>}
                      {sec.id === "ip" && <>
                        <p>The ERS application, including its source code, design, user interface, graphics, logos, icons, and all other content, is the exclusive intellectual property of <span className="text-white font-medium">IUXOA</span> and is protected by applicable copyright, trademark, and intellectual property laws.</p>
                        <p>You are granted a limited, non-exclusive, non-transferable, revocable license to use ERS solely for personal, non-commercial safety purposes in accordance with these Terms.</p>
                        <p>You may not copy, modify, distribute, sell, sublicense, reverse engineer, or create derivative works based on ERS or any of its components without prior written permission from IUXOA.</p>
                        <p>The ERS name, logo, and "IUXOA" brand are trademarks of IUXOA and may not be used without explicit written consent.</p>
                      </>}
                      {sec.id === "warranty" && <>
                        <p>ERS is provided <span className="text-white font-medium">"as is" and "as available,"</span> without warranties of any kind, whether express or implied.</p>
                        <p>We don't guarantee that ERS will be error-free, uninterrupted, or that it will meet every expectation you might have. To the extent permitted by law, IUXOA disclaims all implied warranties, including merchantability, fitness for a particular purpose, and non-infringement.</p>
                        <p>This is a standard disclaimer used by most software products — it doesn't mean we don't stand behind ERS, only that we can't make absolute guarantees about a piece of software running across thousands of different Android devices and conditions.</p>
                      </>}
                      {sec.id === "data-storage" && <>
                        <p>ERS is built around <span className="text-white font-medium">local, on-device storage</span>. Your recordings, emergency contacts, recording history, and app settings are all saved directly on your phone.</p>
                        <ul className="list-none space-y-2 pl-2">
                          {["IUXOA does not operate servers that store your recordings or personal information.","Nothing you record or configure in ERS is transmitted to IUXOA at any point.","Uninstalling the app removes its locally stored data from your device.","Because there's no cloud copy, losing or resetting your device means losing any recordings you haven't separately saved or shared elsewhere."].map(item => (
                            <li key={item} className="flex items-start gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#ff1744" }} />{item}</li>
                          ))}
                        </ul>
                      </>}
                      {sec.id === "software-updates" && <>
                        <p>From time to time, we may release updates to ERS through the distribution channel you installed it from, to fix bugs, improve reliability, or add functionality.</p>
                        <p>Keeping ERS updated helps ensure it continues to work correctly with newer versions of Android. We don't guarantee that every past version will keep working indefinitely as the Android platform evolves.</p>
                        <p>Updates are optional at the operating-system level unless required for the app to continue functioning, but we recommend installing them when available.</p>
                      </>}
                      {sec.id === "feedback" && <>
                        <p>If you send us feedback, suggestions, or ideas about ERS — whether by email, a review, or any other channel — you agree that IUXOA may use that feedback to improve the application without any obligation to compensate you or credit you.</p>
                        <p>Please don't include sensitive personal information in feedback you send us, since feedback channels are not designed for handling private data.</p>
                      </>}
                      {sec.id === "third-party-libraries" && <>
                        <p>Like most Android applications, ERS is built using a number of third-party open-source software libraries and components. These libraries remain the property of their respective authors and are governed by their own individual licenses.</p>
                        <p>A list of the open-source components used in ERS and their corresponding licenses is maintained separately and made available to users on request. Use of ERS does not grant you any rights to these underlying libraries beyond what their own licenses provide.</p>
                      </>}
                      {sec.id === "availability" && <>
                        <p>We work to keep ERS reliable, but as with any software, we can't promise uninterrupted or error-free operation at all times.</p>
                        <ul className="list-none space-y-2 pl-2">
                          {["We may release updates, patches, or new versions of ERS at any time.","We reserve the right to discontinue ERS or any of its features, with reasonable advance notice where possible.","Performance may vary based on your device's hardware, Android version, OEM customizations, and network conditions.","ERS is not designed or certified for use in environments with critical or safety-critical infrastructure."].map(item => (
                            <li key={item} className="flex items-start gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#ff1744" }} />{item}</li>
                          ))}
                        </ul>
                      </>}
                      {sec.id === "liability" && <>
                        <p>To the maximum extent permitted by applicable law, <span className="text-white font-medium">IUXOA shall not be liable</span> for any direct, indirect, incidental, special, consequential, or punitive damages arising from or related to your use or inability to use ERS, including but not limited to:</p>
                        <ul className="list-none space-y-2 pl-2">
                          {["Failure of the emergency trigger, recording, or SMS alert features during an emergency situation.","Loss, corruption, or unauthorized access to recordings stored on your device.","Inaccurate GPS data or failure to determine your location.","Non-delivery or delayed delivery of emergency SMS messages.","Actions taken or not taken by your emergency contacts upon receiving an alert.","Any harm, injury, loss, or legal consequence arising from your use or misuse of ERS."].map(item => (
                            <li key={item} className="flex items-start gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#ff1744" }} />{item}</li>
                          ))}
                        </ul>
                        <p>In jurisdictions that do not allow the exclusion or limitation of incidental or consequential damages, our liability shall be limited to the maximum extent permitted by law.</p>
                      </>}
                      {sec.id === "termination" && <>
                        <p>Your right to use ERS is effective until terminated. These Terms and your right to use ERS will terminate automatically if you fail to comply with any provision of these Terms.</p>
                        <p>You may terminate these Terms at any time by uninstalling ERS from your device. Upon uninstallation, all locally stored application data will be deleted from your device.</p>
                        <p>IUXOA reserves the right to discontinue the application or release incompatible updates that effectively end support for older versions. In such cases, we will make reasonable efforts to notify users through app store listings or in-app communications.</p>
                        <p>Termination does not affect any rights or liabilities that arose prior to the date of termination.</p>
                      </>}
                      {sec.id === "updates" && <>
                        <p>IUXOA reserves the right to modify these Terms at any time to reflect changes in the application, applicable law, or our practices. When changes are made:</p>
                        <ul className="list-none space-y-2 pl-2">
                          {["The \"Last Updated\" date at the top of this page will be revised.","For material changes, we will provide notice through the app or app store listing.","Continued use of ERS after updated Terms are posted constitutes acceptance of the revised Terms."].map(item => (
                            <li key={item} className="flex items-start gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#ff1744" }} />{item}</li>
                          ))}
                        </ul>
                        <p>If you disagree with any updated Terms, your sole remedy is to discontinue use of ERS and uninstall the application.</p>
                      </>}
                      {sec.id === "governing-law" && <>
                        <p>These Terms are governed by and construed in accordance with the laws of <span className="text-white font-medium">India</span>, without regard to its conflict of law provisions.</p>
                        <p>Any dispute arising out of or relating to these Terms or your use of ERS shall be subject to the exclusive jurisdiction of the courts located in India.</p>
                        <p>These Terms constitute the entire agreement between you and IUXOA with respect to ERS and supersede all prior agreements, representations, and understandings.</p>
                      </>}
                      {sec.id === "severability" && <>
                        <p>If any part of these Terms is found by a court or other authority to be invalid, illegal, or unenforceable, that part will be limited or removed to the minimum extent necessary.</p>
                        <p>The rest of these Terms will continue to apply in full. One unenforceable clause doesn't undo the agreement as a whole.</p>
                      </>}
                      {sec.id === "contact" && <>
                        <p>If you have questions, concerns, or feedback about these Terms and Conditions, please get in touch:</p>
                        <div className="rounded-2xl p-6 mt-4" style={{ background: "rgba(255,23,68,0.06)", border: "1px solid rgba(255,23,68,0.15)" }}>
                          <p className="font-bold text-white mb-1">IUXOA — ERS Development Team</p>
                          <p>You can reach us through the <span className="text-white">Contact</span> option in the app, or via the contact details on our website.</p>
                          <p>Application: Emergency Recording System (ERS) v1.0.0</p>
                          <p>Platform: Android</p>
                        </div>
                      </>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to top */}
      <AnimatePresence>
        {showBackTop && (
          <motion.button initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-50 w-11 h-11 rounded-full flex items-center justify-center text-white"
            style={{ background: "linear-gradient(135deg,#ff1744,#ff4d6d)", boxShadow: "0 0 20px rgba(255,23,68,0.5)" }}>
            <ChevronRight className="w-5 h-5 -rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>
    </LegalLayout>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Routes>
      <Route path="/" element={
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
          <NavBar />
          <HomePage />
          <Footer />
        </div>
      } />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="*" element={
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
          <NavBar />
          <HomePage />
          <Footer />
        </div>
      } />
    </Routes>
  );
}
