const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const main = async () => {
  const genSalt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash("password", genSalt);

  // Create Admin
  const users = [
    {
      name: "Admin Behome",
      address: "Kantor Behome",
      phone: "081234567890",
      email: "admin@behome.com",
      password: hashPassword,
      role: "admin",
    },
    {
      name: "Psikolog Behome",
      address: "Kantor Behome",
      phone: "081234567890",
      email: "psikolog@behome.com",
      password: hashPassword,
      role: "psikolog",
    },
    {
      name: "User Behome",
      address: "Rumah",
      phone: "081234567890",
      email: "user@behome.com",
      password: hashPassword,
      role: "user",
    },
  ];

  const user = await prisma.users.createMany({
    data: users,
  });

  if (user) {
    console.log(`User created ! ✅`);
  }

  const psikolog = [
    {
      name: "Isa Anugrah, S.Psi",
      skill: "Inner Child, Toxic Family",
      virtual_account_payment: "+62 892 4705 5454",
      user_id: 2,
    },
  ];

  const psikologUser = await prisma.psikolog.createMany({
    data: psikolog,
  });

  if (psikologUser) {
    console.log(`Psikolog created ! ✅`);
  }

  const psikologSchedules1 = [
    {
      time: "7:30",
      is_selected: false,
      psikolog_id: 1,
    },
    {
      time: "8:30",
      is_selected: false,
      psikolog_id: 1,
    },
    {
      time: "9:30",
      is_selected: false,
      psikolog_id: 1,
    },
    {
      time: "10:30",
      is_selected: false,
      psikolog_id: 1,
    },
    {
      time: "11:30",
      is_selected: false,
      psikolog_id: 1,
    },
    {
      time: "12:30",
      is_selected: false,
      psikolog_id: 1,
    },
    {
      time: "13:30",
      is_selected: false,
      psikolog_id: 1,
    },
    {
      time: "14:20",
      is_selected: true,
      psikolog_id: 1,
    },
    {
      time: "15:30",
      is_selected: false,
      psikolog_id: 1,
    },
    {
      time: "16:20",
      is_selected: true,
      psikolog_id: 1,
    },
    {
      time: "17:20",
      is_selected: true,
      psikolog_id: 1,
    },
    {
      time: "19:20",
      is_selected: true,
      psikolog_id: 1,
    },
  ];

  const psikologSchedule1 = await prisma.psikolog_schedules.createMany({
    data: psikologSchedules1,
  });

  if (psikologSchedule1) {
    console.log(`Psikolog Schedule 1 created ! ✅`);
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
