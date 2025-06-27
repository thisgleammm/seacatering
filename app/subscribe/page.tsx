"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Chip } from "@heroui/chip";

interface FormData {
  name: string;
  phone: string;
  plan: string;
  mealTypes: string[];
  deliveryDays: string[];
  allergies: string;
}

const PLANS = [
  {
    id: "weight-loss",
    name: "Healthy Weight Loss Plan",
    price: 85000,
    description:
      "A carefully crafted meal plan designed to help you lose weight while maintaining proper nutrition and energy levels.",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Weight Loss",
    calories: "1,200-1,400 kcal/day",
  },
  {
    id: "muscle-gain",
    name: "Muscle Building Plan",
    price: 120000,
    description:
      "High-protein meal plan perfect for athletes and fitness enthusiasts looking to build lean muscle mass.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Muscle Gain",
    calories: "2,200-2,500 kcal/day",
  },
  {
    id: "mediterranean",
    name: "Mediterranean Wellness",
    price: 95000,
    description:
      "Inspired by Mediterranean diet principles, focusing on heart-healthy ingredients and balanced nutrition.",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Wellness",
    calories: "1,600-1,800 kcal/day",
  },
  {
    id: "keto",
    name: "Keto Lifestyle Plan",
    price: 110000,
    description:
      "Low-carb, high-fat ketogenic meal plan designed to help your body enter and maintain ketosis.",
    image:
      "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Keto",
    calories: "1,500-1,700 kcal/day",
  },
  {
    id: "vegetarian",
    name: "Vegetarian Balance",
    price: 75000,
    description:
      "Plant-based meal plan providing complete nutrition through diverse vegetarian ingredients and protein sources.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Vegetarian",
    calories: "1,400-1,600 kcal/day",
  },
  {
    id: "family",
    name: "Family Healthy Plan",
    price: 150000,
    description:
      "Family-sized portions of healthy, balanced meals suitable for all family members including children.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Family",
    calories: "Varies by family size",
  },
];

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

export default function SubscribePage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    plan: "",
    mealTypes: [],
    deliveryDays: [],
    allergies: "",
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (
      formData.plan &&
      formData.mealTypes.length > 0 &&
      formData.deliveryDays.length > 0
    ) {
      const planPrice = PLANS.find((p) => p.id === formData.plan)?.price || 0;
      const total =
        planPrice *
        formData.mealTypes.length *
        formData.deliveryDays.length *
        4.3;
      setTotalPrice(total);
    } else {
      setTotalPrice(0);
    }
  }, [formData.plan, formData.mealTypes, formData.deliveryDays]);

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
        console.log("Form submitted:", formData);
        console.log("Total Price:", totalPrice);
      } catch (error) {
        console.error("Error submitting form:", error);
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
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  Personal Information *
                </h3>
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  isInvalid={!!errors.name}
                  errorMessage={errors.name}
                  isRequired
                />
                <Input
                  label="Active Phone Number"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  type="number"
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  isInvalid={!!errors.phone}
                  errorMessage={errors.phone}
                  isRequired
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Select Your Plan *</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PLANS.map((plan) => (
                    <Card
                      key={plan.id}
                      isPressable
                      isHoverable
                      className={`cursor-pointer transition-all ${
                        formData.plan === plan.id
                          ? "border-primary border-2 bg-primary/10"
                          : "border hover:border-primary"
                      }`}
                      onPress={() =>
                        setFormData({ ...formData, plan: plan.id })
                      }
                    >
                      <CardHeader className="flex flex-col gap-1">
                        <div className="relative w-full h-48 overflow-hidden rounded-t-xl rounded-b-none">
                          <Image
                            alt={plan.name}
                            className="w-full h-full object-cover"
                            src={plan.image}
                            removeWrapper
                          />
                          <div className="absolute top-2 right-2">
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
                      <CardBody className="p-4">
                        <h4
                          className={`font-semibold mb-1 ${
                            formData.plan === plan.id ? "text-primary" : ""
                          }`}
                        >
                          {plan.name}
                        </h4>
                        <div className="flex justify-between items-center">
                          <p className="text-lg font-bold text-primary">
                            Rp{plan.price.toLocaleString()}
                          </p>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
                {errors.plan && (
                  <p className="text-danger text-sm">{errors.plan}</p>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Meal Types *</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {MEAL_TYPES.map((type) => (
                    <Card
                      key={type.id}
                      isPressable
                      isHoverable
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
                      <CardBody className="text-center p-4">
                        <div className="text-3xl mb-2">{type.icon}</div>
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
                      isPressable
                      isHoverable
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
                          className={`font-medium ${formData.deliveryDays.includes(day.id) ? "text-primary" : ""}`}
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
                  label="Allergies or Dietary Restrictions"
                  placeholder="List any allergies or dietary restrictions..."
                  value={formData.allergies}
                  onChange={(e) =>
                    setFormData({ ...formData, allergies: e.target.value })
                  }
                />
              </div>

              {totalPrice > 0 && (
                <Card className="bg-default-50">
                  <CardBody>
                    <h3 className="text-xl font-semibold mb-4">
                      Price Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Selected Plan:</span>
                        <span>
                          {PLANS.find((p) => p.id === formData.plan)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Meal Types:</span>
                        <span>{formData.mealTypes.length} types</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Days:</span>
                        <span>{formData.deliveryDays.length} days</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total Monthly Price:</span>
                          <span>Rp{totalPrice.toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-default-600 mt-1">
                          Based on 4.3 weeks per month
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}

              <Button
                type="submit"
                color="primary"
                className="w-full bg-[#8C0909] text-white"
                size="lg"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Subscribe Now"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
