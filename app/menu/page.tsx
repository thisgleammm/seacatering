"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Image } from "@heroui/image";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";

const mealPlans = [
  {
    id: 1,
    name: "Healthy Weight Loss Plan",
    price: "Rp85,000",
    pricePerDay: "Rp85,000/day",
    duration: "1 day",
    description:
      "A carefully crafted meal plan designed to help you lose weight while maintaining proper nutrition and energy levels.",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Weight Loss",
    meals: ["Breakfast", "Lunch", "Dinner", "2 Snacks"],
    calories: "1,200-1,400 kcal/day",
    features: [
      "Low-calorie, nutrient-dense meals",
      "Portion-controlled servings",
      "High protein content",
      "Fresh vegetables and lean proteins",
      "Free nutrition consultation",
    ],
    ingredients:
      "Lean chicken, fish, quinoa, brown rice, fresh vegetables, fruits, nuts, seeds",
    nutritionInfo: {
      protein: "25-30%",
      carbs: "40-45%",
      fats: "25-30%",
    },
  },
  {
    id: 2,
    name: "Muscle Building Plan",
    price: "Rp120,000",
    pricePerDay: "Rp120,000/day",
    duration: "1 day",
    description:
      "High-protein meal plan perfect for athletes and fitness enthusiasts looking to build lean muscle mass.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Muscle Gain",
    meals: ["Breakfast", "Lunch", "Dinner", "3 Protein Snacks"],
    calories: "2,200-2,500 kcal/day",
    features: [
      "High-quality protein sources",
      "Complex carbohydrates for energy",
      "Post-workout meal timing",
      "Supplemented with protein shakes",
      "Customizable portion sizes",
    ],
    ingredients:
      "Grilled chicken, salmon, eggs, Greek yogurt, quinoa, sweet potatoes, avocado, nuts",
    nutritionInfo: {
      protein: "35-40%",
      carbs: "35-40%",
      fats: "20-25%",
    },
  },
  {
    id: 3,
    name: "Mediterranean Wellness",
    price: "Rp95,000",
    pricePerDay: "Rp95,000/day",
    duration: "1 day",
    description:
      "Inspired by Mediterranean diet principles, focusing on heart-healthy ingredients and balanced nutrition.",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Wellness",
    meals: ["Breakfast", "Lunch", "Dinner", "2 Healthy Snacks"],
    calories: "1,600-1,800 kcal/day",
    features: [
      "Rich in omega-3 fatty acids",
      "Abundant fresh vegetables",
      "Olive oil based cooking",
      "Whole grains and legumes",
      "Anti-inflammatory ingredients",
    ],
    ingredients:
      "Fresh fish, olive oil, vegetables, whole grains, legumes, nuts, herbs, fruits",
    nutritionInfo: {
      protein: "20-25%",
      carbs: "45-50%",
      fats: "30-35%",
    },
  },
  {
    id: 4,
    name: "Keto Lifestyle Plan",
    price: "Rp110,000",
    pricePerDay: "Rp110,000/day",
    duration: "1 day",
    description:
      "Low-carb, high-fat ketogenic meal plan designed to help your body enter and maintain ketosis.",
    image:
      "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Keto",
    meals: ["Breakfast", "Lunch", "Dinner", "2 Keto Snacks"],
    calories: "1,500-1,700 kcal/day",
    features: [
      "Very low carbohydrate content",
      "High healthy fat content",
      "Moderate protein levels",
      "Ketosis-friendly ingredients",
      "Blood ketone monitoring guide",
    ],
    ingredients:
      "Avocado, coconut oil, grass-fed beef, fatty fish, eggs, leafy greens, nuts, seeds",
    nutritionInfo: {
      protein: "20-25%",
      carbs: "5-10%",
      fats: "70-75%",
    },
  },
  {
    id: 5,
    name: "Vegetarian Balance",
    price: "Rp75,000",
    pricePerDay: "Rp75,000/day",
    duration: "1 day",
    description:
      "Plant-based meal plan providing complete nutrition through diverse vegetarian ingredients and protein sources.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Vegetarian",
    meals: ["Breakfast", "Lunch", "Dinner", "2 Plant-based Snacks"],
    calories: "1,400-1,600 kcal/day",
    features: [
      "Complete plant-based proteins",
      "Rich in fiber and vitamins",
      "Sustainable and eco-friendly",
      "Diverse protein sources",
      "Includes superfoods",
    ],
    ingredients:
      "Tofu, tempeh, legumes, quinoa, nuts, seeds, vegetables, fruits, whole grains",
    nutritionInfo: {
      protein: "20-25%",
      carbs: "50-55%",
      fats: "25-30%",
    },
  },
  {
    id: 6,
    name: "Family Healthy Plan",
    price: "Rp150,000",
    pricePerDay: "Rp150,000/day",
    duration: "1 day",
    description:
      "Family-sized portions of healthy, balanced meals suitable for all family members including children.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Family",
    meals: ["Family Breakfast", "Family Lunch", "Family Dinner", "Kids Snacks"],
    calories: "Varies by family size",
    features: [
      "Family-sized portions (4 people)",
      "Kid-friendly meals included",
      "Balanced nutrition for all ages",
      "Easy to share and enjoy together",
      "Customizable for dietary restrictions",
    ],
    ingredients:
      "Variety of proteins, vegetables, whole grains, fruits, dairy alternatives",
    nutritionInfo: {
      protein: "25-30%",
      carbs: "45-50%",
      fats: "25-30%",
    },
  },
];

export default function Menu() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedPlan, setSelectedPlan] = useState<
    (typeof mealPlans)[0] | null
  >(null);

  const handleSeeDetails = (plan: (typeof mealPlans)[0]) => {
    setSelectedPlan(plan);
    onOpen();
  };

  const getCategoryColor = (category: string) => {
    const colors: {
      [key: string]:
        | "success"
        | "primary"
        | "secondary"
        | "warning"
        | "danger"
        | "default";
    } = {
      "Weight Loss": "success",
      "Muscle Gain": "danger",
      Wellness: "secondary",
      Keto: "warning",
      Vegetarian: "success",
      Family: "danger",
    };
    return colors[category] || "default";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Our Meal Plans
        </h1>
        <p className="text-lg text-default-600 max-w-2xl mx-auto">
          Choose from our carefully crafted meal plans designed to meet your
          specific health and fitness goals. All meals are prepared fresh daily
          with premium ingredients.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {mealPlans.map((plan) => (
          <Card
            key={plan.id}
            className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col"
          >
            <CardHeader className="flex flex-col gap-1">
              <div className="relative w-full h-48 overflow-hidden rounded-t-xl rounded-b-none">
                <Image
                  alt={plan.name}
                  className="w-full h-full object-cover object-center"
                  src={plan.image}
                  removeWrapper
                />
                <div className="absolute top-3 right-3">
                  <Chip
                    color={getCategoryColor(plan.category)}
                    variant="flat"
                    size="sm"
                  >
                    {plan.category}
                  </Chip>
                </div>
              </div>
            </CardHeader>
            <CardBody className="p-6 flex-1 flex flex-col">
              <div className="space-y-4 flex-1 flex flex-col">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-small text-default-600 line-clamp-2">
                    {plan.description}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {plan.price}/day
                    </p>
                    <span className="text-small text-default-400 block">
                      {plan.calories}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {plan.meals.slice(0, 3).map((meal, index) => (
                    <Chip key={index} size="sm" variant="bordered">
                      {meal}
                    </Chip>
                  ))}
                </div>

                <Button
                  color="primary"
                  variant="flat"
                  className="w-full mt-auto text-red-800 font-semibold"
                  onPress={() => handleSeeDetails(plan)}
                >
                  See More Details
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold">{selectedPlan?.name}</h2>
                <Chip
                  color={getCategoryColor(selectedPlan?.category || "")}
                  variant="flat"
                  size="sm"
                >
                  {selectedPlan?.category}
                </Chip>
              </ModalHeader>
              <ModalBody>
                {selectedPlan && (
                  <div className="space-y-6">
                    <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        alt={selectedPlan.name}
                        className="w-full h-full object-cover object-center"
                        src={selectedPlan.image}
                        removeWrapper
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Description
                      </h3>
                      <p className="text-default-600">
                        {selectedPlan.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center bg-primary/10 p-4 rounded-lg">
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {selectedPlan.price}
                        </p>
                        <p className="text-small text-default-600">
                          {selectedPlan.pricePerDay}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{selectedPlan.duration}</p>
                        <p className="text-small text-default-600">
                          {selectedPlan.calories}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Meals Included
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPlan.meals.map((meal, index) => (
                          <Chip
                            key={index}
                            color="primary"
                            className="text-red-800"
                            variant="flat"
                          >
                            {meal}
                          </Chip>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Nutrition Breakdown
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-success/10 rounded-lg">
                          <p className="text-lg font-bold text-success">
                            {selectedPlan.nutritionInfo.protein}
                          </p>
                          <p className="text-small">Protein</p>
                        </div>
                        <div className="text-center p-3 bg-primary/10 rounded-lg">
                          <p className="text-lg font-bold text-primary">
                            {selectedPlan.nutritionInfo.carbs}
                          </p>
                          <p className="text-small">Carbs</p>
                        </div>
                        <div className="text-center p-3 bg-warning/10 rounded-lg">
                          <p className="text-lg font-bold text-warning">
                            {selectedPlan.nutritionInfo.fats}
                          </p>
                          <p className="text-small">Fats</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Plan Features
                      </h3>
                      <ul className="space-y-2">
                        {selectedPlan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="text-success">✓</span>
                            <span className="text-default-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Key Ingredients
                      </h3>
                      <p className="text-default-600">
                        {selectedPlan.ingredients}
                      </p>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Order This Plan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
