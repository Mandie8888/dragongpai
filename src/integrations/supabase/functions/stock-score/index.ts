// supabase/functions/stock-score/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  try {
    const { symbol, stockData, language } = await req.json()

    if (!symbol || !stockData) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing parameters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const rsi = stockData.rsi || 50
    const trend = stockData.trend || 'Sideways'
    const macd = stockData.macd || 'Neutral'
    const change = stockData.change || 0
    const pe = stockData.pe || null
    const roe = stockData.roe || null

    // Calculate scores
    let trendScore = trend === 'Uptrend' ? 16 : trend === 'Sideways' ? 10 : 5
    
    let momentumScore = 0
    if (rsi >= 30 && rsi <= 50) momentumScore = 12
    else if (rsi > 50 && rsi <= 70) momentumScore = 9
    else if (rsi < 30) momentumScore = 10
    else if (rsi > 70) momentumScore = 3
    
    if (macd === 'Bullish') momentumScore += 3
    else if (macd === 'Bearish') momentumScore -= 3
    momentumScore = Math.max(0, Math.min(15, momentumScore))
    
    const volumeScore = Math.abs(change) > 3 ? 10 : Math.abs(change) > 1 ? 7 : 5
    
    let valuationScore = 7
    if (pe && pe > 0) {
      if (pe < 15) valuationScore = 12
      else if (pe < 30) valuationScore = 8
      else valuationScore = 4
    }
    
    let fundamentalScore = 10
    if (roe && roe > 0) {
      if (roe > 20) fundamentalScore = 16
      else if (roe > 10) fundamentalScore = 12
      else fundamentalScore = 6
    }
    
    let riskScore = 3
    const volatility = stockData.volatility || 0.3
    if (volatility < 0.25) riskScore = 4.5
    else if (volatility < 0.4) riskScore = 3
    else riskScore = 1.5
    
    const marketScore = trend === 'Uptrend' ? 8 : trend === 'Sideways' ? 5 : 3
    
    const totalScore = Math.round(
      trendScore + momentumScore + volumeScore + valuationScore + fundamentalScore + riskScore + marketScore
    )
    const finalScore = Math.min(100, Math.max(0, totalScore))

    let recommendation: string
    let riskLevel: string
    if (finalScore >= 80) { recommendation = 'STRONG BUY'; riskLevel = 'Low' }
    else if (finalScore >= 65) { recommendation = 'BUY'; riskLevel = 'Low-Moderate' }
    else if (finalScore >= 50) { recommendation = 'HOLD'; riskLevel = 'Moderate' }
    else if (finalScore >= 35) { recommendation = 'SELL'; riskLevel = 'High' }
    else { recommendation = 'STRONG SELL'; riskLevel = 'Very High' }

    const getEmoji = (score: number, max: number): string => {
      const pct = score / max
      if (pct >= 0.7) return '🟢'
      if (pct >= 0.45) return '🟡'
      return '🔴'
    }

    return new Response(
      JSON.stringify({
        success: true,
        stockScore: {
          totalScore: finalScore,
          recommendation,
          riskLevel,
          scores: {
            trend: { score: Math.min(trendScore, 20), maxScore: 20, emoji: getEmoji(trendScore, 20), details: [`Trend: ${trend}`] },
            momentum: { score: Math.min(momentumScore, 15), maxScore: 15, emoji: getEmoji(momentumScore, 15), details: [`RSI: ${rsi.toFixed(1)}, MACD: ${macd}`] },
            volume: { score: Math.min(volumeScore, 15), maxScore: 15, emoji: getEmoji(volumeScore, 15), details: [`Volume: ${Math.abs(change) > 3 ? 'High' : 'Moderate'}`] },
            valuation: { score: Math.min(valuationScore, 15), maxScore: 15, emoji: getEmoji(valuationScore, 15), details: [`PE: ${pe ? pe.toFixed(1) + 'x' : 'N/A'}`] },
            fundamentals: { score: Math.min(fundamentalScore, 20), maxScore: 20, emoji: getEmoji(fundamentalScore, 20), details: [`ROE: ${roe ? (roe * 100).toFixed(1) + '%' : 'N/A'}`] },
            risk: { score: Math.min(riskScore, 5), maxScore: 5, emoji: getEmoji(riskScore, 5), details: [`Risk: ${riskScore >= 3.5 ? 'Low' : 'Moderate'}`] },
            market: { score: Math.min(marketScore, 10), maxScore: 10, emoji: getEmoji(marketScore, 10), details: [`Market: ${trend === 'Uptrend' ? 'Strong' : 'Neutral'}`] }
          },
          explanation: `Score based on RSI ${rsi.toFixed(1)}, Trend ${trend}, MACD ${macd}. ${finalScore >= 65 ? 'Positive outlook with strong signals.' : finalScore >= 50 ? 'Mixed signals, wait for confirmation.' : 'Cautious outlook with weak signals.'}`
        },
        scoreText: `📊 Score: ${finalScore}/100 - ${recommendation}`
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})