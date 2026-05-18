"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

export interface TryOnJob {
  jobId: string;
  productSlug: string;
  productName: string;
  productImage: string;
  selfiePreview: string | null;
  bodyPreview: string;
  status: "processing" | "completed" | "failed";
  outputUrl?: string;
  timestamp: number;
  background?: string;
}

interface TryOnContextValue {
  jobs: TryOnJob[];
  addJob: (job: Omit<TryOnJob, "status" | "outputUrl">) => void;
  clearJobs: () => void;
  freshCompletions: TryOnJob[];
  dismissCompletion: (jobId: string) => void;
  avatar: string | null;
  setAvatar: (dataUrl: string) => void;
  clearAvatar: () => void;
}

const TryOnContext = createContext<TryOnContextValue | null>(null);
const STORAGE_KEY = "sarambi_tryon_v1";
const AVATAR_KEY = "sarambi_avatar_v1";

export function TryOnProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<TryOnJob[]>([]);
  const [freshCompletions, setFreshCompletions] = useState<TryOnJob[]>([]);
  const [avatar, setAvatarState] = useState<string | null>(null);
  const jobsRef = useRef<TryOnJob[]>([]);
  jobsRef.current = jobs;

  // Hydrate jobs from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: TryOnJob[] = JSON.parse(raw);
        const cutoff = Date.now() - 24 * 60 * 60 * 1000;
        const cleaned = parsed
          .filter((j) => j.timestamp > cutoff)
          .map((j) => (j.status === "processing" ? { ...j, status: "failed" as const } : j));
        setJobs(cleaned);
      }
    } catch { /* ignore */ }
  }, []);

  // Hydrate avatar from sessionStorage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(AVATAR_KEY);
      if (stored) setAvatarState(stored);
    } catch { /* ignore */ }
  }, []);

  // Persist jobs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    } catch { /* ignore */ }
  }, [jobs]);

  // Continuous polling for processing jobs
  useEffect(() => {
    const interval = setInterval(async () => {
      const processing = jobsRef.current.filter((j) => j.status === "processing");
      if (!processing.length) return;

      await Promise.all(
        processing.map(async (job) => {
          try {
            const res = await fetch(`/api/tryon/poll/${job.jobId}`);
            const data: { status: string; outputUrl?: string } = await res.json();

            if (data.status === "completed" && data.outputUrl) {
              const updated: TryOnJob = { ...job, status: "completed", outputUrl: data.outputUrl };
              setJobs((prev) => prev.map((j) => (j.jobId === job.jobId ? updated : j)));
              setFreshCompletions((prev) => [...prev, updated]);
            } else if (data.status === "failed") {
              setJobs((prev) =>
                prev.map((j) => (j.jobId === job.jobId ? { ...j, status: "failed" } : j))
              );
            }
          } catch { /* ignore */ }
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const addJob = useCallback((job: Omit<TryOnJob, "status" | "outputUrl">) => {
    setJobs((prev) => [{ ...job, status: "processing" }, ...prev]);
  }, []);

  const clearJobs = useCallback(() => {
    setJobs([]);
    setFreshCompletions([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const dismissCompletion = useCallback((jobId: string) => {
    setFreshCompletions((prev) => prev.filter((j) => j.jobId !== jobId));
  }, []);

  const setAvatar = useCallback((dataUrl: string) => {
    setAvatarState(dataUrl);
    try { sessionStorage.setItem(AVATAR_KEY, dataUrl); } catch { /* ignore */ }
  }, []);

  const clearAvatar = useCallback(() => {
    setAvatarState(null);
    try { sessionStorage.removeItem(AVATAR_KEY); } catch { /* ignore */ }
  }, []);

  return (
    <TryOnContext.Provider value={{ jobs, addJob, clearJobs, freshCompletions, dismissCompletion, avatar, setAvatar, clearAvatar }}>
      {children}
    </TryOnContext.Provider>
  );
}

export function useTryOn() {
  const ctx = useContext(TryOnContext);
  if (!ctx) throw new Error("useTryOn must be used within TryOnProvider");
  return ctx;
}
