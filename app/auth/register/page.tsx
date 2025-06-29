"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import Link from "next/link";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  general?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string): boolean => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    return (
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar &&
      isLongEnough
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate password
    if (!validatePassword(password)) {
      setErrors({
        password:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      });
      setIsLoading(false);

      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      router.push("/auth/login?registered=true");
    } catch (error) {
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardBody className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Create Account</h2>
            <p className="mt-2 text-default-600">
              Join us to start your meal plan journey
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="p-3 text-danger text-sm bg-danger-50 rounded-lg">
                {errors.general}
              </div>
            )}

            <div className="space-y-4">
              <Input
                isRequired
                errorMessage={errors.name}
                label="Full Name"
                name="name"
                placeholder="Enter your full name"
              />

              <Input
                isRequired
                errorMessage={errors.email}
                label="Email"
                name="email"
                placeholder="Enter your email"
                type="email"
              />

              <Input
                isRequired
                errorMessage={errors.password}
                label="Password"
                name="password"
                placeholder="Create a password"
                type="password"
              />

              <p className="text-xs text-default-500">
                Password must be at least 8 characters and include uppercase,
                lowercase, number, and special character.
              </p>
            </div>

            <Button
              className="w-full"
              color="primary"
              isLoading={isLoading}
              type="submit"
            >
              Create Account
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-default-600">Already have an account? </span>
            <Link
              className="text-primary hover:text-primary-600"
              href="/auth/login"
            >
              Sign in
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
