import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const username = "admin";
  const password = "password123"; // Plain text for now as per previous logic
  
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    console.log(`User ${username} already exists.`);
    return;
  }

  const user = await prisma.user.create({
    data: {
      username,
      password,
      role: "Admin",
      fullName: "System Administrator",
      email: "admin@alms.com",
      isActive: true,
    },
  });

  console.log(`Test user created: ${user.username} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
