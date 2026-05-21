// Simple LocalStorage wrapper to mock a backend database for the demo

export type ModuleStatus = "locked" | "in-progress" | "completed";

export interface ModuleProgress {
  id: string;
  score: number | null;
  status: ModuleStatus;
  progress: number;
}

export interface UserProgressData {
  modules: Record<string, ModuleProgress>;
  lastUpdated: number;
}

const DEFAULT_DATA: UserProgressData = {
  modules: {
    "dasar-asuransi": { id: "dasar-asuransi", score: null, status: "in-progress", progress: 0 },
    "handling-objection": { id: "handling-objection", score: null, status: "locked", progress: 0 },
    "roleplay-premi": { id: "roleplay-premi", score: null, status: "locked", progress: 0 },
  },
  lastUpdated: Date.now()
};

export const getProgressData = (): UserProgressData => {
  if (typeof window === "undefined") return DEFAULT_DATA;
  const stored = localStorage.getItem("agent_training_progress");
  if (stored) {
    try {
      return JSON.parse(stored) as UserProgressData;
    } catch {
      return DEFAULT_DATA;
    }
  }
  return DEFAULT_DATA;
};

export const saveModuleScore = (moduleId: string, score: number) => {
  if (typeof window === "undefined") return;
  
  const data = getProgressData();
  
  // Updating specific module
  data.modules[moduleId] = {
    id: moduleId,
    score: score,
    status: "completed",
    progress: 100
  };

  // Logic to unlock the next levels sequentially
  if (moduleId === "dasar-asuransi") {
    data.modules["handling-objection"] = { ...data.modules["handling-objection"], status: "in-progress", id: "handling-objection", score: data.modules["handling-objection"]?.score || null, progress: data.modules["handling-objection"]?.progress || 0 };
  } else if (moduleId === "handling-objection") {
    data.modules["roleplay-premi"] = { ...data.modules["roleplay-premi"], status: "in-progress", id: "roleplay-premi", score: data.modules["roleplay-premi"]?.score || null, progress: data.modules["roleplay-premi"]?.progress || 0 };
  }

  data.lastUpdated = Date.now();
  localStorage.setItem("agent_training_progress", JSON.stringify(data));
};

export const getModuleStatus = (moduleId: string): ModuleProgress => {
  const data = getProgressData();
  return data.modules[moduleId] || { id: moduleId, score: null, status: "locked", progress: 0 };
};
