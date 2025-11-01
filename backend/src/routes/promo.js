const express = require('express');

module.exports = (prisma) => {
  const router = express.Router();

  router.post('/validate', async (req, res) => {
    try {
      const { code } = req.body;
      if (!code) return res.status(400).json({ valid: false, message: 'Promo code is required' });

      const promo = await prisma.promo.findUnique({ where: { code } });
      if (!promo) return res.json({ valid: false, message: 'Invalid promo code' });

      if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
        return res.json({ valid: false, message: 'Promo expired' });
      }

      res.json({
        valid: true,
        type: promo.type,
        value: promo.value,
        message: 'Promo code applied successfully!',
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ valid: false, message: 'Promo validation failed' });
    }
  });

  return router;
};
