"use client";

import { Component, type ReactNode } from "react";
import { unstable_rethrow } from "next/navigation";
import { ErrorFallback, type ErrorFallbackLabels } from "@/shared/components/error-fallback";

type ErrorBoundaryProps = {
  /** Translated by the Server Component that renders the boundary. */
  labels: ErrorFallbackLabels;
  compact?: boolean;
  children: ReactNode;
};

type ErrorBoundaryState = { error: (Error & { digest?: string }) | null };

/**
 * Keeps one failing section (a widget, a whole screen) from taking the rest of the page down.
 * Server render errors reach it too, with Next's `digest` as the reference number.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("Section failed to render", error);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    // notFound(), redirect() and forbidden() are signals for Next, not failures: pass them up untouched.
    unstable_rethrow(error);
    return <ErrorFallback labels={this.props.labels} reset={this.reset} reference={error.digest} compact={this.props.compact} />;
  }
}
