import { calculateHistoricalNAV, calculateNAV } from "./calculateNAV";

describe("calculateNAV", () => {
  it("works", () => {
    const equity = 52845;

    const NAV = calculateNAV({ positions: getAssets(), equity });

    expect(NAV).toBeCloseTo(12.68);
  });

  it("worsk2", () => {
    const historicalNAV = calculateHistoricalNAV(getReport());

    expect(historicalNAV[0]).toBeCloseTo(11.85);
    expect(historicalNAV[1]).toBeCloseTo(11.4);
  });
});

function getAssets() {
  return [
    {
      asset_id: "9de9d5e0-2850-4325-ae6a-f8d7511dafb5",
      symbol: "INM",
      exchange: "NASDAQ",
      asset_class: "us_equity",
      asset_marginable: false,
      qty: "2466",
      avg_entry_price: "2.33",
      side: "long",
      market_value: "4537.44",
      cost_basis: "5745.78",
      unrealized_pl: "-1208.34",
      unrealized_plpc: "-0.2103004291845494",
      unrealized_intraday_pl: "-135.63",
      unrealized_intraday_plpc: "-0.029023746701847",
      current_price: "1.84",
      lastday_price: "1.895",
      change_today: "-0.029023746701847",
      qty_available: "0",
    },
    {
      asset_id: "0a664e9d-7a1e-4f2c-9f03-de721f8910ed",
      symbol: "MNMD",
      exchange: "NASDAQ",
      asset_class: "us_equity",
      asset_marginable: false,
      qty: "811",
      avg_entry_price: "3.55",
      side: "long",
      market_value: "3235.89",
      cost_basis: "2879.05",
      unrealized_pl: "356.84",
      unrealized_plpc: "0.123943661971831",
      unrealized_intraday_pl: "72.99",
      unrealized_intraday_plpc: "0.0230769230769231",
      current_price: "3.99",
      lastday_price: "3.9",
      change_today: "0.0230769230769231",
      qty_available: "811",
    },
    {
      asset_id: "1200d1bf-a0d4-4b5b-9cd6-84d3682596db",
      symbol: "TUSK",
      exchange: "NASDAQ",
      asset_class: "us_equity",
      asset_marginable: false,
      qty: "889",
      avg_entry_price: "6.45",
      side: "long",
      market_value: "5502.91",
      cost_basis: "5734.05",
      unrealized_pl: "-231.14",
      unrealized_plpc: "-0.0403100775193798",
      unrealized_intraday_pl: "0",
      unrealized_intraday_plpc: "0",
      current_price: "6.19",
      lastday_price: "6.19",
      change_today: "0",
      qty_available: "0",
    },
  ];
}

function getReport() {
  return [
    {
      positions: [
        {
          symbol: "INM",
          cusip: "457637601",
          long_qty: "2466",
          short_qty: "0",
          long_market_value: "4673.0700",
          short_market_value: "0",
          num_accounts: "1",
          asset_type: "us_equity",
          closing_price: "1.8950",
        },
        {
          symbol: "MNMD",
          cusip: "60255C885",
          long_qty: "811",
          short_qty: "0",
          long_market_value: "3162.9000",
          short_market_value: "0",
          num_accounts: "1",
          asset_type: "us_equity",
          closing_price: "3.9000",
        },

        {
          symbol: "TUSK",
          cusip: "56155L108",
          long_qty: "889",
          short_qty: "0",
          long_market_value: "5502.910000",
          short_market_value: "0",
          num_accounts: "1",
          asset_type: "us_equity",
          closing_price: "6.190000",
        },
      ],
      equity: 49381.70450179724,
    },
    {
      positions: [
        {
          symbol: "GATO",
          cusip: "368036109",
          long_qty: "0",
          short_qty: "-1",
          long_market_value: "0",
          short_market_value: "-4.8300",
          num_accounts: "1",
          asset_type: "us_equity",
          closing_price: "4.8300",
        },
        {
          symbol: "INM",
          cusip: "457637601",
          long_qty: "2466",
          short_qty: "0",
          long_market_value: "4685.400000",
          short_market_value: "0",
          num_accounts: "1",
          asset_type: "us_equity",
          closing_price: "1.900000",
        },
        {
          symbol: "MNMD",
          cusip: "60255C885",
          long_qty: "811",
          short_qty: "0",
          long_market_value: "3280.495000",
          short_market_value: "0",
          num_accounts: "1",
          asset_type: "us_equity",
          closing_price: "4.045000",
        },
        {
          symbol: "NSTG",
          cusip: "63009R109",
          long_qty: "228",
          short_qty: "0",
          long_market_value: "2733.7200",
          short_market_value: "0",
          num_accounts: "1",
          asset_type: "us_equity",
          closing_price: "11.9900",
        },
        {
          symbol: "TSLA",
          cusip: "88160R101",
          long_qty: "0",
          short_qty: "-0.009673443",
          long_market_value: "0",
          short_market_value: "-1.9471673414700",
          num_accounts: "1",
          asset_type: "us_equity",
          closing_price: "201.2900",
        },
        {
          symbol: "TUSK",
          cusip: "56155L108",
          long_qty: "889",
          short_qty: "0",
          long_market_value: "6160.770000",
          short_market_value: "0",
          num_accounts: "1",
          asset_type: "us_equity",
          closing_price: "6.930000",
        },
        {
          symbol: "VOR",
          cusip: "929033108",
          long_qty: "0",
          short_qty: "-653",
          long_market_value: "0",
          short_market_value: "-3682.9200",
          num_accounts: "1",
          asset_type: "us_equity",
          closing_price: "5.6400",
        },
      ],
      equity: 50106.39783265853,
    },
  ];
}
