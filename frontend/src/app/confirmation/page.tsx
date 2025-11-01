"use client";
import { useSearchParams, useRouter } from "next/navigation";

export default function ConfirmationPage() {
  const router = useRouter();
  const params = useSearchParams();
  const title = params.get("title");

  return (
    <main className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold mb-4">🎉 Booking Confirmed!</h1>
      <p className="text-lg mb-6">
        Thank you for booking <strong>{title}</strong>!
      </p>
      <button
        onClick={() => router.push("/")}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Back to Home
      </button>
    </main>
  );
}
