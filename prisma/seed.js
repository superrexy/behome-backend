const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const main = async () => {
    //   Check Database
    const checkAdmin = await prisma.users.findFirst({
        where: { email: "admin1@behome.com" },
    });

    if (!checkAdmin) {
        const genSalt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash("password", genSalt);

        // Create Admin
        const admin = [
            {
                name: "Admin Behome 1",
                address: "Kantor Behome",
                phone: "081234567890",
                email: "admin1@behome.com",
                password: hashPassword,
                role: "psikolog",
            },
            {
                name: "Admin Behome 2",
                address: "Kantor Behome",
                phone: "081234567890",
                email: "admin2@behome.com",
                password: hashPassword,
                role: "psikolog",
            },
            {
                name: "Admin Behome 3",
                address: "Kantor Behome",
                phone: "081234567890",
                email: "admin3@behome.com",
                password: hashPassword,
                role: "psikolog",
            },
        ];

        const adminUser = await prisma.users.createMany({
            data: admin,
        });

        if (adminUser) {
            console.log(`Admin created ! ✅`);
        }

        const psikolog = [
            {
                name: "Isa Anugrah, S.Psi",
                skill: "Inner Child, Toxic Family",
                virtual_account_payment: "+62 892 4705 5454",
                user_id: 1,
            },
            {
                name: "Dr. Nalini Muhdi, SpKJ",
                skill: "Psihoterapi, Psikologi Klinis",
                virtual_account_payment: "+62 888 1234 9999",
                user_id: 2,
            },
            {
                name: "Dr. Soetjipto, SpKJ",
                skill: "Psikologi Klinis",
                virtual_account_payment: "+62 821 4567 6666",
                user_id: 3,
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

        const psikologSchedules2 = [
            {
                time: "7:30",
                is_selected: false,
                psikolog_id: 2,
            },
            {
                time: "8:30",
                is_selected: false,
                psikolog_id: 2,
            },
            {
                time: "9:30",
                is_selected: false,
                psikolog_id: 2,
            },
            {
                time: "10:30",
                is_selected: false,
                psikolog_id: 2,
            },
            {
                time: "11:30",
                is_selected: false,
                psikolog_id: 2,
            },
            {
                time: "12:30",
                is_selected: false,
                psikolog_id: 2,
            },
            {
                time: "13:30",
                is_selected: false,
                psikolog_id: 2,
            },
            {
                time: "14:20",
                is_selected: true,
                psikolog_id: 2,
            },
            {
                time: "15:30",
                is_selected: false,
                psikolog_id: 2,
            },
            {
                time: "16:20",
                is_selected: true,
                psikolog_id: 2,
            },
            {
                time: "17:20",
                is_selected: true,
                psikolog_id: 2,
            },
            {
                time: "19:20",
                is_selected: true,
                psikolog_id: 2,
            },
        ];

        const psikologSchedules3 = [
            {
                time: "7:30",
                is_selected: false,
                psikolog_id: 3,
            },
            {
                time: "8:30",
                is_selected: false,
                psikolog_id: 3,
            },
            {
                time: "9:30",
                is_selected: false,
                psikolog_id: 3,
            },
            {
                time: "10:30",
                is_selected: false,
                psikolog_id: 3,
            },
            {
                time: "11:30",
                is_selected: false,
                psikolog_id: 3,
            },
            {
                time: "12:30",
                is_selected: false,
                psikolog_id: 3,
            },
            {
                time: "13:30",
                is_selected: false,
                psikolog_id: 3,
            },
            {
                time: "14:20",
                is_selected: true,
                psikolog_id: 3,
            },
            {
                time: "15:30",
                is_selected: false,
                psikolog_id: 3,
            },
            {
                time: "16:20",
                is_selected: true,
                psikolog_id: 3,
            },
            {
                time: "17:20",
                is_selected: true,
                psikolog_id: 3,
            },
            {
                time: "19:20",
                is_selected: true,
                psikolog_id: 3,
            },
        ];

        const psikologSchedule1 = await prisma.psikolog_schedules.createMany({
            data: psikologSchedules1,
        });

        if (psikologSchedule1) {
            console.log(`Psikolog Schedule 1 created ! ✅`);
        }

        const psikologSchedule2 = await prisma.psikolog_schedules.createMany({
            data: psikologSchedules2,
        });

        if (psikologSchedule2) {
            console.log(`Psikolog Schedule 2 created ! ✅`);
        }

        const psikologSchedule3 = await prisma.psikolog_schedules.createMany({
            data: psikologSchedules3,
        });

        if (psikologSchedule3) {
            console.log(`Psikolog Schedule 3 created ! ✅`);
        }
    }

    if (process.env.NODE_ENV === "development") {
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
