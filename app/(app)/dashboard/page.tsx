"use client";

import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import PetCard from "@/components/pet-card";
import { useGamification } from "@/components/streak-provider";

export default function DashboardPage() {
  const { completeTask, isTaskDoneToday, isHydrated } = useGamification();
  const loginTriggered = useRef(false);

  useEffect(() => {
    if (!isHydrated || loginTriggered.current) return;
    loginTriggered.current = true;

    if (!isTaskDoneToday("daily-login")) {
      const result = completeTask("daily-login", 10);
      if (result.expGained > 0) {
        toast.success(`+${result.expGained} XP — Login harian!`, {
          duration: 2500,
        });
      }
    }
  }, [isHydrated, completeTask, isTaskDoneToday]);

  return (
    <div className="flex-1 flex flex-col gap-4 px-4 md:px-10 lg:px-20 py-6 md:py-10">
      <section className="flex gap-4 items-center">
        <div className="p-6 rounded-full bg-zinc-200 w-fit">
          <span className="text-xl">DN</span>
        </div>
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">
            Halo, Dio V!
          </h1>
          <span className="bg-orange-200 text-orange-400 font-bold p-1 rounded-md text-xs">
            Siswa
          </span>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div
            className="relative w-full h-fit bg-orange-400 p-6 border border-zinc-200 rounded-lg overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: "url('/decoration.webp')" }}
          >
            <div className="absolute inset-0 bg-white/60" aria-hidden="true" />
            <div className="relative h-full flex flex-col gap-8 ">
              <div>
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-zinc-800">
                  Jadi Tutor, Bantu Teman-Temanmu Belajar!
                </h2>
                <p>
                  Daftar menjadi tutor, bantu teman-temanmu belajar dengan lebih
                  baik, dan dapatkan benefit menarik!
                </p>
              </div>

              <button className="px-4 py-2 bg-black w-fit text-white text-sm font-bold rounded-md transition-colors">
                Pelajari Lebih Lanjut
              </button>
            </div>
          </div>
        </div>

        <PetCard />
      </section>

      <section className="flex-col flex gap-4 lg:flex-row">
        <div className="flex flex-col lg:grow">
          <h1 className="text-xl font-bold mb-4">Sesi Selanjutnya</h1>
          <div className="w-full h-fit rounded-lg py-15 px-5 border-zinc-200 border-2 text-center">
            <span className="text-zinc-400 font-medium">
              Tidak ada sesi yang akan datang
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-xl font-bold mb-4">Series yang Diikuti</h1>
          <div className="w-full h-fit rounded-lg py-15 px-5 border-zinc-200 border-2 text-center">
            <span className="text-zinc-400 font-medium">
              Belum terdaftar di series apapun
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
