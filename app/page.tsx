import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Link } from "@heroui/link";

import { TestimonialsSection } from "@/components/testimonials";
import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 px-4 py-4 sm:gap-8 sm:px-6 sm:py-8 md:py-10">
      <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-xl md:rounded-3xl">
        <Card className="h-[400px] w-full border-none sm:h-[450px] md:h-[500px] lg:h-[550px]">
          <CardBody className="relative overflow-hidden p-0">
            <div
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat blur-sm brightness-60"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
              }}
            />
            <div className="absolute inset-0 z-10 bg-black/50" />

            <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-center sm:px-6 md:px-8">
              <div className="mx-auto max-w-4xl">
                <h1 className="mb-4 text-3xl font-bold leading-tight text-white uppercase sm:mb-6 sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl">
                  {siteConfig.name}
                </h1>

                <p className="mb-6 px-2 text-lg font-medium text-white/90 sm:mb-8 sm:text-xl md:text-2xl lg:text-3xl">
                  {siteConfig.description}
                </p>

                <Button
                  as={Link}
                  className="h-auto transform rounded-full px-6 py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl sm:px-8 sm:py-6 sm:text-lg"
                  color="primary"
                  href="/menu"
                  size="lg"
                  variant="solid"
                >
                  Order Now
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="mx-auto mt-12 max-w-4xl px-4 text-center sm:mt-16">
        <h2 className="mb-4 text-2xl font-bold text-foreground sm:mb-6 sm:text-3xl md:text-4xl">
          Welcome to SEA Catering
        </h2>
        <p className="mb-8 text-base leading-relaxed text-default-600 sm:mb-12 sm:text-lg">
          SEA Catering is a customizable healthy meal service that delivers
          across Indonesia. We provide high-nutrition meals with a focus on
          quality and health. Every dish is specially designed to support your
          active lifestyle, anytime and anywhere.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-6xl px-4 sm:mt-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-foreground sm:mb-12 sm:text-3xl md:text-4xl">
          Our Key Services
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          <Card className="p-6 transition-shadow hover:shadow-lg">
            <CardBody className="text-center">
              <div className="mb-4 text-4xl">🍽️</div>
              <h3 className="mb-3 text-xl font-semibold">Menu Customization</h3>
              <p className="text-default-600">
                Customize your meals based on your dietary preferences and
                personal nutritional needs.
              </p>
            </CardBody>
          </Card>

          <Card className="p-6 transition-shadow hover:shadow-lg">
            <CardBody className="text-center">
              <div className="mb-4 text-4xl">🇮🇩</div>
              <h3 className="mb-3 text-xl font-semibold">
                Nationwide Delivery
              </h3>
              <p className="text-default-600">
                Delivery service to major cities across Indonesia with
                guaranteed freshness.
              </p>
            </CardBody>
          </Card>

          <Card className="p-6 transition-shadow hover:shadow-lg">
            <CardBody className="text-center">
              <div className="mb-4 text-4xl">📊</div>
              <h3 className="mb-3 text-xl font-semibold">
                Nutritional Information
              </h3>
              <p className="text-default-600">
                Get complete and detailed nutritional information for every dish
                you order.
              </p>
            </CardBody>
          </Card>

          <Card className="p-6 transition-shadow hover:shadow-lg">
            <CardBody className="text-center">
              <div className="mb-4 text-4xl">🥗</div>
              <h3 className="mb-3 text-xl font-semibold">Fresh Ingredients</h3>
              <p className="text-default-600">
                Using high-quality fresh ingredients from trusted local sources.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
      <TestimonialsSection />
    </section>
  );
}
