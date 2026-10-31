import { cn } from "@/shared/lib/utils";

export type SocialNetwork = "instagram" | "facebook" | "tiktok";

/** lucide no longer ships brand logos, so the three we link to are drawn here as simple outlines. */
export function SocialIcon({ network, className }: { network: SocialNetwork; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cn("size-5", className)}>
      {network === "instagram" && (
        <>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
        </>
      )}
      {network === "facebook" && <path d="M14 8.5h3V4.5h-3a4 4 0 0 0-4 4v2.5H7v4h3V21h4v-6h3l1-4h-4V8.5z" />}
      {network === "tiktok" && <path d="M15 3.5a4.5 4.5 0 0 0 4 4V11a8 8 0 0 1-4-1.3v5.8a5.5 5.5 0 1 1-5.5-5.5v3.3a2.2 2.2 0 1 0 2.2 2.2V3.5H15z" />}
    </svg>
  );
}
