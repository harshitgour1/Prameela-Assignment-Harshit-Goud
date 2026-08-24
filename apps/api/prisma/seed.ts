import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const companies = [
  {
    companyName: 'Acme Software',
    website: 'https://acme-software.com',
    industry: 'Software',
    employeeCount: 1500,
  },
  {
    companyName: 'Nexus Health',
    website: 'https://nexushealth.org',
    industry: 'Healthcare',
    employeeCount: 420,
  },
  {
    companyName: 'Global Finance Corp',
    website: 'https://globalfinance.io',
    industry: 'Finance',
    employeeCount: 12500,
  },
  {
    companyName: 'Swift Retail',
    website: 'https://swiftretail.net',
    industry: 'Retail',
    employeeCount: 890,
  },
  {
    companyName: 'Quantum SaaS',
    website: 'https://quantum-saas.co',
    industry: 'SaaS',
    employeeCount: 55,
  },
  {
    companyName: 'Apex Data',
    website: 'https://apexdata.ai',
    industry: 'Software',
    employeeCount: 230,
  },
  {
    companyName: 'Pioneer Biotech',
    website: 'https://pioneerbio.com',
    industry: 'Healthcare',
    employeeCount: 3100,
  },
  {
    companyName: 'Vertex Capital',
    website: 'https://vertexcapital.com',
    industry: 'Finance',
    employeeCount: 800,
  },
  {
    companyName: 'Echo Logistics',
    website: 'https://echologistics.com',
    industry: 'Supply Chain',
    employeeCount: 5200,
  },
  {
    companyName: 'Stellar Tech',
    website: 'https://stellartech.io',
    industry: 'Software',
    employeeCount: 120,
  },
  {
    companyName: 'Meridian Commerce',
    website: 'https://meridiancommerce.com',
    industry: 'E-Commerce',
    employeeCount: 450,
  },
  {
    companyName: 'Nova Therapeutics',
    website: 'https://novatherapeutics.com',
    industry: 'Healthcare',
    employeeCount: 680,
  },
  {
    companyName: 'Zenith Banking',
    website: 'https://zenithbanking.net',
    industry: 'Finance',
    employeeCount: 15400,
  },
  {
    companyName: 'Crest Retail',
    website: 'https://crestretail.co.uk',
    industry: 'Retail',
    employeeCount: 3200,
  },
  {
    companyName: 'Pulse Analytics',
    website: 'https://pulseanalytics.io',
    industry: 'SaaS',
    employeeCount: 85,
  },
  {
    companyName: 'Orion Security',
    website: 'https://orionsecurity.com',
    industry: 'Software',
    employeeCount: 550,
  },
  {
    companyName: 'Vitalis Health',
    website: 'https://vitalishealth.org',
    industry: 'Healthcare',
    employeeCount: 2100,
  },
  {
    companyName: 'Summit Investments',
    website: 'https://summitinvest.com',
    industry: 'Finance',
    employeeCount: 340,
  },
  {
    companyName: 'Horizon Delivery',
    website: 'https://horizondelivery.com',
    industry: 'Logistics',
    employeeCount: 8900,
  },
  {
    companyName: 'Nimbus Cloud',
    website: 'https://nimbuscloud.io',
    industry: 'Software',
    employeeCount: 1100,
  },
  {
    companyName: 'Aegis Commerce',
    website: 'https://aegiscommerce.com',
    industry: 'E-Commerce',
    employeeCount: 230,
  },
  {
    companyName: 'Genesis Pharma',
    website: 'https://genesispharma.com',
    industry: 'Healthcare',
    employeeCount: 4500,
  },
  {
    companyName: 'Equinox Wealth',
    website: 'https://equinoxwealth.com',
    industry: 'Finance',
    employeeCount: 670,
  },
  {
    companyName: 'Catalyst Retail',
    website: 'https://catalystretail.net',
    industry: 'Retail',
    employeeCount: 1200,
  },
  {
    companyName: 'Prism SaaS',
    website: 'https://prism-saas.com',
    industry: 'SaaS',
    employeeCount: 45,
  },
  {
    companyName: 'Vertex AI',
    website: 'https://vertexai.io',
    industry: 'Software',
    employeeCount: 340,
  },
  {
    companyName: 'Lumina Health',
    website: 'https://luminahealth.com',
    industry: 'Healthcare',
    employeeCount: 1800,
  },
  {
    companyName: 'Citadel Finance',
    website: 'https://citadelfinance.com',
    industry: 'Finance',
    employeeCount: 9200,
  },
  {
    companyName: 'Velocity Logistics',
    website: 'https://velocitylogistics.com',
    industry: 'Supply Chain',
    employeeCount: 6300,
  },
  {
    companyName: 'Aura Software',
    website: 'https://aurasoftware.io',
    industry: 'Software',
    employeeCount: 89,
  },
  {
    companyName: 'Oasis Commerce',
    website: 'https://oasiscommerce.com',
    industry: 'E-Commerce',
    employeeCount: 560,
  },
  {
    companyName: 'Serenity Health',
    website: 'https://serenityhealth.org',
    industry: 'Healthcare',
    employeeCount: 3200,
  },
  {
    companyName: 'Vanguard Banking',
    website: 'https://vanguardbanking.com',
    industry: 'Finance',
    employeeCount: 18500,
  },
  {
    companyName: 'Pinnacle Retail',
    website: 'https://pinnacleretail.co',
    industry: 'Retail',
    employeeCount: 4100,
  },
  {
    companyName: 'Flow Analytics',
    website: 'https://flowanalytics.io',
    industry: 'SaaS',
    employeeCount: 150,
  },
  {
    companyName: 'Cygnus Security',
    website: 'https://cygnussecurity.com',
    industry: 'Software',
    employeeCount: 780,
  },
  {
    companyName: 'Radiant Biotech',
    website: 'https://radiantbio.com',
    industry: 'Healthcare',
    employeeCount: 1400,
  },
  {
    companyName: 'Crescent Capital',
    website: 'https://crescentcapital.com',
    industry: 'Finance',
    employeeCount: 520,
  },
  {
    companyName: 'Express Delivery',
    website: 'https://expressdelivery.net',
    industry: 'Logistics',
    employeeCount: 12400,
  },
  {
    companyName: 'Solstice Cloud',
    website: 'https://solsticecloud.io',
    industry: 'Software',
    employeeCount: 2200,
  },
  {
    companyName: 'Tide Commerce',
    website: 'https://tidecommerce.com',
    industry: 'E-Commerce',
    employeeCount: 380,
  },
  {
    companyName: 'Aura Pharma',
    website: 'https://aurapharma.com',
    industry: 'Healthcare',
    employeeCount: 5100,
  },
  {
    companyName: 'Apex Wealth',
    website: 'https://apexwealth.com',
    industry: 'Finance',
    employeeCount: 890,
  },
  {
    companyName: 'Zenith Retail',
    website: 'https://zenithretail.com',
    industry: 'Retail',
    employeeCount: 2700,
  },
  {
    companyName: 'Nova SaaS',
    website: 'https://nova-saas.io',
    industry: 'SaaS',
    employeeCount: 65,
  },
  {
    companyName: 'Quantum AI',
    website: 'https://quantumai.com',
    industry: 'Software',
    employeeCount: 410,
  },
  {
    companyName: 'Vital Health',
    website: 'https://vitalhealth.org',
    industry: 'Healthcare',
    employeeCount: 2600,
  },
  {
    companyName: 'Meridian Finance',
    website: 'https://meridianfinance.com',
    industry: 'Finance',
    employeeCount: 7800,
  },
  {
    companyName: 'Swift Logistics',
    website: 'https://swiftlogistics.com',
    industry: 'Supply Chain',
    employeeCount: 4500,
  },
  {
    companyName: 'Stellar Solutions',
    website: 'https://stellarsolutions.io',
    industry: 'Software',
    employeeCount: 180,
  },
];

async function main() {
  console.log('Seeding database with 50 companies...');

  // Optional: clear existing data first
  // await prisma.company.deleteMany({});

  let count = 0;
  for (const company of companies) {
    await prisma.company.create({
      data: company,
    });
    count++;
  }

  console.log(`Successfully seeded ${count} companies!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
