import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/shared/config/site";
import { cn } from "@/shared/lib/utils/cn";

type LogoProps = {
  href: string;
  /** "light" is for dark backgrounds (footer, story viewer). */
  tone?: "dark" | "light";
  className?: string;
  priority?: boolean;
};

export function Logo({ href, tone = "dark", className, priority }: LogoProps) {
  return (
    <Link href={href} aria-label={siteConfig.name} className={cn("inline-block", className)}>
      <Image
        src={siteConfig.logo[tone]}
        alt={siteConfig.name}
        width={siteConfig.logo.width}
        height={siteConfig.logo.height}
        priority={priority}
        className="h-full w-auto"
      />
    </Link>
  );
}
