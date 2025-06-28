"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import Image from "next/image";

import { PlanSkeletonGrid } from "@/components/plan-skeleton";

interface FormData {
  name: string;
  phone: string;
  plan: string;
  mealTypes: string[];
  deliveryDays: string[];
  allergies: string;
}

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
}

const MEAL_TYPES = [
  { id: "breakfast", name: "Breakfast", icon: "🌅" },
  { id: "lunch", name: "Lunch", icon: "🍽️" },
  { id: "dinner", name: "Dinner", icon: "🌙" },
];

const DAYS = [
  { id: "monday", name: "Monday" },
  { id: "tuesday", name: "Tuesday" },
  { id: "wednesday", name: "Wednesday" },
  { id: "thursday", name: "Thursday" },
  { id: "friday", name: "Friday" },
  { id: "saturday", name: "Saturday" },
  { id: "sunday", name: "Sunday" },
];

const getCategoryFromName = (name: string): string => {
  if (name.includes("Weight Loss")) return "Weight Loss";
  if (name.includes("Muscle")) return "Muscle Gain";
  if (name.includes("Mediterranean")) return "Wellness";
  if (name.includes("Keto")) return "Keto";
  if (name.includes("Vegetarian")) return "Vegetarian";
  if (name.includes("Family")) return "Family";

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

  return images[category] || images["Wellness"];
};

export default function SubscribePage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    plan: "",
    mealTypes: [],
    deliveryDays: [],
    allergies: "",
  });

  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/meal-plans")
      .then((res) => res.json())
      .then((data) => {
        const enhancedData = data.map((plan: MealPlan) => ({
          ...plan,
          category: getCategoryFromName(plan.name),
          image: getImageFromName(plan.name),
        }));

        setPlans(enhancedData);
      })
      .catch(() => {
        setErrors((prev) => ({ ...prev, api: "Failed to load meal plans" }));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (
      formData.plan &&
      formData.mealTypes.length > 0 &&
      formData.deliveryDays.length > 0
    ) {
      const planPrice = plans.find((p) => p.id === formData.plan)?.price || 0;
      const total =
        planPrice *
        formData.mealTypes.length *
        formData.deliveryDays.length *
        4.3;

      setTotalPrice(total);
    } else {
      setTotalPrice(0);
    }
  }, [formData.plan, formData.mealTypes, formData.deliveryDays, plans]);

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10,12}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.plan) {
      newErrors.plan = "Please select a plan";
    }
    if (formData.mealTypes.length === 0) {
      newErrors.mealTypes = ["Please select at least one meal type"];
    }

    if (formData.deliveryDays.length === 0) {
      newErrors.deliveryDays = ["Please select at least one delivery day"];
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsSuccess(true);
      } catch {
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardBody className="text-center py-12">
            <div className="text-success text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-4">
              Subscription Successful!
            </h2>
            <p className="text-default-600 mb-6">
              Thank you for subscribing to our meal plan. We will contact you
              shortly with further details.
            </p>
            <Button
              color="primary"
              onClick={() => {
                setIsSuccess(false);
                setFormData({
                  name: "",
                  phone: "",
                  plan: "",
                  mealTypes: [],
                  deliveryDays: [],
                  allergies: "",
                });
              }}
            >
              Subscribe Another Plan
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Subscribe to Our Meal Plan
          </h1>
          <p className="text-lg text-default-600 max-w-2xl mx-auto">
            Choose your preferred meal plan and customize it according to your
            needs
          </p>
        </div>

        <Card className="w-full">
          <CardBody>
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    isRequired
                    id="name"
                    label="Full Name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                  <Input
                    isRequired
                    id="phone"
                    label="Phone Number"
                    name="phone"
                    placeholder="Enter your phone number"
                    type="number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>
                {(errors.name || errors.phone) && (
                  <div className="text-danger text-sm">
                    {errors.name && <p>{errors.name}</p>}
                    {errors.phone && <p>{errors.phone}</p>}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Choose Your Plan *</h3>
                {isLoading ? (
                  <PlanSkeletonGrid />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                      <Card
                        key={plan.id}
                        isPressable
                        className={`border-2 transition-all duration-200 ${
                          formData.plan === plan.id
                            ? "border-primary"
                            : "border-default-200"
                        }`}
                        onPress={() =>
                          setFormData({ ...formData, plan: plan.id })
                        }
                      >
                        <CardBody className="p-0">
                          <div className="relative w-full pt-[65%]">
                            <Image
                              alt={plan.name}
                              className="absolute top-0 left-0 w-full h-full object-cover rounded-t-xl"
                              src={plan.image || "/images/placeholder-meal.jpg"}
                            />
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-lg font-semibold text-foreground">
                                {plan.name}
                              </h4>
                              <div className="text-right">
                                <p className="text-lg font-bold text-primary">
                                  Rp{plan.price.toLocaleString("id-ID")}
                                </p>
                                <p className="text-sm text-default-400">
                                  per meal
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
                {errors.plan && (
                  <p className="text-danger text-sm">{errors.plan}</p>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Meal Types *</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {MEAL_TYPES.map((type) => (
                    <Card
                      key={type.id}
                      isHoverable
                      isPressable
                      className={`cursor-pointer transition-all ${
                        formData.mealTypes.includes(type.id)
                          ? "border-primary border-2 bg-primary/10"
                          : "border hover:border-primary"
                      }`}
                      onPress={() => {
                        setFormData({
                          ...formData,
                          mealTypes: formData.mealTypes.includes(type.id)
                            ? formData.mealTypes.filter((t) => t !== type.id)
                            : [...formData.mealTypes, type.id],
                        });
                      }}
                    >
                      <CardBody className="text-center p-3">
                        <div className="text-2xl mb-2">{type.icon}</div>
                        <h4
                          className={`font-medium ${
                            formData.mealTypes.includes(type.id)
                              ? "text-primary"
                              : ""
                          }`}
                        >
                          {type.name}
                        </h4>
                      </CardBody>
                    </Card>
                  ))}
                </div>
                {errors.mealTypes && (
                  <p className="text-danger text-sm">{errors.mealTypes}</p>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Delivery Days *</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
                  {DAYS.map((day) => (
                    <Card
                      key={day.id}
                      isHoverable
                      isPressable
                      className={`cursor-pointer transition-all ${
                        formData.deliveryDays.includes(day.id)
                          ? "border-primary border-2 bg-primary/10"
                          : "border hover:border-primary"
                      }`}
                      onPress={() => {
                        setFormData({
                          ...formData,
                          deliveryDays: formData.deliveryDays.includes(day.id)
                            ? formData.deliveryDays.filter((d) => d !== day.id)
                            : [...formData.deliveryDays, day.id],
                        });
                      }}
                    >
                      <CardBody className="text-center p-3">
                        <h4
                          className={`font-medium ${
                            formData.deliveryDays.includes(day.id)
                              ? "text-primary"
                              : ""
                          }`}
                        >
                          {day.name}
                        </h4>
                      </CardBody>
                    </Card>
                  ))}
                </div>
                {errors.deliveryDays && (
                  <p className="text-danger text-sm">{errors.deliveryDays}</p>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  Additional Information
                </h3>
                <Textarea
                  label="Allergies or Special Requests"
                  placeholder="Please let us know if you have any allergies or special dietary requirements"
                  value={formData.allergies}
                  onChange={(e) =>
                    setFormData({ ...formData, allergies: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(totalPrice)}
                  </p>
                  <p className="text-small text-default-500">
                    Monthly estimate (30 days)
                  </p>
                </div>
                <Button
                  color="primary"
                  isDisabled={isSubmitting}
                  isLoading={isSubmitting}
                  size="lg"
                  type="submit"
                >
                  Subscribe Now
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
