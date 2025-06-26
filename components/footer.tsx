import { Link } from "@heroui/link";

import { siteConfig } from "@/config/site";

export const Footer = () => {
  return (
    <footer className="w-full bg-gray-50 dark:bg-gray-900 border-t border-divider mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">SEA Catering</h3>
            <p className="text-sm text-default-600 leading-relaxed">
              Healthy meal service with delivery across Indonesia. Healthy
              Meals, Anytime, Anywhere.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-md font-semibold text-foreground">Menu</h4>
            <ul className="space-y-2">
              {siteConfig.navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-default-600 hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-md font-semibold text-foreground">
              Contact Us
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">👨‍💼</span>
                <div className="text-sm">
                  <p className="text-default-600">
                    Manager:{" "}
                    <span className="text-foreground font-medium">Brian</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">📱</span>
                <Link
                  href="tel:08123456789"
                  className="text-sm text-primary hover:text-primary-600 transition-colors"
                >
                  08123456789
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-md font-semibold text-foreground">Services</h4>
            <ul className="space-y-2 text-sm text-default-600">
              <li>Menu Customization</li>
              <li>Nationwide Delivery</li>
              <li>Nutritional Information</li>
              <li>Fresh Ingredients</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-divider">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-default-600">
              © {new Date().getFullYear()} SEA Catering. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
