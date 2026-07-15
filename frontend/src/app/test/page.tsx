import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/* eslint-disable react/no-unescaped-entities */
export default function TestPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-black text-slate-800 mb-6">
        🎉 Transition Successful!
      </h1>
      <p className="text-slate-600 mb-8 max-w-md">
        You have successfully navigated through the "Fly-Through" Splash Screen!
        Notice how the logo shrank down, the page changed, and then the logo expanded again perfectly.
      </p>
      <Link href="/">
        <button className="bg-forest text-white px-8 py-4 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
          <ArrowLeft size={20} strokeWidth={3} /> Go Back Home
        </button>
      </Link>
    </div>
  );
}
