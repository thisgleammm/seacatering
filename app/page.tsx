import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Link } from "@heroui/link";

import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 sm:gap-8 py-4 sm:py-8 md:py-10 px-4 sm:px-6">
      <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-xl md:rounded-3xl">
        <Card className="w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] border-none">
          <CardBody className="relative p-0 overflow-hidden">
            <div
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat blur-sm brightness-60"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
              }}
            />
            <div className="absolute inset-0 bg-black/50 z-10" />

            <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 md:px-8">
              <div className="max-w-4xl mx-auto">
                <h1 className="uppercase text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                  {siteConfig.name}
                </h1>

                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 mb-6 sm:mb-8 font-medium px-2">
                  {siteConfig.description}
                </p>

                <Button
                  as={Link}
                  className="text-white font-semibold text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 h-auto rounded-full shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-200"
                  href="/menu"
                  size="lg"
                  color="primary"
                  variant="solid"
                >
                  Order Now
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="max-w-4xl mx-auto text-center mt-12 sm:mt-16 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6">
          Welcome to SEA Catering
        </h2>
        <p className="text-base sm:text-lg text-default-600 mb-8 sm:mb-12 leading-relaxed">
          SEA Catering is a customizable healthy meal service that delivers
          across Indonesia. We provide high-nutrition meals with a focus on
          quality and health. Every dish is specially designed to support your
          active lifestyle, anytime and anywhere.
        </p>
      </div>

      <div className="max-w-6xl mx-auto mt-12 sm:mt-16 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-12 text-center">
          Our Key Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardBody className="text-center">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold mb-3">Menu Customization</h3>
              <p className="text-default-600">
                Customize your meals based on your dietary preferences and
                personal nutritional needs.
              </p>
            </CardBody>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardBody className="text-center">
              <div className="text-4xl mb-4">🇮🇩</div>
              <h3 className="text-xl font-semibold mb-3">
                Nationwide Delivery
              </h3>
              <p className="text-default-600">
                Delivery service to major cities across Indonesia with
                guaranteed freshness.
              </p>
            </CardBody>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardBody className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3">
                Nutritional Information
              </h3>
              <p className="text-default-600">
                Get complete and detailed nutritional information for every dish
                you order.
              </p>
            </CardBody>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardBody className="text-center">
              <div className="text-4xl mb-4">🥗</div>
              <h3 className="text-xl font-semibold mb-3">Fresh Ingredients</h3>
              <p className="text-default-600">
                Using high-quality fresh ingredients from trusted local sources.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
}
