// src/pages/api/stock-score.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    const { symbol, stockData, language } = req.body;

    // Validate required fields
    if (!symbol) {
      return res.status(400).json({
        success: false,
        error: 'Missing symbol parameter'
      });
    }

    if (!stockData) {
      return res.status(400).json({
        success: false,
        error: 'Missing stockData parameter'
      });
    }

    // Dynamically import StockScoreEngine to avoid issues if not found
    let StockScoreEngine: any;
    try {
      // ✅ Correct path using @ alias
const module = await import('@/lib/stock/StockScoreEngine');
      StockScoreEngine = module.StockScoreEngine;
    } catch (importError) {
      console.error('Failed to import StockScoreEngine:', importError);
      return res.status(500).json({
        success: false,
        error: 'StockScoreEngine module not found'
      });
    }

    // Calculate the score
    const engine = new StockScoreEngine(symbol, stockData, {});
    const stockScore = engine.getScore();
    const scoreText = engine.getScoreText(language || 'en');

    return res.status(200).json({
      success: true,
      stockScore,
      scoreText
    });

  } catch (error) {
    console.error('Stock Score API Error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to calculate stock score'
    });
  }
}