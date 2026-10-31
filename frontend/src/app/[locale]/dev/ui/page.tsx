import { notFound } from "next/navigation";
import { ORDER_STATUSES } from "@nosa/contracts";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { getFeedbackMessages } from "@/shared/i18n/get-feedback-messages";
import { Reveal, RevealGroup } from "@/shared/components/reveal";
import { FeedbackDemo } from "./_feedback-demo";
import { Logo } from "@/shared/components/logo";
import { LocaleSwitcher } from "@/shared/components/locale-switcher";
import { Price } from "@/shared/components/price";
import { RatingStars } from "@/shared/components/rating-stars";
import { SectionTitle } from "@/shared/components/section-title";
import { StatusBadge } from "@/shared/components/status-badge";
import { Illustration } from "@/shared/components/illustration";
import { ThreadLine } from "@/shared/components/thread-line";
import { YarnBall } from "@/shared/components/yarn-ball";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Checkbox } from "@/shared/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/ui/sheet";
import { Skeleton } from "@/shared/ui/skeleton";
import { Switch } from "@/shared/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";

// Development-only showcase of the design system in both languages. Sample copy is hard-coded on purpose.
export default async function DevUiPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const [locale, dict, feedback] = await Promise.all([getLocale(), getDictionary(), getFeedbackMessages()]);

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 px-4 py-10">
      <div className="flex items-center justify-between">
        <Logo href={`/${locale}`} className="h-20" />
        <LocaleSwitcher label={dict.common.switchLocale} />
      </div>

      <SectionTitle title={dict.home.heroTitle} subtitle={dict.home.heroSubtitle} />
      <SectionTitle variant="inline" title="Featured Products" />

      <Showcase title="Motifs · Script font">
        <ThreadLine variant="heart" className="w-56" />
        <YarnBall className="size-8" />
        <YarnBall spinning className="size-8 text-yarn-500" />
        <span className="font-script text-4xl text-primary-600">Handmade with love</span>
        <div className="stitch-soft rounded-2xl border-2 bg-blush/40 p-4 text-sm text-primary-800">stitch-soft card</div>
      </Showcase>

      <Showcase title="Illustrations">
        {(["yarn-ball", "yarn-happy", "yarn-basket", "empty-cart", "empty-search", "handmade-with-love"] as const).map((name) => (
          <Illustration key={name} name={name} alt="" className="w-40" />
        ))}
        <div className="rounded-2xl bg-sidebar p-4">
          <Illustration name="sidebar-flowers" alt="" className="w-16" />
        </div>
      </Showcase>

      <Showcase title="Buttons">
        <Button size="xl">{dict.common.shopNow}</Button>
        <Button size="xl" variant="outline">{dict.common.customOrder}</Button>
        <Button variant="yarn">Sale</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Delete</Button>
        <Button disabled>Disabled</Button>
      </Showcase>

      <Showcase title="Price · Rating · Badges">
        <Price amount={850} compareAt={1100} locale={locale} size="lg" />
        <Price amount={450} locale={locale} />
        <RatingStars value={4.5} count={38} label={dict.rating.outOf.replace("{value}", "4.5")} />
        <Badge>Handmade</Badge>
        <Badge variant="secondary">New</Badge>
        <span className="stitch rounded-full border px-3 py-1 text-xs text-primary-700">Stitch</span>
      </Showcase>

      <Showcase title="Order statuses">
        {ORDER_STATUSES.map((status) => (
          <StatusBadge key={status} status={status} label={dict.orderStatus[status]} />
        ))}
      </Showcase>

      <Showcase title="Form controls">
        <div className="grid w-full max-w-sm gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" placeholder="01012345678" dir="ltr" />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms">Remember me</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="guest" defaultChecked />
          <Label htmlFor="guest">Guest checkout</Label>
        </div>
        <ToggleGroup type="single" variant="outline" defaultValue="6-12m">
          {["0-3m", "3-6m", "6-12m", "1-2y"].map((size) => (
            <ToggleGroupItem key={size} value={size}>{size}</ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Showcase>

      <Showcase title="Overlays">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dict.common.customOrder}</DialogTitle>
              <DialogDescription>{dict.home.heroSubtitle}</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Open cart sheet</Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Cart</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </Showcase>

      <Showcase title="Card · Tabs · Accordion">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Minnie dress set</CardTitle>
            <CardDescription>Dress + hat · 6-12m</CardDescription>
          </CardHeader>
          <CardContent>
            <Price amount={850} compareAt={1100} locale={locale} />
          </CardContent>
        </Card>
        <Tabs defaultValue="ar" className="w-full max-w-sm">
          <TabsList>
            <TabsTrigger value="ar">العربية</TabsTrigger>
            <TabsTrigger value="en">English</TabsTrigger>
          </TabsList>
          <TabsContent value="ar">اسم المنتج بالعربي</TabsContent>
          <TabsContent value="en">Product name in English</TabsContent>
        </Tabs>
        <Accordion type="single" collapsible className="w-full max-w-sm">
          <AccordionItem value="care">
            <AccordionTrigger>Care instructions</AccordionTrigger>
            <AccordionContent>Hand wash cold, dry flat.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Showcase>

      <Showcase title="Action feedback (toasts)">
        <FeedbackDemo messages={feedback} />
      </Showcase>

      <Showcase title="Motion">
        <RevealGroup className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4" variant="scaleIn">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="aspect-square rounded-2xl bg-blush" />
          ))}
        </RevealGroup>
        <Reveal className="w-full rounded-2xl bg-primary-50 p-6 text-primary-800">{dict.home.heroSubtitle}</Reveal>
      </Showcase>

      <Showcase title="Feedback">
        <Alert className="max-w-md">
          <AlertTitle>{dict.errors.RATE_LIMITED}</AlertTitle>
          <AlertDescription>{dict.errors.requestId}: 7f3a-91c2</AlertDescription>
        </Alert>
        <div className="flex w-full max-w-xs flex-col gap-2">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </Showcase>
    </main>
  );
}

function Showcase({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border bg-card p-6">{children}</div>
    </section>
  );
}
