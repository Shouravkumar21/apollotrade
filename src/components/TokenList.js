import React from "react";

export default function TokenList({ tokens = [], onSaveAlert }) {
  if (!tokens.length) return <div className="text-gray-400 mt-4">No matching tokens found. Try running a different query.</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Found {tokens.length} Matching Token{tokens.length !== 1 ? 's' : ''}</h3>
      </div>

      <div className="space-y-4">
        {tokens.map(t => (
          <div key={t.id} className="card p-4 border border-slate-700 rounded-lg">
            <div className="flex items-start justify-between">
              {/* Token Info with Image */}
              <div className="flex items-start gap-3 flex-1">
                {t.raw?.image && (
                  <img 
                    src={t.raw.image} 
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white">
                    {t.symbol} <span className="text-sm text-gray-400">({t.name})</span>
                  </h4>
                  
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="space-y-1">
                      <p className="flex items-center gap-2">
                        <span className="text-blue-400">💰</span>
                        <strong>Price:</strong> ${t.current_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                      </p>
                      
                      <p className="flex items-center gap-2">
                        <span className="text-green-400">📊</span>
                        <strong>Market Cap:</strong> ${(t.market_cap||0).toLocaleString()}
                      </p>
                      
                      <p className="flex items-center gap-2">
                        <span className="text-yellow-400">📈</span>
                        <strong>1h Change:</strong> 
                        <span className={t.price_change_1h >= 0 ? "text-green-400" : "text-red-400"}>
                          {(t.price_change_1h||0).toFixed?.(2) ?? (t.price_change_1h||0)}%
                        </span>
                      </p>
                      
                      {t.raw?.price_change_percentage_24h && (
                        <p className="flex items-center gap-2">
                          <span className="text-purple-400">📊</span>
                          <strong>24h Change:</strong> 
                          <span className={t.raw.price_change_percentage_24h >= 0 ? "text-green-400" : "text-red-400"}>
                            {t.raw.price_change_percentage_24h.toFixed(2)}%
                          </span>
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-yellow-400 font-semibold">🎯 Trading Suggestions:</p>
                      <div className="ml-4 space-y-1">
                        <p className="flex items-center gap-2">
                          <span className="text-red-400">⛔</span>
                          <strong>Stop Loss:</strong> ${t.suggestion.stop} <span className="text-red-400">(-8%)</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="text-green-400">🎯</span>
                          <strong>Take Profit:</strong> ${t.suggestion.target} <span className="text-green-400">(+15%)</span>
                        </p>
                        <p className="text-xs text-gray-400">
                          Risk/Reward: 1:1.88
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Details */}
                  {t.raw?.total_volume && (
                    <p className="mt-2 text-xs text-gray-400">
                      <strong>24h Volume:</strong> ${t.raw.total_volume.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-2 ml-4">
                <button 
                  className="btn bg-yellow-500 hover:bg-yellow-600 text-sm px-3 py-2 flex items-center gap-1"
                  onClick={() => {
                    const alert = { 
                      id: crypto.randomUUID(), 
                      createdAt: Date.now(), 
                      name: `${t.symbol} Price Alert`, 
                      filters: { price: { lt: t.current_price } }, 
                      token: t 
                    };
                    onSaveAlert(alert);
                    window.alert(`📊 Alert set for ${t.symbol} at $${t.current_price}`);
                  }}
                >
                  <span>🔔</span> Set Alert
                </button>

                <button 
                  className="btn bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-2 flex items-center gap-1"
                  onClick={() => alert(`🎯 Ready to snipe ${t.symbol} at $${t.current_price}. In production, this would connect to your wallet and execute the trade.`)}
                >
                  <span>⚡</span> Quick Snipe
                </button>
                
                <button 
                  className="btn bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2"
                  onClick={() => {
                    const jsonData = JSON.stringify(t, null, 2);
                    navigator.clipboard.writeText(jsonData);
                    alert(`📋 JSON data for ${t.symbol} copied to clipboard!`);
                  }}
                >
                  Copy JSON Data
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
