// Enhanced CoinGecko markets fetcher with comprehensive data
export async function fetchCoinGeckoMarkets() {
  try {
    // Fetch comprehensive data including images, market data, and price changes
    const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=250&page=1&price_change_percentage=1h,24h,7d&sparkline=false');
    if (!res.ok) throw new Error('CoinGecko API failed: ' + res.status);
    const data = await res.json();
    
    // Enhance data with additional details if needed
    return data.map(coin => ({
      ...coin,
      // Ensure all required fields have proper defaults
      current_price: coin.current_price || 0,
      market_cap: coin.market_cap || 0,
      price_change_percentage_1h_in_currency: coin.price_change_percentage_1h_in_currency || 0,
      price_change_percentage_24h: coin.price_change_percentage_24h || 0,
      total_volume: coin.total_volume || 0,
      image: coin.image || '',
      symbol: coin.symbol ? coin.symbol.toUpperCase() : '',
      name: coin.name || 'Unknown Token'
    }));
  } catch (err) {
    console.error('Market API error:', err);
    return [];
  }
}

// Additional function to fetch detailed coin information
export async function fetchCoinDetails(coinId) {
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);
    if (!res.ok) throw new Error('CoinGecko details failed: ' + res.status);
    return await res.json();
  } catch (err) {
    console.error('Coin details error:', err);
    return null;
  }
}
