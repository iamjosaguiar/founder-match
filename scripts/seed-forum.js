const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  {
    name: "General Discussion",
    slug: "general", 
    description: "Open discussions about startups, entrepreneurship, and building companies",
    color: "#6366f1",
    icon: "general",
    order: 1
  },
  {
    name: "Introductions",
    slug: "introductions",
    description: "Welcome! Introduce yourself and tell us about your startup journey",
    color: "#10b981",
    icon: "introductions", 
    order: 2
  },
  {
    name: "Idea Validation",
    slug: "idea-validation",
    description: "Get feedback on your startup ideas and validate market demand", 
    color: "#f59e0b",
    icon: "idea-validation",
    order: 3
  },
  {
    name: "Co-founder Search",
    slug: "co-founder-search",
    description: "Connect with potential co-founders and discuss partnership opportunities",
    color: "#ef4444", 
    icon: "co-founder-search",
    order: 4
  },
  {
    name: "Technical Discussion", 
    slug: "technical",
    description: "Developer discussions about tech stacks, architecture, and development challenges",
    color: "#8b5cf6",
    icon: "technical", 
    order: 5
  },
  {
    name: "Business & Strategy",
    slug: "business", 
    description: "Business models, strategy, operations, and scaling discussions",
    color: "#06b6d4",
    icon: "business",
    order: 6
  },
  {
    name: "Legal & Compliance",
    slug: "legal",
    description: "Legal questions, compliance issues, and regulatory discussions",
    color: "#64748b", 
    icon: "legal",
    order: 7
  },
  {
    name: "Marketing & Growth",
    slug: "marketing",
    description: "Marketing strategies, growth hacking, customer acquisition, and retention",
    color: "#ec4899",
    icon: "marketing", 
    order: 8
  },
  {
    name: "Global Founders",
    slug: "global",
    description: "Connect with founders from around the world and discuss regional markets",
    color: "#059669",
    icon: "global",
    order: 9
  }
];

async function seedForum() {
  console.log('🌱 Seeding forum categories...');

  try {
    // Create categories
    for (const category of categories) {
      const existing = await prisma.forumCategory.findUnique({
        where: { slug: category.slug }
      });

      if (!existing) {
        await prisma.forumCategory.create({
          data: category
        });
        console.log(`✅ Created category: ${category.name}`);
      } else {
        console.log(`⏭️  Category already exists: ${category.name}`);
      }
    }

    console.log('🎉 Forum seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding forum:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedForum();
}

module.exports = { seedForum };