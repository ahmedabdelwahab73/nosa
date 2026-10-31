"use client";

import type { FeedbackMessages } from "@/shared/hooks/use-action-feedback";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";
import { useFeedbackDemo } from "./feedback-demo.ux";

export function FeedbackDemo({ messages }: { messages: FeedbackMessages }) {
  const { formAction, pending } = useFeedbackDemo(messages);

  return (
    <form action={formAction} className="flex gap-3">
      <Button name="outcome" value="ok" disabled={pending}>
        {pending && <Spinner />} Save (success)
      </Button>
      <Button name="outcome" value="fail" variant="outline" disabled={pending}>
        Save (failure)
      </Button>
    </form>
  );
}
