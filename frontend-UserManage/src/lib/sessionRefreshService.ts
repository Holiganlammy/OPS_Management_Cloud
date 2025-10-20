// lib/sessionRefreshService.ts
"use client"
class SessionRefreshService {
  private intervalId: NodeJS.Timeout | null = null;
  private isRefreshing: boolean = false;
  private readonly REFRESH_INTERVAL = 5 * 60 * 1000; // ⭐ 5 นาที (ไม่ใช่ทุกวินาที)

  start(updateCallback: () => Promise<void>) {
    if (this.intervalId) {
      console.log("⚠️ Refresh service already running");
      return;
    }

    this.intervalId = setInterval(async () => {
      if (this.isRefreshing) {
        console.log("⏭️ Already refreshing, skip");
        return;
      }
      try {
        this.isRefreshing = true;
        console.log("🔄 Auto-refreshing session...");
        await updateCallback();
      } catch (error) {
        console.error("❌ Failed to refresh session:", error);
      } finally {
        this.isRefreshing = false;
      }
    }, this.REFRESH_INTERVAL);

    console.log("✅ Session refresh service started");
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.isRefreshing = false;
      console.log("🛑 Session refresh service stopped");
    }
  }
}

export const sessionRefreshService = new SessionRefreshService();