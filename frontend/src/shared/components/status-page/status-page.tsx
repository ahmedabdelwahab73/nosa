import Link from "next/link";
import { Illustration, type IllustrationName } from "@/shared/components/illustration";
import { Button } from "@/shared/ui/button";

type StatusPageProps = {
  illustration: Extract<IllustrationName, "empty-search" | "empty-cart" | "yarn-happy">;
  title: string;
  text: string;
  action: { href: string; label: string };
};

/** One friendly full-page message for "not found" and "not allowed". */
export function StatusPage({ illustration, title, text, action }: StatusPageProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-20 text-center">
      <Illustration name={illustration} alt="" className="w-52" />
      <h1 className="font-display text-2xl font-semibold text-primary-800">{title}</h1>
      <p className="text-muted-foreground">{text}</p>
      <Button asChild size="xl">
        <Link href={action.href}>{action.label}</Link>
      </Button>
    </div>
  );
}
