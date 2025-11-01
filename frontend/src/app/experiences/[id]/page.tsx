"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

export default function ExperienceDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [experience, setExperience] = useState<any>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/experiences/${id}`)
      .then((res) => setExperience(res.data))
      .catch((err) => console.error("Error fetching experience:", err));
  }, [id]);

  const handleBooking = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/bookings", {
        experienceId: Number(id),
        userName,
        userEmail,
      });

      router.push(`/confirmation?title=${encodeURIComponent(experience.title)}`);
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!experience)
    return <p className="p-6 text-center text-gray-400">Loading...</p>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <img
        src={experience.imageUrl}
        alt={experience.title}
        className="w-full h-72 object-cover rounded-xl mb-6 shadow"
      />
      <h1 className="text-3xl font-bold mb-2">{experience.title}</h1>
      <p className="text-gray-300 mb-4">{experience.description}</p>
      <p className="text-xl font-semibold mb-4">
        ₹{(experience.priceCents / 100).toFixed(2)}
      </p>

      <form onSubmit={handleBooking} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-2 border rounded text-black"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full p-2 border rounded text-black"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Booking..." : "Book Now"}
        </button>
      </form>
    </main>
  );
}
