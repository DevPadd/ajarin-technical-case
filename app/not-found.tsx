import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <h1>404 - Page not found</h1>
      <Link
        href="/dashboard"
        className="border rounded-lg bg-black text-white w-fit p-2 font-bold"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
