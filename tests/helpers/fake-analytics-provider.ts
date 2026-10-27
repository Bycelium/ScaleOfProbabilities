import type { AnalyticsDomainEvent, AnalyticsProvider } from "../../src/analytics";

export class FakeAnalyticsProvider implements AnalyticsProvider {
  readonly events: AnalyticsDomainEvent[] = [];
  readonly callbacks: Array<() => void> = [];
  starts = 0;
  stops = 0;
  disposals = 0;
  throwOnSend = false;
  onSend?: (event: AnalyticsDomainEvent) => void;

  start(onReady: () => void): void {
    this.starts += 1;
    this.callbacks.push(onReady);
  }

  ready(index = this.callbacks.length - 1): void {
    this.callbacks[index]?.();
  }

  send(event: AnalyticsDomainEvent): void {
    if (this.throwOnSend) throw new Error("provider failure");
    this.events.push(event);
    this.onSend?.(event);
  }

  stop(): void { this.stops += 1; }
  dispose(): void { this.disposals += 1; }
}
