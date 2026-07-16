import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create a dummy Flock
  const flock1 = await prisma.flock.create({
    data: {
      name: "Broiler Batch A - Sector North",
      hatchDate: new Date(new Date().setDate(new Date().getDate() - 14)), // 14 days ago
      targetWeight: 2.5,
      status: "ACTIVE",
      userId: "user_dummy_123"
    }
  });

  // 2. Create Tasks for that Flock
  await prisma.task.createMany({
    data: [
      {
        title: "Administer NDV Vaccine",
        description: "Standard Newcastle Disease vaccine protocol at Day 14.",
        dueDate: new Date(),
        isCompleted: false,
        flockId: flock1.id
      },
      {
        title: "Switch to Finisher Feed",
        description: "Increase protein ratio according to Day 15 target.",
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        isCompleted: false,
        flockId: flock1.id
      }
    ]
  });

  // 3. Create Commodity Prices (Bapanas Simulation)
  await prisma.commodityPrice.createMany({
    data: [
      { commodity: "CORN", pricePerKg: 5400, region: "Jawa Timur" },
      { commodity: "SOYBEAN", pricePerKg: 12500, region: "Jawa Timur" },
      { commodity: "RICE_BRAN", pricePerKg: 3200, region: "Jawa Timur" }
    ]
  });

  // 4. Create some Financial Transactions
  await prisma.transaction.createMany({
    data: [
      { type: "EXPENSE", category: "FEED", amount: 1500000, description: "Purchased 300kg Corn", userId: "user_dummy_123" },
      { type: "EXPENSE", category: "VACCINE", amount: 250000, description: "NDV Vaccine for Batch A", userId: "user_dummy_123" }
    ]
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
