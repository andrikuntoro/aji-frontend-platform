"use client";

import React from "react";
import { useRealtimeStore } from "@/stores/realtime-store";
import { REALTIME_STAGE_META } from "@/lib/realtime/session-orchestrator";

export function SessionPanel() {
  const {
    config,
    currentStage,
    objectionHistory,
    trustLevel,
    elapsedSeconds,
    connectionState,
  } = useRealtimeStore();

  const stageMeta = REALTIME_STAGE_META[currentStage] ?? REALTIME_STAGE_META["opening"];
  const stageLabel = stageMeta.labelId || stageMeta.label;

  const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, "0");
  const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");

  const allStages = Object.values(REALTIME_STAGE_META).sort((a, b) => a.order - b.order);
  const currentOrder = stageMeta.order;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      height: "100%",
    }}>
      {/* Skenario Info */}
      {config && (
        <div style={{
          borderRadius: "0.75rem",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          backgroundColor: "rgba(15, 23, 42, 0.4)",
          padding: "0.75rem",
        }}>
          <p style={{
            margin: "0 0 0.25rem 0",
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "rgba(147, 197, 253, 0.6)",
            fontWeight: 600,
          }}>
            SKENARIO
          </p>
          <p style={{
            margin: 0,
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#ffffff",
          }}>{config.scenarioTitle}</p>
          <p style={{
            margin: "0.25rem 0 0 0",
            fontSize: "0.75rem",
            color: "rgba(226, 232, 240, 0.8)",
            lineHeight: "1.3",
          }}>{config.scenarioObjective}</p>
        </div>
      )}

      {/* Tahap Percakapan (Stages pipeline) */}
      <div style={{
        borderRadius: "0.75rem",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        backgroundColor: "rgba(15, 23, 42, 0.4)",
        padding: "0.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}>
        <p style={{
          margin: 0,
          fontSize: "0.7rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "rgba(147, 197, 253, 0.6)",
          fontWeight: 600,
        }}>
          TAHAPAN ROLEPLAY
        </p>
        <div>
          <span style={{
            display: "inline-block",
            borderRadius: "999px",
            backgroundColor: "rgba(56, 189, 248, 0.15)",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            padding: "0.15rem 0.5rem",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#38bdf8",
          }}>
            {stageLabel}
          </span>
        </div>

        {/* Stage pipe dots */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          paddingTop: "0.25rem",
        }}>
          {allStages.map((s, i) => {
            const completed = i < currentOrder;
            const active = i === currentOrder;
            return (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div
                  style={{
                    height: "8px",
                    width: "8px",
                    borderRadius: "50%",
                    backgroundColor: completed ? "#38bdf8" : active ? "#38bdf8" : "rgba(255, 255, 255, 0.15)",
                    boxShadow: active ? "0 0 10px #38bdf8" : "none",
                    transform: active ? "scale(1.2)" : "scale(1)",
                    transition: "all 0.3s ease",
                  }}
                  title={s.labelId}
                />
                {i < allStages.length - 1 && (
                  <div
                    style={{
                      height: "1px",
                      width: "12px",
                      backgroundColor: completed ? "rgba(56, 189, 248, 0.5)" : "rgba(255, 255, 255, 0.1)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust level (Kepercayaan) */}
      <div style={{
        borderRadius: "0.75rem",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        backgroundColor: "rgba(15, 23, 42, 0.4)",
        padding: "0.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.35rem",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "between",
          width: "100%",
        }}>
          <p style={{
            margin: 0,
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "rgba(147, 197, 253, 0.6)",
            fontWeight: 600,
            flex: 1,
          }}>
            TINGKAT KEPERCAYAAN
          </p>
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#ffffff" }}>
            {trustLevel}%
          </span>
        </div>
        <div style={{
          height: "6px",
          width: "100%",
          borderRadius: "999px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          overflow: "hidden",
        }}>
          <div
            style={{
              height: "100%",
              borderRadius: "999px",
              width: `${trustLevel}%`,
              backgroundColor: trustLevel >= 70 ? "#10b981" : trustLevel >= 45 ? "#f59e0b" : "#ef4444",
              boxShadow: trustLevel >= 70 ? "0 0 10px rgba(16, 185, 129, 0.5)" : "none",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        </div>
      </div>

      {/* Keberatan / Objections list */}
      <div style={{
        borderRadius: "0.75rem",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        backgroundColor: "rgba(15, 23, 42, 0.4)",
        padding: "0.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.35rem",
        flex: 1,
      }}>
        <p style={{
          margin: 0,
          fontSize: "0.7rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "rgba(147, 197, 253, 0.6)",
          fontWeight: 600,
        }}>
          KEBERATAN YANG MUNCUL
        </p>
        {objectionHistory.length === 0 ? (
          <p style={{
            margin: "0.25rem 0 0 0",
            fontSize: "0.75rem",
            color: "rgba(147, 197, 253, 0.3)",
            fontStyle: "italic",
          }}>
            Belum ada keberatan terdeteksi...
          </p>
        ) : (
          <ul style={{
            margin: "0.25rem 0 0 0",
            padding: 0,
            listStyleType: "none",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}>
            {objectionHistory.map((obj, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.25rem",
                  fontSize: "0.75rem",
                  color: "#fcd34d",
                }}
              >
                <span style={{ color: "#fbbf24" }}>⚠</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Timer + connection state */}
      <div style={{
        borderRadius: "0.75rem",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        backgroundColor: "rgba(15, 23, 42, 0.4)",
        padding: "0.6rem 0.75rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              height: "8px",
              width: "8px",
              borderRadius: "50%",
              backgroundColor: connectionState === "active" ? "#10b981" : "#64748b",
              animation: connectionState === "active" ? "statusPulse 1s infinite" : "none",
            }}
          />
          <span style={{ fontSize: "0.75rem", color: "rgba(226, 232, 240, 0.8)", fontWeight: 500 }}>
            {connectionState === "connecting" ? "Menghubungkan..."
              : connectionState === "active" ? "Terhubung"
              : connectionState === "ending" ? "Mengakhiri..."
              : connectionState === "ended" ? "Selesai"
              : connectionState === "error" ? "Eror Koneksi"
              : "Siap"}
          </span>
        </div>
        <span style={{
          fontFamily: "monospace",
          fontSize: "0.85rem",
          fontWeight: "bold",
          color: "#ffffff",
        }}>
          {minutes}:{seconds}
        </span>
      </div>

      <style>{`
        @keyframes statusPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.9); }
        }
      `}</style>
    </div>
  );
}
