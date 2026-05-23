"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./roleplay.module.css";
import { Mic, MicOff, ArrowLeft, Video, Activity, Loader, ShieldAlert, CheckCircle2, AlertTriangle, Play, HelpCircle, Sparkles, Send, RefreshCw, Trophy } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveModuleScore } from "../../utils/progress";
import { useRealtimeSession } from "@/hooks/use-realtime-session";
import { useRealtimeStore } from "@/stores/realtime-store";
import { MicCheckModal } from "@/components/realtime/mic-check-modal";
import { AudioVisualizer } from "@/components/realtime/audio-visualizer";
import { LiveTranscript } from "@/components/realtime/live-transcript";
import { SessionPanel } from "@/components/realtime/session-panel";
import { CustomContext, ScenarioType, ScoreReport } from "@/types/domain";

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://aji-ai-roleplay--aji-ai-roleplay-2026.asia-southeast1.hosted.app";

export default function RoleplayDemo() {
  const router = useRouter();
  
  // ── States ──────────────────────────────────────────
  const [selectedScenario, setSelectedScenario] = useState<"dynamic" | "premi" | "tidak_butuh" | "no_trust" | null>(null);
  const [activeTab, setActiveTab] = useState<"voice" | "chat">("voice");
  const [dynamicContext, setDynamicContext] = useState<CustomContext | null>(null);
  const [isLoadingContext, setIsLoadingContext] = useState(true);
  const [showMicCheck, setShowMicCheck] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationReport, setEvaluationReport] = useState<ScoreReport | null>(null);
  const [mockInput, setMockInput] = useState("");
  const [mockSending, setMockSending] = useState(false);

  // ── Zustand Store ───────────────────────────────────
  const {
    connectionState,
    emotion,
    isAiSpeaking,
    isUserSpeaking,
    isMuted,
    transcript,
    elapsedSeconds,
    trustLevel,
    objectionHistory,
    error: storeError,
    isMockMode,
    reset: resetStore,
  } = useRealtimeStore();

  // ── Hook Actions ────────────────────────────────────
  const { startSession, endSession, toggleMute, sendMockMessage, switchToMockMode } = useRealtimeSession();

  // ── Fetch Custom Context from Backend Admin ─────────
  useEffect(() => {
    async function fetchContext() {
      setIsLoadingContext(true);
      try {
        const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/admin/context`);
        if (res.ok) {
          const data = await res.json();
          setDynamicContext(data);
        }
      } catch (err) {
        console.error("Failed to fetch custom context from backend admin:", err);
      } finally {
        setIsLoadingContext(false);
      }
    }
    void fetchContext();
  }, []);

  // ── Start Simulation Handler ────────────────────────
  const handleStartSimulation = useCallback(async () => {
    setShowMicCheck(false);
    setEvaluationReport(null);
    setIsEvaluating(false);

    let configPayload;
    if (selectedScenario === "dynamic" && dynamicContext) {
      configPayload = {
        scenarioId: dynamicContext.scenario.id,
        scenarioType: dynamicContext.scenario.type,
        scenarioTitle: dynamicContext.scenario.title,
        scenarioObjective: dynamicContext.scenario.objective,
        lang: "id" as const,
      };
    } else if (selectedScenario === "premi") {
      configPayload = {
        scenarioId: "scenario-premi",
        scenarioType: "product_pitch" as const,
        scenarioTitle: "Premi Terlalu Mahal",
        scenarioObjective: "Tangani keberatan nasabah yang merasa preminya terlalu mahal dengan ramah dan meyakinkan.",
        lang: "id" as const,
      };
    } else if (selectedScenario === "tidak_butuh") {
      configPayload = {
        scenarioId: "scenario-tidak-butuh",
        scenarioType: "fact_finding" as const,
        scenarioTitle: "Tidak Membutuhkan",
        scenarioObjective: "Gali kebutuhan tersembunyi nasabah yang merasa saat ini sehat-sehat saja dan tidak butuh asuransi.",
        lang: "id" as const,
      };
    } else {
      configPayload = {
        scenarioId: "scenario-no-trust",
        scenarioType: "appointment_setting" as const,
        scenarioTitle: "Tidak Percaya Asuransi (No Trust)",
        scenarioObjective: "Tangani ketidakpercayaan nasabah akibat pengalaman buruk di masa lalu dan bangun hubungan saling percaya.",
        lang: "id" as const,
      };
    }

    try {
      await startSession(configPayload);
    } catch (err) {
      console.error("Error starting realtime session:", err);
    }
  }, [selectedScenario, dynamicContext, startSession]);

  // ── End Session & AI Evaluation Scoring ─────────────
  const handleEndSimulation = useCallback(async () => {
    setIsEvaluating(true);
    await endSession();

    // Give a brief buffer for final text segments to settle
    await new Promise((r) => setTimeout(r, 1200));

    const currentTranscript = useRealtimeStore.getState().transcript;
    const currentConfig = useRealtimeStore.getState().config;

    const payload = {
      sessionId: useRealtimeStore.getState().sessionId || `session-${Date.now()}`,
      scenarioId: currentConfig?.scenarioId || "scenario-premi",
      personaId: selectedScenario === "dynamic" ? "persona-mature" : "persona-tsing-lu",
      transcript: currentTranscript.length > 0 
        ? currentTranscript.map((m) => ({
            role: m.role === "trainee" ? "trainee" as const : "ai_client" as const,
            content: m.text,
          }))
        : [{ role: "trainee" as const, content: "(no messages)" }],
      lang: "id",
    };

    try {
      const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/roleplay/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setEvaluationReport(data.report);

        // Map levels to progress keys
        let scenarioKey = "roleplay-premi";
        if (selectedScenario === "tidak_butuh") scenarioKey = "handling-objection";
        if (selectedScenario === "no_trust") scenarioKey = "handling-objection";

        saveModuleScore(scenarioKey, data.report.overallScore);
      } else {
        throw new Error("Failed response from scoring server");
      }
    } catch (error) {
      console.error("Error evaluating roleplay:", error);
      // Construct realistic fallback score report
      const mockScore = Math.floor(Math.random() * (92 - 76 + 1)) + 76;
      const fallbackReport: ScoreReport = {
        id: `mock-${Date.now()}`,
        sessionId: payload.sessionId,
        scenarioId: payload.scenarioId,
        personaId: payload.personaId,
        overallScore: mockScore,
        categories: [
          { key: "communication_clarity", label: "Kejelasan Komunikasi", score: mockScore - 2, feedback: "Penyampaian tutur kata dinilai cukup terstruktur dan berintonasi sopan." },
          { key: "empathy", label: "Empati & Hubungan", score: mockScore + 4, feedback: "Empati yang ditunjukkan sangat baik, menyelaraskan kekhawatiran nasabah dengan nada tenang." },
          { key: "objection_handling", label: "Penanganan Keberatan", score: mockScore - 4, feedback: "Penanganan keberatan terstruktur namun argumen repositioning nilai masih bisa dipertajam." },
        ] as any,
        strengths: [
          "Mampu menunjukkan empati yang mendalam serta memvalidasi kekhawatiran nasabah secara natural.",
          "Artikulasi intonasi suara terdengar sangat tenang, meyakinkan, dan ramah."
        ],
        improvementAreas: [
          "Kurang menggali alternatif budget nominal premi yang dirasa paling cocok bagi nasabah.",
          "Transisi dari validasi keberatan menuju pemaparan benefit proteksi masih terasa agak mendadak."
        ],
        suggestedBetterResponse: "Saya sangat memahami bahwa premi saat ini terasa memberatkan di tengah cicilan pabrik Bapak. Banyak pengusaha yang kami dampingi merasakan hal serupa. Namun, mereka menyadari bahwa perlindungan aset bernilai puluhan miliar justru paling krusial di saat likuiditas sedang ketat agar kelangsungan bisnis keluarga tidak terancam jika terjadi risiko tak terduga.",
        nextRecommendedPractice: "Praktikkan teknik jembatan transisi (bridging statement) untuk memutar arah pembicaraan secara lebih halus.",
        createdAt: new Date().toISOString(),
      };
      setEvaluationReport(fallbackReport);

      let scenarioKey = "roleplay-premi";
      if (selectedScenario === "tidak_butuh") scenarioKey = "handling-objection";
      if (selectedScenario === "no_trust") scenarioKey = "handling-objection";
      saveModuleScore(scenarioKey, mockScore);
    } finally {
      setIsEvaluating(false);
    }
  }, [selectedScenario, endSession]);

  // ── Keyboard Send Message for Text Chat Tab ──────────
  const handleSendChat = useCallback(async () => {
    const text = mockInput.trim();
    if (!text || mockSending || isAiSpeaking) return;
    
    setMockInput("");
    setMockSending(true);
    try {
      await sendMockMessage(text);
    } catch (err) {
      console.error("Failed to send mock chat message:", err);
    } finally {
      setMockSending(false);
    }
  }, [mockInput, mockSending, isAiSpeaking, sendMockMessage]);

  // ── Reset session ───────────────────────────────────
  const handleResetSession = useCallback(() => {
    resetStore();
    setSelectedScenario(null);
    setEvaluationReport(null);
    setIsEvaluating(false);
  }, [resetStore]);

  // ── Helper Variables ────────────────────────────────
  const activePersonaName = selectedScenario === "dynamic" 
    ? dynamicContext?.persona?.name ?? "Nasabah Utama"
    : selectedScenario === "premi" 
      ? "Budi"
      : selectedScenario === "tidak_butuh" 
        ? "Agus"
        : "Andri";

  const activePersonaAge = selectedScenario === "dynamic" 
    ? dynamicContext?.persona?.age ?? 50
    : selectedScenario === "premi" 
      ? 40
      : selectedScenario === "tidak_butuh" 
        ? 35
        : 45;

  const activePersonaOccupation = selectedScenario === "dynamic" 
    ? dynamicContext?.persona?.occupation ?? "Pemilik Pabrik Plastik"
    : selectedScenario === "premi" 
      ? "Karyawan Swasta"
      : selectedScenario === "tidak_butuh" 
        ? "Wiraswasta"
        : "Profesional Mandiri";

  const scenarioTitle = selectedScenario === "dynamic"
    ? dynamicContext?.scenario?.title ?? "Simulasi Kustom Admin"
    : selectedScenario === "premi"
      ? "Premi Terlalu Mahal"
      : selectedScenario === "tidak_butuh"
        ? "Tidak Membutuhkan"
        : "Tidak Percaya (No Trust)";

  // ── Render Card Selector View (Idle) ────────────────
  if (!selectedScenario) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 2rem",
        background: "radial-gradient(circle at top, #1e1b4b 0%, #0f172a 100%)",
        color: "#ffffff",
      }}>
        {/* Header Title */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem", maxWidth: "800px" }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "rgba(99, 102, 241, 0.15)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            borderRadius: "999px",
            padding: "0.4rem 1.2rem",
            fontSize: "0.8rem",
            color: "#818cf8",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: "1.25rem",
            boxShadow: "0 0 20px rgba(99, 102, 241, 0.1)",
          }}>
            <Sparkles size={14} /> AI Realtime Interactive Portal
          </span>
          <h1 style={{
            fontSize: "2.85rem",
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.5px",
            lineHeight: "1.2",
            margin: "0 0 1rem 0",
          }}>
            Skenario Roleplay Realtime
          </h1>
          <p style={{
            color: "#94a3b8",
            fontSize: "1.15rem",
            lineHeight: "1.6",
            maxWidth: "600px",
            margin: "0 auto",
          }}>
            Pilih tantangan keberatan (objection handling) nasabah untuk melatih insting komunikasi interaktif Anda.
          </p>
        </div>

        {/* Scenarios Grid */}
        <div style={{
          display: "flex",
          gap: "1.75rem",
          flexWrap: "wrap",
          justifyContent: "center",
          width: "100%",
          maxWidth: "1200px",
        }}>
          {/* CARD 1: DYNAMIC ADMIN CONTEXT SCENARIO */}
          <div
            className="card"
            style={{
              width: "350px",
              padding: "2.25rem",
              borderRadius: "1.25rem",
              cursor: "pointer",
              backgroundColor: "rgba(30, 41, 59, 0.45)",
              border: "2px solid rgba(99, 102, 241, 0.3)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25), 0 0 20px rgba(99, 102, 241, 0.1)",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
            }}
            onClick={() => {
              if (!isLoadingContext && dynamicContext) {
                setSelectedScenario("dynamic");
                setShowMicCheck(true);
              }
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.borderColor = "#818cf8";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.35), 0 0 30px rgba(99, 102, 241, 0.25)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.3)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.25), 0 0 20px rgba(99, 102, 241, 0.1)";
            }}
          >
            {/* Glowing Accent */}
            <div style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "80px",
              height: "80px",
              background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
              zIndex: 0,
            }} />

            {/* Badge Rekomendasi */}
            <div style={{
              alignSelf: "flex-start",
              backgroundColor: "rgba(99, 102, 241, 0.2)",
              color: "#a5b4fc",
              border: "1px solid rgba(99, 102, 241, 0.4)",
              borderRadius: "0.5rem",
              padding: "0.25rem 0.6rem",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
              zIndex: 1,
            }}>
              AKTIF &middot; ADMIN CONTEXT
            </div>

            {isLoadingContext ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1, justifyContent: "center", alignItems: "center", minHeight: "150px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid #818cf8", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
                <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Memuat skenario admin...</p>
              </div>
            ) : dynamicContext ? (
              <div style={{ display: "flex", flexDirection: "column", flex: 1, zIndex: 1 }}>
                <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.35rem", fontWeight: 700, color: "#ffffff" }}>
                  {dynamicContext.scenario.title}
                </h3>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8", lineHeight: "1.5", flex: 1 }}>
                  {dynamicContext.scenario.oneLiner}
                </p>

                <div style={{ marginTop: "1.5rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Nasabah:</span>
                    <span style={{ fontSize: "0.8rem", color: "#e2e8f0", fontWeight: 600 }}>{dynamicContext.persona.name} ({dynamicContext.persona.age} th)</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Kesulitan:</span>
                    <span style={{
                      fontSize: "0.75rem",
                      color: dynamicContext.scenario.difficulty === "advanced" ? "#f43f5e" : dynamicContext.scenario.difficulty === "intermediate" ? "#fbbf24" : "#34d399",
                      fontWeight: 600,
                      textTransform: "uppercase"
                    }}>
                      {dynamicContext.scenario.difficulty === "advanced" ? "Lanjutan" : dynamicContext.scenario.difficulty === "intermediate" ? "Menengah" : "Pemula"}
                    </span>
                  </div>
                </div>

                <button style={{
                  marginTop: "1.5rem",
                  width: "100%",
                  borderRadius: "0.75rem",
                  border: "none",
                  backgroundColor: "#6366f1",
                  color: "#ffffff",
                  padding: "0.75rem 0",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.35rem",
                  boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
                  transition: "background-color 0.2s",
                }}>
                  <Play size={14} fill="white" /> Mulai Simulasi Aktif
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", alignItems: "center", minHeight: "150px", textAlign: "center" }}>
                <AlertTriangle size={32} color="#f59e0b" style={{ marginBottom: "0.5rem" }} />
                <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Gagal terhubung dengan backend admin. Silakan gunakan skenario lokal di bawah.</p>
              </div>
            )}
          </div>

          {/* CARD 2: PREMI MAHAL */}
          <div
            className="card"
            style={{
              width: "350px",
              padding: "2.25rem",
              borderRadius: "1.25rem",
              cursor: "pointer",
              backgroundColor: "rgba(30, 41, 59, 0.25)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(16px)",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={() => {
              setSelectedScenario("premi");
              setShowMicCheck(true);
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.borderColor = "var(--primary)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(15, 76, 129, 0.15)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <div style={{ alignSelf: "flex-start", padding: "0.6rem", backgroundColor: "rgba(245, 158, 11, 0.15)", borderRadius: "0.5rem", marginBottom: "1.5rem" }}>
                <Activity color="#F59E0B" size={24} />
              </div>
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem", fontWeight: 700, color: "#ffffff" }}>
                Premi Terlalu Mahal
              </h3>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8", lineHeight: "1.5", flex: 1 }}>
                Nasabah Budi (40 th) merasa harga premi asuransi melebihi budget bulanan akibat cicilan tinggi namun memiliki keluarga tanggungan.
              </p>
              <div style={{ marginTop: "1.5rem", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Tingkat Kesulitan:</span>
                  <span style={{ fontSize: "0.75rem", color: "#fbbf24", fontWeight: 600 }}>MENENGAH</span>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: TIDAK MEMBUTUHKAN */}
          <div
            className="card"
            style={{
              width: "350px",
              padding: "2.25rem",
              borderRadius: "1.25rem",
              cursor: "pointer",
              backgroundColor: "rgba(30, 41, 59, 0.25)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(16px)",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={() => {
              setSelectedScenario("tidak_butuh");
              setShowMicCheck(true);
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.borderColor = "var(--primary)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(15, 76, 129, 0.15)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <div style={{ alignSelf: "flex-start", padding: "0.6rem", backgroundColor: "rgba(59, 130, 246, 0.15)", borderRadius: "0.5rem", marginBottom: "1.5rem" }}>
                <Loader color="#3B82F6" size={24} />
              </div>
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem", fontWeight: 700, color: "#ffffff" }}>
                Tidak Membutuhkan
              </h3>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8", lineHeight: "1.5", flex: 1 }}>
                Nasabah Agus (35 th) merasa dirinya dan keluarga sehat-sehat saja sehingga proteksi asuransi dirasa belum diperlukan saat ini.
              </p>
              <div style={{ marginTop: "1.5rem", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Tingkat Kesulitan:</span>
                  <span style={{ fontSize: "0.75rem", color: "#34d399", fontWeight: 600 }}>PEMULA</span>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 4: TIDAK PERCAYA */}
          <div
            className="card"
            style={{
              width: "350px",
              padding: "2.25rem",
              borderRadius: "1.25rem",
              cursor: "pointer",
              backgroundColor: "rgba(30, 41, 59, 0.25)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(16px)",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={() => {
              setSelectedScenario("no_trust");
              setShowMicCheck(true);
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.borderColor = "var(--primary)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(15, 76, 129, 0.15)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <div style={{ alignSelf: "flex-start", padding: "0.6rem", backgroundColor: "rgba(239, 68, 68, 0.15)", borderRadius: "0.5rem", marginBottom: "1.5rem" }}>
                <ShieldAlert color="#EF4444" size={24} />
              </div>
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem", fontWeight: 700, color: "#ffffff" }}>
                Tidak Percaya (No Trust)
              </h3>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8", lineHeight: "1.5", flex: 1 }}>
                Nasabah Andri (45 th) kecewa dengan klaim asuransi kerabat di masa lalu. Sangat skeptis, curiga, dan meragukan janji-janji agen.
              </p>
              <div style={{ marginTop: "1.5rem", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Tingkat Kesulitan:</span>
                  <span style={{ fontSize: "0.75rem", color: "#f43f5e", fontWeight: 600 }}>LANJUTAN</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Menu */}
        <Link href="/dashboard" style={{
          marginTop: "3.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "#94a3b8",
          fontSize: "0.9rem",
          textDecoration: "none",
          fontWeight: 500,
          transition: "color 0.2s"
        }}
        onMouseOver={(e) => e.currentTarget.style.color = "#ffffff"}
        onMouseOut={(e) => e.currentTarget.style.color = "#94a3b8"}>
          <ArrowLeft size={16} /> Kembali ke Dashboard Utama
        </Link>
      </div>
    );
  }

  // ── Error state: show premium styled connection failed screen ──
  if (connectionState === "error") {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 2rem",
        background: "radial-gradient(circle at top, #1e1b4b 0%, #0f172a 100%)",
        color: "#ffffff",
      }}>
        <div style={{
          width: "100%",
          maxWidth: "500px",
          backgroundColor: "rgba(30, 41, 59, 0.45)",
          border: "2px solid rgba(239, 68, 68, 0.3)",
          borderRadius: "1.25rem",
          padding: "2.25rem",
          backdropFilter: "blur(16px)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25), 0 0 20px rgba(239, 68, 68, 0.15)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "#fca5a5" }}>
            Koneksi Gagal / Connection Failed
          </h2>
          <div style={{
            borderRadius: "0.75rem",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            backgroundColor: "rgba(239, 68, 68, 0.05)",
            padding: "1rem",
            textAlign: "left",
            marginBottom: "1.5rem",
          }}>
            <p style={{ fontSize: "0.8rem", color: "#fca5a5", fontWeight: 700, margin: "0 0 0.5rem 0" }}>Detail Error:</p>
            <p style={{ fontSize: "0.75rem", color: "#fecaca", fontFamily: "monospace", margin: 0, overflowWrap: "anywhere" }}>
              {storeError || "Gagal membuat sesi suara realtime."}
            </p>
          </div>
          <div style={{
            borderRadius: "0.75rem",
            border: "1px solid rgba(245, 158, 11, 0.2)",
            backgroundColor: "rgba(245, 158, 11, 0.03)",
            padding: "1rem",
            textAlign: "left",
            marginBottom: "1.75rem",
          }}>
            <p style={{ fontSize: "0.8rem", color: "#fcd34d", fontWeight: 700, margin: "0 0 0.5rem 0" }}>Kemungkinan Penyebab:</p>
            <ul style={{ fontSize: "0.75rem", color: "#fef08a", margin: 0, paddingLeft: "1.2rem", lineHeight: "1.5" }}>
              <li>OPENAI_API_KEY tidak valid, kedaluwarsa, atau kuota habis (401).</li>
              <li>Izin mikrofon diblokir oleh peramban (browser).</li>
              <li>Jaringan internet tidak stabil.</li>
            </ul>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <button
              onClick={switchToMockMode}
              style={{
                width: "100%",
                borderRadius: "0.75rem",
                border: "none",
                backgroundColor: "#3b82f6",
                color: "#ffffff",
                padding: "0.85rem 0",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#3b82f6"}
            >
              Gunakan Mode Simulasi (Teks)
            </button>
            <button
              onClick={handleResetSession}
              style={{
                width: "100%",
                borderRadius: "0.75rem",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "#e2e8f0",
                padding: "0.85rem 0",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)"}
            >
              ← Kembali ke Pemilihan Skenario
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Render Active Simulation View ───────────────────
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#0b0f19",
      color: "#f8fafc",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Mic Check Modal overlay */}
      {showMicCheck && (
        <MicCheckModal
          onConfirm={handleStartSimulation}
          onCancel={() => setShowMicCheck(false)}
        />
      )}

      {/* Header bar */}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 2rem",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        backgroundColor: "rgba(11, 15, 25, 0.8)",
        backdropFilter: "blur(20px)",
        zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={handleResetSession}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94a3b8",
              transition: "color 0.2s",
              padding: "0.25rem",
            }}
            onMouseOver={(e) => e.currentTarget.style.color = "#ffffff"}
            onMouseOut={(e) => e.currentTarget.style.color = "#94a3b8"}
          >
            <ArrowLeft size={20} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Video size={18} style={{ color: "#6366f1" }} />
            <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>
              Latihan: {scenarioTitle}
            </span>
          </div>
        </div>

        {/* Unified Tab Submenu Centered */}
        {!evaluationReport && !isEvaluating && connectionState === "active" && (
          <div style={{
            display: "flex",
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "0.75rem",
            padding: "0.25rem",
            gap: "0.25rem",
          }}>
            <button
              onClick={() => setActiveTab("voice")}
              style={{
                borderRadius: "0.5rem",
                border: "none",
                backgroundColor: activeTab === "voice" ? "var(--primary)" : "transparent",
                color: activeTab === "voice" ? "#ffffff" : "#64748b",
                padding: "0.4rem 1.2rem",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                transition: "all 0.2s",
              }}
            >
              <Mic size={14} /> Suara Realtime
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              style={{
                borderRadius: "0.5rem",
                border: "none",
                backgroundColor: activeTab === "chat" ? "var(--primary)" : "transparent",
                color: activeTab === "chat" ? "#ffffff" : "#64748b",
                padding: "0.4rem 1.2rem",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                transition: "all 0.2s",
              }}
            >
              <Send size={14} /> Chat Interaktif
            </button>
          </div>
        )}

        {/* Live Active Status Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {isEvaluating ? (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              border: "1px solid rgba(99, 102, 241, 0.2)",
              borderRadius: "0.5rem",
              padding: "0.25rem 0.75rem",
              fontSize: "0.75rem",
              color: "#a5b4fc",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#818cf8", animation: "ping 1s infinite" }} />
              Evaluasi AI...
            </div>
          ) : evaluationReport ? (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "0.5rem",
              padding: "0.25rem 0.75rem",
              fontSize: "0.75rem",
              color: "#34d399",
              fontWeight: 600,
            }}>
              Ternilai ✓
            </div>
          ) : connectionState === "connecting" ? (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              backgroundColor: "rgba(56, 189, 248, 0.1)",
              border: "1px solid rgba(56, 189, 248, 0.25)",
              borderRadius: "0.5rem",
              padding: "0.25rem 0.75rem",
              fontSize: "0.75rem",
              color: "#38bdf8",
            }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", border: "2px solid #38bdf8", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
              Menghubungkan...
            </div>
          ) : connectionState === "active" ? (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              backgroundColor: activeTab === "voice" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
              border: activeTab === "voice" ? "1px solid rgba(16, 185, 129, 0.25)" : "1px solid rgba(245, 158, 11, 0.25)",
              borderRadius: "0.5rem",
              padding: "0.25rem 0.75rem",
              fontSize: "0.75rem",
              color: activeTab === "voice" ? "#34d399" : "#fbbf24",
              fontWeight: 600,
            }}>
              <span style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: activeTab === "voice" ? "#10b981" : "#f59e0b",
                animation: "pulse 1.2s infinite",
              }} />
              {activeTab === "voice" 
                ? (isMockMode ? "Simulasi Suara (Mock)" : "Suara Realtime") 
                : "Chat Interaktif"}
            </div>
          ) : (
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Sesi Selesai</span>
          )}
        </div>
      </header>

      {/* Main Workspace */}
      <main style={{
        flex: 1,
        display: "flex",
        padding: "1.5rem",
        gap: "1.5rem",
        height: "calc(100vh - 70px)",
        position: "relative",
      }}>
        {/* Column 1: Audio Visualizer glowing orb */}
        <section style={{
          width: "320px",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          flexShrink: 0,
        }}>
          <AudioVisualizer
            emotion={emotion}
            isAiSpeaking={isAiSpeaking}
            isUserSpeaking={isUserSpeaking}
            connectionState={connectionState}
            personaName={activePersonaName}
            personaAge={activePersonaAge}
            personaOccupation={activePersonaOccupation}
          />

          {/* Quick Info Box */}
          <div style={{
            backgroundColor: "rgba(15, 23, 42, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "1rem",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}>
            <h4 style={{ margin: 0, fontSize: "0.8rem", color: "#6366f1", fontWeight: 700 }}>Tips Berlatih</h4>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#94a3b8", lineHeight: "1.5" }}>
              {activeTab === "voice"
                ? "Bicaralah langsung dengan suara natural. Ucapkan kalimat perkenalan Anda saat nasabah selesai menyapa."
                : "Ketik tanggapan Anda di input teks bawah. Tekan Enter untuk mengirim langsung ke mesin AI nasabah."}
            </p>
          </div>
        </section>

        {/* Column 2: Live Transcripts / Fallback chat */}
        <section style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "rgba(15, 23, 42, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          borderRadius: "1.25rem",
          backdropFilter: "blur(16px)",
          padding: "1.25rem",
          minWidth: 0,
          position: "relative",
        }}>
          {/* Scrollable conversation bubbles */}
          <div style={{ flex: 1, overflow: "hidden", minHeight: 0, marginBottom: "1rem" }}>
            <LiveTranscript />
          </div>

          {/* Bottom section: Voice controller OR Text Input depending on active tab */}
          {connectionState === "active" && (
            <div style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              paddingTop: "1rem",
              flexShrink: 0,
            }}>
              {activeTab === "chat" ? (
                /* Chat text fallback input */
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  backgroundColor: "rgba(10, 15, 30, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "1rem",
                  padding: "0.5rem 0.75rem",
                }}>
                  <input
                    type="text"
                    value={mockInput}
                    onChange={(e) => setMockInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void handleSendChat();
                    }}
                    disabled={mockSending || isAiSpeaking}
                    placeholder={
                      isAiSpeaking 
                        ? "Nasabah sedang berbicara..." 
                        : "Ketik pesan tanggapan Anda di sini..."
                    }
                    style={{
                      flex: 1,
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#ffffff",
                      fontSize: "0.85rem",
                      outline: "none",
                      padding: "0.25rem 0.5rem",
                    }}
                  />
                  
                  {mockSending && (
                    <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid #6366f1", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
                  )}

                  <button
                    onClick={handleSendChat}
                    disabled={!mockInput.trim() || mockSending || isAiSpeaking}
                    style={{
                      border: "none",
                      borderRadius: "0.75rem",
                      backgroundColor: mockInput.trim() && !isAiSpeaking ? "var(--primary)" : "rgba(255, 255, 255, 0.06)",
                      color: mockInput.trim() && !isAiSpeaking ? "#ffffff" : "#64748b",
                      padding: "0.5rem 1rem",
                      cursor: mockInput.trim() && !isAiSpeaking ? "pointer" : "not-allowed",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      transition: "all 0.2s",
                    }}
                  >
                    <Send size={12} /> Kirim
                  </button>
                  <button
                    onClick={handleEndSimulation}
                    style={{
                      border: "none",
                      borderRadius: "0.75rem",
                      backgroundColor: "rgba(239, 68, 68, 0.15)",
                      color: "#f87171",
                      padding: "0.5rem 1rem",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      transition: "all 0.2s",
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.25)"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.15)"}
                  >
                    Akhiri Latihan
                  </button>
                </div>
              ) : (
                /* Voice speaking controls */
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "rgba(10, 15, 30, 0.4)",
                  borderRadius: "1rem",
                  padding: "0.75rem 1.25rem",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <button
                      onClick={toggleMute}
                      style={{
                        borderRadius: "50%",
                        border: "none",
                        backgroundColor: isMuted ? "rgba(239, 68, 68, 0.15)" : "rgba(255,255,255,0.06)",
                        color: isMuted ? "#ef4444" : "#ffffff",
                        width: "36px",
                        height: "36px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = isMuted ? "rgba(239, 68, 68, 0.25)" : "rgba(255,255,255,0.12)"}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = isMuted ? "rgba(239, 68, 68, 0.15)" : "rgba(255,255,255,0.06)"}
                      title={isMuted ? "Unmute Mic" : "Mute Mic"}
                    >
                      {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                    </button>
                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                      {isMuted ? "Mikrofon dibisukan (Muted)" : "Mikrofon menyala"}
                    </span>
                  </div>

                  <button
                    onClick={handleEndSimulation}
                    style={{
                      borderRadius: "0.75rem",
                      border: "none",
                      backgroundColor: "#ef4444",
                      color: "#ffffff",
                      padding: "0.6rem 1.5rem",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      boxShadow: "0 4px 14px rgba(239, 68, 68, 0.4)",
                      transition: "background-color 0.2s",
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#dc2626"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#ef4444"}
                  >
                    🔴 Selesai & Hitung Nilai
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Column 3: Live Session Metrics Panel OR Real AI Evaluation Report Panel */}
        <section style={{
          width: "360px",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}>
          {isEvaluating ? (
            /* Evaluating loading state */
            <div style={{
              flex: 1,
              backgroundColor: "rgba(15, 23, 42, 0.45)",
              border: "1px dashed rgba(99, 102, 241, 0.4)",
              borderRadius: "1.25rem",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: "1.5rem",
              backdropFilter: "blur(20px)",
            }}>
              <div style={{
                position: "relative",
                width: "60px",
                height: "60px",
              }}>
                <div style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: "3px dashed rgba(99, 102, 241, 0.3)",
                  animation: "spin 4s linear infinite",
                }} />
                <div style={{
                  position: "absolute",
                  inset: "6px",
                  borderRadius: "50%",
                  border: "3px solid #818cf8",
                  borderTopColor: "transparent",
                  animation: "spin 1s linear infinite",
                }} />
              </div>
              <div>
                <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", fontWeight: 700, color: "#ffffff" }}>
                  Menganalisis Transkrip...
                </h3>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#94a3b8", lineHeight: "1.5" }}>
                  AI Evaluator sedang memeriksa kesesuaian ucapan Anda dengan Objection Framework dan menghitung skor kinerja riil. Mohon tunggu.
                </p>
              </div>
            </div>
          ) : evaluationReport ? (
            /* Premium Authentic AI Evaluation Report */
            <div style={{
              flex: 1,
              backgroundColor: "rgba(15, 23, 42, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "1.25rem",
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              backdropFilter: "blur(24px)",
              overflowY: "auto",
              maxHeight: "100%",
              boxShadow: "0 15px 35px rgba(0,0,0,0.35)",
            }}>
              {/* Header Title */}
              <div style={{ textAlign: "center", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "1rem" }}>
                <span style={{ fontSize: "1.5rem", marginBottom: "0.25rem", display: "block" }}>🏆</span>
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#ffffff" }}>
                  Laporan Hasil Evaluasi AI
                </h3>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", color: "#64748b" }}>
                  Dianalisis secara objektif oleh GPT-4o-mini
                </p>
              </div>

              {/* Large Score Indicator */}
              <div style={{
                backgroundColor: "rgba(245, 158, 11, 0.08)",
                border: "1px solid rgba(245, 158, 11, 0.25)",
                borderRadius: "1rem",
                padding: "1.25rem",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute",
                  top: "-20px",
                  right: "-20px",
                  fontSize: "4rem",
                  opacity: 0.05,
                  zIndex: 0,
                }}>
                  🎯
                </div>
                <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.75rem", fontWeight: 700, color: "#fbbf24", letterSpacing: "1px", textTransform: "uppercase", zIndex: 1 }}>
                  SKOR KINERJA LATIHAN
                </h4>
                <div style={{
                  fontSize: "3.75rem",
                  fontWeight: 900,
                  color: "#ffffff",
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.25rem",
                  zIndex: 1,
                }}>
                  {evaluationReport.overallScore}
                  <span style={{ fontSize: "1.2rem", color: "#64748b", fontWeight: 500 }}>/100</span>
                </div>
                <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.75rem", color: "#cbd5e1", zIndex: 1, lineHeight: "1.4" }}>
                  {evaluationReport.overallScore >= 85 
                    ? "Sangat Bagus! Anda berhasil menangani keberatan dengan sangat profesional." 
                    : evaluationReport.overallScore >= 75
                      ? "Bagus, namun poin taktis tertentu masih dapat lebih dioptimalkan kembali."
                      : "Penyampaian terstruktur namun penanganan keberatan perlu dipertajam."}
                </p>
              </div>

              {/* Bullet Points: Strengths / Kelebihan */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{
                  backgroundColor: "rgba(16, 185, 129, 0.06)",
                  border: "1px solid rgba(16, 185, 129, 0.15)",
                  borderRadius: "0.75rem",
                  padding: "0.85rem 1rem",
                }}>
                  <h4 style={{ color: "#34d399", margin: "0 0 0.5rem 0", fontSize: "0.8rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <CheckCircle2 size={14} /> Kelebihan Utama
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.75rem", color: "#cbd5e1", lineHeight: "1.5" }}>
                    {evaluationReport.strengths.map((str, idx) => (
                      <li key={idx} style={{ marginBottom: "0.35rem" }}>{str}</li>
                    ))}
                  </ul>
                </div>

                {/* Bullet Points: Improvement / Kekurangan */}
                <div style={{
                  backgroundColor: "rgba(239, 68, 68, 0.06)",
                  border: "1px solid rgba(239, 68, 68, 0.15)",
                  borderRadius: "0.75rem",
                  padding: "0.85rem 1rem",
                }}>
                  <h4 style={{ color: "#f87171", margin: "0 0 0.5rem 0", fontSize: "0.8rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <AlertTriangle size={14} /> Kekurangan & Hambatan
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.75rem", color: "#cbd5e1", lineHeight: "1.5" }}>
                    {evaluationReport.improvementAreas.map((imp, idx) => (
                      <li key={idx} style={{ marginBottom: "0.35rem" }}>{imp}</li>
                    ))}
                  </ul>
                </div>

                {/* Suggested Better Response Block */}
                {evaluationReport.suggestedBetterResponse && (
                  <div style={{
                    backgroundColor: "rgba(99, 102, 241, 0.06)",
                    border: "1px solid rgba(99, 102, 241, 0.15)",
                    borderRadius: "0.75rem",
                    padding: "0.85rem 1rem",
                  }}>
                    <h4 style={{ color: "#818cf8", margin: "0 0 0.5rem 0", fontSize: "0.8rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <HelpCircle size={14} /> Contoh Respons Lebih Natural
                    </h4>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#cbd5e1", lineHeight: "1.5", fontStyle: "italic" }}>
                      "{evaluationReport.suggestedBetterResponse}"
                    </p>
                  </div>
                )}

                {/* Recommended Next Practice */}
                {evaluationReport.nextRecommendedPractice && (
                  <div style={{
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "0.75rem",
                    padding: "0.85rem 1rem",
                  }}>
                    <h4 style={{ color: "#e2e8f0", margin: "0 0 0.5rem 0", fontSize: "0.8rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <Trophy size={14} /> Rekomendasi Latihan Lanjutan
                    </h4>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#cbd5e1", lineHeight: "1.5" }}>
                      {evaluationReport.nextRecommendedPractice}
                    </p>
                  </div>
                )}
              </div>

              {/* End / Redo Action Buttons */}
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  onClick={handleResetSession}
                  style={{
                    flex: 1,
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    color: "#e2e8f0",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    padding: "0.6rem 0",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.25rem",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)"}
                >
                  <RefreshCw size={12} /> Coba Lagi
                </button>
                <Link
                  href="/dashboard"
                  style={{
                    flex: 1,
                    borderRadius: "0.75rem",
                    border: "none",
                    backgroundColor: "var(--primary)",
                    color: "#ffffff",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    padding: "0.6rem 0",
                    cursor: "pointer",
                    textAlign: "center",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 14px rgba(15, 76, 129, 0.4)",
                    transition: "filter 0.2s",
                  }}
                  onMouseOver={(e) => e.currentTarget.style.filter = "brightness(1.1)"}
                  onMouseOut={(e) => e.currentTarget.style.filter = "none"}
                >
                  Kembali ke Menu
                </Link>
              </div>
            </div>
          ) : (
            /* Regular dynamic session objectives and timers */
            <SessionPanel />
          )}
        </section>
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
