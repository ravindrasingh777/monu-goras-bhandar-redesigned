"use client";
import {
  ArrowRight,
  ArrowUpRight,
  Leaf,
  Menu,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  ShoppingCartPlus,
  Trash2,
} from "lucide-react";
import Container from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks, whatsappLink } from "@/data/site";
import Image from "next/image";
import logo from "../../app/favicon.ico";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";

export default function Header() {
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items, removeFromCart, updateQuantity } = useCartStore();

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-semibold"
        >
          <Image width={45} height={45} alt="logo" src={logo} />
          Monu Goras Bhandar
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger>
              <Button
                variant="ghost"
                className="relative inline-flex sm:hidden w-auto rounded-full"
              >
                <ShoppingCartPlus className="h-5 w-5 shrink-0" />

                {/* Cart Count Badge */}
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#A1351B] px-1 text-[10px] font-bold text-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Button>
              <Button className="hidden sm:inline-flex relative w-auto px-5 rounded-full">
                <ShoppingCartPlus className="h-5 w-5 shrink-0" />
                View Cart
                {cartCount > 0 && (
                  <span className="absolute -top-3 left-28 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#A1351B] px-1 text-[10px] font-bold text-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex h-full w-full flex-col  border-0 bg-[#FFFAF7] p-0 "
            >
              {/* Header */}
              <SheetHeader className="px-6 pb-5 pt-6 text-left">
                <SheetTitle className="font-display text-3xl font-semibold text-black">
                  Your cart
                </SheetTitle>

                <div className="container h-[500px]  overflow-auto mx-auto py-10">
                  {items?.length === 0 && (
                    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#e3e8df] bg-[#fbf8f2] px-5 py-10 text-center">
                      {/* Cart Icon */}
                      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f6ead0]">
                        <ShoppingBag
                          className="h-7 w-7 text-[#A1351B]"
                          strokeWidth={1.5}
                        />
                      </div>

                      {/* Heading */}
                      <h3 className="font-display text-2xl font-medium text-[#1c2a22]">
                        Your cart is empty
                      </h3>

                      {/* Description */}
                      <p className="mt-2 max-w-[280px] text-sm leading-relaxed text-[#5b6b61]">
                        Looks like you haven&apos;t added anything yet.
                        Explore our natural goodness and find something you
                        love.
                      </p>

                      {/* Shop Button */}
                      <Button onClick={()=> setIsCartOpen(false)} className="mt-6 h-11 rounded-xl bg-[#A1351B] px-7 text-white hover:bg-[#842b17]">
                        <Link className="inline-flex" href="/our-products">
                          Explore Products
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  )}

                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center mb-2 md:mr-4 border border-gray-200 bg-white rounded-3xl  gap-4 p-5 border-b"
                    >
                      <div>
                        <Image
                          src={item.bannerImage}
                          alt={item.title}
                          width={100}
                          height={100}
                          className="rounded-lg border p-1 border-gray-200"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[17px]">
                          {item.title}
                        </h3>
                        <div className="flex text-base gap-2 items-center">
                          <p>₹{item.final_price}</p>
                          <span className=" text-red-600 line-through">
                            {new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: "INR",
                              maximumFractionDigits: 2,
                            }).format(Number(item.price))}
                          </span>
                        </div>
                        <div className="flex gap-3 mt-2 items-center">
                          <button
                            className="px-2 py-1 bg-gray-200 rounded"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1),
                              )
                            }
                          >
                            -
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            className="px-2 py-1 bg-gray-200 rounded"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </button>

                          <button
                            className="px-2 py-1 bg-[#A1351B] text-white rounded"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* <h2 className="text-xl font-bold mt-5">
                    Subtotal: ₹{subtotal}
                  </h2> */}
                </div>
              </SheetHeader>
              <SheetFooter className="px-6 py-5">
                <Button
                  onClick={() => {
                    setIsCartOpen(false);
                    router.push("/checkout");
                  }}
                  className="w-full h-10  font-bold rounded-full bg-[#A1351B] text-xl  text-white hover:bg-[#902a15]"
                >
                  Checkout  <span className="ml-1">₹{subtotal}</span>
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="flex w-full h-full flex-col border-l border-[#e3e8df] bg-[#fbf8f2] p-0 text-[#1c2a22]"
            >
              {/* Header */}
              <div className="border-b border-[#e3e8df] px-6 pb-6 pt-8">
                <div className="flex items-center justify-between pr-8">
                  <div>
                    <SheetTitle className="font-display text-3xl font-medium text-[#1c2a22]">
                      Explore
                    </SheetTitle>

                    <SheetDescription className="mt-1 text-sm text-[#5b6b61]">
                      Discover the goodness of nature.
                    </SheetDescription>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f6ead0]">
                    <Leaf className="h-5 w-5 text-[#A1351B]" />
                  </div>
                </div>

                <div className="mt-5 h-[2px] w-12 rounded-full bg-[#A1351B]" />
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto px-4 py-6">
                <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[2px] text-[#8b968d]">
                  Main Navigation
                </p>

                <div className="flex flex-col gap-1.5">
                  {navLinks.map((link) => {
                    const Icon = link.icon;

                    return (
                      <SheetClose key={link.href}>
                        <Link
                          href={link.href}
                          className="group flex items-center justify-between rounded-xl px-3 py-3.5 transition-all duration-200 hover:bg-[#f6ead0]"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#5b6b61] shadow-sm transition-all duration-200 group-hover:bg-[#A1351B] group-hover:text-white">
                              <Icon className="h-[19px] w-[19px]" />
                            </div>

                            <span className="font-sans text-[15px] font-medium text-[#1c2a22] transition-colors group-hover:text-[#A1351B]">
                              {link.label}
                            </span>
                          </div>

                          <ArrowUpRight className="h-4 w-4 text-[#a3ada5] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#A1351B]" />
                        </Link>
                      </SheetClose>
                    );
                  })}
                </div>
              </nav>

              {/* WhatsApp Contact Section */}
              <div className="border-t border-[#e3e8df] bg-white/60 p-5">
                <div className="mb-4">
                  <p className="font-display text-xl text-[#1c2a22]">
                    Need assistance?
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-[#5b6b61]">
                    Have questions about our products? We`&apos;`re just a
                    message away.
                  </p>
                </div>

                <Button className="h-12 w-full rounded-xl bg-[#A1351B] font-medium text-white shadow-sm transition-all hover:bg-[#842b17]">
                  <Link
                    className="inline-flex items-center justify-center gap-2"
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp /> Connect on WhatsApp
                  </Link>
                </Button>

                <p className="mt-3 text-center text-[10px] tracking-wide text-[#8b968d]">
                  MADE WITH LOVE & NATURAL GOODNESS
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
