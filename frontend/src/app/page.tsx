"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../lib/api";

export default function Home() {
  const [experiences, setExperiences] = useState<any[]>([]);

  useEffect(() => {
    api.get("/experiences")
      .then((res) => setExperiences(res.data))
      .catch((err) => console.error("Error fetching experiences:", err));
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Experiences</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiences.length === 0 ? (
          <p className="text-center text-gray-600">Loading experiences...</p>
        ) : (
          experiences.map((exp) => (
            <div
              key={exp.id}
              className="border rounded-xl p-4 shadow hover:shadow-lg transition"
            >
              <img
                src={exp.imageUrl}
                alt={exp.title}
                className="h-48 w-full object-cover rounded-lg mb-3"
              />
              <h2 className="text-xl font-semibold">{exp.title}</h2>
              <p className="text-sm text-gray-600">{exp.description}</p>
              <p className="mt-2 font-bold">₹{(exp.priceCents / 100).toFixed(2)}</p>
              <Link
                href={`/experiences/${exp.id}`}
                className="text-blue-600 mt-2 inline-block"
              >
                View Details →
              </Link>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
