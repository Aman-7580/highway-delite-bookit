const express = require('express');

module.exports = (prisma) => {
  const router = express.Router();

  router.post('/', async (req, res) => {
    const { experienceId, slotId, customerName, customerEmail, seats, promoCode } = req.body;

    if (!experienceId || !slotId || !customerName || !customerEmail || !seats) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const booking = await prisma.$transaction(async (tx) => {
        const slot = await tx.slot.findUnique({ where: { id: slotId } });
        if (!slot) throw new Error('Slot not found');

        const booked = await tx.booking.aggregate({
          where: { slotId },
          _sum: { seats: true },
        });

        const totalBooked = booked._sum.seats || 0;
        if (totalBooked + seats > slot.capacity) {
          throw new Error('Not enough seats available');
        }

        const exp = await tx.experience.findUnique({ where: { id: experienceId } });
        let amount = exp.priceCents * seats;

        if (promoCode) {
          const promo = await tx.promo.findUnique({ where: { code: promoCode } });
          if (promo) {
            if (promo.type === 'percent') {
              amount = Math.round(amount * (100 - promo.value) / 100);
            } else if (promo.type === 'flat') {
              amount = Math.max(0, amount - promo.value);
            }
          }
        }

        const newBooking = await tx.booking.create({
          data: {
            experienceId,
            slotId,
            customerName,
            customerEmail,
            seats,
            amountCents: amount,
            promoCode,
          },
        });

        return newBooking;
      });

      res.json({ success: true, booking });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message || 'Booking failed' });
    }
  });

  return router;
};
