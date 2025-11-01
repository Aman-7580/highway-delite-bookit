"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-3xl font-bold mb-4">🎉 Booking Confirmed!</h1>
      <p className="text-lg mb-6">
        Thank you for booking <strong>{title || "your experience"}</strong>!
      </p>
      <Link
        href="/"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Back to Home
      </Link>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<p className="text-center p-6">Loading...</p>}>
      <ConfirmationContent />
    </Suspense>
  );
}
