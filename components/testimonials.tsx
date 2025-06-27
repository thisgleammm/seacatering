"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Avatar } from "@heroui/avatar";

interface Testimonial {
  id: number;
  name: string;
  message: string;
  rating: number;
  date: string;
  plan?: string;
}

const initialTestimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    message:
      "SEA Catering has completely transformed my eating habits! The Weight Loss Plan was perfect for my goals. Fresh, delicious meals delivered right to my door. I've lost 8kg in 2 months!",
    rating: 5,
    date: "2024-01-15",
    plan: "Weight Loss Plan",
  },
  {
    id: 2,
    name: "Michael Chen",
    message:
      "As a busy professional, SEA Catering has been a lifesaver. The Muscle Building Plan provides exactly what I need for my workout routine. High-quality proteins and perfectly balanced nutrition.",
    rating: 5,
    date: "2024-01-10",
    plan: "Muscle Building Plan",
  },
  {
    id: 3,
    name: "Amanda Rodriguez",
    message:
      "The Mediterranean Wellness plan is absolutely amazing! Every meal feels like a restaurant-quality dish. My family loves the flavors and I feel so much healthier. Highly recommended!",
    rating: 4,
    date: "2024-01-08",
    plan: "Mediterranean Wellness",
  },
  {
    id: 4,
    name: "David Kim",
    message:
      "Excellent service and fantastic food quality. The Keto Lifestyle Plan helped me achieve my health goals faster than I expected. The customer service team is also very responsive.",
    rating: 5,
    date: "2024-01-05",
    plan: "Keto Lifestyle Plan",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    message:
      "Love the variety in the Vegetarian Balance plan! Each meal is thoughtfully prepared with fresh ingredients. It's convenient, healthy, and delicious. Perfect for my busy lifestyle.",
    rating: 4,
    date: "2024-01-02",
    plan: "Vegetarian Balance",
  },
  {
    id: 6,
    name: "Robert Green",
    message:
      "Finally, a meal service that understands gluten-free needs. The Gluten-Free plan is delicious and safe. No more worrying about cross-contamination!",
    rating: 5,
    date: "2024-01-01",
    plan: "Gluten-Free Plan",
  },
];

export const TestimonialsSection = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(initialTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    rating: 5,
    plan: "",
  });

  const [isPaused, setIsPaused] = useState(false);
  const testimonialsToShow = 3;

  const plans = [
    "Healthy Weight Loss Plan",
    "Muscle Building Plan",
    "Mediterranean Wellness",
    "Keto Lifestyle Plan",
    "Vegetarian Balance",
    "Family Healthy Plan"
  ];

  useEffect(() => {
    const slideTimer = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex((prevIndex) =>
          prevIndex === testimonials.length - testimonialsToShow
            ? 0
            : prevIndex + 1
        );
      }
    }, 3000);

    return () => clearInterval(slideTimer);
  }, [isPaused, testimonials.length, testimonialsToShow]);

  const handleSubmit = (onClose: () => void) => {
    if (!formData.name.trim() || !formData.message.trim()) {
      alert("Please fill in your name and review message.");
      return;
    }

    const newTestimonial: Testimonial = {
      id: Date.now(),
      name: formData.name,
      message: formData.message,
      rating: formData.rating,
      date: new Date().toISOString().split("T")[0],
      plan: formData.plan,
    };

    setTestimonials([newTestimonial, ...testimonials]);
    setFormData({ name: "", message: "", rating: 5, plan: "" });
    onClose();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type="button"
        className={index < rating ? "text-yellow-400" : "text-gray-300"}
      >
        ★
      </button>
    ));
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-base md:text-lg text-default-600 max-w-2xl mx-auto mb-8">
            Read authentic reviews from our satisfied customers who have
            transformed their health journey with SEA Catering meal plans.
          </p>
          <Button
            className="text-red-800 font-semibold"
            color="primary"
            onPress={onOpen}
            variant="flat"
          >
            Share Your Experience
          </Button>
        </div>

        <div
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="md:hidden">
            <div className="w-full px-2">
              <Card
                className="h-full transition-all duration-700 ease-in-out bg-white hover:bg-white hover:shadow-lg"
                style={{ backgroundColor: "white" }}
              >
                <CardHeader className="pb-3 pt-2 px-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      className="bg-[#8C0909] text-white w-10 h-10 text-base"
                      name={testimonials[currentIndex].name}
                    />
                    <div className="flex flex-col">
                      <p className="font-semibold text-foreground text-base">
                        {testimonials[currentIndex].name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex text-xs">
                          {renderStars(testimonials[currentIndex].rating)}
                        </div>
                        <span className="text-xs text-default-500">
                          {testimonials[currentIndex].date}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="px-3 pt-1 pb-3">
                  <p className="text-sm text-default-600 leading-relaxed">
                    &ldquo;{testimonials[currentIndex].message}&rdquo;
                  </p>
                  {testimonials[currentIndex].plan && (
                    <div className="mt-3 pt-3 border-t border-divider">
                      <p className="text-xs text-[#8C0909] font-medium">
                        Plan: {testimonials[currentIndex].plan}
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
            <div className="flex justify-center mt-6">
              <div className="flex gap-1.5">
                {Array.from(
                  { length: testimonials.length - testimonialsToShow + 1 },
                  (_, index) => (
                    <button
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        currentIndex === index
                          ? "bg-[#8C0909]"
                          : "bg-default-300"
                      }`}
                      onClick={() => setCurrentIndex(index)}
                    />
                  )
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:block overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / testimonialsToShow)}%)`,
              }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-1/2 lg:w-1/3 flex-shrink-0 px-3 py-2"
                >
                  <Card
                    className="h-full transition-all duration-700 ease-in-out bg-white hover:bg-white hover:shadow-lg"
                    style={{ backgroundColor: "white" }}
                  >
                    <CardHeader className="pb-4 pt-3 px-4">
                      <div className="flex items-center gap-4">
                        <Avatar
                          className="bg-[#8C0909] text-white w-12 h-12 text-lg"
                          name={testimonial.name}
                        />
                        <div className="flex flex-col">
                          <p className="font-semibold text-foreground text-lg">
                            {testimonial.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex text-sm">
                              {renderStars(testimonial.rating)}
                            </div>
                            <span className="text-small text-default-500">
                              {testimonial.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody className="px-4 pt-2 pb-4">
                      <p className="text-base text-default-600 leading-relaxed">
                        &ldquo;{testimonial.message}&rdquo;
                      </p>
                      {testimonial.plan && (
                        <div className="mt-4 pt-4 border-t border-divider">
                          <p className="text-small text-[#8C0909] font-medium">
                            Plan: {testimonial.plan}
                          </p>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                {Array.from(
                  { length: testimonials.length - testimonialsToShow + 1 },
                  (_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        currentIndex === index
                          ? "bg-[#8C0909]"
                          : "bg-default-300"
                      }`}
                      onClick={() => setCurrentIndex(index)}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <h3 className="text-2xl font-bold">Share Your Experience</h3>
                  <p className="text-default-600 font-normal">
                    Tell others about your journey with SEA Catering
                  </p>
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-4">
                    <Input
                      isRequired
                      label="Your Name"
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter your full name"
                      value={formData.name}
                    />

                    <Textarea
                      isRequired
                      label="Your Review"
                      minRows={4}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Share your experience with our meal plans..."
                      value={formData.message}
                    />

                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium text-foreground"
                        htmlFor="plan"
                      >
                        Select Plan
                      </label>
                      <select
                        id="plan"
                        className="w-full px-3 py-2 rounded-lg bg-default-100 border-2 border-default-200 focus:border-primary focus:outline-none"
                        value={formData.plan}
                        onChange={(e) =>
                          setFormData({ ...formData, plan: e.target.value })
                        }
                        required
                      >
                        <option value="">Choose a meal plan</option>
                        {plans.map((plan) => (
                          <option key={plan} value={plan}>
                            {plan}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium text-foreground"
                        htmlFor="rating"
                      >
                        Rating
                      </label>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }, (_, index) => (
                          <button
                            key={index}
                            type="button"
                            className={`text-2xl transition-colors ${
                              index < formData.rating
                                ? "text-yellow-400 hover:text-yellow-500"
                                : "text-gray-300 hover:text-yellow-400"
                            }`}
                            onClick={() =>
                              setFormData({ ...formData, rating: index + 1 })
                            }
                          >
                            ★
                          </button>
                        ))}
                        <span className="ml-2 text-small text-default-600">
                          {formData.rating} out of 5 stars
                        </span>
                      </div>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" onPress={onClose} variant="light">
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#8C0909] text-white hover:bg-red-900"
                    color="primary"
                    isDisabled={
                      !formData.name.trim() || !formData.message.trim()
                    }
                    onPress={() => handleSubmit(onClose)}
                  >
                    Submit Review
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </section>
  );
};
