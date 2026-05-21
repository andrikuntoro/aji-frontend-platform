"use client";

import React, { useMemo } from "react";
import { EmotionState, RealtimeConnectionState } from "@/types/domain";

interface AudioVisualizerProps {
  emotion: EmotionState;
  isAiSpeaking: boolean;
  isUserSpeaking: boolean;
  connectionState: RealtimeConnectionState;
  personaName?: string;
  personaAge?: number;
  personaOccupation?: string;
}

// Map emotions to beautiful premium HSL gradient colors and emojis
const EMOTION_THEMES: Record<
  EmotionState,
  {
    gradient: string;
    glow: string;
    emoji: string;
    label: string;
  }
> = {
  neutral: {
    gradient: "linear-gradient(135deg, #475569 0%, #1e293b 100%)",
    glow: "rgba(100, 116, 139, 0.4)",
    emoji: "😐",
    label: "Netral",
  },
  interested: {
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)",
    glow: "rgba(14, 165, 233, 0.5)",
    emoji: "👀",
    label: "Tertarik",
  },
  skeptical: {
    gradient: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
    glow: "rgba(245, 158, 11, 0.5)",
    emoji: "🤔",
    label: "Skeptis",
  },
  frustrated: {
    gradient: "linear-gradient(135deg, #f43f5e 0%, #be123c 100%)",
    glow: "rgba(244, 63, 94, 0.5)",
    emoji: "😤",
    label: "Frustrasi",
  },
  open: {
    gradient: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
    glow: "rgba(16, 185, 129, 0.5)",
    emoji: "👍",
    label: "Terbuka",
  },
  thinking: {
    gradient: "linear-gradient(135deg, #a855f7 0%, #6b21a8 100%)",
    glow: "rgba(168, 85, 247, 0.5)",
    emoji: "💭",
    label: "Berpikir",
  },
};

export function AudioVisualizer({
  emotion,
  isAiSpeaking,
  isUserSpeaking,
  connectionState,
  personaName = "Tsing Lu",
  personaAge = 50,
  personaOccupation = "Pengusaha",
}: AudioVisualizerProps) {
  const isConnecting = connectionState === "connecting";
  const isEnded = connectionState === "ended" || connectionState === "ending";
  const isError = connectionState === "error";

  const theme = useMemo(() => {
    return EMOTION_THEMES[emotion] || EMOTION_THEMES.neutral;
  }, [emotion]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      minHeight: "340px",
      position: "relative",
      padding: "2rem",
      backgroundColor: "rgba(10, 15, 30, 0.6)",
      borderRadius: "1rem",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      backdropFilter: "blur(20px)",
      overflow: "hidden",
      boxShadow: "inset 0 0 20px rgba(255, 255, 255, 0.02)",
    }}>
      {/* Dynamic Background Glow representing AI presence */}
      <div style={{
        position: "absolute",
        width: "250px",
        height: "250px",
        borderRadius: "50%",
        background: theme.glow,
        filter: "blur(80px)",
        opacity: isAiSpeaking ? 0.8 : 0.4,
        transform: isAiSpeaking ? "scale(1.2)" : "scale(1.0)",
        transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
        zIndex: 0,
        pointerEvents: "none",
      }} />

      {/* Main Interactive Orb Framework */}
      <div style={{
        position: "relative",
        width: "180px",
        height: "180px",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Trainee Speaking Indicator Ring (Green glow outward) */}
        {isUserSpeaking && !isEnded && (
          <div style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: "2px solid #10b981",
            boxShadow: "0 0 25px rgba(16, 185, 129, 0.4)",
            animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
          }} />
        )}

        {/* AI Speaking Pulse Waves (Dynamic layered halos) */}
        {isAiSpeaking && !isEnded && (
          <>
            <div style={{
              position: "absolute",
              width: "115%",
              height: "115%",
              borderRadius: "50%",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: `0 0 30px ${theme.glow}`,
              animation: "pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }} />
            <div style={{
              position: "absolute",
              width: "135%",
              height: "135%",
              borderRadius: "50%",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              boxShadow: `0 0 45px ${theme.glow}`,
              animation: "pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              animationDelay: "0.4s",
            }} />
          </>
        )}

        {/* The Spherical Glowing Orb */}
        <div style={{
          position: "relative",
          width: "140px",
          height: "140px",
          borderRadius: "50%",
          background: theme.gradient,
          boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.5), 0 0 40px ${theme.glow}, inset 0 8px 16px rgba(255, 255, 255, 0.2), inset 0 -8px 16px rgba(0, 0, 0, 0.4)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          animation: isAiSpeaking ? "bounce 2s infinite" : "float 4s ease-in-out infinite",
          cursor: "pointer",
          overflow: "hidden",
        }}>
          {/* Glass Gloss highlight overlay */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%)",
            borderRadius: "140px 140px 0 0",
            pointerEvents: "none",
          }} />

          {/* Center Emoji / Content */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.25rem",
            transform: "translateY(-2px)",
          }}>
            <span style={{
              fontSize: "2.5rem",
              filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))",
              animation: isAiSpeaking ? "wiggle 0.5s ease-in-out infinite" : "none",
            }}>
              {isConnecting ? "⏳" : isError ? "⚠️" : isEnded ? "👋" : theme.emoji}
            </span>
          </div>

          {/* Connection Overlay */}
          {isConnecting && (
            <div style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <div style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                border: "2px solid #38bdf8",
                borderTopColor: "transparent",
                animation: "spin 0.8s linear infinite",
              }} />
            </div>
          )}

          {/* Ended Overlay */}
          {isEnded && (
            <div style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(10, 15, 30, 0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600 }}>SESI SELESAI</span>
            </div>
          )}
        </div>

        {/* Subtitle Badge overlay: Speaking... / Mendengarkan... */}
        {!isEnded && connectionState === "active" && (
          <div style={{
            position: "absolute",
            bottom: "-12px",
            zIndex: 10,
            whiteSpace: "nowrap",
          }}>
            {isAiSpeaking ? (
              <span style={{
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                borderRadius: "999px",
                backgroundColor: "rgba(14, 165, 233, 0.15)",
                border: "1px solid rgba(14, 165, 233, 0.3)",
                padding: "0.25rem 0.75rem",
                fontSize: "0.75rem",
                color: "#38bdf8",
                fontWeight: 600,
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}>
                <span style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#38bdf8",
                  animation: "ping 1s infinite",
                }} />
                Berbicara...
              </span>
            ) : isUserSpeaking ? (
              <span style={{
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                borderRadius: "999px",
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                padding: "0.25rem 0.75rem",
                fontSize: "0.75rem",
                color: "#34d399",
                fontWeight: 600,
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}>
                <span style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#34d399",
                  animation: "ping 1s infinite",
                }} />
                Mendengarkan Anda...
              </span>
            ) : (
              <span style={{
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                borderRadius: "999px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                padding: "0.25rem 0.75rem",
                fontSize: "0.75rem",
                color: "#94a3b8",
                fontWeight: 500,
                backdropFilter: "blur(8px)",
              }}>
                Menunggu respon...
              </span>
            )}
          </div>
        )}
      </div>

      {/* Trainee Details */}
      <div style={{
        marginTop: "2.25rem",
        textAlign: "center",
        zIndex: 1,
      }}>
        <h4 style={{
          margin: 0,
          fontSize: "1.2rem",
          fontWeight: 600,
          color: "#ffffff",
          letterSpacing: "0.5px",
        }}>
          {personaName}
        </h4>
        <p style={{
          margin: "0.25rem 0 0 0",
          fontSize: "0.85rem",
          color: "#94a3b8",
        }}>
          {personaOccupation} &middot; {personaAge} Tahun
        </p>

        {/* Emotion Display badge */}
        {!isEnded && connectionState === "active" && (
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            marginTop: "0.75rem",
            padding: "0.2rem 0.6rem",
            borderRadius: "0.5rem",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            fontSize: "0.75rem",
            color: "#cbd5e1",
          }}>
            <span>Status Emosi:</span>
            <span style={{ fontWeight: 600, color: "#f8fafc" }}>
              {theme.label} {theme.emoji}
            </span>
          </div>
        )}
      </div>

      {/* Inject custom CSS keyframes globally to handle the glowing visual effects */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.08); opacity: 0.3; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-12px) scale(1.03); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
