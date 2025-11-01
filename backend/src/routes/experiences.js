const express = require("express");

module.exports = (prisma) => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const experiences = await prisma.experience.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          priceCents: true,
          imageUrl: true,
        },
      });
      res.json(experiences);
    } catch (err) {
      console.error("❌ Error fetching experiences:", err);
      res.status(500).json({ error: "Failed to fetch experiences" });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const experience = await prisma.experience.findUnique({
        where: { id },
        include: { slots: true },
      });
      if (!experience)
        return res.status(404).json({ error: "Experience not found" });
      res.json(experience);
    } catch (err) {
      console.error("❌ Error fetching experience:", err);
      res.status(500).json({ error: "Failed to fetch experience" });
    }
  });

  return router;
};
