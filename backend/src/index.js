import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

app.get("/experiences", async (req, res) => {
  try {
    const experiences = await prisma.experience.findMany();
    res.json(experiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    res.status(500).json({ error: "Failed to fetch experiences" });
  }
});
app.get("/experiences/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const experience = await prisma.experience.findUnique({
      where: { id },
    });
    if (!experience) {
      return res.status(404).json({ error: "Experience not found" });
    }
    res.json(experience);
  } catch (error) {
    console.error("Error fetching experience:", error);
    res.status(500).json({ error: "Failed to fetch experience" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

app.post("/bookings", async (req, res) => {
  try {
    const { experienceId, userName, userEmail } = req.body;

    if (!experienceId || !userName || !userEmail) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const booking = await prisma.booking.create({
      data: {
        experienceId: Number(experienceId),
        userName,
        userEmail,
      },
      include: {
        experience: true,
      },
    });

    res.json({ message: "Booking successful", booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

