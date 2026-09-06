// src/lib/stock/StockScoreEngine.ts

export interface ScoreResult {
  category: string;
  score: number;
  maxScore: number;
  weight: number;
  emoji: '🟢' | '🟡' | '🔴';
  details: string[];
}

export interface StockScore {
  totalScore: number;
  recommendation: 'STRONG BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG SELL';
  riskLevel: 'Low' | 'Low-Moderate' | 'Moderate' | 'High' | 'Very High';
  scores: {
    trend: ScoreResult;
    momentum: ScoreResult;
    volume: ScoreResult;
    valuation: ScoreResult;
    fundamentals: ScoreResult;
    risk: ScoreResult;
    market: ScoreResult;
  };
  explanation: string;
  categoryBreakdown: ScoreResult[];
}

export class StockScoreEngine {
  private symbol: string;
  private stockData: any;
  private fundamentals: any;

  constructor(symbol: string, stockData: any, fundamentals: any) {
    this.symbol = symbol;
    this.stockData = stockData;
    this.fundamentals = fundamentals || {};
  }

  private getEmoji(score: number, max: number): '🟢' | '🟡' | '🔴' {
    const percentage = score / max;
    if (percentage >= 0.7) return '🟢';
    if (percentage >= 0.45) return '🟡';
    return '🔴';
  }

  // ── TREND SCORE (25%) ──
  private calculateTrendScore(): ScoreResult {
    const weight = 25;
    let score = 0;
    const details: string[] = [];
    
    const price = this.stockData.price;
    const sma20 = this.stockData.sma20;
    const sma50 = this.stockData.sma50;
    const adx = this.stockData.adx || 20;
    const trend = this.stockData.trend;

    // 1. Price vs MA50 (8 points)
    if (price && sma50) {
      const percentAbove = ((price - sma50) / sma50) * 100;
      if (percentAbove > 10) {
        score += 8;
        details.push(`Price ${percentAbove.toFixed(1)}% above MA50 (+8)`);
      } else if (percentAbove > 5) {
        score += 6;
        details.push(`Price ${percentAbove.toFixed(1)}% above MA50 (+6)`);
      } else if (percentAbove > 0) {
        score += 4;
        details.push(`Price ${percentAbove.toFixed(1)}% above MA50 (+4)`);
      } else if (percentAbove > -5) {
        score += 2;
        details.push(`Price ${percentAbove.toFixed(1)}% below MA50 (+2)`);
      } else {
        details.push(`Price ${percentAbove.toFixed(1)}% below MA50 (0)`);
      }
    }

    // 2. ADX for trend strength (7 points)
    if (adx > 30) {
      score += 7;
      details.push(`Strong trend detected (ADX: ${adx.toFixed(1)}) (+7)`);
    } else if (adx > 25) {
      score += 5;
      details.push(`Moderate trend (ADX: ${adx.toFixed(1)}) (+5)`);
    } else if (adx > 20) {
      score += 3;
      details.push(`Weak trend (ADX: ${adx.toFixed(1)}) (+3)`);
    } else {
      details.push(`No trend (ADX: ${adx.toFixed(1)}) (0)`);
    }

    // 3. Trend direction (5 points)
    if (trend === 'Uptrend') {
      score += 5;
      details.push('Uptrend (+5)');
    } else if (trend === 'Sideways') {
      score += 2;
      details.push('Sideways trend (+2)');
    } else {
      details.push('Downtrend (0)');
    }

    // 4. Price vs SMA20 (5 points)
    if (price && sma20) {
      if (price > sma20 * 1.05) {
        score += 5;
        details.push('Price well above SMA20 (+5)');
      } else if (price > sma20) {
        score += 3;
        details.push('Price above SMA20 (+3)');
      } else if (price > sma20 * 0.95) {
        score += 1;
        details.push('Price near SMA20 (+1)');
      } else {
        details.push('Price below SMA20 (0)');
      }
    }

    return {
      category: 'Trend',
      score: Math.min(Math.round(score * 10) / 10, weight),
      maxScore: weight,
      weight,
      emoji: this.getEmoji(score, weight),
      details
    };
  }

  // ── MOMENTUM SCORE (20%) ──
  private calculateMomentumScore(): ScoreResult {
    const weight = 20;
    let score = 0;
    const details: string[] = [];
    
    const rsi = this.stockData.rsi;
    const macd = this.stockData.macd;
    const stochastic = this.stockData.stochastic || 50;
    const price = this.stockData.price;
    const historical = this.stockData.historical || [];

    // 1. RSI (6 points)
    if (rsi !== null && rsi !== undefined) {
      if (rsi >= 30 && rsi <= 45) {
        score += 6;
        details.push(`RSI ${rsi.toFixed(1)} - favorable buying zone (+6)`);
      } else if (rsi > 45 && rsi <= 55) {
        score += 4;
        details.push(`RSI ${rsi.toFixed(1)} - neutral (+4)`);
      } else if (rsi > 55 && rsi <= 70) {
        score += 2;
        details.push(`RSI ${rsi.toFixed(1)} - slightly overbought (+2)`);
      } else if (rsi < 30) {
        score += 5;
        details.push(`RSI ${rsi.toFixed(1)} - oversold, bounce potential (+5)`);
      } else if (rsi > 70) {
        score += 1;
        details.push(`RSI ${rsi.toFixed(1)} - overbought, caution (+1)`);
      }
    }

    // 2. MACD (5 points)
    if (macd === 'Bullish') {
      score += 5;
      details.push('MACD Bullish (+5)');
    } else if (macd === 'Neutral') {
      score += 2;
      details.push('MACD Neutral (+2)');
    } else {
      details.push('MACD Bearish (0)');
    }

    // 3. Stochastic Oscillator (4 points)
    if (stochastic < 20) {
      score += 4;
      details.push(`Stochastic ${stochastic.toFixed(1)} - oversold, buy signal (+4)`);
    } else if (stochastic < 80) {
      score += 2;
      details.push(`Stochastic ${stochastic.toFixed(1)} - neutral (+2)`);
    } else {
      score += 0.5;
      details.push(`Stochastic ${stochastic.toFixed(1)} - overbought, caution (+0.5)`);
    }

    // 4. ROC - price momentum (5 points)
    if (historical.length >= 10) {
      const currentPrice = historical[historical.length - 1]?.price || price;
      const price10DaysAgo = historical[Math.max(0, historical.length - 11)]?.price || currentPrice;
      const roc = ((currentPrice - price10DaysAgo) / price10DaysAgo) * 100;
      
      if (roc > 5) {
        score += 5;
        details.push(`Strong momentum +${roc.toFixed(1)}% (+5)`);
      } else if (roc > 2) {
        score += 3;
        details.push(`Positive momentum +${roc.toFixed(1)}% (+3)`);
      } else if (roc > -2) {
        score += 1;
        details.push(`Flat momentum ${roc.toFixed(1)}% (+1)`);
      } else if (roc > -5) {
        score += 0.5;
        details.push(`Slight negative ${roc.toFixed(1)}% (+0.5)`);
      } else {
        details.push(`Strong negative ${roc.toFixed(1)}% (0)`);
      }
    }

    return {
      category: 'Momentum',
      score: Math.min(Math.round(score * 10) / 10, weight),
      maxScore: weight,
      weight,
      emoji: this.getEmoji(score, weight),
      details
    };
  }

  // ── VOLUME SCORE (10%) ──
  private calculateVolumeScore(): ScoreResult {
    const weight = 10;
    let score = 0;
    const details: string[] = [];
    
    const avgVolume = this.stockData.avgVolume;
    const currentVolume = this.stockData.volume;
    const historical = this.stockData.historical || [];
    const price = this.stockData.price;
    const change = this.stockData.changePercent || 0;

    // 1. Volume vs average (5 points)
    if (avgVolume && currentVolume && avgVolume > 0) {
      const ratio = currentVolume / avgVolume;
      if (ratio > 1.5) {
        score += 5;
        details.push(`Volume ${(ratio * 100).toFixed(0)}% above average (+5)`);
      } else if (ratio > 1.2) {
        score += 3;
        details.push(`Volume ${(ratio * 100).toFixed(0)}% above average (+3)`);
      } else if (ratio > 0.8) {
        score += 2;
        details.push('Volume at average levels (+2)');
      } else {
        details.push('Volume below average (0)');
      }
    }

    // 2. Price-volume confirmation (5 points)
    if (historical.length >= 5) {
      const recentPrices = historical.slice(-5).map((d: any) => d.price);
      const recentVolumes = historical.slice(-5).map((d: any) => d.volume);
      
      if (recentPrices.length >= 5 && recentVolumes.length >= 5) {
        const priceUp = recentPrices[4] > recentPrices[0];
        const volumeUp = recentVolumes[4] > recentVolumes[0];
        
        // Check if volume is confirming the price trend
        if ((priceUp && volumeUp) || (!priceUp && !volumeUp)) {
          if (priceUp) {
            score += 5;
            details.push('Price & volume both rising - strong confirmation (+5)');
          } else {
            score += 2;
            details.push('Price & volume both falling - caution (+2)');
          }
        } else if (priceUp && !volumeUp) {
          score += 1;
          details.push('Price rising, volume falling - weak signal (+1)');
        } else if (!priceUp && volumeUp) {
          score += 3;
          details.push('Price falling, volume rising - possible accumulation (+3)');
        }
      }
    }

    return {
      category: 'Volume',
      score: Math.min(Math.round(score * 10) / 10, weight),
      maxScore: weight,
      weight,
      emoji: this.getEmoji(score, weight),
      details
    };
  }

  // ── VALUATION SCORE (15%) ──
  private calculateValuationScore(): ScoreResult {
    const weight = 15;
    let score = 0;
    const details: string[] = [];
    
    const pe = this.fundamentals?.peRatio;
    const peg = this.fundamentals?.pegRatio;
    const evEbitda = this.fundamentals?.evEbitda;
    const sector = this.stockData.sector || '';

    // 1. P/E (6 points)
    if (pe !== null && pe !== undefined && pe > 0) {
      // Adjust for technology sector (higher P/E is normal)
      const isTech = sector.toLowerCase().includes('technology') || 
                     sector.toLowerCase().includes('semiconductor');
      const techAdjustment = isTech ? 1.3 : 1;
      
      const adjustedPe = pe / techAdjustment;
      
      if (adjustedPe < 10) {
        score += 6;
        details.push(`P/E ${pe.toFixed(1)}x - undervalued (+6)`);
      } else if (adjustedPe < 20) {
        score += 4;
        details.push(`P/E ${pe.toFixed(1)}x - fair value (+4)`);
      } else if (adjustedPe < 35) {
        score += 2;
        details.push(`P/E ${pe.toFixed(1)}x - slightly high (+2)`);
      } else {
        details.push(`P/E ${pe.toFixed(1)}x - overvalued (0)`);
      }
    } else {
      details.push('P/E not available (0)');
    }

    // 2. PEG (5 points)
    if (peg !== null && peg !== undefined && peg > 0) {
      if (peg < 1) {
        score += 5;
        details.push(`PEG ${peg.toFixed(2)} - undervalued (+5)`);
      } else if (peg < 2) {
        score += 3;
        details.push(`PEG ${peg.toFixed(2)} - fair (+3)`);
      } else {
        details.push(`PEG ${peg.toFixed(2)} - overvalued (0)`);
      }
    }

    // 3. EV/EBITDA (4 points)
    if (evEbitda !== null && evEbitda !== undefined && evEbitda > 0) {
      if (evEbitda < 8) {
        score += 4;
        details.push(`EV/EBITDA ${evEbitda.toFixed(1)}x - attractive (+4)`);
      } else if (evEbitda < 15) {
        score += 2;
        details.push(`EV/EBITDA ${evEbitda.toFixed(1)}x - fair (+2)`);
      } else {
        details.push(`EV/EBITDA ${evEbitda.toFixed(1)}x - expensive (0)`);
      }
    }

    return {
      category: 'Valuation',
      score: Math.min(Math.round(score * 10) / 10, weight),
      maxScore: weight,
      weight,
      emoji: this.getEmoji(score, weight),
      details
    };
  }

  // ── FUNDAMENTALS SCORE (25%) ──
  private calculateFundamentalScore(): ScoreResult {
    const weight = 25;
    let score = 0;
    const details: string[] = [];
    
    const revenueGrowth = this.fundamentals?.revenueGrowth;
    const epsGrowth = this.fundamentals?.epsGrowth;
    const profitMargin = this.fundamentals?.profitMargin;
    const roe = this.fundamentals?.roe;
    const roic = this.fundamentals?.roic;
    const debtToEquity = this.fundamentals?.debtToEquity;
    const fcfGrowth = this.fundamentals?.fcfGrowth;

    // 1. Revenue Growth (5 points)
    if (revenueGrowth !== null && revenueGrowth !== undefined) {
      if (revenueGrowth > 30) {
        score += 5;
        details.push(`Revenue growth ${revenueGrowth.toFixed(1)}% - exceptional (+5)`);
      } else if (revenueGrowth > 20) {
        score += 4;
        details.push(`Revenue growth ${revenueGrowth.toFixed(1)}% - strong (+4)`);
      } else if (revenueGrowth > 10) {
        score += 3;
        details.push(`Revenue growth ${revenueGrowth.toFixed(1)}% - good (+3)`);
      } else if (revenueGrowth > 5) {
        score += 2;
        details.push(`Revenue growth ${revenueGrowth.toFixed(1)}% - moderate (+2)`);
      } else if (revenueGrowth > 0) {
        score += 1;
        details.push(`Revenue growth ${revenueGrowth.toFixed(1)}% - weak (+1)`);
      } else {
        details.push(`Revenue growth ${revenueGrowth.toFixed(1)}% - negative (0)`);
      }
    }

    // 2. EPS Growth (5 points)
    if (epsGrowth !== null && epsGrowth !== undefined) {
      if (epsGrowth > 25) {
        score += 5;
        details.push(`EPS growth ${epsGrowth.toFixed(1)}% - exceptional (+5)`);
      } else if (epsGrowth > 15) {
        score += 4;
        details.push(`EPS growth ${epsGrowth.toFixed(1)}% - strong (+4)`);
      } else if (epsGrowth > 5) {
        score += 2;
        details.push(`EPS growth ${epsGrowth.toFixed(1)}% - moderate (+2)`);
      } else if (epsGrowth > 0) {
        score += 1;
        details.push(`EPS growth ${epsGrowth.toFixed(1)}% - weak (+1)`);
      } else {
        details.push(`EPS growth ${epsGrowth.toFixed(1)}% - negative (0)`);
      }
    }

    // 3. Profit Margin (4 points)
    if (profitMargin !== null && profitMargin !== undefined) {
      if (profitMargin > 25) {
        score += 4;
        details.push(`Profit margin ${profitMargin.toFixed(1)}% - excellent (+4)`);
      } else if (profitMargin > 15) {
        score += 3;
        details.push(`Profit margin ${profitMargin.toFixed(1)}% - good (+3)`);
      } else if (profitMargin > 8) {
        score += 2;
        details.push(`Profit margin ${profitMargin.toFixed(1)}% - average (+2)`);
      } else if (profitMargin > 0) {
        score += 1;
        details.push(`Profit margin ${profitMargin.toFixed(1)}% - low (+1)`);
      } else {
        details.push(`Profit margin ${profitMargin.toFixed(1)}% - negative (0)`);
      }
    }

    // 4. ROE (4 points)
    if (roe !== null && roe !== undefined) {
      if (roe > 20) {
        score += 4;
        details.push(`ROE ${roe.toFixed(1)}% - excellent (+4)`);
      } else if (roe > 12) {
        score += 3;
        details.push(`ROE ${roe.toFixed(1)}% - good (+3)`);
      } else if (roe > 8) {
        score += 1.5;
        details.push(`ROE ${roe.toFixed(1)}% - average (+1.5)`);
      } else {
        details.push(`ROE ${roe.toFixed(1)}% - low (0)`);
      }
    }

    // 5. ROIC (3 points)
    if (roic !== null && roic !== undefined) {
      if (roic > 15) {
        score += 3;
        details.push(`ROIC ${roic.toFixed(1)}% - excellent (+3)`);
      } else if (roic > 10) {
        score += 2;
        details.push(`ROIC ${roic.toFixed(1)}% - good (+2)`);
      } else if (roic > 6) {
        score += 1;
        details.push(`ROIC ${roic.toFixed(1)}% - average (+1)`);
      } else {
        details.push(`ROIC ${roic.toFixed(1)}% - low (0)`);
      }
    }

    // 6. Debt-to-Equity (4 points)
    if (debtToEquity !== null && debtToEquity !== undefined && debtToEquity > 0) {
      if (debtToEquity < 30) {
        score += 4;
        details.push(`Debt/Equity ${debtToEquity.toFixed(1)}% - healthy (+4)`);
      } else if (debtToEquity < 50) {
        score += 2.5;
        details.push(`Debt/Equity ${debtToEquity.toFixed(1)}% - acceptable (+2.5)`);
      } else if (debtToEquity < 70) {
        score += 1;
        details.push(`Debt/Equity ${debtToEquity.toFixed(1)}% - elevated (+1)`);
      } else {
        details.push(`Debt/Equity ${debtToEquity.toFixed(1)}% - high debt (0)`);
      }
    }

    // 7. Free Cash Flow Growth (bonus points)
    if (fcfGrowth !== null && fcfGrowth !== undefined) {
      if (fcfGrowth > 20) {
        score += 0.5;
        details.push(`FCF growth ${fcfGrowth.toFixed(1)}% - excellent (+0.5)`);
      } else if (fcfGrowth > 10) {
        score += 0.3;
        details.push(`FCF growth ${fcfGrowth.toFixed(1)}% - good (+0.3)`);
      }
    }

    return {
      category: 'Fundamentals',
      score: Math.min(Math.round(score * 10) / 10, weight),
      maxScore: weight,
      weight,
      emoji: this.getEmoji(score, weight),
      details
    };
  }

  // ── RISK SCORE (5%) ──
  private calculateRiskScore(): ScoreResult {
    const weight = 5;
    let score = 0;
    const details: string[] = [];
    
    const volatility = this.stockData.volatility;
    const beta = this.fundamentals?.beta;
    const price = this.stockData.price;
    const dayLow = this.stockData.dayLow;
    const dayHigh = this.stockData.dayHigh;

    // 1. Beta (2 points)
    if (beta !== null && beta !== undefined && beta > 0) {
      if (beta < 0.8) {
        score += 2;
        details.push(`Beta ${beta.toFixed(2)} - low volatility (+2)`);
      } else if (beta < 1.2) {
        score += 1.5;
        details.push(`Beta ${beta.toFixed(2)} - market average (+1.5)`);
      } else {
        details.push(`Beta ${beta.toFixed(2)} - high volatility (0)`);
      }
    }

    // 2. Volatility (2 points)
    if (volatility !== null && volatility !== undefined) {
      const volPct = volatility * 100;
      if (volPct < 25) {
        score += 2;
        details.push(`Volatility ${volPct.toFixed(1)}% - low (+2)`);
      } else if (volPct < 40) {
        score += 1;
        details.push(`Volatility ${volPct.toFixed(1)}% - moderate (+1)`);
      } else {
        details.push(`Volatility ${volPct.toFixed(1)}% - high (0)`);
      }
    }

    // 3. Daily drawdown (1 point)
    if (price && dayLow) {
      const drawdown = ((price - dayLow) / price) * 100;
      if (drawdown < 2) {
        score += 1;
        details.push(`Intraday drawdown ${drawdown.toFixed(1)}% - low (+1)`);
      } else if (drawdown < 5) {
        score += 0.5;
        details.push(`Intraday drawdown ${drawdown.toFixed(1)}% - moderate (+0.5)`);
      } else {
        details.push(`Intraday drawdown ${drawdown.toFixed(1)}% - high (0)`);
      }
    }

    // 4. 52-week range position (bonus)
    if (dayLow && dayHigh && price) {
      const range = dayHigh - dayLow;
      const position = range > 0 ? (price - dayLow) / range : 0.5;
      if (position > 0.8) {
        score += 0.5;
        details.push('Trading near 52-week high (+0.5)');
      } else if (position < 0.2) {
        score += 0.5;
        details.push('Trading near 52-week low - potential value (+0.5)');
      }
    }

    return {
      category: 'Risk',
      score: Math.min(Math.round(score * 10) / 10, weight),
      maxScore: weight,
      weight,
      emoji: this.getEmoji(score, weight),
      details
    };
  }

  // ── MARKET/SECTOR SCORE (10%) ──
  private calculateMarketScore(): ScoreResult {
    const weight = 10;
    let score = 0;
    const details: string[] = [];
    
    const trend = this.stockData.trend;
    const price = this.stockData.price;
    const sma20 = this.stockData.sma20;
    const sma50 = this.stockData.sma50;
    const marketCap = this.fundamentals?.marketCap;

    // 1. Relative to MA20 (4 points)
    if (price && sma20) {
      const relStrength = ((price - sma20) / sma20) * 100;
      if (relStrength > 5) {
        score += 4;
        details.push(`Price ${relStrength.toFixed(1)}% above MA20 - strong (+4)`);
      } else if (relStrength > 2) {
        score += 2.5;
        details.push(`Price ${relStrength.toFixed(1)}% above MA20 - good (+2.5)`);
      } else if (relStrength > -2) {
        score += 1;
        details.push(`Price near MA20 - neutral (+1)`);
      } else {
        details.push(`Price below MA20 - weak (0)`);
      }
    }

    // 2. Relative to MA50 (3 points)
    if (price && sma50) {
      const relStrength = ((price - sma50) / sma50) * 100;
      if (relStrength > 5) {
        score += 3;
        details.push(`Price ${relStrength.toFixed(1)}% above MA50 - strong (+3)`);
      } else if (relStrength > 0) {
        score += 1.5;
        details.push(`Price ${relStrength.toFixed(1)}% above MA50 - good (+1.5)`);
      } else if (relStrength > -5) {
        score += 0.5;
        details.push(`Price ${relStrength.toFixed(1)}% below MA50 - neutral (+0.5)`);
      } else {
        details.push(`Price ${relStrength.toFixed(1)}% below MA50 - weak (0)`);
      }
    }

    // 3. Trend direction (3 points)
    if (trend === 'Uptrend') {
      score += 3;
      details.push('In uptrend vs market (+3)');
    } else if (trend === 'Sideways') {
      score += 1.5;
      details.push('Sideways vs market (+1.5)');
    } else {
      details.push('In downtrend vs market (0)');
    }

    return {
      category: 'Market/Sector',
      score: Math.min(Math.round(score * 10) / 10, weight),
      maxScore: weight,
      weight,
      emoji: this.getEmoji(score, weight),
      details
    };
  }

  // ── GET COMPLETE SCORE ──
  public getScore(): StockScore {
    const trend = this.calculateTrendScore();
    const momentum = this.calculateMomentumScore();
    const volume = this.calculateVolumeScore();
    const valuation = this.calculateValuationScore();
    const fundamentals = this.calculateFundamentalScore();
    const risk = this.calculateRiskScore();
    const market = this.calculateMarketScore();

    const totalScore = Math.round(
      trend.score + 
      momentum.score + 
      volume.score + 
      valuation.score + 
      fundamentals.score + 
      risk.score + 
      market.score
    );

    // UPDATED THRESHOLDS
    let recommendation: 'STRONG BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG SELL';
    let riskLevel: 'Low' | 'Low-Moderate' | 'Moderate' | 'High' | 'Very High';

    if (totalScore >= 85) {
      recommendation = 'STRONG BUY';
      riskLevel = 'Low';
    } else if (totalScore >= 70) {
      recommendation = 'BUY';
      riskLevel = 'Low-Moderate';
    } else if (totalScore >= 55) {
      recommendation = 'HOLD';
      riskLevel = 'Moderate';
    } else if (totalScore >= 35) {
      recommendation = 'SELL';
      riskLevel = 'High';
    } else {
      recommendation = 'STRONG SELL';
      riskLevel = 'Very High';
    }

    const explanation = this.generateExplanation(
      trend, momentum, volume, valuation, fundamentals, risk, market
    );

    return {
      totalScore,
      recommendation,
      riskLevel,
      scores: {
        trend,
        momentum,
        volume,
        valuation,
        fundamentals,
        risk,
        market
      },
      explanation,
      categoryBreakdown: [trend, momentum, volume, valuation, fundamentals, risk, market]
    };
  }

  // ── GENERATE EXPLANATION ──
  private generateExplanation(
    trend: ScoreResult,
    momentum: ScoreResult,
    volume: ScoreResult,
    valuation: ScoreResult,
    fundamentals: ScoreResult,
    risk: ScoreResult,
    market: ScoreResult
  ): string {
    const parts: string[] = [];
    
    // Trend
    if (trend.score / trend.maxScore >= 0.7) {
      parts.push('Strong uptrend with price above key moving averages.');
    } else if (trend.score / trend.maxScore >= 0.45) {
      parts.push('Moderate uptrend, price near moving averages.');
    } else {
      parts.push('Weak trend, price below key moving averages.');
    }

    // Momentum
    if (momentum.score / momentum.maxScore >= 0.7) {
      parts.push('Strong momentum with bullish indicators.');
    } else if (momentum.score / momentum.maxScore >= 0.45) {
      parts.push('Positive momentum, indicators are favorable.');
    } else {
      parts.push('Weak momentum, bearish signals detected.');
    }

    // Volume
    if (volume.score / volume.maxScore >= 0.7) {
      parts.push('Volume confirms the trend with strong buying interest.');
    } else if (volume.score / volume.maxScore >= 0.45) {
      parts.push('Volume is supportive of the current trend.');
    } else {
      parts.push('Low volume suggests lack of conviction.');
    }

    // Valuation
    if (valuation.score / valuation.maxScore >= 0.7) {
      parts.push('Valuation is attractive, stock appears undervalued.');
    } else if (valuation.score / valuation.maxScore >= 0.45) {
      parts.push('Valuation is fair, reasonably priced.');
    } else {
      parts.push('Valuation is expensive, caution advised.');
    }

    // Fundamentals
    if (fundamentals.score / fundamentals.maxScore >= 0.7) {
      parts.push('Strong fundamentals with excellent growth and profitability.');
    } else if (fundamentals.score / fundamentals.maxScore >= 0.45) {
      parts.push('Solid fundamentals, good financial health.');
    } else {
      parts.push('Weak fundamentals, financial concerns exist.');
    }

    // Risk
    if (risk.score / risk.maxScore >= 0.7) {
      parts.push('Low risk profile, stable stock.');
    } else if (risk.score / risk.maxScore >= 0.45) {
      parts.push('Moderate risk, manageable volatility.');
    } else {
      parts.push('High risk, significant volatility or drawdown risk.');
    }

    // Market
    if (market.score / market.maxScore >= 0.7) {
      parts.push('Strong relative performance vs market.');
    } else if (market.score / market.maxScore >= 0.45) {
      parts.push('Performance in line with market.');
    } else {
      parts.push('Underperforming relative to market.');
    }

    return parts.join(' ');
  }

  // ── GET SCORE TEXT FOR SHARING ──
  public getScoreText(langKey: string): string {
    const score = this.getScore();
    const isChinese = langKey === 'tc' || langKey === 'zh-TW' || langKey === 'zh-CN';
    
    const lines: string[] = [];
    
    lines.push(isChinese ? '═══════════════════════════════════════' : '═══════════════════════════════════════');
    lines.push(isChinese 
      ? `📊 DragonGpAi ${score.recommendation} 評分: ${score.totalScore}/100` 
      : `📊 DragonGpAi ${score.recommendation} Score: ${score.totalScore}/100`);
    lines.push(isChinese ? '═══════════════════════════════════════' : '═══════════════════════════════════════');
    lines.push('');
    
    const categories = [
      { key: 'trend', label: isChinese ? '趨勢' : 'Trend', weight: 25 },
      { key: 'momentum', label: isChinese ? '動量' : 'Momentum', weight: 20 },
      { key: 'volume', label: 'Volume', weight: 10 },
      { key: 'valuation', label: isChinese ? '估值' : 'Valuation', weight: 15 },
      { key: 'fundamentals', label: isChinese ? '基本面' : 'Fundamentals', weight: 25 },
      { key: 'risk', label: isChinese ? '風險' : 'Risk', weight: 5 },
      { key: 'market', label: isChinese ? '市場/板塊' : 'Market/Sector', weight: 10 },
    ];
    
    for (const cat of categories) {
      const data = score.scores[cat.key as keyof typeof score.scores];
      if (data) {
        lines.push(`${data.emoji} ${cat.label}: ${data.score.toFixed(1)}/${data.weight}`);
      }
    }
    
    lines.push('');
    lines.push(isChinese ? '📝 分析摘要:' : '📝 Analysis Summary:');
    lines.push(score.explanation);
    lines.push('');
    lines.push(isChinese ? `⚠️ 風險評級: ${score.riskLevel}` : `⚠️ Risk Rating: ${score.riskLevel}`);
    lines.push(isChinese ? '═══════════════════════════════════════' : '═══════════════════════════════════════');
    
    return lines.join('\n');
  }
}