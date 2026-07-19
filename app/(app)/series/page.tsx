"use client";

import { ChevronDown, Search, UserPlus, Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useGamification } from "@/components/streak-provider";

const SUBJECT_LABELS: Record<string, string> = {
  all: "Semua Mapel",
  matematika: "Matematika",
  kimia: "Kimia",
  fisika: "Fisika",
  biologi: "Biologi",
  "bahasa-indonesia": "Bahasa Indonesia",
  "bahasa-inggris": "Bahasa Inggris",
  sejarah: "Sejarah",
  ekonomi: "Ekonomi",
};

const SUBJECT_KEYS = Object.keys(SUBJECT_LABELS);

const selectClassName =
  "appearance-none w-full bg-white border border-zinc-200 rounded-md pl-3 pr-9 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 cursor-pointer";

const SAMPLE_SERIES = [
  {
    id: "kimia-redoks",
    title: "Kimia - Reaksi Redoks",
    subject: "kimia" as const,
    description:
      "Pelajari konsep dasar reaksi reduksi-oksidasi, mulai dari penentuan bilangan oksidasi hingga penerapan dalam kehidupan sehari-hari.",
    sessionCount: 6,
    participants: 24,
    nextSessionAt: "2026-07-22",
  },
];

export default function SeriesPage() {
  const { completeTask, isHydrated } = useGamification();
  const [joined, setJoined] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [subjectFilter, setSubjectFilter] = useState("all");

  const filtered = SAMPLE_SERIES.filter((s) => {
    const matchesSearch =
      searchQuery === "" ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      subjectFilter === "all" || s.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  function handleJoin() {
    setJoined(true);
    if (isHydrated) {
      const result = completeTask("join-series", 30);
      if (result.expGained > 0) {
        toast.success(`+${result.expGained} XP — Bergabung dengan series!`, {
          duration: 2500,
        });
      }
    }
  }

  return (
    <div className="flex-1 flex flex-col gap-6 px-4 md:px-10 lg:px-20 py-6 md:py-10">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Cari Series
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Temukan series yang sesuai dengan minat dan kebutuhan belajarmu di
          sini.
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <div className="relative w-full">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="search"
            placeholder="Cari series..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative w-full sm:w-56">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={selectClassName}
              aria-label="Urutkan series"
            >
              <option value="newest">Series Terbaru</option>
              <option value="nearest">Series Terdekat</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-zinc-600 shrink-0">Filter:</span>
            <div className="relative w-full sm:w-56">
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className={selectClassName}
                aria-label="Filter mata pelajaran"
              >
                {SUBJECT_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {SUBJECT_LABELS[key]}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-sm text-zinc-400 py-12">
            Series tidak ditemukan
          </div>
        )}
        {filtered.map((series) => (
          <article
            key={series.id}
            className="relative border border-zinc-200 rounded-lg bg-white p-5 hover:border-orange-300 hover:shadow-sm transition flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="inline-block text-xs font-medium text-orange-500 bg-orange-100 rounded-full px-2 py-0.5">
                {SUBJECT_LABELS[series.subject]}
              </span>
              <span className="text-xs text-zinc-500">
                {series.participants} peserta
              </span>
            </div>

            <div>
              <h2 className="font-semibold text-zinc-800 text-lg">
                {series.title}
              </h2>
              <p className="mt-1 text-sm text-zinc-600">{series.description}</p>
            </div>

            <div className="text-xs text-zinc-500">
              {series.sessionCount} sesi · Sesi berikutnya{" "}
              {series.nextSessionAt}
            </div>

            <div className="mt-auto pt-2">
              <button
                type="button"
                onClick={handleJoin}
                disabled={joined}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  joined
                    ? "bg-zinc-100 text-zinc-500 cursor-default"
                    : "bg-orange-400 text-white hover:bg-orange-500"
                }`}
              >
                {joined ? (
                  <>
                    <Check size={16} />
                    Sudah Terdaftar
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Ikuti Series
                  </>
                )}
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
