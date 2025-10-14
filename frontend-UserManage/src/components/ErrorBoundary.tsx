// components/ErrorBoundary.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,  // ⭐ Props type
  ErrorBoundaryState   // ⭐ State type
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("❌ Error Boundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center space-y-4 max-w-md px-4">
            <h1 className="text-3xl font-bold text-red-600">เกิดข้อผิดพลาด</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {this.state.error?.message || "เกิดข้อผิดพลาดในระบบ"}
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
            >
              โหลดหน้าใหม่
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}