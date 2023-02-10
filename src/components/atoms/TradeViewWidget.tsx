import { useEffect } from "react";
import styled from "styled-components";

const WidgetContainer = styled.div`
  height: 100%;
  width: 100%;
`;
const Widget = styled.div`
  height: 100%;
`;

export const TradeViewWidget = ({ ticker }: { ticker: string }) => {
  useEffect(() => {
    if (TradingView) {
      new TradingView.widget({
        autosize: true,
        symbol: `${ticker}`,
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
