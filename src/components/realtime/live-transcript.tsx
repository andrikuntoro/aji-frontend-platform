"use client";

import React, { useEffect, useRef } from "react";
import { useRealtimeStore } from "@/stores/realtime-store";
import { REALTIME_STAGE_META } from "@/lib/realtime/session-orchestrator";

export function LiveTranscript() {
  const { transcript, streamingAiText, isAiSpeaking } = useRealtimeStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of transcripts
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript, streamingAiText]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      minHeight: "0px",
    }}>
      <p style={{
        marginBottom: "0.5rem",
        fontSize: "0.75rem",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "rgba(147, 197, 253, 0.6)",
        fontWeight: 600,
        flexShrink: 0,
      }}>
        Transkrip Langsung
      </p>

      <div style={{
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        paddingRight: "0.25rem",
      }}>
        {transcript.length === 0 && !streamingAiText && (
          <p style={{
            fontSize: "0.75rem",
            color: "rgba(191, 219, 254, 0.3)",
            fontStyle: "italic",
            textAlign: "center",
            marginTop: "2rem",
          }}>
            Percakapan akan muncul di sini...
          </p>
        )}

        {transcript.map((entry) => {
          const isAI = entry.role === "ai_client";
          const stageLabel = REALTIME_STAGE_META[entry.stage]?.labelId || "Pembukaan";

          return (
            <div
              key={entry.id}
              style={{
                display: "flex",
                gap: "0.5rem",
                flexDirection: isAI ? "row" : "row-reverse",
              }}
            >
              {/* Role avatar dot */}
              <div
                style={{
                  marginTop: "0.25rem",
                  height: "1.5rem",
                  width: "1.5rem",
                  flexShrink: 0,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  backgroundColor: isAI ? "#334155" : "var(--primary)",
                  color: isAI ? "#93c5fd" : "#ffffff",
                }}
              >
                {isAI ? "NS" : "AG"}
              </div>

              <div
                style={{
                  maxWidth: "85%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isAI ? "flex-start" : "flex-end",
                  gap: "0.25rem",
                }}
              >
                {/* Stage label (tiny text overlay) */}
                {stageLabel && (
                  <span style={{ fontSize: "9px", color: "rgba(147, 197, 253, 0.4)", padding: "0 0.25rem" }}>
                    {stageLabel}
                  </span>
                )}

                {/* Message bubble */}
                <div
                  style={{
                    borderRadius: "1rem",
                    padding: "0.5rem 0.75rem",
                    fontSize: "0.85rem",
                    lineHeight: "1.4",
                    backgroundColor: isAI ? "rgba(30, 41, 59, 0.8)" : "rgba(15, 76, 129, 0.2)",
                    border: isAI ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(15, 76, 129, 0.3)",
                    color: isAI ? "#f8fafc" : "#e2e8f0",
                    borderTopLeftRadius: isAI ? "0px" : "1rem",
                    borderTopRightRadius: isAI ? "1rem" : "0px",
                  }}
                >
                  {entry.text}
                </div>
              </div>
            </div>
          );
        })}

        {/* Streaming AI response */}
        {streamingAiText && (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <div style={{
              marginTop: "0.25rem",
              height: "1.5rem",
              width: "1.5rem",
              flexShrink: 0,
              borderRadius: "50%",
              backgroundColor: "#334155",
              color: "#93c5fd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.7rem",
              fontWeight: "bold",
            }}>
              NS
            </div>
            <div style={{ maxWidth: "85%" }}>
              <div style={{
                borderRadius: "1rem",
                borderTopLeftRadius: "0px",
                backgroundColor: "rgba(30, 41, 59, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                padding: "0.5rem 0.75rem",
                fontSize: "0.85rem",
                color: "#f8fafc",
                lineHeight: "1.4",
              }}>
                {streamingAiText}
                <span style={{
                  display: "inline-block",
                  width: "2px",
                  height: "0.85rem",
                  backgroundColor: "#38bdf8",
                  marginLeft: "2px",
                  verticalAlign: "middle",
                  animation: "streamPulse 1s infinite",
                }} />
              </div>
            </div>
          </div>
        )}

        {/* AI thinking / speaking visual indicator */}
        {isAiSpeaking && !streamingAiText && (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <div style={{
              marginTop: "0.25rem",
              height: "1.5rem",
              width: "1.5rem",
              flexShrink: 0,
              borderRadius: "50%",
              backgroundColor: "#334155",
              color: "#93c5fd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.7rem",
              fontWeight: "bold",
            }}>
              NS
            </div>
            <div style={{
              borderRadius: "1rem",
              borderTopLeftRadius: "0px",
              backgroundColor: "rgba(30, 41, 59, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              padding: "0.6rem 0.9rem",
              display: "flex",
              alignItems: "center",
            }}>
              <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#38bdf8", animation: "streamBounce 1.4s infinite", animationDelay: "0ms" }} />
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#38bdf8", animation: "streamBounce 1.4s infinite", animationDelay: "150ms" }} />
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#38bdf8", animation: "streamBounce 1.4s infinite", animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <style>{`
        @keyframes streamPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes streamBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
