import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const clientPassword = await bcrypt.hash("client123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@ownwebify.com" },
    update: {
      referralCode: "ABHI-ADMN",
    },
    create: {
      email: "admin@ownwebify.com",
      name: "Abhi",
      passwordHash: adminPassword,
      role: "ADMIN",
      referralCode: "ABHI-ADMN",
    },
  });

  const client = await prisma.user.upsert({
    where: { email: "client@example.com" },
    update: {
      referralCode: "SARA-J7K2",
      referralBalance: 50,
    },
    create: {
      email: "client@example.com",
      name: "Sarah Johnson",
      passwordHash: clientPassword,
      role: "CLIENT",
      company: "TechStart Inc.",
      referralCode: "SARA-J7K2",
      referralBalance: 50,
    },
  });

  await prisma.portfolioItem.upsert({
    where: { slug: "ecommerce-platform-freshmarket" },
    update: {},
    create: {
      title: "FreshMarket E-Commerce Platform",
      slug: "ecommerce-platform-freshmarket",
      description: "A modern e-commerce platform for an organic grocery delivery service with real-time inventory management.",
      longDescription: "Built a full-featured e-commerce platform for FreshMarket, an organic grocery delivery startup. The platform handles real-time inventory tracking, subscription management, and seamless checkout with multiple payment providers. Achieved 40% faster page loads compared to their previous solution.",
      imageUrl: "/portfolio/freshmarket.jpg",
      techStack: ["Next.js", "Stripe", "PostgreSQL", "Redis", "Tailwind CSS"],
      liveUrl: "https://freshmarket.example.com",
      category: "E-Commerce",
      featured: true,
    },
  });

  await prisma.portfolioItem.upsert({
    where: { slug: "saas-dashboard-analytics" },
    update: {},
    create: {
      title: "DataPulse Analytics Dashboard",
      slug: "saas-dashboard-analytics",
      description: "Real-time analytics dashboard for a B2B SaaS product with customizable widgets and team collaboration.",
      longDescription: "Designed and developed DataPulse's analytics dashboard from scratch. Features include real-time data visualization, drag-and-drop widget customization, team sharing, automated report generation, and white-label capabilities for enterprise clients.",
      imageUrl: "/portfolio/datapulse.jpg",
      techStack: ["React", "D3.js", "Node.js", "MongoDB", "WebSocket"],
      liveUrl: "https://datapulse.example.com",
      category: "Web App",
      featured: true,
    },
  });

  await prisma.portfolioItem.upsert({
    where: { slug: "corporate-website-greentech" },
    update: {},
    create: {
      title: "GreenTech Solutions Corporate Site",
      slug: "corporate-website-greentech",
      description: "Award-winning corporate website for a renewable energy company with interactive data visualizations.",
      longDescription: "Created a stunning corporate website for GreenTech Solutions that showcases their renewable energy projects. Features interactive maps showing project locations, real-time energy production data, investor relations portal, and a careers section with ATS integration.",
      imageUrl: "/portfolio/greentech.jpg",
      techStack: ["Next.js", "Three.js", "Sanity CMS", "Vercel"],
      liveUrl: "https://greentech.example.com",
      category: "Business Site",
      featured: true,
    },
  });

  await prisma.portfolioItem.upsert({
    where: { slug: "mobile-app-fittrack" },
    update: {},
    create: {
      title: "FitTrack Health App",
      slug: "mobile-app-fittrack",
      description: "A cross-platform fitness tracking web app with social features and AI-powered workout recommendations.",
      longDescription: "Built a progressive web app for FitTrack that works seamlessly on mobile and desktop. Includes workout tracking, nutrition logging, social challenges with friends, and an AI engine that generates personalized workout plans based on user goals and progress.",
      imageUrl: "/portfolio/fittrack.jpg",
      techStack: ["React Native Web", "Firebase", "TensorFlow.js", "PWA"],
      liveUrl: "https://fittrack.example.com",
      category: "Web App",
      featured: false,
    },
  });

  await prisma.portfolioItem.upsert({
    where: { slug: "restaurant-booking-tastebud" },
    update: {},
    create: {
      title: "TasteBud Restaurant Platform",
      slug: "restaurant-booking-tastebud",
      description: "Restaurant discovery and reservation platform with real-time availability and waitlist management.",
      longDescription: "Developed TasteBud, a restaurant booking platform that connects diners with local restaurants. Features include real-time table availability, waitlist management, menu browsing, dietary filter system, and a review/rating engine. Increased partner restaurant bookings by 65%.",
      imageUrl: "/portfolio/tastebud.jpg",
      techStack: ["Next.js", "PostgreSQL", "Google Maps API", "Twilio"],
      liveUrl: "https://tastebud.example.com",
      category: "E-Commerce",
      featured: false,
    },
  });

  const project = await prisma.project.upsert({
    where: { id: "demo-project-1" },
    update: {},
    create: {
      id: "demo-project-1",
      title: "Corporate Website Redesign",
      description: "We need a complete redesign of our corporate website. Current site is outdated and not mobile-friendly. Looking for a modern, clean design with improved UX.",
      projectType: "redesign",
      budget: "5k-10k",
      timeline: "1-2 months",
      status: "IN_PROGRESS",
      referenceLinks: "https://stripe.com, https://linear.app",
      howFoundUs: "Google Search",
      clientId: client.id,
    },
  });

  await prisma.quote.upsert({
    where: { id: "demo-quote-1" },
    update: {},
    create: {
      id: "demo-quote-1",
      projectId: project.id,
      amount: 350,
      description: "Corporate website redesign including: homepage, about, services, contact page. Includes responsive design, SEO optimization, and CMS integration.",
      validUntil: new Date("2026-08-01"),
      status: "ACCEPTED",
    },
  });

  await prisma.message.create({
    data: {
      projectId: project.id,
      senderId: client.id,
      content: "Hi! I've reviewed the quote and accepted it. When can we start the kickoff call?",
    },
  });

  await prisma.message.create({
    data: {
      projectId: project.id,
      senderId: admin.id,
      content: "Great to hear, Sarah! I'm available this Thursday at 2 PM or Friday at 10 AM. Which works better for you?",
    },
  });

  console.log("Seed completed successfully!");
  console.log(`Admin: admin@ownwebify.com / admin123`);
  console.log(`Client: client@example.com / client123`);
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
