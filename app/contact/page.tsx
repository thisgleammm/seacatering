"use client";

import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-default-600">
            Have questions about our meal plans or services? We&apos;re here to
            help!
          </p>
        </div>

        <div className="mb-12">
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm max-w-md mx-auto">
            <CardHeader className="pb-2">
              <div>
                <h2 className="text-2xl font-bold text-foreground leading-none mb-1">
                  SEA Catering
                </h2>
                <p className="text-sm text-default-600 leading-tight">
                  Healthy Meals, Anytime, Anywhere
                </p>
              </div>
            </CardHeader>
            <CardBody className="py-3">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">👨‍💼</span>
                    <div>
                      <p className="text-sm text-default-600">Manager</p>
                      <p className="font-semibold">Brian</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📱</span>
                    <div>
                      <p className="text-sm text-default-600">Phone</p>
                      <Link
                        className="font-semibold text-primary hover:text-primary-600 transition-colors"
                        href="tel:08123456789"
                      >
                        08123456789
                      </Link>
                    </div>
                  </div>
                </div>

                <Divider />

                <div className="space-y-2">
                  <h3 className="font-semibold">Our Services</h3>
                  <ul className="text-sm text-default-600 space-y-1">
                    <li>✓ Menu Customization</li>
                    <li>✓ Nationwide Delivery</li>
                    <li>✓ Nutritional Information</li>
                    <li>✓ Fresh Ingredients</li>
                  </ul>
                </div>
              </div>
            </CardBody>
            <CardFooter className="pt-2">
              <p className="text-xs text-default-500">
                © {new Date().getFullYear()} SEA Catering
              </p>
            </CardFooter>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-default-600">
            For business inquiries or urgent matters, please contact us directly
            at{" "}
            <Link
              className="text-primary hover:text-primary-600 transition-colors"
              href="tel:08123456789"
            >
              08123456789
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
