"use client";

import { ArrowDown, ArrowUp, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import { HOME_SECTION_TYPES, type HomeSectionDto, type Locale } from "@nosa/contracts";
import { EmptyState } from "@/shared/components/empty-state";
import type { ImageUploaderLabels } from "@/shared/components/image-uploader";
import type { FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import type { Dictionary } from "@/shared/i18n/get-dictionary";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import { Spinner } from "@/shared/ui/spinner";
import { Switch } from "@/shared/ui/switch";
import { SectionDialog } from "../section-dialog";
import { useHomeManager } from "./home-manager.ux";

type HomeManagerProps = {
  sections: HomeSectionDto[];
  locale: Locale;
  labels: Dictionary["dashboard"]["content"];
  languages: Record<Locale, string>;
  categories: { slug: string; name: Record<Locale, string> }[];
  uploaderLabels: ImageUploaderLabels;
  invalidMessage: string;
  messages: FeedbackMessages;
};

export function HomeManager({ sections, locale, labels, languages, categories, uploaderLabels, invalidMessage, messages }: HomeManagerProps) {
  const manager = useHomeManager(sections, messages);
  const home = labels.home;

  const addMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="lg" className="h-10 px-4">
          <Plus />
          {home.add}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {HOME_SECTION_TYPES.map((type) => (
          <DropdownMenuItem key={type} onSelect={() => manager.openDialog(null, type)}>
            <span className="flex flex-col">
              <span>{home.types[type]}</span>
              <span className="text-xs text-muted-foreground">{home.typeHints[type]}</span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-muted-foreground">{home.hint}</p>
        {addMenu}
      </div>

      {manager.sections.length ? (
        <ol className="flex flex-col gap-3">
          {manager.sections.map((section, index) => {
            const heading = ("title" in section.content && section.content.title?.[locale]) || home.types[section.content.type];
            return (
              <li key={section.id} className="flex flex-wrap items-center gap-3 rounded-2xl border bg-card p-3 shadow-card sm:px-4">
                <div className="flex flex-col">
                  <Button variant="ghost" size="icon-sm" disabled={index === 0 || manager.pending} aria-label={home.actions.moveUp} onClick={() => manager.move(index, -1)}>
                    <ArrowUp />
                  </Button>
                  <Button variant="ghost" size="icon-sm" disabled={index === manager.sections.length - 1 || manager.pending} aria-label={home.actions.moveDown} onClick={() => manager.move(index, 1)}>
                    <ArrowDown />
                  </Button>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate font-medium">{heading}</span>
                  <Badge variant="secondary" className="w-fit">
                    {home.types[section.content.type]}
                  </Badge>
                </div>
                <Switch checked={section.isActive} disabled={manager.pending} onCheckedChange={() => manager.toggle(section)} aria-label={section.isActive ? home.shown : home.hidden} />
                <span className="w-14 text-sm text-muted-foreground">{section.isActive ? home.shown : home.hidden}</span>
                <Button variant="ghost" size="icon-sm" title={home.actions.edit} aria-label={`${home.actions.edit}: ${heading}`} onClick={() => manager.openDialog(section)}>
                  <Pencil />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="text-destructive" title={home.actions.delete} aria-label={`${home.actions.delete}: ${heading}`}>
                      <Trash2 />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{home.delete.title}</AlertDialogTitle>
                      <AlertDialogDescription>{home.delete.text}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{home.delete.cancel}</AlertDialogCancel>
                      <AlertDialogAction onClick={() => manager.remove(section)}>{home.delete.confirm}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </li>
            );
          })}
        </ol>
      ) : (
        <EmptyState
          illustration="yarn-basket"
          title={home.empty}
          description={home.emptyHint}
          action={
            <Button size="xl" onClick={manager.seed} disabled={manager.pending}>
              {manager.pending ? <Spinner /> : <Sparkles />}
              {home.useDefault}
            </Button>
          }
        />
      )}

      <SectionDialog
        key={manager.dialog.key}
        open={manager.dialog.open}
        onOpenChange={manager.setDialogOpen}
        section={manager.dialog.section}
        newType={manager.dialog.type}
        locale={locale}
        labels={labels}
        languages={languages}
        categories={categories}
        uploaderLabels={uploaderLabels}
        invalidMessage={invalidMessage}
        messages={messages}
      />
    </div>
  );
}
