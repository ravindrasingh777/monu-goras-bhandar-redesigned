import {
  Home,
  ShoppingBag,
  Truck,
  Leaf,
  Info,
  Phone,
  PackageSearch,
} from "lucide-react";

export const site = {
  name: "Monu Goras Bhandar",
  phone: "+91 92521 39481",
  whatsapp: "919887700428",
  email: "ravindrasinghrss2004@gmail.com",
  address:
    "26, Phool Colony, near Mahima Public School, Sanganer, Jaipur 302029, Rajasthan",
};

export const telLink = `tel:${site.phone.replace(/\s/g, "")}`;

export const whatsappLink = (
  message = "Hi, I would like to order fresh dairy products.",
) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;

export const navLinks = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    description: "Welcome to Goras",
  },
  {
    label: "Our Products",
    href: "/our-products",
    icon: ShoppingBag,
    description: "Explore our natural products",
  },
  {
    label: "About Us",
    href: "/about-us",
    icon: Info,
    description: "Discover our story and values",
  },
  {
    label: "Why Choose Us",
    href: "/#why-us",
    icon: Leaf,
    description: "Discover what makes us special",
  },
  {
    label: "Delivery",
    href: "/#delivery",
    icon: Truck,
    description: "Learn about our delivery process",
  },
  {
    label: "Track Order",
    href: "/track-order",
    icon: PackageSearch,
    description: "Track your order status",
  },
  {
    label: "Contact Us",
    href: "/contact-us",
    icon: Phone,
    description: "We're here to help you",
  },
];

export const deliveryAreas = ["Sanganer", "Pratap Nagar", "Mansarovar"];

export const categories = [
  "All",
  "Milk",
  "Ghee",
  "Chaach",
  "Shrikhand",
  "Sweets",
] as const;
export type Category = Exclude<(typeof categories)[number], "All">;

// Image for each product: public/images/products/<id>.png
export type Product = {
  id: string;
  name: string;
  category: Category;
  size?: string;
};

export const products: Product[] = [
  {
    id: "cow-milk-1kg",
    name: "Goras Cow Milk",
    category: "Milk",
    size: "1 kg",
  },
  {
    id: "bilona-ghee-1kg",
    name: "Goras Bilona Ghee",
    category: "Ghee",
    size: "1 kg",
  },
  {
    id: "rasgulla",
    name: "Goras Rasgulla",
    category: "Sweets",
    size: "1250 gm",
  },
  { id: "sri-khand", name: "Goras Sri-Khand", category: "Shrikhand" },
  {
    id: "cow-milk-6kg",
    name: "Goras Cow Milk",
    category: "Milk",
    size: "6 kg",
  },
  {
    id: "cow-milk-half-kg",
    name: "Goras Cow Milk",
    category: "Milk",
    size: "1/2 kg",
  },
  { id: "chaach", name: "Goras Chaach", category: "Chaach", size: "1/2 kg" },
  { id: "ghee-1kg", name: "Goras Ghee", category: "Ghee", size: "1 kg" },
  { id: "ghee-15kg", name: "Goras Ghee", category: "Ghee", size: "15 kg" },
  {
    id: "bilona-ghee-15kg",
    name: "Goras Bilona Ghee",
    category: "Ghee",
    size: "15 kg",
  },
];

export const testimonials = [
  {
    name: "Raghuman Singh",
    quote:
      "Amazing service and very fresh dairy products. The delivery was quick and hassle free!",
  },
  {
    name: "Mohit Saini",
    quote:
      "The yogurt is so creamy and fresh. The delivery staff was very courteous.",
  },
  {
    name: "Mal Singh Shekhawat",
    quote:
      "Butter tastes just like homemade. Delivery team was on time and very polite.",
  },
];

export const shipmentRates = [
  { platform: "Shiprocket", pincode: "302001", price: 45 },
  { platform: "Delhivery", pincode: "302001", price: 50 },
  { platform: "Blue Dart", pincode: "302001", price: 75 },
  { platform: "DTDC", pincode: "302001", price: 60 },
  { platform: "Xpressbees", pincode: "302001", price: 48 },
  { platform: "Ecom Express", pincode: "302001", price: 55 },
  { platform: "India Post", pincode: "302001", price: 40 },
  { platform: "Shadowfax", pincode: "302001", price: 52 },
  { platform: "Ekart", pincode: "302001", price: 58 },
  { platform: "Amazon Shipping", pincode: "302001", price: 65 },

  { platform: "Shiprocket", pincode: "110001", price: 65 },
  { platform: "Delhivery", pincode: "110001", price: 55 },
  { platform: "Blue Dart", pincode: "110001", price: 85 },
  { platform: "DTDC", pincode: "110001", price: 70 },
  { platform: "Xpressbees", pincode: "110001", price: 52 },
  { platform: "Ecom Express", pincode: "110001", price: 60 },
  { platform: "India Post", pincode: "110001", price: 45 },
  { platform: "Shadowfax", pincode: "110001", price: 58 },
  { platform: "Ekart", pincode: "110001", price: 62 },
  { platform: "Amazon Shipping", pincode: "110001", price: 72 },

  { platform: "Shiprocket", pincode: "400001", price: 75 },
  { platform: "Delhivery", pincode: "400001", price: 65 },
  { platform: "Blue Dart", pincode: "400001", price: 95 },
  { platform: "DTDC", pincode: "400001", price: 80 },
  { platform: "Xpressbees", pincode: "400001", price: 60 },
  { platform: "Ecom Express", pincode: "400001", price: 68 },
  { platform: "India Post", pincode: "400001", price: 50 },
  { platform: "Shadowfax", pincode: "400001", price: 62 },
  { platform: "Ekart", pincode: "400001", price: 70 },
  { platform: "Amazon Shipping", pincode: "400001", price: 78 },
];

export const coupons = [
  { code: "WELCOME10", amount: 10 },
  { code: "SAVE50", amount: 50 },
  { code: "FIRST100", amount: 100 },
  { code: "DIWALI20", amount: 20 },
  { code: "BIGSALE150", amount: 150 },
];
