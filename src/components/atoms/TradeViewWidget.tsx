import { useEffect } from "react";
import styled from "styled-components";

const WidgetContainer = styled.div`
  height: -webkit-fill-available;
  width: -webkit-fill-available;
`;
const Widget = styled.div`
  height: -webkit-fill-available;
  width: -webkit-fill-available;
`;

export const TradeViewWidget = ({ ticker }: { ticker: string }) => {
  useEffect(() => {
    if (typeof window.TradingView !== "undefined") {
      new window.TradingView.widget({
        autosize: true,
        symbol: `NASDAQ:${ticker}`,
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: "tradingview_ce73d",
      });
    }
  }, []);

  return (
    <WidgetContainer className="tradingview-widget-container">
      <Widget id="tradingview_ce73d"></Widget>
    </WidgetContainer>
  );
};
