const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.booking.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.promo.deleteMany();

  const exp1 = await prisma.experience.create({
    data: {
      title: 'Sunset Kayaking',
      slug: 'sunset-kayak',
      description: 'Enjoy an unforgettable kayaking experience during sunset.',
      priceCents: 2000,
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
    }
  });

  const exp2 = await prisma.experience.create({
    data: {
      title: 'Mountain Trekking',
      slug: 'mountain-trek',
      description: 'Challenge yourself with scenic mountain treks.',
      priceCents: 3500,
      imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'
    }
  });

  await prisma.slot.createMany({
    data: [
      {
        experienceId: exp1.id,
        slotDate: new Date(),
        startTime: '17:00',
        capacity: 6
      },
      {
        experienceId: exp1.id,
        slotDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        startTime: '18:00',
        capacity: 8
      },
      {
        experienceId: exp2.id,
        slotDate: new Date(),
        startTime: '08:00',
        capacity: 10
      }
    ]
  });

  await prisma.promo.createMany({
    data: [
      { code: 'SAVE10', type: 'percent', value: 10 },
      { code: 'FLAT100', type: 'flat', value: 100 }
    ]
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
