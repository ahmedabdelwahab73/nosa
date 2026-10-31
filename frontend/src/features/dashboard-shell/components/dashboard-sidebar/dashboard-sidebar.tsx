import type { Locale, UserRole } from "@nosa/contracts";
import { LOCALE_DIR } from "@nosa/contracts";
import { Illustration } from "@/shared/components/illustration";
import { Logo } from "@/shared/components/logo";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/shared/ui/sidebar";
import { navItemsFor } from "../../lib/nav-items";
import { DashboardNav } from "../dashboard-nav";

type DashboardSidebarProps = {
  locale: Locale;
  role: UserRole;
  dict: Dictionary["dashboard"];
};

export function DashboardSidebar({ locale, role, dict }: DashboardSidebarProps) {
  const basePath = `/${locale}/dashboard`;
  const items = navItemsFor(role).map(({ key, path, icon, ready }) => ({
    icon,
    ready,
    href: `${basePath}${path}`,
    label: dict.nav[key],
  }));

  return (
    // The shadcn sidebar takes physical sides, so map "start" for the current direction.
    <Sidebar side={LOCALE_DIR[locale] === "rtl" ? "right" : "left"}>
      <SidebarHeader className="items-center pt-6">
        <Logo href={basePath} tone="light" className="h-24" />
      </SidebarHeader>
      <SidebarContent className="px-3 pt-2">
        <DashboardNav basePath={basePath} items={items} soonLabel={dict.soon} />
      </SidebarContent>
      <SidebarFooter className="relative min-h-44 overflow-hidden" aria-hidden>
        <Illustration name="sidebar-flowers" alt="" className="absolute -bottom-6 end-0 w-24 opacity-80 rtl:-scale-x-100" />
        <Illustration name="handmade-with-love" alt="" className="relative mt-auto w-40 opacity-90" />
      </SidebarFooter>
    </Sidebar>
  );
}
