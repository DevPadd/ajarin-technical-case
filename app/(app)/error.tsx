"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
      <h2 className="text-lg font-semibold text-zinc-700">
        Terjadi kesalahan
      </h2>
      <p className="text-sm text-zinc-500 text-center max-w-md">
        {error.message}
      </p>
      <button
        type="button"
        onClick={reset}
        className="px-4 py-2 rounded-md text-sm font-medium bg-orange-400 text-white hover:bg-orange-500 transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  );
}
