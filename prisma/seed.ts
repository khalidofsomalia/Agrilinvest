import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create farmer user
  const farmer = await prisma.user.upsert({
    where: { email: "farmer@investoir.com" },
    update: {},
    create: {
      name: "Ahmed Hassan",
      email: "farmer@investoir.com",
      password: await bcrypt.hash("password123", 10),
      role: "FARMER",
      balance: 50000,
    },
  });

  // Create investor user
  const investor = await prisma.user.upsert({
    where: { email: "investor@investoir.com" },
    update: {},
    create: {
      name: "Sarah Johnson",
      email: "investor@investoir.com",
      password: await bcrypt.hash("password123", 10),
      role: "INVESTOR",
      balance: 25000,
    },
  });

  // Create demo farms
  const farms = await Promise.all([
    prisma.farm.create({
      data: {
        name: "Golden Wheat Fields",
        description:
          "Premium wheat farmland in the fertile plains of Kansas. This 500-acre farm produces high-quality winter wheat with consistent yields. Modern irrigation systems and sustainable farming practices ensure reliable returns year after year.",
        location: "Kansas, USA",
        cropType: "Wheat",
        totalPlots: 100,
        soldPlots: 67,
        pricePerPlot: 250,
        expectedROI: 12.5,
        imageUrl: "/images/wheat.jpg",
        status: "ACTIVE",
        farmerId: farmer.id,
      },
    }),
    prisma.farm.create({
      data: {
        name: "Ethiopian Coffee Estate",
        description:
          "Organic coffee plantation in the highlands of Ethiopia, the birthplace of coffee. Shade-grown arabica beans with exceptional flavor profiles. Fair trade certified with direct relationships with local farming communities.",
        location: "Sidamo, Ethiopia",
        cropType: "Coffee",
        totalPlots: 80,
        soldPlots: 80,
        pricePerPlot: 400,
        expectedROI: 18.2,
        imageUrl: "/images/coffee.jpg",
        status: "FUNDED",
        farmerId: farmer.id,
      },
    }),
    prisma.farm.create({
      data: {
        name: "Mekong Rice Paddies",
        description:
          "Traditional rice paddies in Vietnam's Mekong Delta, one of the world's most productive rice-growing regions. Two harvests per year with premium jasmine rice varieties commanding top market prices.",
        location: "Mekong Delta, Vietnam",
        cropType: "Rice",
        totalPlots: 120,
        soldPlots: 45,
        pricePerPlot: 200,
        expectedROI: 10.8,
        imageUrl: "/images/rice.jpg",
        status: "ACTIVE",
        farmerId: farmer.id,
      },
    }),
    prisma.farm.create({
      data: {
        name: "Kenyan Avocado Grove",
        description:
          "Hass avocado grove in the fertile highlands of central Kenya. Growing global demand for avocados makes this an exciting investment opportunity. Drip irrigation and modern farming techniques maximize yield.",
        location: "Central Kenya",
        cropType: "Avocado",
        totalPlots: 60,
        soldPlots: 22,
        pricePerPlot: 500,
        expectedROI: 22.0,
        imageUrl: "/images/avocado.jpg",
        status: "ACTIVE",
        farmerId: farmer.id,
      },
    }),
    prisma.farm.create({
      data: {
        name: "Tuscan Olive Orchard",
        description:
          "Century-old olive trees in the rolling hills of Tuscany, producing award-winning extra virgin olive oil. Limited plots available for this prestigious agricultural investment.",
        location: "Tuscany, Italy",
        cropType: "Olives",
        totalPlots: 40,
        soldPlots: 38,
        pricePerPlot: 750,
        expectedROI: 15.5,
        imageUrl: "/images/olives.jpg",
        status: "HARVESTING",
        farmerId: farmer.id,
      },
    }),
    prisma.farm.create({
      data: {
        name: "Brazilian Cacao Farm",
        description:
          "Sustainable cacao plantation in Bahia, Brazil. Premium cacao beans used by artisan chocolate makers worldwide. Rainforest Alliance certified with agroforestry practices.",
        location: "Bahia, Brazil",
        cropType: "Cacao",
        totalPlots: 90,
        soldPlots: 51,
        pricePerPlot: 350,
        expectedROI: 16.8,
        imageUrl: "/images/cacao.jpg",
        status: "ACTIVE",
        farmerId: farmer.id,
      },
    }),
    prisma.farm.create({
      data: {
        name: "Napa Valley Vineyard",
        description:
          "Premium Cabernet Sauvignon vineyard in Napa Valley, California. World-renowned terroir producing grapes for top-rated wines. Excellent long-term appreciation potential.",
        location: "Napa Valley, USA",
        cropType: "Grapes",
        totalPlots: 50,
        soldPlots: 50,
        pricePerPlot: 1000,
        expectedROI: 20.0,
        imageUrl: "/images/grapes.jpg",
        status: "COMPLETED",
        farmerId: farmer.id,
      },
    }),
    prisma.farm.create({
      data: {
        name: "Somali Banana Plantation",
        description:
          "Organic banana plantation along the Jubba River valley. Somalia's fertile southern regions produce some of Africa's finest bananas. Supporting local communities through sustainable agriculture.",
        location: "Jubba Valley, Somalia",
        cropType: "Bananas",
        totalPlots: 70,
        soldPlots: 15,
        pricePerPlot: 180,
        expectedROI: 14.2,
        imageUrl: "/images/bananas.jpg",
        status: "ACTIVE",
        farmerId: farmer.id,
      },
    }),
    prisma.farm.create({
      data: {
        name: "Thai Mango Orchard",
        description:
          "Nam Doc Mai mango orchard in Chiang Mai province. Premium Thai mangoes are exported worldwide at premium prices. Tropical climate ensures year-round growing potential.",
        location: "Chiang Mai, Thailand",
        cropType: "Mangoes",
        totalPlots: 55,
        soldPlots: 30,
        pricePerPlot: 300,
        expectedROI: 17.5,
        imageUrl: "/images/mangoes.jpg",
        status: "ACTIVE",
        farmerId: farmer.id,
      },
    }),
    prisma.farm.create({
      data: {
        name: "Moroccan Saffron Fields",
        description:
          "Precious saffron cultivation in the Atlas Mountains of Morocco. The world's most expensive spice by weight, saffron offers exceptional returns per acre. Hand-harvested using traditional methods.",
        location: "Atlas Mountains, Morocco",
        cropType: "Saffron",
        totalPlots: 30,
        soldPlots: 12,
        pricePerPlot: 600,
        expectedROI: 25.0,
        imageUrl: "/images/saffron.jpg",
        status: "ACTIVE",
        farmerId: farmer.id,
      },
    }),
  ]);

  // Create investments for the demo investor
  const investment1 = await prisma.investment.create({
    data: {
      userId: investor.id,
      farmId: farms[0].id, // Golden Wheat Fields
      plotCount: 5,
      amount: 1250,
      returns: 156.25,
      status: "ACTIVE",
    },
  });

  const investment2 = await prisma.investment.create({
    data: {
      userId: investor.id,
      farmId: farms[1].id, // Ethiopian Coffee Estate
      plotCount: 3,
      amount: 1200,
      returns: 218.4,
      status: "ACTIVE",
    },
  });

  const investment3 = await prisma.investment.create({
    data: {
      userId: investor.id,
      farmId: farms[3].id, // Kenyan Avocado Grove
      plotCount: 2,
      amount: 1000,
      returns: 0,
      status: "ACTIVE",
    },
  });

  const investment4 = await prisma.investment.create({
    data: {
      userId: investor.id,
      farmId: farms[6].id, // Napa Valley Vineyard
      plotCount: 4,
      amount: 4000,
      returns: 800,
      status: "PAID",
    },
  });

  // Create transactions
  await prisma.transaction.createMany({
    data: [
      {
        userId: investor.id,
        type: "DEPOSIT",
        amount: 35000,
        description: "Initial account deposit",
        createdAt: new Date("2025-01-15"),
      },
      {
        userId: investor.id,
        type: "INVESTMENT",
        amount: -1250,
        description: "Investment in Golden Wheat Fields (5 plots)",
        createdAt: new Date("2025-02-01"),
      },
      {
        userId: investor.id,
        type: "INVESTMENT",
        amount: -1200,
        description: "Investment in Ethiopian Coffee Estate (3 plots)",
        createdAt: new Date("2025-02-15"),
      },
      {
        userId: investor.id,
        type: "INVESTMENT",
        amount: -1000,
        description: "Investment in Kenyan Avocado Grove (2 plots)",
        createdAt: new Date("2025-03-01"),
      },
      {
        userId: investor.id,
        type: "INVESTMENT",
        amount: -4000,
        description: "Investment in Napa Valley Vineyard (4 plots)",
        createdAt: new Date("2025-03-15"),
      },
      {
        userId: investor.id,
        type: "RETURN",
        amount: 156.25,
        description: "Quarterly return from Golden Wheat Fields",
        createdAt: new Date("2025-06-01"),
      },
      {
        userId: investor.id,
        type: "RETURN",
        amount: 218.4,
        description: "Quarterly return from Ethiopian Coffee Estate",
        createdAt: new Date("2025-06-15"),
      },
      {
        userId: investor.id,
        type: "RETURN",
        amount: 800,
        description: "Final return from Napa Valley Vineyard",
        createdAt: new Date("2025-09-01"),
      },
    ],
  });

  console.log("Seed data created successfully!");
  console.log(`  Farmer: ${farmer.email} (password: password123)`);
  console.log(`  Investor: ${investor.email} (password: password123)`);
  console.log(`  Farms: ${farms.length} created`);
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
