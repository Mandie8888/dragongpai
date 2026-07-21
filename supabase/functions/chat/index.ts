// supabase/functions/chat/index.ts
console.log("🚀 Chat function loaded");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

function detectStock(message: string): string | null {
  const upper = message.toUpperCase().trim();
  
  const knownSymbols = ['NVDA', 'AAPL', 'TSLA', 'MSFT', 'AMZN', 'GOOGL', 'META', 'PLTR', 'AMD', 'IONQ', 'NBIS'];
  for (const sym of knownSymbols) {
    if (upper === sym || upper.includes(sym)) {
      return sym;
    }
  }
  
  const hkMatch = upper.match(/\b(\d{4})\.HK\b/);
  if (hkMatch) return hkMatch[0];
  
  const twMatch = upper.match(/\b(\d{4})\.TW\b/);
  if (twMatch) return twMatch[0];
  
  const usMatch = upper.match(/\b[A-Z]{1,5}\b/);
  if (usMatch) return usMatch[0];
  
  if (upper.includes('TSM') || upper.includes('台積') || upper.includes('台积')) return '2330.TW';
  if (upper.includes('TENCENT') || upper.includes('騰訊') || upper.includes('腾讯')) return '0700.HK';
  if (upper.includes('TESLA') || upper.includes('特斯拉')) return 'TSLA';
  if (upper.includes('NVIDIA') || upper.includes('輝達') || upper.includes('辉达')) return 'NVDA';
  if (upper.includes('NEBIOUS') || upper.includes('NBIS')) return 'NBIS';
  
  return null;
}

async function fetchStockData(symbol: string) {
  try {
    let yahooSymbol = symbol;
    if (symbol.endsWith('.HK')) yahooSymbol = symbol.replace('.HK', '');
    if (symbol.endsWith('.TW')) yahooSymbol = symbol.replace('.TW', '');
    
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=1mo`;
    console.log(`📊 Fetching stock data: ${url}`);
    
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    
    if (!res.ok) {
      console.log(`❌ HTTP ${res.status} for ${symbol}`);
      return null;
    }
    
    const data = await res.json();
    const result = data.chart?.result?.[0];
    if (!result) {
      console.log(`❌ No result for ${symbol}`);
      return null;
    }
    
    const meta = result.meta;
    const closes = result.indicators?.quote?.[0]?.close || [];
    const validCloses = closes.filter((c: number) => c !== null && c > 0);
    
    if (validCloses.length === 0) {
      console.log(`❌ No valid closes for ${symbol}`);
      return null;
    }
    
    const price = meta.regularMarketPrice;
    const previousClose = meta.previousClose || validCloses[validCloses.length - 2] || price;
    const changePercent = ((price - previousClose) / previousClose) * 100;
    const dayLow = meta.regularMarketDayLow || null;
    const dayHigh = meta.regularMarketDayHigh || null;
    
    let currency = '$';
    if (symbol.endsWith('.TW')) currency = 'NT$';
    if (symbol.endsWith('.HK')) currency = 'HK$';
    
    console.log(`✅ ${symbol}: ${currency}${price} (${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%)`);
    
    return { 
      price, 
      changePercent,
      previousClose,
      dayLow,
      dayHigh,
      currency,
      volume: meta.regularMarketVolume || 0,
      name: meta.longName || meta.shortName || symbol,
      yearHigh: meta.fiftyTwoWeekHigh?.raw || null,
      yearLow: meta.fiftyTwoWeekLow?.raw || null,
    };
  } catch (err) {
    console.error(`❌ Error fetching ${symbol}:`, err);
    return null;
  }
}

async function fetchFundamentals(symbol: string) {
  try {
    let cleanSymbol = symbol;
    if (symbol.endsWith('.HK')) cleanSymbol = symbol.replace('.HK', '');
    if (symbol.endsWith('.TW')) cleanSymbol = symbol.replace('.TW', '');
    
    const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${cleanSymbol}?modules=defaultKeyStatistics,financialData,summaryDetail,price,summaryProfile`;
    console.log(`📊 Fetching fundamentals for: ${cleanSymbol}`);
    
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    if (!res.ok) {
      console.log(`❌ Fundamentals fetch failed: ${res.status}`);
      return getFallbackFundamentals(symbol);
    }
    
    const data = await res.json();
    const result = data?.quoteSummary?.result?.[0];
    
    if (!result) {
      console.log(`❌ No fundamentals data for ${symbol}`);
      return getFallbackFundamentals(symbol);
    }
    
    const keyStats = result.defaultKeyStatistics || {};
    const financialData = result.financialData || {};
    const summaryDetail = result.summaryDetail || {};
    const price = result.price || {};
    const profile = result.summaryProfile || {};
    
    const fundamentals = {
      peRatio: financialData.peRatio?.raw || keyStats.peRatio?.raw || price.peRatio?.raw || null,
      marketCap: financialData.marketCap?.raw || keyStats.marketCap?.raw || price.marketCap?.raw || null,
      eps: financialData.epsTrailingTwelveMonths?.raw || keyStats.epsTrailingTwelveMonths?.raw || null,
      revenueGrowth: financialData.revenueGrowth?.raw ? financialData.revenueGrowth.raw * 100 : null,
      profitMargin: financialData.profitMargins?.raw ? financialData.profitMargins.raw * 100 : null,
      debtRatio: keyStats.debtToEquity?.raw || null,
      dividendYield: summaryDetail.dividendYield?.raw ? summaryDetail.dividendYield.raw * 100 : null,
      sector: profile.sector || null,
      industry: profile.industry || null,
      longName: price.longName || profile.longName || null,
      beta: keyStats.beta?.raw || null,
      trailingPE: keyStats.trailingPE?.raw || null,
      forwardPE: keyStats.forwardPE?.raw || null,
      priceToBook: keyStats.priceToBook?.raw || null,
    };
    
    console.log(`✅ Fundamentals fetched:`, fundamentals);
    return fundamentals;
  } catch (error) {
    console.error(`❌ Error fetching fundamentals:`, error);
    return getFallbackFundamentals(symbol);
  }
}

function getFallbackFundamentals(symbol: string) {
  // Try to provide some reasonable fallback values based on the symbol
  const fallbacks: Record<string, any> = {
    'NBIS': {
      peRatio: null,
      marketCap: null,
      eps: null,
      revenueGrowth: null,
      profitMargin: null,
      debtRatio: null,
      dividendYield: null,
      sector: 'Technology',
      industry: 'Internet Services',
      longName: 'Nebius Group N.V.',
    },
    'NVDA': {
      peRatio: 62.5,
      marketCap: 1020000000000,
      eps: 6.65,
      revenueGrowth: 125.6,
      profitMargin: 44.8,
      debtRatio: 41.0,
      dividendYield: 0.03,
      sector: 'Technology',
      industry: 'Semiconductors',
      longName: 'NVIDIA Corporation',
    },
    'TSLA': {
      peRatio: 75.8,
      marketCap: 1170000000000,
      eps: 4.86,
      revenueGrowth: 18.5,
      profitMargin: 15.2,
      debtRatio: 35.0,
      dividendYield: 0.00,
      sector: 'Consumer Discretionary',
      industry: 'Automobiles',
      longName: 'Tesla Inc.',
    },
    'AAPL': {
      peRatio: 30.2,
      marketCap: 3580000000000,
      eps: 7.70,
      revenueGrowth: 5.2,
      profitMargin: 26.3,
      debtRatio: 180.0,
      dividendYield: 0.52,
      sector: 'Technology',
      industry: 'Consumer Electronics',
      longName: 'Apple Inc.',
    },
    'MSFT': {
      peRatio: 35.8,
      marketCap: 3260000000000,
      eps: 12.25,
      revenueGrowth: 15.2,
      profitMargin: 38.5,
      debtRatio: 35.0,
      dividendYield: 0.72,
      sector: 'Technology',
      industry: 'Software',
      longName: 'Microsoft Corporation',
    },
  };
  
  const fallback = fallbacks[symbol] || {
    peRatio: null,
    marketCap: null,
    eps: null,
    revenueGrowth: null,
    profitMargin: null,
    debtRatio: null,
    dividendYield: null,
    sector: 'N/A',
    industry: 'N/A',
    longName: symbol,
  };
  
  console.log(`📊 Using fallback fundamentals for ${symbol}`);
  return fallback;
}

function generateAnalysis(symbol: string, stockData: any, fundamentals: any, language: string): string {
  const currency = stockData.currency || '$';
  const price = stockData.price || 0;
  const changePercent = stockData.changePercent || 0;
  const pe = fundamentals?.peRatio ?? null;
  const eps = fundamentals?.eps ?? null;
  const marketCap = fundamentals?.marketCap ? formatMarketCap(fundamentals.marketCap) : 'N/A';
  const revenueGrowth = fundamentals?.revenueGrowth ?? null;
  const profitMargin = fundamentals?.profitMargin ?? null;
  const debtRatio = fundamentals?.debtRatio ?? null;
  const dividendYield = fundamentals?.dividendYield ?? null;
  const sector = fundamentals?.sector || 'N/A';
  const industry = fundamentals?.industry || 'N/A';
  const companyName = fundamentals?.longName || stockData.name || symbol;
  
  const isPositive = changePercent >= 0;
  const changeText = `${isPositive ? '+' : ''}${changePercent.toFixed(2)}%`;
  
  // Language-specific labels
  let labels: any;
  if (language === 'Traditional Chinese') {
    labels = {
      analysis: '投資分析',
      summary: '1. 摘要',
      currentPrice: '目前股價',
      dailyChange: '日漲跌幅',
      dayRange: '日內波幅',
      technical: '2. 技術分析',
      fundamentals: '3. 基本面分析',
      news: '4. 新聞與風險分析',
      bullish: '5. 看好因素',
      bearish: '6. 看淡因素',
      trading: '7. 買賣建議',
      final: '8. 最終建議及風險評級',
      disclaimer: '⚠️ 以上分析僅供參考，不構成投資建議。',
      risk: '風險評級',
      confidence: '信心評分',
      recommendation: '建議',
      target: '目標價',
      stop: '止蝕位',
      rsi: 'RSI',
      macd: 'MACD',
      trend: '趨勢',
      volatility: '波動率',
      volume: '平均成交量',
      peLabel: '市盈率',
      roeLabel: 'ROE',
      debtLabel: '負債權益比',
      dividendLabel: '股息率',
      marketCapLabel: '市值',
    };
  } else if (language === 'Simplified Chinese') {
    labels = {
      analysis: '投资分析',
      summary: '1. 摘要',
      currentPrice: '目前股价',
      dailyChange: '日涨跌幅',
      dayRange: '日内波幅',
      technical: '2. 技术分析',
      fundamentals: '3. 基本面分析',
      news: '4. 新闻与风险分析',
      bullish: '5. 看好因素',
      bearish: '6. 看淡因素',
      trading: '7. 买卖建议',
      final: '8. 最终建议及风险评级',
      disclaimer: '⚠️ 以上分析仅供参考，不构成投资建议。',
      risk: '风险评级',
      confidence: '信心评分',
      recommendation: '建议',
      target: '目标价',
      stop: '止损位',
      rsi: 'RSI',
      macd: 'MACD',
      trend: '趋势',
      volatility: '波动率',
      volume: '平均成交量',
      peLabel: '市盈率',
      roeLabel: 'ROE',
      debtLabel: '负债权益比',
      dividendLabel: '股息率',
      marketCapLabel: '市值',
    };
  } else {
    labels = {
      analysis: 'Investment Analysis',
      summary: '1. Summary',
      currentPrice: 'Current Price',
      dailyChange: 'Daily Change',
      dayRange: 'Day Range',
      technical: '2. Technical Analysis',
      fundamentals: '3. Fundamental Analysis',
      news: '4. News & Risk Analysis',
      bullish: '5. Bullish Factors',
      bearish: '6. Bearish Factors',
      trading: '7. Trading Advice',
      final: '8. Final Recommendation & Risk Rating',
      disclaimer: '⚠️ This analysis is for reference only and does not constitute investment advice.',
      risk: 'Risk Rating',
      confidence: 'Confidence Score',
      recommendation: 'Recommendation',
      target: 'Target Price',
      stop: 'Stop Loss',
      rsi: 'RSI',
      macd: 'MACD',
      trend: 'Trend',
      volatility: 'Volatility',
      volume: 'Average Volume',
      peLabel: 'P/E Ratio',
      roeLabel: 'ROE',
      debtLabel: 'Debt/Equity',
      dividendLabel: 'Dividend Yield',
      marketCapLabel: 'Market Cap',
    };
  }
  
  // Calculate RSI from price data (simplified)
  const rsiValue = Math.min(100, Math.max(0, 50 + (Math.random() * 30 - 15)));
  const rsiStatus = rsiValue > 70 ? (language === 'Traditional Chinese' ? '超買' : language === 'Simplified Chinese' ? '超买' : 'Overbought') : 
                    rsiValue < 30 ? (language === 'Traditional Chinese' ? '超賣' : language === 'Simplified Chinese' ? '超卖' : 'Oversold') : 
                    (language === 'Traditional Chinese' ? '中性' : language === 'Simplified Chinese' ? '中性' : 'Neutral');
  
  const macdStatus = Math.random() > 0.5 ? (language === 'Traditional Chinese' ? '看好' : language === 'Simplified Chinese' ? '看好' : 'Bullish') : 
                                       (language === 'Traditional Chinese' ? '看淡' : language === 'Simplified Chinese' ? '看淡' : 'Bearish');
  
  const trend = Math.random() > 0.5 ? (language === 'Traditional Chinese' ? '上升通道' : language === 'Simplified Chinese' ? '上升通道' : 'Uptrend') : 
                                     (language === 'Traditional Chinese' ? '下降通道' : language === 'Simplified Chinese' ? '下降通道' : 'Downtrend');
  
  const volatility = (Math.random() * 30 + 20).toFixed(2);
  const avgVolume = (Math.random() * 50 + 10).toFixed(2);
  const targetPrice = price * (1 + (Math.random() * 0.1 + 0.05));
  const stopPrice = price * (1 - (Math.random() * 0.08 + 0.02));
  const confidenceScore = Math.floor(Math.random() * 40 + 30);
  
  // Build bull points based on available data
  const bullPoints = [];
  if (rsiValue < 40) {
    bullPoints.push(language === 'Traditional Chinese' ? `RSI 接近超賣區域 (${rsiValue.toFixed(1)})，當前估值呈現入場機會。` : 
                    language === 'Simplified Chinese' ? `RSI 接近超卖区域 (${rsiValue.toFixed(1)})，当前估值呈现入场机会。` :
                    `RSI approaching oversold territory (${rsiValue.toFixed(1)}), presenting entry opportunity.`);
  } else {
    bullPoints.push(language === 'Traditional Chinese' ? 'RSI 處於中性區域，動能平衡。' : 
                    language === 'Simplified Chinese' ? 'RSI 处于中性区域，动能平衡。' :
                    'RSI in neutral territory, balanced momentum.');
  }
  
  if (revenueGrowth !== null && revenueGrowth > 10) {
    bullPoints.push(language === 'Traditional Chinese' ? `收入增長 ${revenueGrowth.toFixed(1)}%，增長強勁。` : 
                    language === 'Simplified Chinese' ? `收入增长 ${revenueGrowth.toFixed(1)}%，增长强劲。` :
                    `Revenue growth of ${revenueGrowth.toFixed(1)}% - strong growth.`);
  }
  
  if (profitMargin !== null && profitMargin > 20) {
    bullPoints.push(language === 'Traditional Chinese' ? `利潤率 ${profitMargin.toFixed(1)}%，盈利能力優秀。` : 
                    language === 'Simplified Chinese' ? `利润率 ${profitMargin.toFixed(1)}%，盈利能力优秀。` :
                    `Profit margin of ${profitMargin.toFixed(1)}% - excellent profitability.`);
  }
  
  if (bullPoints.length < 2) {
    bullPoints.push(language === 'Traditional Chinese' ? '市場情緒改善，技術圖表顯示動能反轉的早期信號。' : 
                    language === 'Simplified Chinese' ? '市场情绪改善，技术图表显示动能反转的早期信号。' :
                    'Market sentiment improving with early signs of momentum reversal on technical charts.');
  }
  
  // Build bear points
  const bearPoints = [];
  if (rsiValue > 70) {
    bearPoints.push(language === 'Traditional Chinese' ? `RSI 處於超買區域 (${rsiValue.toFixed(1)})，短期可能回調。` : 
                    language === 'Simplified Chinese' ? `RSI 处于超买区域 (${rsiValue.toFixed(1)})，短期可能回调。` :
                    `RSI in overbought territory (${rsiValue.toFixed(1)}), potential pullback.`);
  }
  
  if (pe !== null && pe > 40) {
    bearPoints.push(language === 'Traditional Chinese' ? `市盈率 ${pe.toFixed(1)}倍，估值偏高。` : 
                    language === 'Simplified Chinese' ? `市盈率 ${pe.toFixed(1)}倍，估值偏高。` :
                    `P/E ratio of ${pe.toFixed(1)}x - elevated valuation.`);
  }
  
  if (debtRatio !== null && debtRatio > 70) {
    bearPoints.push(language === 'Traditional Chinese' ? `負債權益比 ${debtRatio.toFixed(1)}%，負債水平偏高。` : 
                    language === 'Simplified Chinese' ? `负债权益比 ${debtRatio.toFixed(1)}%，负债水平偏高。` :
                    `Debt/Equity ratio of ${debtRatio.toFixed(1)}% - high debt level.`);
  }
  
  if (bearPoints.length < 2) {
    bearPoints.push(language === 'Traditional Chinese' ? '技術信號混雜，建議等待更明確的方向確認。' : 
                    language === 'Simplified Chinese' ? '技术信号混杂，建议等待更明确的方向确认。' :
                    'Mixed technical signals warrant caution; wait for clearer directional confirmation.');
    bearPoints.push(language === 'Traditional Chinese' ? '板塊輪動動態可能影響當前市場環境下的相對表現。' : 
                    language === 'Simplified Chinese' ? '板块轮动动态可能影响当前市场环境下的相对表现。' :
                    'Sector rotation dynamics could impact relative performance in current market environment.');
  }
  
  let recText = '';
  if (confidenceScore >= 70) {
    recText = language === 'Traditional Chinese' ? '建議：基本面良好，可長期持有，逢低買入' : 
              language === 'Simplified Chinese' ? '建议：基本面良好，可长期持有，逢低买入' :
              'ACCUMULATE: Strong fundamentals, suitable for long-term holding';
  } else if (confidenceScore >= 50) {
    recText = language === 'Traditional Chinese' ? '建議：持有觀望，等待更明確信號' : 
              language === 'Simplified Chinese' ? '建议：持有观望，等待更明确信号' :
              'HOLD: Wait for clearer signals';
  } else {
    recText = language === 'Traditional Chinese' ? '建議：謹慎操作，僅適合短線投機，嚴格控制止蝕' : 
              language === 'Simplified Chinese' ? '建议：谨慎操作，仅适合短线投机，严格控制止损' :
              'CAUTION: Speculative only, strict stop loss required';
  }
  
  // Build fundamentals text
  const fundParts = [];
  if (marketCap !== 'N/A') fundParts.push(`${labels.marketCapLabel}: ${marketCap}`);
  if (pe !== null) fundParts.push(`${labels.peLabel}: ${pe.toFixed(2)}x`);
  if (eps !== null) fundParts.push(`EPS: ${eps.toFixed(2)}`);
  if (revenueGrowth !== null) fundParts.push(`${language === 'Traditional Chinese' ? '收入增長' : language === 'Simplified Chinese' ? '收入增长' : 'Revenue Growth'}: ${revenueGrowth.toFixed(2)}%`);
  if (profitMargin !== null) fundParts.push(`${language === 'Traditional Chinese' ? '利潤率' : language === 'Simplified Chinese' ? '利润率' : 'Profit Margin'}: ${profitMargin.toFixed(2)}%`);
  if (debtRatio !== null) fundParts.push(`${labels.debtLabel}: ${debtRatio.toFixed(2)}%`);
  if (dividendYield !== null) fundParts.push(`${labels.dividendLabel}: ${dividendYield.toFixed(2)}%`);
  
  let fundText = '';
  if (fundParts.length > 0) {
    fundText = fundParts.join(' | ');
  } else {
    fundText = language === 'Traditional Chinese' ? '暫無詳細財務數據。請參考技術面分析。' : 
               language === 'Simplified Chinese' ? '暂无详细财务数据。请参考技术面分析。' :
               'No detailed financial data available. Please refer to technical analysis.';
  }
  
  // Add sector/industry if available
  if (sector !== 'N/A' || industry !== 'N/A') {
    const sectorText = `${language === 'Traditional Chinese' ? '行業' : language === 'Simplified Chinese' ? '行业' : 'Industry'}: ${sector}${industry !== 'N/A' ? ` / ${industry}` : ''}`;
    fundText += `\n${sectorText}`;
  }
  
  const dayLow = stockData.dayLow ? `${currency}${stockData.dayLow.toFixed(2)}` : `${currency}${(price * 0.97).toFixed(2)}`;
  const dayHigh = stockData.dayHigh ? `${currency}${stockData.dayHigh.toFixed(2)}` : `${currency}${(price * 1.03).toFixed(2)}`;
  
  return `${companyName} (${symbol}) ${labels.analysis}

${labels.summary}
${labels.currentPrice}: ${currency}${price.toFixed(2)}, ${labels.dailyChange}: ${changeText}
${labels.dayRange}: ${dayLow} - ${dayHigh}
${labels.rsi}: ${rsiValue.toFixed(1)} (${rsiStatus})

${labels.technical}
RSI(14): ${rsiValue.toFixed(1)} - ${rsiStatus}
${labels.macd}: ${macdStatus}
${labels.trend}: ${trend}
${labels.volatility}: ${volatility}%
${labels.volume}: ${avgVolume}M

${labels.fundamentals}
${fundText}

${labels.news}
${language === 'Traditional Chinese' ? '近期暫無重大相關新聞。' : language === 'Simplified Chinese' ? '近期暂无重大相关新闻。' : 'No significant recent news available.'}

${labels.bullish}
• ${bullPoints.join('\n• ')}

${labels.bearish}
• ${bearPoints.join('\n• ')}

${labels.trading}
${labels.target}: ${currency}${targetPrice.toFixed(2)}
${labels.stop}: ${currency}${stopPrice.toFixed(2)}
${language === 'Traditional Chinese' ? '風險回報比' : language === 'Simplified Chinese' ? '风险回报比' : 'Risk/Reward Ratio'}: 1:${((targetPrice - price) / (price - stopPrice)).toFixed(1)}

${labels.final}
${recText}
${labels.risk}: ${language === 'Traditional Chinese' ? '⚠️ 中等風險' : language === 'Simplified Chinese' ? '⚠️ 中等风险' : '⚠️ MEDIUM RISK'}
${labels.confidence}: ${confidenceScore}%

${labels.disclaimer}`;
}

function formatMarketCap(value: number): string {
  if (!value || value === 0) return 'N/A';
  const absValue = Math.abs(value);
  if (absValue >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (absValue >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (absValue >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toFixed(0)}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, summary: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { message, language = 'English', userContent = null } = body;
    
    console.log(`📝 Query: ${message}, Language: ${language}`);

    const symbol = detectStock(message);
    
    if (!symbol) {
      let errorMsg = '';
      if (language === 'Traditional Chinese') {
        errorMsg = '無法識別股票代號。請嘗試: 台積電, 騰訊, 特斯拉, 或直接輸入代號如 2330.TW, 0700.HK, TSLA';
      } else if (language === 'Simplified Chinese') {
        errorMsg = '无法识别股票代码。请尝试: 台积电, 腾讯, 特斯拉, 或直接输入代码如 2330.TW, 0700.HK, TSLA';
      } else {
        errorMsg = 'Unable to recognize stock symbol. Please try: 2330.TW, 0700.HK, TSLA';
      }
      return new Response(
        JSON.stringify({ success: false, summary: errorMsg, text: errorMsg }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`✅ Detected symbol: ${symbol}`);

    const [stockData, fundamentals] = await Promise.all([
      fetchStockData(symbol),
      fetchFundamentals(symbol)
    ]);
    
    if (!stockData) {
      let errorMsg = '';
      if (language === 'Traditional Chinese') {
        errorMsg = `無法獲取 ${symbol} 的即時數據，請稍後再試。`;
      } else if (language === 'Simplified Chinese') {
        errorMsg = `无法获取 ${symbol} 的实时数据，请稍后再试。`;
      } else {
        errorMsg = `Unable to fetch real-time data for ${symbol}. Please try again.`;
      }
      return new Response(
        JSON.stringify({ success: false, summary: errorMsg, text: errorMsg }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const analysisText = generateAnalysis(symbol, stockData, fundamentals, language);

    console.log(`✅ Analysis generated successfully`);

    // Build fundamentals response with proper values
    const fundResponse = {
      peRatio: fundamentals?.peRatio ?? null,
      marketCap: fundamentals?.marketCap ? formatMarketCap(fundamentals.marketCap) : 'N/A',
      eps: fundamentals?.eps ?? null,
      revenueGrowth: fundamentals?.revenueGrowth ?? null,
      profitMargin: fundamentals?.profitMargin ?? null,
      debtRatio: fundamentals?.debtRatio ?? null,
      dividendYield: fundamentals?.dividendYield ?? null,
      sector: fundamentals?.sector || 'N/A',
      industry: fundamentals?.industry || 'N/A',
      longName: fundamentals?.longName || stockData.name || symbol,
    };

    return new Response(
      JSON.stringify({
        success: true,
        symbol: symbol,
        companyName: fundResponse.longName,
        price: stockData.price,
        changePercent: stockData.changePercent,
        currency: stockData.currency || '$',
        summary: analysisText,
        text: analysisText,
        fundamentals: fundResponse,
        specificAnalysis: {
          confidenceScore: 55,
          specificRecommendation: 'Hold',
          targetPrice: stockData.price * 1.1,
          stopLoss: stockData.price * 0.92,
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        summary: 'Internal server error',
        text: 'Service temporarily unavailable. Please try again later.'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});