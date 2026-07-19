import Link from "next/link";

export default function Home() {
  return (
    <Link
      href="/dashboard"
      className="border rounded-lg bg-black text-white w-fit p-2 font-bold"
    >
      Go to Dashboard
    </Link>
  );
}
