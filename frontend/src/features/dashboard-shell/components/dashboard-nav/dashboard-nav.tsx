"use client";

import Link from "next/link";
import {
  ClipboardList,
  GalleryVerticalEnd,
  LayoutDashboard,
  LayoutGrid,
  PanelsTopLeft,
  Settings,
  ShoppingBag,
  Sparkles,
  Star,
  Ticket,
  Truck,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";
import { SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem } from "@/shared/ui/sidebar";
import type { NavItem } from "../../lib/nav-items";
import { useDashboardNav } from "./dashboard-nav.ux";

const ICONS: Record<NavItem["icon"], LucideIcon> = {
  overview: LayoutDashboard,
  orders: ClipboardList,
  customOrders: Sparkles,
  products: ShoppingBag,
  categories: LayoutGrid,
  customers: Users,
  coupons: Ticket,
  reviews: Star,
  stories: GalleryVerticalEnd,
  content: PanelsTopLeft,
  shipping: Truck,
  staff: UserCog,
  settings: Settings,
};

export type DashboardNavEntry = Pick<NavItem, "icon" | "ready"> & { href: string; label: string };

type DashboardNavProps = {
  basePath: string;
  items: DashboardNavEntry[];
  soonLabel: string;
};

export function DashboardNav({ basePath, items, soonLabel }: DashboardNavProps) {
  const { isActive } = useDashboardNav(basePath);

  return (
    <SidebarMenu>
      {items.map(({ icon, href, label, ready }) => {
        const Icon = ICONS[icon];
        return (
          <SidebarMenuItem key={href}>
            {ready ? (
              <SidebarMenuButton asChild isActive={isActive(href)} size="lg" className="rounded-xl text-base">
                <Link href={href}>
                  <Icon />
                  <span>{label}</span>
                </Link>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton disabled size="lg" className="rounded-xl text-base opacity-50" aria-disabled>
                <Icon />
                <span>{label}</span>
                <SidebarMenuBadge className="text-[0.65rem]">{soonLabel}</SidebarMenuBadge>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
