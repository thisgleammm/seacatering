import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.testimonial.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.mealPlan.deleteMany();
  await prisma.user.deleteMany();

  const mealPlans = [
    {
      name: "Healthy Weight Loss Plan",
      description:
        "A carefully crafted meal plan designed to help you lose weight while maintaining proper nutrition and energy levels.",
      price: 85000,
      calories: 1300, // Average of 1,200-1,400 kcal/day
      duration: "1 day",
      features: [
        "Low-calorie, nutrient-dense meals",
        "Portion-controlled servings",
        "High protein content",
        "Fresh vegetables and lean proteins",
        "Free nutrition consultation",
      ],
    },
    {
      name: "Muscle Building Plan",
      description:
        "High-protein meal plan perfect for athletes and fitness enthusiasts looking to build lean muscle mass.",
      price: 120000,
      calories: 2350, // Average of 2,200-2,500 kcal/day
      duration: "1 day",
      features: [
        "High-quality protein sources",
        "Complex carbohydrates for energy",
        "Post-workout meal timing",
        "Supplemented with protein shakes",
        "Customizable portion sizes",
      ],
    },
    {
      name: "Mediterranean Wellness",
      description:
        "Inspired by Mediterranean diet principles, focusing on heart-healthy ingredients and balanced nutrition.",
      price: 95000,
      calories: 1700, // Average of 1,600-1,800 kcal/day
      duration: "1 day",
      features: [
        "Rich in omega-3 fatty acids",
        "Abundant fresh vegetables",
        "Olive oil based cooking",
        "Whole grains and legumes",
        "Anti-inflammatory ingredients",
      ],
    },
    {
      name: "Keto Lifestyle Plan",
      description:
        "Low-carb, high-fat ketogenic meal plan designed to help your body enter and maintain ketosis.",
      price: 110000,
      calories: 1600, // Average of 1,500-1,700 kcal/day
      duration: "1 day",
      features: [
        "Very low carbohydrate content",
        "High healthy fat content",
        "Moderate protein levels",
        "Ketosis-friendly ingredients",
        "Blood ketone monitoring guide",
      ],
    },
    {
      name: "Vegetarian Balance",
      description:
        "Plant-based meal plan providing complete nutrition through diverse vegetarian ingredients and protein sources.",
      price: 75000,
      calories: 1500, // Average of 1,400-1,600 kcal/day
      duration: "1 day",
      features: [
        "Complete plant-based proteins",
        "Rich in fiber and vitamins",
        "Sustainable and eco-friendly",
        "Diverse protein sources",
        "Includes superfoods",
      ],
    },
    {
      name: "Family Healthy Plan",
      description:
        "Family-sized portions of healthy, balanced meals suitable for all family members including children.",
      price: 150000,
      calories: 2000, // Base calories, varies by family size
      duration: "1 day",
      features: [
        "Family-sized portions (4 people)",
        "Kid-friendly meals included",
        "Balanced nutrition for all ages",
        "Easy to share and enjoy together",
        "Customizable for dietary restrictions",
      ],
    },
  ];

  const createdMealPlans = await Promise.all(
    mealPlans.map((plan) => prisma.mealPlan.create({ data: plan }))
  );

  const users = [
    {
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "0812345678",
    },
    {
      name: "Michael Chen",
      email: "michael.chen@example.com",
      phone: "0823456789",
    },
    {
      name: "Amanda Rodriguez",
      email: "amanda.rodriguez@example.com",
      phone: "0834567890",
    },
    {
      name: "David Kim",
      email: "david.kim@example.com",
      phone: "0845678901",
    },
    {
      name: "Lisa Thompson",
      email: "lisa.thompson@example.com",
      phone: "0856789012",
    },
    {
      name: "Robert Green",
      email: "robert.green@example.com",
      phone: "0867890123",
    },
  ];

  const createdUsers = await Promise.all(
    users.map((user) => prisma.user.create({ data: user }))
  );

  const testimonials = [
    {
      userId: createdUsers[0].id,
      mealPlanId: createdMealPlans[0].id, // Weight Loss Plan
      rating: 5,
      message:
        "SEA Catering has completely transformed my eating habits! The Weight Loss Plan was perfect for my goals. Fresh, delicious meals delivered right to my door. I've lost 8kg in 2 months!",
      date: new Date("2024-01-15"),
    },
    {
      userId: createdUsers[1].id,
      mealPlanId: createdMealPlans[1].id, // Muscle Building Plan
      rating: 5,
      message:
        "As a busy professional, SEA Catering has been a lifesaver. The Muscle Building Plan provides exactly what I need for my workout routine. High-quality proteins and perfectly balanced nutrition.",
      date: new Date("2024-01-10"),
    },
    {
      userId: createdUsers[2].id,
      mealPlanId: createdMealPlans[2].id, // Mediterranean Wellness
      rating: 4,
      message:
        "The Mediterranean Wellness plan is absolutely amazing! Every meal feels like a restaurant-quality dish. My family loves the flavors and I feel so much healthier. Highly recommended!",
      date: new Date("2024-01-08"),
    },
    {
      userId: createdUsers[3].id,
      mealPlanId: createdMealPlans[3].id, // Keto Lifestyle Plan
      rating: 5,
      message:
        "Excellent service and fantastic food quality. The Keto Lifestyle Plan helped me achieve my health goals faster than I expected. The customer service team is also very responsive.",
      date: new Date("2024-01-05"),
    },
    {
      userId: createdUsers[4].id,
      mealPlanId: createdMealPlans[4].id, // Vegetarian Balance
      rating: 4,
      message:
        "Love the variety in the Vegetarian Balance plan! Each meal is thoughtfully prepared with fresh ingredients. It's convenient, healthy, and delicious. Perfect for my busy lifestyle.",
      date: new Date("2024-01-02"),
    },
    {
      userId: createdUsers[5].id,
      mealPlanId: createdMealPlans[0].id, // Weight Loss Plan
      rating: 5,
      message:
        "Finally, a meal service that understands gluten-free needs. The Weight Loss plan is delicious and safe. No more worrying about cross-contamination!",
      date: new Date("2024-01-01"),
    },
  ];

  await Promise.all(
    testimonials.map((testimonial) =>
      prisma.testimonial.create({ data: testimonial })
    )
  );

  console.log("Database has been seeded. 🌱");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
