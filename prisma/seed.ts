import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@ownwebify.com" },
    update: {
      referralCode: "ABHI-ADMN",
      emailVerified: true,
    },
    create: {
      email: "admin@ownwebify.com",
      name: "Abhi",
      passwordHash: adminPassword,
      role: "ADMIN",
      emailVerified: true,
      referralCode: "ABHI-ADMN",
    },
  });

  console.log("Seed completed successfully!");
  console.log("Admin: admin@ownwebify.com");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
