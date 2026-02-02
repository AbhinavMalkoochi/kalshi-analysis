import EventCard from "@/components/event-card";
import type { GroupedEvent } from "@/lib/kalshi";

export default function EventGrid({ events }: { events: GroupedEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-border/40 bg-black/40 p-8 text-center">
        <p className="text-muted-foreground">No markets found</p>
      </div>
    );
  }
  
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.event_ticker} event={event} />
      ))}
    </div>
  );
}
