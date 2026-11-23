"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Box,
  LayoutDashboard,
  LogOut,
  ShoppingCart,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";

import { MdOutlineSpaceDashboard } from "react-icons/md";
import { Button } from "./ui/button";
import { toast } from "./ui/toast";
import { useRouter } from "next/navigation";

export function AppSidebar() {
  const router = useRouter();
  interface MenuItem {
    title: string;
    link: string;
    icon: any;
  }

  const menuItems = [
    { title: "Overview", link: "/admin", icon: MdOutlineSpaceDashboard },
    { title: "Products", link: "/admin/products", icon: Box },
    { title: "Categories", link: "/admin/categories", icon:LayoutDashboard },
    { title: "Orders", link: "/admin/orders", icon: ShoppingCart },
    { title: "Customers", link: "/admin/customers", icon: Users },
    { title: "Reviews", link: "/admin/reviews", icon: Star },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.add({
          type: "success",
          title: "Logout successful!",
          description: "You have been logged out successfully.",
        });
        router.refresh();
      } else {
        toast.add({
          type: "error",
          title: "Logout failed!",
          description: "An error occurred while trying to logout.",
        });
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.add({
        type: "error",
        title: "Logout failed!",
        description: "An unexpected error occurred.",
      });
    }
  };

  return (
    <>
      <Sidebar className="border-r bg-background">
        <SidebarHeader className="border-b px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <LayoutDashboard className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Admin Panel
              </h2>
              <p className="text-xs text-muted-foreground">
                Manage and monitor your store
              </p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-5">
          <SidebarMenu className="gap-1">
            {menuItems.map((item: MenuItem, index: number) => {
              const Icon = item.icon;

              return (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="h-10 border-2 border-gray-200 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Link href={item.link} className="flex items-center gap-2">
                      <Icon className="h-[18px] w-[18px]" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t p-4">
          <Button
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
