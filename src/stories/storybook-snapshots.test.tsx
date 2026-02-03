import { render } from "@testing-library/react";

import MarketStats from "@/components/market/market-stats";
import EventMarkets from "@/components/market/event-markets";
import MarketTicket from "@/components/market/market-ticket";

import { Default as MarketStatsDefault } from "@/components/market/market-stats.stories";
import { Default as EventMarketsDefault } from "@/components/market/event-markets.stories";
import { Default as MarketTicketDefault } from "@/components/market/market-ticket.stories";

describe("storybook snapshots", () => {
  it("MarketStats: Default", () => {
    const { container } = render(<MarketStats {...(MarketStatsDefault.args ?? {})} />);
    expect(container).toMatchSnapshot();
  });

  it("EventMarkets: Default", () => {
    const { container } = render(<EventMarkets {...(EventMarketsDefault.args ?? {})} />);
    expect(container).toMatchSnapshot();
  });

  it("MarketTicket: Default", () => {
    const { container } = render(<MarketTicket {...(MarketTicketDefault.args ?? {})} />);
    expect(container).toMatchSnapshot();
  });
});
