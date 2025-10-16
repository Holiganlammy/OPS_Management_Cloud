// lib/sessionRefreshService.ts
"use client";

class SessionRefreshService {
  private intervalId: NodeJS.Timeout | null = null;
  private isInitialized = false;
  private updateFn: (() => Promise<void>) | null = null;

  start(updateFunction: () => Promise<void>) {
    if (this.isInitialized) {
      console.log("⏭️ Session refresh already running");
      return;
    }

    this.isInitialized = true;
    this.updateFn = updateFunction;
    console.log("✅ Session refresh service started (2 seconds then every 15 minutes)");

    // First refresh after 2 seconds
    setTimeout(() => {
      console.log("🔄 Loading New Session");
      this.refresh();
    }, 2000);

    // Then every 5 minutes
    this.intervalId = setInterval(() => {
      console.log("🔄 Auto-refresh");
      this.refresh();
    }, 15 * 60 * 1000);
  }

  private refresh() {
    if (this.updateFn) {
      this.updateFn().catch((error) => {
        console.error("❌ Refresh failed:", error);
      });
    }
  }

  stop() {
    console.log("🛑 Session refresh service stopped");
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isInitialized = false;
    this.updateFn = null;
  }
}

//  Export singleton instance
export const sessionRefreshService = new SessionRefreshService();