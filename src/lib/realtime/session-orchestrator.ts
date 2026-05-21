import { RealtimeStage, RealtimeStageMeta } from "@/types/domain";

export const REALTIME_STAGE_META: Record<RealtimeStage, RealtimeStageMeta> = {
  opening: {
    label: "Opening",
    labelId: "Pembukaan",
    description: "Initial contact. Trainee introduces themselves.",
    order: 0,
  },
  rapport_building: {
    label: "Rapport Building",
    labelId: "Membangun Kedekatan",
    description: "Building trust and establishing common ground.",
    order: 1,
  },
  needs_exploration: {
    label: "Needs Exploration",
    labelId: "Eksplorasi Kebutuhan",
    description: "Uncovering client goals, priorities, and concerns.",
    order: 2,
  },
  objection_triggered: {
    label: "Objection Raised",
    labelId: "Keberatan Muncul",
    description: "Client raised a specific objection.",
    order: 3,
  },
  objection_handling: {
    label: "Handling Objection",
    labelId: "Menangani Keberatan",
    description: "Trainee actively addressing the objection.",
    order: 4,
  },
  value_reframe: {
    label: "Value Reframe",
    labelId: "Reframing Nilai",
    description: "Reframing product value around client's priorities.",
    order: 5,
  },
  closing: {
    label: "Closing",
    labelId: "Penutupan",
    description: "Moving toward commitment or appointment.",
    order: 6,
  },
  completed: {
    label: "Completed",
    labelId: "Selesai",
    description: "Session concluded.",
    order: 7,
  },
};

const STAGE_SIGNALS: Record<RealtimeStage, string[]> = {
  opening: [],
  rapport_building: ["keluarga", "bisnis", "latar belakang", "cerita", "background"],
  needs_exploration: ["kebutuhan", "prioritas", "rencana", "tujuan", "khawatir", "masa depan"],
  objection_triggered: [
    "sibuk", "tidak tertarik", "sudah punya", "mahal", "nanti", "pikir-pikir",
    "tidak perlu", "tidak butuh", "kirim dulu",
  ],
  objection_handling: ["saya mengerti", "justru", "bayangkan", "sebenarnya", "faktanya"],
  value_reframe: ["manfaatnya", "nilainya", "investasi", "proteksi", "coverage", "relevan"],
  closing: ["kapan kita bisa", "jadwal", "pertemuan", "deal", "setuju", "konfirmasi"],
  completed: ["terima kasih", "sampai jumpa", "sesi selesai", "session ended"],
};

export function detectStageFromText(text: string, current: RealtimeStage): RealtimeStage {
  const lower = text.toLowerCase();

  // Check completed first
  if (STAGE_SIGNALS.completed.some((s) => lower.includes(s))) return "completed";

  const stages: RealtimeStage[] = [
    "opening", "rapport_building", "needs_exploration",
    "objection_triggered", "objection_handling",
    "value_reframe", "closing", "completed",
  ];

  const currentIdx = stages.indexOf(current);

  // Check objection can be triggered from any stage
  if (STAGE_SIGNALS.objection_triggered.some((s) => lower.includes(s))) {
    return "objection_triggered";
  }

  // Try to advance stage
  for (let i = currentIdx + 1; i < stages.length; i++) {
    const stage = stages[i];
    if (stage === "objection_triggered") continue;
    const signals = STAGE_SIGNALS[stage];
    if (signals.length > 0 && signals.some((s) => lower.includes(s))) {
      return stage;
    }
  }

  return current;
}
