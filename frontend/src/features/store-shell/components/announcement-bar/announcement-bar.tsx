import { YarnBall } from "@/shared/components/yarn-ball";

/** Thin purple strip above the header ("Free shipping over 1500 EGP"). Hidden when the owner turns it off. */
export function AnnouncementBar({ text }: { text?: string }) {
  if (!text) return null;

  return (
    <div className="bg-primary-600 px-4 py-1.5 text-center text-sm text-primary-foreground">
      <span className="inline-flex items-center gap-2">
        <YarnBall className="size-4 text-primary-foreground" />
        {text}
      </span>
    </div>
  );
}
