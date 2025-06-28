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
  id: string;
  user: {
    name: string;
  };
  mealPlan: {
    name: string;
  };
  message: string;
  rating: number;
  date: string;
}

interface FormData {
  name: string;
  message: string;
  rating: number;
  plan: string;
}

export const TestimonialsSection = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    message: "",
    rating: 5,
    plan: "",
  });
  const [plans, setPlans] = useState<{ id: string; name: string }[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const testimonialsToShow = 3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testimonialsRes, plansRes] = await Promise.all([
          fetch("/api/testimonials"),
          fetch("/api/meal-plans"),
        ]);

        if (!testimonialsRes.ok || !plansRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [testimonialsData, plansData] = await Promise.all([
          testimonialsRes.json(),
          plansRes.json(),
        ]);

        setTestimonials(testimonialsData);
        setPlans(plansData);
      } catch {
        setError("Failed to load testimonials. Please try again later.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      if (!isPaused && testimonials.length > 0) {
        setCurrentIndex((prevIndex) =>
          prevIndex === testimonials.length - testimonialsToShow
            ? 0
            : prevIndex + 1,
        );
      }
    }, 3000);

    return () => clearInterval(slideTimer);
  }, [isPaused, testimonials.length, testimonialsToShow]);

  const handleSubmit = async (onClose: () => void) => {
    try {
      if (!formData.name.trim() || !formData.message.trim() || !formData.plan) {
        setError("Please fill in all required fields.");

        return;
      }

      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit testimonial");
      }

      const newTestimonial = await response.json();

      setTestimonials([newTestimonial, ...testimonials]);
      setFormData({ name: "", message: "", rating: 5, plan: "" });
      setError(null);
      onClose();
    } catch {
      setError("Failed to submit testimonial. Please try again.");
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        className={index < rating ? "text-yellow-400" : "text-gray-300"}
        type="button"
      >
        ★
      </button>
    ));
  };

  if (testimonials.length === 0 && !error) {
    return null;
  }

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
            variant="flat"
            onPress={onOpen}
          >
            Share Your Experience
          </Button>
        </div>

        {error && <div className="text-danger text-center mb-8">{error}</div>}

        <div
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <Modal
            isOpen={isOpen}
            scrollBehavior="inside"
            size="lg"
            onOpenChange={onOpenChange}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader>Share Your Experience</ModalHeader>
                  <ModalBody>
                    <div className="space-y-4">
                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          htmlFor="name"
                        >
                          Your Name
                        </label>
                        <Input
                          isRequired
                          id="name"
                          name="name"
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          htmlFor="plan"
                        >
                          Meal Plan
                        </label>
                        <select
                          className="w-full rounded-lg border-default-200 focus:border-primary"
                          id="plan"
                          name="plan"
                          value={formData.plan}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              plan: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select a meal plan</option>
                          {plans.map((plan) => (
                            <option key={plan.id} value={plan.id}>
                              {plan.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          htmlFor="rating"
                        >
                          Rating
                        </label>
                        <div className="flex gap-2">
                          {Array.from({ length: 5 }, (_, index) => (
                            <button
                              key={index}
                              className={
                                index < formData.rating
                                  ? "text-yellow-400 text-2xl"
                                  : "text-gray-300 text-2xl"
                              }
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  rating: index + 1,
                                }))
                              }
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          htmlFor="message"
                        >
                          Your Message
                        </label>
                        <Textarea
                          isRequired
                          id="message"
                          name="message"
                          placeholder="Share your experience with our meal plan"
                          value={formData.message}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              message: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      onPress={() => handleSubmit(onClose)}
                    >
                      Submit
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>

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
                      name={testimonials[currentIndex].user.name}
                    />
                    <div className="flex flex-col">
                      <p className="font-semibold text-foreground text-base">
                        {testimonials[currentIndex].user.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex text-xs">
                          {renderStars(testimonials[currentIndex].rating)}
                        </div>
                        <span className="text-xs text-default-500">
                          {new Date(
                            testimonials[currentIndex].date,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="px-3 pt-1 pb-3">
                  <p className="text-sm text-default-600 leading-relaxed">
                    &ldquo;{testimonials[currentIndex].message}&rdquo;
                  </p>
                  <div className="mt-3 pt-3 border-t border-divider">
                    <p className="text-xs text-[#8C0909] font-medium">
                      Plan: {testimonials[currentIndex].mealPlan.name}
                    </p>
                  </div>
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
                  ),
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
                          name={testimonial.user.name}
                        />
                        <div className="flex flex-col">
                          <p className="font-semibold text-foreground text-lg">
                            {testimonial.user.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex text-sm">
                              {renderStars(testimonial.rating)}
                            </div>
                            <span className="text-small text-default-500">
                              {new Date(testimonial.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody className="px-4 pt-2 pb-4">
                      <p className="text-base text-default-600 leading-relaxed">
                        &ldquo;{testimonial.message}&rdquo;
                      </p>
                      <div className="mt-4 pt-4 border-t border-divider">
                        <p className="text-small text-[#8C0909] font-medium">
                          Plan: {testimonial.mealPlan.name}
                        </p>
                      </div>
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
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
