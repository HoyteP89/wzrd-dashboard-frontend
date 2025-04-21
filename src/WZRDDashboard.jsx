import React, { useState, useEffect } from 'react';

const WZRDDashboard = () => {
  const [selectedPair, setSelectedPair] = useState("bitcoin");
  const [coinData, setCoinData] = useState(null);
  const [gptOutput, setGptOutput] = useState("Awaiting market scan...");
  const [tradeLogs, setTradeLogs] = useState([]);
  const [gptReview, setGptReview] = useState(null);

  const pairs = [
    { label: "Bitcoin (BTC/USDT)", value: "bitcoin", tvSymbol: "BINANCE:BTCUSDT" },
    { label: "Ethereum (ETH/USDT)", value: "ethereum", tvSymbol: "BINANCE:ETHUSDT" },
    { label: "Chainlink (LINK/USDT)", value: "chainlink", tvSymbol: "BINANCE:LINKUSDT" },
    { label: "Ripple (XRP/USDT)", value: "ripple", tvSymbol: "BINANCE:XRPUSDT" },
    { label: "Solana (SOL/USDT)", value: "solana", tvSymbol: "BINANCE:SOLUSDT" },
    { label: "Pepe (PEPE/USDT)", value: "pepe", tvSymbol: "BINANCE:PEPEUSDT" },
    { label: "Jasmy (JASMY/USDT)", value: "jasmycoin", tvSymbol: "BINANCE:JASMYUSDT" },
  ];

  const currentPair = pairs.find(pair => pair.value === selectedPair);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${selectedPair}`);
      const data = await res.json();
      const rsi = (Math.random() * (80 - 20) + 20).toFixed(2);
      setCoinData({ price: data.market_data.current_price.usd, volume: data.market_data.total_volume.usd, rsi });

      const gptRes = await fetch("https://wzrd-gpt-backend.vercel.app/api/wzrd-gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pair: selectedPair.toUpperCase(),
          price: data.market_data.current_price.usd,
          rsi,
          volume: data.market_data.total_volume.usd
        })
      });
      const gptData = await gptRes.json();
      setGptOutput(gptData.result);
    };
    fetchData();
    const logs = JSON.parse(localStorage.getItem("wzrd_trade_logs")) || [];
    setTradeLogs(logs);
  }, [selectedPair]);

  const getSession = () => {
    const h = new Date().getUTCHours();
    return h < 8 ? "Asia" : h < 16 ? "London" : "New York";
  };

  const handleLogTrade = () => {
    const log = {
      id: Date.now(),
      pair: selectedPair,
      timestamp: new Date().toISOString(),
      session: getSession(),
      trade: gptOutput,
      outcome: null,
    };
    const updated = [log, ...tradeLogs];
    localStorage.setItem("wzrd_trade_logs", JSON.stringify(updated));
    setTradeLogs(updated);
  };

  const handleReview = async () => {
    const res = await fetch("https://wzrd-gpt-backend.vercel.app/api/wzrd-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logs: tradeLogs })
    });
    const data = await res.json();
    setGptReview(data.review);
  };

  return (
    <div className="bg-black min-h-screen text-white p-6 space-y-6">
      <h1 className="text-3xl text-purple-400 font-bold">🔮 WZRD Dashboard</h1>

      <select
        value={selectedPair}
        onChange={(e) => setSelectedPair(e.target.value)}
        className="bg-gray-800 p-3 rounded-lg border border-purple-600 text-white"
      >
        {pairs.map(pair => <option key={pair.value} value={pair.value}>{pair.label}</option>)}
      </select>

      <iframe
        src={`https://www.tradingview.com/chart/?symbol=${currentPair.tvSymbol}`}
        width="100%"
        height="400"
        frameBorder="0"
        className="rounded border-2 border-purple-700"
      ></iframe>

      <div className="p-4 bg-gray-900 border border-blue-600 rounded">
        <h2 className="text-xl text-purple-300 mb-2">GPT Setup</h2>
        <pre className="whitespace-pre-wrap text-sm text-gray-200">{gptOutput}</pre>
        <button onClick={handleLogTrade} className="mt-2 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700">
          📘 Log This Trade
        </button>
      </div>

      <div className="p-4 bg-gray-800 border border-purple-500 rounded">
        <h2 className="text-lg text-purple-200 mb-2">📘 Trade Journal</h2>
        {tradeLogs.map(log => (
          <div key={log.id} className="mb-4 p-3 bg-gray-900 border border-purple-700 rounded">
            <div className="text-sm text-blue-300">{new Date(log.timestamp).toLocaleString()} – {log.pair.toUpperCase()} – {log.session}</div>
            <pre className="text-sm text-gray-200 whitespace-pre-wrap">{log.trade}</pre>
            <div className="mt-2">
              Outcome: {log.outcome || "Pending"}
              <button onClick={() => {
                const updated = tradeLogs.map(l => l.id === log.id ? { ...l, outcome: "✅ Win" } : l);
                setTradeLogs(updated);
                localStorage.setItem("wzrd_trade_logs", JSON.stringify(updated));
              }} className="ml-4 px-2 py-1 bg-green-600 rounded">✅ Win</button>
              <button onClick={() => {
                const updated = tradeLogs.map(l => l.id === log.id ? { ...l, outcome: "❌ Loss" } : l);
                setTradeLogs(updated);
                localStorage.setItem("wzrd_trade_logs", JSON.stringify(updated));
              }} className="ml-2 px-2 py-1 bg-red-600 rounded">❌ Loss</button>
            </div>
          </div>
        ))}

        <button onClick={handleReview} className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
          🧠 Get GPT Feedback
        </button>
        {gptReview && (
          <div className="mt-4 p-4 bg-gray-700 rounded border border-blue-400">
            <h3 className="text-lg text-blue-200 mb-2">🧠 GPT Insights</h3>
            <pre className="text-sm text-white whitespace-pre-wrap">{gptReview}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default WZRDDashboard;
