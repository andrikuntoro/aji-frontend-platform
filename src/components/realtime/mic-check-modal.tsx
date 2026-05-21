/**
 * MicCheckModal — Microphone permission check in the frontend.
 *
 * Shown automatically before every realtime roleplay session starts.
 * Tests mic access, displays device info, and guides the user to fix
 * any permission or hardware issues before the session begins.
 */
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

type MicStatus =
  | "idle"        // not yet tested
  | "requesting"  // waiting for browser permission prompt
  | "granted"     // permission OK, mic working
  | "denied"      // permission denied by user
  | "unavailable" // no mic hardware found
  | "error";      // unknown error

interface MicCheckModalProps {
  /** Called when user confirms mic is ready and wants to proceed */
  onConfirm: () => void;
  /** Called when user cancels / goes back */
  onCancel: () => void;
}

export function MicCheckModal({ onConfirm, onCancel }: MicCheckModalProps) {
  const [status, setStatus] = useState<MicStatus>("idle");
  const [deviceLabel, setDeviceLabel] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);          // 0–100 live mic level
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // ── Clean up audio resources on unmount ──────────────────
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const stopAudio = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    analyserRef.current = null;
    setVolume(0);
  };

  // ── Request mic and run volume analyser ──────────────────
  const testMic = useCallback(async () => {
    setStatus("requesting");
    setErrorDetail(null);
    stopAudio();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      // Get device label
      const track = stream.getAudioTracks()[0];
      setDeviceLabel(track?.label || null);

      // Set up analyser for live volume meter
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArr = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        if (!analyserRef.current) return;
        analyser.getByteFrequencyData(dataArr);
        const avg = dataArr.reduce((a, b) => a + b, 0) / dataArr.length;
        setVolume(Math.min(100, Math.round((avg / 255) * 100 * 2.5)));
        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();

      setStatus("granted");
    } catch (err: unknown) {
      const name = err instanceof Error ? err.name : "Unknown";
      const msg  = err instanceof Error ? err.message : String(err);

      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setStatus("denied");
      } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        setStatus("unavailable");
      } else {
        setStatus("error");
        setErrorDetail(msg);
      }
    }
  }, []);

  // Auto-test on mount
  useEffect(() => {
    void testMic();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Confirm: keep stream open, parent will use it ────────
  const handleConfirm = () => {
    stopAudio();
    onConfirm();
  };

  // ── Status-specific content ───────────────────────────────
  const statusIcon: Record<MicStatus, string> = {
    idle:        "🎙️",
    requesting:  "⏳",
    granted:     "✅",
    denied:      "🚫",
    unavailable: "🔌",
    error:       "⚠️",
  };

  const statusColor: Record<MicStatus, string> = {
    idle:        "#cbd5e1",
    requesting:  "#93c5fd",
    granted:     "#34d399",
    denied:      "#f43f5e",
    unavailable: "#fbbf24",
    error:       "#f43f5e",
  };

  const statusTitle: Record<MicStatus, string> = {
    idle:        "Memeriksa Mikrofon...",
    requesting:  "Meminta Izin Akses Mikrofon",
    granted:     "Mikrofon Siap",
    denied:      "Akses Mikrofon Ditolak",
    unavailable: "Mikrofon Tidak Ditemukan",
    error:       "Gagal Mengakses Mikrofon",
  };

  const isReady = status === "granted";
  const isBlocked = status === "denied" || status === "unavailable" || status === "error";

  return (
    /* Backdrop overlay */
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(4px)",
    }}>
      {/* Modal card */}
      <div style={{
        width: "100%",
        maxWidth: "420px",
        borderRadius: "1rem",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        backgroundColor: "#0f172a",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "1.25rem 1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}>
          <span style={{ fontSize: "1.5rem" }}>🎙️</span>
          <div>
            <p style={{
              margin: 0,
              fontSize: "0.65rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "rgba(147, 197, 253, 0.7)",
              fontWeight: 600,
            }}>
              PERSIAPAN SIMULASI
            </p>
            <h2 style={{
              margin: 0,
              fontSize: "1rem",
              fontWeight: 600,
              color: "#ffffff",
            }}>
              Pemeriksaan Mikrofon
            </h2>
          </div>
        </div>

        {/* Content body */}
        <div style={{
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}>
          {/* Status Box */}
          <div style={{
            borderRadius: "0.75rem",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            backgroundColor: "rgba(30, 41, 59, 0.5)",
            padding: "1rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem",
          }}>
            <span style={{ fontSize: "1.75rem", flexShrink: 0 }}>{statusIcon[status]}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                margin: 0,
                fontWeight: 600,
                color: statusColor[status],
                fontSize: "0.9rem",
              }}>
                {statusTitle[status]}
              </p>
              {status === "requesting" && (
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", color: "rgba(226, 232, 240, 0.7)", lineHeight: "1.4" }}>
                  Browser akan memunculkan pilihan izin mikrofon — silakan klik <b>Izinkan</b> untuk melanjutkan simulasi.
                </p>
              )}
              {status === "granted" && deviceLabel && (
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", color: "#a7f3d0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  Perangkat: <span style={{ fontFamily: "monospace" }}>{deviceLabel}</span>
                </p>
              )}
              {status === "granted" && !deviceLabel && (
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", color: "#a7f3d0" }}>
                  Perangkat mikrofon Anda berhasil tersambung.
                </p>
              )}
              {status === "denied" && (
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", color: "#fca5a5", lineHeight: "1.4" }}>
                  Akses diblokir. Silakan buka Pengaturan Browser Anda &rarr; Cari 'Mikrofon' &rarr; Pilih 'Izinkan' untuk situs ini.
                </p>
              )}
              {status === "unavailable" && (
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", color: "#fde047", lineHeight: "1.4" }}>
                  Tidak ada mikrofon terdeteksi. Silakan sambungkan mic eksternal atau headset Anda.
                </p>
              )}
              {status === "error" && errorDetail && (
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", color: "#fca5a5", fontFamily: "monospace", wordBreak: "break-all" }}>
                  Detail: {errorDetail}
                </p>
              )}
            </div>
          </div>

          {/* Live volume level meter */}
          {status === "granted" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#94a3b8" }}>
                  Level Suara (silakan berbicara untuk tes)
                </p>
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontFamily: "monospace" }}>{volume}%</span>
              </div>
              <div style={{
                height: "10px",
                width: "100%",
                borderRadius: "999px",
                backgroundColor: "rgba(51, 65, 85, 0.6)",
                overflow: "hidden",
              }}>
                <div
                  style={{
                    height: "100%",
                    borderRadius: "999px",
                    width: `${volume}%`,
                    transition: "all 0.08s ease",
                    background:
                      volume > 60
                        ? "linear-gradient(90deg, #10b981, #34d399)"
                        : volume > 20
                        ? "linear-gradient(90deg, #3b82f6, #60a5fa)"
                        : "linear-gradient(90deg, #475569, #64748b)",
                  }}
                />
              </div>
              <p style={{ margin: 0, fontSize: "0.7rem", color: "#64748b" }}>
                {volume === 0
                  ? "Tidak ada suara terdeteksi — pastikan mic tidak di-mute secara hardware."
                  : volume < 10
                  ? "Sinyal suara sangat lemah — coba bicara lebih dekat ke mikrofon."
                  : "Suara terdeteksi dengan baik ✓"}
              </p>
            </div>
          )}

          {/* Tips for blocked permissions */}
          {status === "denied" && (
            <div style={{
              borderRadius: "0.75rem",
              border: "1px solid rgba(244, 63, 94, 0.2)",
              backgroundColor: "rgba(244, 63, 94, 0.05)",
              padding: "0.75rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.35rem",
            }}>
              <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 600, color: "#fca5a5" }}>
                Langkah mengaktifkan kembali mikrofon:
              </p>
              <ol style={{
                margin: 0,
                paddingLeft: "1.25rem",
                fontSize: "0.75rem",
                color: "rgba(252, 165, 165, 0.8)",
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}>
                <li>Klik ikon gembok 🔒 di sebelah kiri URL address bar.</li>
                <li>Aktifkan saklar atau ganti status 'Mikrofon' menjadi 'Izinkan' / 'Allow'.</li>
                <li>Muat ulang (Refresh) halaman browser ini lalu coba lagi.</li>
              </ol>
            </div>
          )}

          {/* Info notice */}
          {!isBlocked && (
            <div style={{
              borderRadius: "0.75rem",
              border: "1px solid rgba(147, 197, 253, 0.15)",
              backgroundColor: "rgba(14, 165, 233, 0.05)",
              padding: "0.75rem",
              display: "flex",
              gap: "0.5rem",
            }}>
              <span style={{ color: "#38bdf8", fontSize: "0.85rem", flexShrink: 0 }}>ℹ️</span>
              <p style={{ margin: 0, fontSize: "0.7rem", color: "rgba(147, 197, 253, 0.8)", lineHeight: "1.3" }}>
                Akses mikrofon hanya aktif selama simulasi suara berjalan. Browser akan langsung melepas koneksi audio saat Anda menekan tombol "Akhiri".
              </p>
            </div>
          )}
        </div>

        {/* Buttons footer */}
        <div style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "1rem 1.5rem",
          display: "flex",
          gap: "0.75rem",
        }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              borderRadius: "0.75rem",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              color: "#cbd5e1",
              fontSize: "0.85rem",
              fontWeight: 500,
              padding: "0.6rem 0",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)"}
          >
            &larr; Batal
          </button>

          {isBlocked ? (
            <button
              onClick={() => void testMic()}
              style={{
                flex: 1,
                borderRadius: "0.75rem",
                border: "1px solid rgba(14, 165, 233, 0.3)",
                backgroundColor: "rgba(14, 165, 233, 0.15)",
                color: "#38bdf8",
                fontSize: "0.85rem",
                fontWeight: 600,
                padding: "0.6rem 0",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(14, 165, 233, 0.25)"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(14, 165, 233, 0.15)"}
            >
              🔄 Tes Ulang
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={!isReady}
              style={{
                flex: 1,
                borderRadius: "0.75rem",
                border: "none",
                backgroundColor: isReady ? "var(--primary)" : "rgba(255, 255, 255, 0.15)",
                color: isReady ? "#ffffff" : "rgba(255, 255, 255, 0.4)",
                fontSize: "0.85rem",
                fontWeight: 600,
                padding: "0.6rem 0",
                cursor: isReady ? "pointer" : "not-allowed",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.25rem",
                boxShadow: isReady ? "0 4px 14px rgba(15, 76, 129, 0.4)" : "none",
              }}
              onMouseOver={(e) => {
                if (isReady) e.currentTarget.style.filter = "brightness(1.15)";
              }}
              onMouseOut={(e) => {
                if (isReady) e.currentTarget.style.filter = "none";
              }}
            >
              {status === "requesting" ? "Menghubungkan..." : "Mulai Simulasi 🎙️"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
