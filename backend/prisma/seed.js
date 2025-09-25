import { PrismaClient, PermissionType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // --- Création des utilisateurs ---
  const passwordHash123456 = await bcrypt.hash("123456", 10);
  const passwordHashAdmin = await bcrypt.hash("admin123", 10);
  const passwordHashUser = await bcrypt.hash("user123", 10);

  // Test accounts
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: passwordHashAdmin,
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      name: "Regular User",
      email: "user@example.com",
      password: passwordHashUser,
    },
  });

  const user1 = await prisma.user.create({
    data: {
      name: "oumu Ndiaye",
      email: "oumy@example.com",
      password: passwordHash123456,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "mamam Marra",
      email: "maman@example.com",
      password: passwordHash123456,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: "momo Mbow",
      email: "momo@example.com",
      password: passwordHash123456,
    },
  });

  // --- Création des tâches ---
  const task1 = await prisma.taskFadil.create({
    data: {
      nameFadil: "Tâche 1",
      descriptionFadil: "Description de la tâche 1",
      status: "EN_COURS",
      userId: user1.id, // propriétaire
    },
  });

  const task2 = await prisma.taskFadil.create({
    data: {
      nameFadil: "Tâche 2",
      descriptionFadil: "Description de la tâche 2",
      status: "TERMINEE",
      userId: user2.id, // propriétaire
    },
  });

  const task3 = await prisma.taskFadil.create({
    data: {
      nameFadil: "Tâche 3 sans utilisateur",
      descriptionFadil: "Celle-ci n'a pas encore d'utilisateur",
      status: "EN_COURS",
    },
  });

  // --- Attribution de permissions ---
await prisma.permission.createMany({
  data: [
    {
      userId: user2.id,
      taskId: task1.id,
      type: PermissionType.LIRE,
    },
    {
      userId: user3.id,
      taskId: task1.id,
      type: PermissionType.MODIFIER,
    },
    {
      userId: user3.id,
      taskId: task2.id,
      type: PermissionType.SUPPRIMER,
    },
    {
      userId: user1.id,
      taskId: task2.id,
      type: PermissionType.LIRE,
    },
  ],
});


  console.log("✅ Données seedées avec succès !");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Erreur lors du seeding :", e);
    await prisma.$disconnect();
    process.exit(1);
  });
