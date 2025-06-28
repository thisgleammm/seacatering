"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import Image from "next/image";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Skeleton } from "@heroui/skeleton";
import { Spinner } from "@heroui/spinner";

interface MealPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  calories: number;
  duration: string;
  features: string[];
  category?: string;
  image?: string;
  nutritionInfo?: {
    protein: string;
    carbs: string;
    fats: string;
  };
  ingredients?: string;
  meals?: string[];
}

export default function Menu() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/meal-plans")
      .then((res) => res.json())
      .then((data) => {
        const enhancedData = data.map((plan: MealPlan) => ({
          ...plan,
          category: getCategoryFromName(plan.name),
          image: getImageFromName(plan.name),
          nutritionInfo: getNutritionInfoFromName(plan.name),
          ingredients: getIngredientsFromName(plan.name),
          meals: getMealsFromName(plan.name),
        }));

        setMealPlans(enhancedData);
      })
      .catch(() => {
        setError("Failed to load meal plans. Please try again later.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSeeDetails = (plan: MealPlan) => {
    setSelectedPlan(plan);
    onOpen();
  };

  const getCategoryFromName = (name: string): string => {
    const nameLower = name.toLowerCase();

    if (nameLower.includes("healthy weight loss")) return "Weight Loss";
    if (nameLower.includes("muscle building")) return "Muscle Gain";
    if (nameLower.includes("mediterranean")) return "Wellness";
    if (nameLower.includes("keto lifestyle")) return "Keto";
    if (nameLower.includes("vegetarian balance")) return "Vegetarian";
    if (nameLower.includes("family healthy")) return "Family";

    return "Other";
  };

  const getImageFromName = (name: string): string => {
    const images: { [key: string]: string } = {
      "Weight Loss":
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "Muscle Gain":
        "https://images.unsplash.com/photo-1587996597484-04743eeb56b4?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      Wellness:
        "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      Keto: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      Vegetarian:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      Family:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    };

    const category = getCategoryFromName(name);

    return (
      images[category] || images["Wellness"] || "/images/placeholder-meal.jpg"
    );
  };

  const getNutritionInfoFromName = (
    name: string
  ): { protein: string; carbs: string; fats: string } => {
    const info: {
      [key: string]: { protein: string; carbs: string; fats: string };
    } = {
      "Weight Loss": { protein: "25-30%", carbs: "40-45%", fats: "25-30%" },
      "Muscle Gain": { protein: "35-40%", carbs: "35-40%", fats: "20-25%" },
      Wellness: { protein: "20-25%", carbs: "45-50%", fats: "30-35%" },
      Keto: { protein: "20-25%", carbs: "5-10%", fats: "70-75%" },
      Vegetarian: { protein: "20-25%", carbs: "50-55%", fats: "25-30%" },
      Family: { protein: "25-30%", carbs: "45-50%", fats: "25-30%" },
    };

    const category = getCategoryFromName(name);

    return info[category] || info["Wellness"];
  };

  const getMealsFromName = (name: string): string[] => {
    const meals: { [key: string]: string[] } = {
      "Weight Loss": ["Breakfast", "Lunch", "Dinner", "2 Snacks"],
      "Muscle Gain": ["Breakfast", "Lunch", "Dinner", "3 Protein Snacks"],
      Wellness: ["Breakfast", "Lunch", "Dinner", "2 Healthy Snacks"],
      Keto: ["Breakfast", "Lunch", "Dinner", "2 Keto Snacks"],
      Vegetarian: ["Breakfast", "Lunch", "Dinner", "2 Plant-based Snacks"],
      Family: [
        "Family Breakfast",
        "Family Lunch",
        "Family Dinner",
        "Kids Snacks",
      ],
    };

    const category = getCategoryFromName(name);

    return meals[category] || meals["Wellness"];
  };

  const getIngredientsFromName = (name: string): string => {
    const ingredients: { [key: string]: string } = {
      "Weight Loss":
        "Lean chicken, fish, quinoa, brown rice, fresh vegetables, fruits, nuts, seeds",
      "Muscle Gain":
        "Grilled chicken, salmon, eggs, Greek yogurt, quinoa, sweet potatoes, avocado, nuts",
      Wellness:
        "Fresh fish, olive oil, vegetables, whole grains, legumes, nuts, herbs, fruits",
      Keto: "Avocado, coconut oil, grass-fed beef, fatty fish, eggs, leafy greens, nuts, seeds",
      Vegetarian:
        "Tofu, tempeh, legumes, quinoa, nuts, seeds, vegetables, fruits, whole grains",
      Family:
        "Variety of proteins, vegetables, whole grains, fruits, dairy alternatives",
    };

    const category = getCategoryFromName(name);

    return ingredients[category] || ingredients["Wellness"];
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-3/4 md:w-1/2 mx-auto mb-4 rounded-lg" />
          <Skeleton className="h-6 w-full md:w-2/3 mx-auto rounded-lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="border border-default-200">
              <CardBody className="p-0">
                <Skeleton className="w-full h-56 rounded-t-xl" />
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <Skeleton className="h-6 w-3/4 rounded-lg" />
                      <Skeleton className="h-4 w-24 rounded-lg" />
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-6 w-28 rounded-lg" />
                      <Skeleton className="h-4 w-16 mt-1 rounded-lg" />
                    </div>
                  </div>
                  <Skeleton className="h-20 w-full rounded-lg" />
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-32 rounded-lg" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (mealPlans.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <Spinner className="mb-4" color="primary" size="lg" />
          <p className="text-default-600">
            No meal plans available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Our Meal Plans
        </h1>
        <p className="text-lg text-default-600 max-w-2xl mx-auto">
          Choose from our carefully crafted meal plans designed to meet your
          specific health and fitness goals. All meals are prepared fresh daily.
        </p>
      </div>

      {error && <div className="text-danger text-center mb-8">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mealPlans.map((plan) => (
          <Card
            key={plan.id}
            className="border border-default-200 hover:border-primary hover:shadow-lg transition-all duration-300"
          >
            <CardBody className="overflow-visible p-0 h-full">
              <div className="flex flex-col h-full">
                <div className="relative w-full h-[240px]">
                  <Image
                    fill
                    priority
                    alt={`${plan.name} meal plan`}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    src={plan.image || "/images/placeholder-meal.jpg"}
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                </div>

                <div className="flex flex-col flex-1 p-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">
                          {plan.name}
                        </h3>
                        <Chip
                          className="text-sm"
                          color={getCategoryColor(plan.category || "Other")}
                          size="sm"
                          variant="flat"
                        >
                          {plan.category}
                        </Chip>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">
                          Rp{plan.price.toLocaleString("id-ID")}
                        </p>
                        <p className="text-sm text-default-500">per day</p>
                      </div>
                    </div>

                    <p className="text-default-600 line-clamp-3 text-base">
                      {plan.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🔥</span>
                        <p className="text-base font-medium">
                          {plan.calories} calories/day
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {plan.meals?.slice(0, 2).map((meal, index) => (
                          <Chip
                            key={index}
                            className="bg-default-100"
                            size="sm"
                            variant="flat"
                          >
                            {meal}
                          </Chip>
                        ))}
                        {plan.meals && plan.meals.length > 2 && (
                          <Chip
                            className="bg-default-100"
                            size="sm"
                            variant="flat"
                          >
                            +{plan.meals.length - 2} more
                          </Chip>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-auto">
                    <Button
                      className="w-full"
                      color="primary"
                      variant="solid"
                      onPress={() => handleSeeDetails(plan)}
                    >
                      See More Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {selectedPlan && (
        <Modal
          backdrop="blur"
          isOpen={isOpen}
          scrollBehavior="inside"
          size="3xl"
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            {() => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <h2 className="text-2xl font-bold">{selectedPlan.name}</h2>
                  <div className="flex items-center gap-2">
                    <Chip
                      className="text-sm"
                      color={getCategoryColor(selectedPlan.category || "Other")}
                      size="sm"
                      variant="flat"
                    >
                      {selectedPlan.category}
                    </Chip>
                    <span className="text-default-500">•</span>
                    <span className="text-default-500">per day</span>
                  </div>
                </ModalHeader>

                <ModalBody>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-default-600">
                        {selectedPlan.description}
                      </p>
                    </div>

                    <Divider />

                    <div>
                      <h3 className="font-semibold mb-2">Meals Included</h3>
                      <ul className="list-disc list-inside text-default-600">
                        {selectedPlan.meals?.map((meal, index) => (
                          <li key={index}>{meal}</li>
                        ))}
                      </ul>
                    </div>

                    <Divider />

                    <div>
                      <h3 className="font-semibold mb-2">Key Ingredients</h3>
                      <p className="text-default-600">
                        {selectedPlan.ingredients}
                      </p>
                    </div>

                    <Divider />

                    <div>
                      <h3 className="font-semibold mb-2">
                        Nutrition Information
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-default-500">Protein</p>
                          <p className="font-semibold">
                            {selectedPlan.nutritionInfo?.protein}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-default-500">Carbs</p>
                          <p className="font-semibold">
                            {selectedPlan.nutritionInfo?.carbs}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-default-500">Fats</p>
                          <p className="font-semibold">
                            {selectedPlan.nutritionInfo?.fats}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Divider />

                    <div>
                      <h3 className="font-semibold mb-2">Features</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPlan.features.map((feature, index) => (
                          <Chip
                            key={index}
                            className="text-sm"
                            size="sm"
                            variant="flat"
                          >
                            {feature}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </div>
                </ModalBody>

                <ModalFooter>
                  <Button className="w-full" color="primary" size="lg">
                    Subscribe - Rp{selectedPlan.price.toLocaleString("id-ID")}
                    /day
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
