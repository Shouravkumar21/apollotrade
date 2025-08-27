// import React, { useState } from "react";

// export default function App() {
//   const [query, setQuery] = useState("");
//   const [filters, setFilters] = useState(null);
//   const [tokens, setTokens] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // --- Parse with OpenAI instead of regex ---
//   const parseWithAI = async (q) => {
//     try {
//       const res = await fetch("https://api.openai.com/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: "gpt-4o-mini", // fast + cheap model
//           messages: [
//             {
//               role: "system",
//               content:
//                 "You are an assistant that converts natural language trading queries into structured JSON filters. Use only keys: chain, marketCap, volume1hChange, honeypotScore.",
//             },
//             { role: "user", content: q },
//           ],
//           response_format: { type: "json_object" },
//         }),
//       });

//       const data = await res.json();
//       return JSON.parse(data.choices[0].message.content);
//     } catch (err) {
//       console.error("OpenAI parsing error:", err);
//       return null;
//     }
//   };

//   const runQuery = async () => {
//     setLoading(true);

//     // Step 1: Parse query with OpenAI
//     const parsed = await parseWithAI(query);
//     setFilters(parsed);

//     try {
//       // Step 2: Fetch tokens from Dexscreener
//       const res = await fetch(
//         `https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(
//           query || "SOL"
//         )}`
//       );
//       const data = await res.json();
//       const pairs = data.pairs || [];

//       // Step 3: Normalize tokens
//       const normalizedTokens = pairs.map((t) => ({
//         id: t.pairAddress,
//         name: t.baseToken.name,
//         symbol: t.baseToken.symbol,
//         price: parseFloat(t.priceUsd || 0),
//         marketCap: t.fdv || t.marketCap,
//         volume24h: t.volume?.h24,
//         volume1hChange: Math.floor(Math.random() * 200 - 100), // dummy
//         honeypotScore: Math.floor(Math.random() * 100), // dummy
//         chain: t.chainId,
//         logo: t.baseToken.logoURI || null,
//       }));

//       // Step 4: Apply OpenAI filters
//       const filtered = normalizedTokens.filter((t) => {
//         if (parsed?.marketCap?.lt && t.marketCap > parsed.marketCap.lt)
//           return false;
//         if (parsed?.marketCap?.gt && t.marketCap < parsed.marketCap.gt)
//           return false;
//         if (parsed?.volume1hChange?.gt && t.volume1hChange < parsed.volume1hChange.gt)
//           return false;
//         if (parsed?.honeypotScore?.gt && t.honeypotScore < parsed.honeypotScore.gt)
//           return false;
//         if (parsed?.chain && parsed.chain !== "all" && t.chain !== parsed.chain)
//           return false;
//         return true;
//       });

//       setTokens(filtered);
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setTokens([]);
//     }

//     setLoading(false);
//   };

//   return (
//     <div
//       className="min-h-screen text-white p-6"
//       style={{ backgroundColor: "#0b1220" }}
//     >
//       <h1 className="text-2xl font-bold mb-4">AI Trade Copilot (Demo)</h1>

//       {/* Query Input */}
//       <div className="flex gap-2 mb-6">
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder='Try: "show sol tokens under 5m mcap with 1h vol +30% and honeypot score above 70"'
//           className="flex-1 p-2 rounded bg-gray-800 text-white"
//         />
//         <button
//           onClick={runQuery}
//           className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
//         >
//           Search
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="mb-4">
//         <h3 className="text-lg font-semibold mb-1">Parsed Filters (AI)</h3>
//         {filters ? (
//           <pre className="text-xs bg-gray-900 p-3 rounded">
//             {JSON.stringify(filters, null, 2)}
//           </pre>
//         ) : (
//           <p className="text-gray-400">AI will parse your query here.</p>
//         )}
//       </div>

//       {/* Results */}
//       <h3 className="text-lg font-semibold mb-2">Results</h3>
//       {loading && <p>Loading...</p>}
//       {!loading && tokens.length === 0 && (
//         <p className="text-gray-400">No matching tokens found.</p>
//       )}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {tokens.map((t) => (
//           <div
//             key={t.id}
//             className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition"
//           >
//             <div className="flex items-center gap-3 mb-2">
//               {t.logo ? (
//                 <img
//                   src={t.logo}
//                   alt={t.symbol}
//                   className="w-8 h-8 rounded-full"
//                 />
//               ) : (
//                 <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
//               )}
//               <div>
//                 <h4 className="font-bold">{t.name}</h4>
//                 <p className="text-sm text-gray-400">{t.symbol}</p>
//               </div>
//             </div>
//             <p>
//               <span className="text-gray-400">Price:</span> $
//               {Number(t.price).toFixed(4)}
//             </p>
//             <p>
//               <span className="text-gray-400">Market Cap:</span>{" "}
//               {t.marketCap ? `$${t.marketCap.toLocaleString()}` : "N/A"}
//             </p>
//             <p>
//               <span className="text-gray-400">24h Vol:</span>{" "}
//               {t.volume24h ? `$${t.volume24h.toLocaleString()}` : "N/A"}
//             </p>
//             <p>
//               <span className="text-gray-400">1h Vol Change:</span>{" "}
//               {t.volume1hChange}%
//             </p>
//             <p>
//               <span className="text-gray-400">Honeypot Score:</span>{" "}
//               {t.honeypotScore}/100
//             </p>
//             <p>
//               <span className="text-gray-400">Chain:</span> {t.chain}
//             </p>

//             {/* Dummy suggested stops/targets */}
//             <div className="mt-3 text-sm text-green-400">
//               🎯 Suggested Target: ${(t.price * 1.2).toFixed(4)}
//             </div>
//             <div className="text-sm text-red-400">
//               🛑 Suggested Stop: ${(t.price * 0.8).toFixed(4)}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";

// // Utility to parse plain English queries into structured filters
// function parseQuery(query) {
//   const filters = {};

//   // Detect chain
//   if (/sol/i.test(query)) filters.chain = "Solana";
//   else if (/eth/i.test(query)) filters.chain = "Ethereum";
//   else if (/bnb/i.test(query)) filters.chain = "BNB";
//   else if (/polygon/i.test(query)) filters.chain = "Polygon";

//   // MarketCap filters
//   const under = query.match(/under\s?\$?([\d.]+)m/i);
//   const between = query.match(/between\s?\$?([\d.]+)m\s?and\s?\$?([\d.]+)m/i);
//   if (under) {
//     filters.marketCap = { lt: parseFloat(under[1]) * 1_000_000 };
//   } else if (between) {
//     filters.marketCap = {
//       gt: parseFloat(between[1]) * 1_000_000,
//       lt: parseFloat(between[2]) * 1_000_000,
//     };
//   }

//   // Volume change
//   const vol1h = query.match(/1h vol\s?\+?(\d+)%/i);
//   const vol24h = query.match(/24h vol\s?\+?(\d+)%/i);
//   if (vol1h) filters.volume1hChange = { gt: parseFloat(vol1h[1]) };
//   if (vol24h) filters.volume24hChange = { gt: parseFloat(vol24h[1]) };

//   // Honeypot score
//   const honeypot = query.match(/honeypot score above (\d+)/i);
//   if (honeypot) filters.honeypotScore = { gt: parseFloat(honeypot[1]) };

//   return filters;
// }

// export default function App() {
//   const [query, setQuery] = useState("");
//   const [filters, setFilters] = useState(null);
//   const [tokens, setTokens] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const dummyQueries = [
//     "show sol tokens under 5m mcap with 1h vol +30% and honeypot score above 70",
//     "eth tokens between 10m and 50m mcap with 24h vol +100%",
//     "find new bnb tokens under 2m mcap with liquidity above 100k",
//     "polygon tokens with price under $1 and 24h vol +200%",
//     "list meme coins on solana with >50 holders and honeypot score above 80",
//   ];

//   const handleSearch = async (q = query) => {
//     if (!q.trim()) return;
//     setLoading(true);
//     const parsed = parseQuery(q);
//     setFilters(parsed);

//     try {
//       const res = await fetch(
//         `https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(
//           parsed.chain || "sol"
//         )}`
//       );
//       const data = await res.json();

//       const normalized = (data.pairs || []).map((p) => ({
//         name: p.baseToken?.name,
//         symbol: p.baseToken?.symbol,
//         price: p.priceUsd ? `$${parseFloat(p.priceUsd).toFixed(4)}` : "N/A",
//         liquidity: p.liquidity?.usd
//           ? `$${(p.liquidity.usd / 1_000).toFixed(1)}k`
//           : "N/A",
//         volume24h: p.volume?.h24
//           ? `$${(p.volume.h24 / 1_000).toFixed(1)}k`
//           : "N/A",
//         marketCap: p.fdv ? `$${(p.fdv / 1_000_000).toFixed(2)}M` : "N/A",
//         honeypotScore: Math.floor(Math.random() * 30) + 70, // dummy score
//       }));

//       setTokens(normalized.slice(0, 10)); // show top 10
//     } catch (err) {
//       console.error("Error fetching tokens:", err);
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen text-white p-6" style={{ backgroundColor: "#0b1220" }}>
//       <h1 className="text-2xl font-bold mb-4">AI Trade Copilot (Demo)</h1>

//       {/* Dummy Queries */}
//       <div className="mb-4 flex flex-wrap gap-2">
//         {dummyQueries.map((q, i) => (
//           <button
//             key={i}
//             onClick={() => {
//               setQuery(q);
//               handleSearch(q);
//             }}
//             className="px-3 py-1 bg-gray-700 rounded text-sm hover:bg-gray-600"
//           >
//             {q}
//           </button>
//         ))}
//       </div>

//       {/* Input */}
//       <div className="flex gap-2 mb-6">
//         <input
//           className="flex-1 p-2 rounded bg-gray-800 text-white"
//           placeholder="Type your query..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />
//         <button
//           onClick={() => handleSearch()}
//           className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
//         >
//           Search
//         </button>
//       </div>

//       {/* Parsed filters */}
//       {filters && (
//         <div className="mb-4 bg-gray-900 p-3 rounded text-xs">
//           <h3 className="font-semibold mb-1">Parsed filters</h3>
//           <pre>{JSON.stringify(filters, null, 2)}</pre>
//         </div>
//       )}

//       {/* Results */}
//       {loading ? (
//         <div>Loading tokens...</div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {tokens.map((t, i) => (
//             <div key={i} className="bg-gray-800 p-3 rounded shadow">
//               <h4 className="font-semibold">
//                 {t.name} ({t.symbol})
//               </h4>
//               <p>Price: {t.price}</p>
//               <p>Liquidity: {t.liquidity}</p>
//               <p>24h Vol: {t.volume24h}</p>
//               <p>Market Cap: {t.marketCap}</p>
//               <p>Honeypot Score: {t.honeypotScore}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }











import React, { useState } from "react";
import "./App.css";
// Utility to parse plain English queries into structured filters
function parseQuery(query) {
  const filters = {};

  // Detect chain
  if (/sol/i.test(query)) filters.chain = "solana";
  else if (/eth/i.test(query)) filters.chain = "ethereum";
  else if (/bnb/i.test(query)) filters.chain = "bsc";
  else if (/polygon/i.test(query)) filters.chain = "polygon";

  // MarketCap filters
  const under = query.match(/under\s?\$?([\d.]+)m/i);
  const between = query.match(/between\s?\$?([\d.]+)m\s?and\s?\$?([\d.]+)m/i);
  if (under) {
    filters.marketCap = { lt: parseFloat(under[1]) * 1_000_000 };
  } else if (between) {
    filters.marketCap = {
      gt: parseFloat(between[1]) * 1_000_000,
      lt: parseFloat(between[2]) * 1_000_000,
    };
  }

  // Liquidity
  const liquidity = query.match(/liquidity above\s?\$?([\d.]+)k?/i);
  if (liquidity) filters.liquidity = { gt: parseFloat(liquidity[1]) * 1000 };

  // Price
  const price = query.match(/price under\s?\$?([\d.]+)/i);
  if (price) filters.price = { lt: parseFloat(price[1]) };

  // Holders
  const holders = query.match(/>(\d+)\s?holders/i);
  if (holders) filters.holders = { gt: parseInt(holders[1]) };

  // Volume change
  const vol1h = query.match(/1h vol\s?\+?(\d+)%/i);
  const vol24h = query.match(/24h vol\s?\+?(\d+)%/i);
  if (vol1h) filters.volume1hChange = { gt: parseFloat(vol1h[1]) };
  if (vol24h) filters.volume24hChange = { gt: parseFloat(vol24h[1]) };

  // Honeypot score
  const honeypot = query.match(/honeypot score above (\d+)/i);
  if (honeypot) filters.honeypotScore = { gt: parseFloat(honeypot[1]) };

  return filters;
}

// Apply filters to token list
function applyFilters(tokens, filters) {
  return tokens.filter((t) => {
    const mcap = t.marketCapNum || 0;
    const liq = t.liquidityNum || 0;
    const price = t.priceNum || 0;
    const vol24h = t.volume24hNum || 0;
    const holders = t.holders || 0;
    const honeypot = t.honeypotScore || 0;

    if (filters.marketCap?.lt && mcap >= filters.marketCap.lt) return false;
    if (filters.marketCap?.gt && mcap <= filters.marketCap.gt) return false;
    if (filters.liquidity?.gt && liq <= filters.liquidity.gt) return false;
    if (filters.price?.lt && price >= filters.price.lt) return false;
    if (filters.volume24hChange?.gt && vol24h <= filters.volume24hChange.gt) return false;
    if (filters.holders?.gt && holders <= filters.holders.gt) return false;
    if (filters.honeypotScore?.gt && honeypot <= filters.honeypotScore.gt) return false;

    return true;
  });
}

export default function App() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);

  const dummyQueries = [
    "show sol tokens under 5m mcap with 1h vol +30% and honeypot score above 70",
    "eth tokens between 10m and 50m mcap with 24h vol +100%",
    "find new bnb tokens under 2m mcap with liquidity above 100k",
    "polygon tokens with price under $1 and 24h vol +200%",
    "list meme coins on solana with >50 holders and honeypot score above 80",
  ];

  const handleSearch = async (q = query) => {
    if (!q.trim()) return;
    setLoading(true);
    const parsed = parseQuery(q);
    setFilters(parsed);

    try {
      const res = await fetch(
        `https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(
          parsed.chain || "sol"
        )}`
      );
      if (!res.ok) throw new Error("Dexscreener API error");
      const data = await res.json();

      // Deduplicate tokens by address
      const seen = new Set();
      let normalized = (data.pairs || [])
        .filter((p) => {
          if (!p.baseToken?.address) return false;
          if (seen.has(p.baseToken.address)) return false;
          seen.add(p.baseToken.address);
          return true;
        })
        .map((p) => ({
          address: p.baseToken?.address,
          name: p.baseToken?.name,
          symbol: p.baseToken?.symbol,
          price: p.priceUsd ? `$${parseFloat(p.priceUsd).toFixed(4)}` : "N/A",
          priceNum: p.priceUsd ? parseFloat(p.priceUsd) : 0,
          liquidity: p.liquidity?.usd
            ? `$${(p.liquidity.usd / 1_000).toFixed(1)}k`
            : "N/A",
          liquidityNum: p.liquidity?.usd || 0,
          volume24h: p.volume?.h24
            ? `$${(p.volume.h24 / 1_000).toFixed(1)}k`
            : "N/A",
          volume24hNum: p.volume?.h24 || 0,
          marketCap: p.fdv ? `$${(p.fdv / 1_000_000).toFixed(2)}M` : "N/A",
          marketCapNum: p.fdv || 0,
          holders: Math.floor(Math.random() * 500), // placeholder
          honeypotScore: Math.floor(Math.random() * 30) + 70, // replace with GoPlus API
        }));

      // Apply filters
      normalized = applyFilters(normalized, parsed);

      setTokens(normalized.slice(0, 10)); // show top 10
    } catch (err) {
      console.error("Error fetching tokens:", err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen text-white p-8" style={{ backgroundColor: "#060817" }}>
      <h1 className="text-2xl font-bold mb-4 text-center" style={{
  fontSize: "clamp(2.5rem, 8vw, 5rem)",
  fontWeight: 700,
  marginBottom: "1.5rem",
  background: "linear-gradient(135deg, #fff 0%, #FF6B35 50%, #F7931A 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  lineHeight: 1.1,
}}>AI Trade Copilot</h1>
      {/* Input */}
      <div className="flex mb-6">
        <input
          className="flex-1 p-2 rounded bg-gray-800 text-white"
          style={{
  padding: "15px",
  borderRadius: "50px 0 0 50px",
}}
          placeholder="Type your query..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={() => handleSearch()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded bg-gradient-to-br from-[#FF6B35] to-[#F7931A] 
  hover:from-[#F7931A] hover:to-[#FF6B35]
  text-white px-8 py-2 rounded-r-[50px] transition"
          style={{
  background: "linear-gradient(135deg, rgb(255, 107, 53) 0%, rgb(247, 147, 26) 100%)",
  color: "#fff",
  padding: "10px 30px",
  borderRadius: "0 50px 50px 0",
  border: "none",
  cursor: "pointer",
}}
        >
          Search
        </button>
      </div>
      {/* Dummy Queries */}
      <div className="mb-4 flex justify-center flex-wrap gap-2">
        {dummyQueries.map((q, i) => (
          <button
            key={i}
            onClick={() => {
              setQuery(q);
              handleSearch(q);
            }}
            className="px-3 py-1 bg-gray-700 rounded text-sm hover:bg-gray-600" style={{
  background: "linear-gradient(135deg, #FF6B35 0%, #F7931A 100%)",
  color: "#ffffff",
  padding: "8px 15px",
}}
          >
            {q}
          </button>
        ))}
      </div>



      {/* Parsed filters */}
      {filters && (
        <div className="mb-4 bg-gray-900 p-3 rounded text-xs hidden">
          <h3 className="font-semibold mb-1">Parsed filters</h3>
          <pre>{JSON.stringify(filters, null, 2)}</pre>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="text-center">Loading tokens...</div>
      ) : tokens.length === 0 ? (
        <div className="text-center">No tokens match your filters.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tokens.map((t, i) => (
            <div key={i} className="bg-gray-800 p-3 rounded shadow">
              <h4 className="font-semibold">
                {t.name} ({t.symbol})
              </h4>
              <p>Price: {t.price}</p>
              <p>Liquidity: {t.liquidity}</p>
              <p>24h Vol: {t.volume24h}</p>
              <p>Market Cap: {t.marketCap}</p>
              <p>Holders: {t.holders}</p>
              <p>Honeypot Score: {t.honeypotScore}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}















// import React, { useState } from "react";

// // Utility to parse plain English queries into structured filters
// function parseQuery(query) {
//   const filters = {};

//   // Detect chain
//   if (/sol/i.test(query)) filters.chain = "solana";
//   else if (/eth/i.test(query)) filters.chain = "ethereum";
//   else if (/bnb/i.test(query)) filters.chain = "bsc";
//   else if (/polygon/i.test(query)) filters.chain = "polygon";

//   // MarketCap filters
//   const under = query.match(/under\s?\$?([\d.]+)m/i);
//   const above = query.match(/above\s?\$?([\d.]+)m/i);
//   const between = query.match(/between\s?\$?([\d.]+)m\s?and\s?\$?([\d.]+)m/i);
//   if (under) filters.marketCap = { lt: parseFloat(under[1]) * 1_000_000 };
//   if (above) filters.marketCap = { gt: parseFloat(above[1]) * 1_000_000 };
//   if (between) {
//     filters.marketCap = {
//       gt: parseFloat(between[1]) * 1_000_000,
//       lt: parseFloat(between[2]) * 1_000_000,
//     };
//   }

//   // Liquidity
//   const liqAbove = query.match(/liquidity above\s?\$?([\d.]+)k?/i);
//   const liqBelow = query.match(/liquidity under\s?\$?([\d.]+)k?/i);
//   if (liqAbove) filters.liquidity = { gt: parseFloat(liqAbove[1]) * 1000 };
//   if (liqBelow) filters.liquidity = { lt: parseFloat(liqBelow[1]) * 1000 };

//   // Price
//   const priceUnder = query.match(/price under\s?\$?([\d.]+)/i);
//   const priceAbove = query.match(/price above\s?\$?([\d.]+)/i);
//   if (priceUnder) filters.price = { lt: parseFloat(priceUnder[1]) };
//   if (priceAbove) filters.price = { gt: parseFloat(priceAbove[1]) };

//   // Holders
//   const holders = query.match(/>(\d+)\s?holders/i);
//   if (holders) filters.holders = { gt: parseInt(holders[1]) };

//   // Volume change (DexScreener only has 24h volume)
//   const vol24h = query.match(/24h vol\s?\+?(\d+)%/i);
//   if (vol24h) filters.volume24hChange = { gt: parseFloat(vol24h[1]) };

//   // Honeypot score
//   const honeypot = query.match(/honeypot score above (\d+)/i);
//   if (honeypot) filters.honeypotScore = { gt: parseFloat(honeypot[1]) };

//   return filters;
// }

// // Apply filters to token list
// function applyFilters(tokens, filters) {
//   return tokens.filter((t) => {
//     const mcap = t.marketCapNum || 0;
//     const liq = t.liquidityNum || 0;
//     const price = t.priceNum || 0;
//     const vol24h = t.volume24hNum || 0;
//     const holders = t.holders || 0;
//     const honeypot = t.honeypotScore || 0;

//     if (filters.marketCap) {
//       if (filters.marketCap.lt && mcap >= filters.marketCap.lt) return false;
//       if (filters.marketCap.gt && mcap <= filters.marketCap.gt) return false;
//     }
//     if (filters.liquidity) {
//       if (filters.liquidity.lt && liq >= filters.liquidity.lt) return false;
//       if (filters.liquidity.gt && liq <= filters.liquidity.gt) return false;
//     }
//     if (filters.price) {
//       if (filters.price.lt && price >= filters.price.lt) return false;
//       if (filters.price.gt && price <= filters.price.gt) return false;
//     }
//     if (filters.volume24hChange?.gt && vol24h <= filters.volume24hChange.gt)
//       return false;
//     if (filters.holders?.gt && holders <= filters.holders.gt) return false;
//     if (filters.honeypotScore?.gt && honeypot <= filters.honeypotScore.gt)
//       return false;

//     return true;
//   });
// }

// // Fetch holders from Birdeye
// async function fetchHolders(address, chain) {
//   try {
//     const res = await fetch(
//       `https://public-api.birdeye.so/public/token/${address}`,
//       {
//         headers: {
//           "X-API-KEY": process.env.REACT_APP_BIRDEYE_KEY,
//         },
//       }
//     );
//     const data = await res.json();
//     return data.data?.holder || 0;
//   } catch {
//     return 0;
//   }
// }

// // Fetch honeypot score from GoPlus
// async function fetchHoneypot(address, chain) {
//   const chainMap = { solana: "solana", ethereum: "1", bsc: "56", polygon: "137" };
//   try {
//     const res = await fetch(
//       `https://api.gopluslabs.io/api/v1/token_security/${
//         chainMap[chain] || "1"
//       }?contract_addresses=${address}`
//     );
//     const data = await res.json();
//     const score =
//       Object.values(data.result || {})[0]?.is_honeypot === "0" ? 90 : 20;
//     return score;
//   } catch {
//     return 50;
//   }
// }

// export default function App() {
//   const [query, setQuery] = useState("");
//   const [filters, setFilters] = useState(null);
//   const [tokens, setTokens] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const dummyQueries = [
//     "show sol tokens under 5m mcap with 24h vol +30% and honeypot score above 70",
//     "eth tokens between 10m and 50m mcap with 24h vol +100%",
//     "find new bnb tokens under 2m mcap with liquidity above 100k",
//     "polygon tokens with price under $1 and 24h vol +200%",
//     "list meme coins on solana with >50 holders and honeypot score above 80",
//   ];

//   const handleSearch = async (q = query) => {
//     if (!q.trim()) return;
//     setLoading(true);
//     const parsed = parseQuery(q);
//     setFilters(parsed);

//     try {
//       const res = await fetch(
//         `https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(
//           parsed.chain || "sol"
//         )}`
//       );
//       if (!res.ok) throw new Error("Dexscreener API error");
//       const data = await res.json();

//       // Deduplicate tokens by address
//       const seen = new Set();
//       let normalized = await Promise.all(
//         (data.pairs || [])
//           .filter((p) => {
//             if (!p.baseToken?.address) return false;
//             if (seen.has(p.baseToken.address)) return false;
//             seen.add(p.baseToken.address);
//             return true;
//           })
//           .slice(0, 20)
//           .map(async (p) => {
//             const holders = await fetchHolders(p.baseToken.address, parsed.chain);
//             const honeypot = await fetchHoneypot(p.baseToken.address, parsed.chain);

//             return {
//               address: p.baseToken?.address,
//               name: p.baseToken?.name,
//               symbol: p.baseToken?.symbol,
//               price: p.priceUsd
//                 ? `$${parseFloat(p.priceUsd).toFixed(4)}`
//                 : "N/A",
//               priceNum: p.priceUsd ? parseFloat(p.priceUsd) : 0,
//               liquidity: p.liquidity?.usd
//                 ? `$${(p.liquidity.usd / 1_000).toFixed(1)}k`
//                 : "N/A",
//               liquidityNum: p.liquidity?.usd || 0,
//               volume24h: p.volume?.h24
//                 ? `$${(p.volume.h24 / 1_000).toFixed(1)}k`
//                 : "N/A",
//               volume24hNum: p.volume?.h24 || 0,
//               marketCap: p.fdvUsd
//                 ? `$${(p.fdvUsd / 1_000_000).toFixed(2)}M`
//                 : "N/A",
//               marketCapNum: p.fdvUsd || 0,
//               holders,
//               honeypotScore: honeypot,
//             };
//           })
//       );

//       // Apply filters
//       normalized = applyFilters(normalized, parsed);

//       setTokens(normalized.slice(0, 10)); // show top 10
//     } catch (err) {
//       console.error("Error fetching tokens:", err);
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen text-white p-6" style={{ backgroundColor: "#0b1220" }}>
//       <h1 className="text-2xl font-bold mb-4">AI Trade Copilot</h1>

//       {/* Dummy Queries */}
//       <div className="mb-4 flex flex-wrap gap-2">
//         {dummyQueries.map((q, i) => (
//           <button
//             key={i}
//             onClick={() => {
//               setQuery(q);
//               handleSearch(q);
//             }}
//             className="px-3 py-1 bg-gray-700 rounded text-sm hover:bg-gray-600"
//           >
//             {q}
//           </button>
//         ))}
//       </div>

//       {/* Input */}
//       <div className="flex gap-2 mb-6">
//         <input
//           className="flex-1 p-2 rounded bg-gray-800 text-white"
//           placeholder="Type your query..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />
//         <button
//           onClick={() => handleSearch()}
//           className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
//         >
//           Search
//         </button>
//       </div>

//       {/* Parsed filters */}
//       {filters && (
//         <div className="mb-4 bg-gray-900 p-3 rounded text-xs">
//           <h3 className="font-semibold mb-1">Parsed filters</h3>
//           <pre>{JSON.stringify(filters, null, 2)}</pre>
//         </div>
//       )}

//       {/* Results */}
//       {loading ? (
//         <div>Loading tokens...</div>
//       ) : tokens.length === 0 ? (
//         <div>No tokens match your filters.</div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {tokens.map((t, i) => (
//             <div key={i} className="bg-gray-800 p-3 rounded shadow">
//               <h4 className="font-semibold">
//                 {t.name} ({t.symbol})
//               </h4>
//               <p>Price: {t.price}</p>
//               <p>Liquidity: {t.liquidity}</p>
//               <p>24h Vol: {t.volume24h}</p>
//               <p>Market Cap: {t.marketCap}</p>
//               <p>Holders: {t.holders}</p>
//               <p>Honeypot Score: {t.honeypotScore}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
