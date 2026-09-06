// server.js
import express from 'express';
import cors from 'cors';
import { StockScoreEngine } from './src/lib/stock/StockScoreEngine.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Stock Score API endpoint
app.post('/api/stock-score', async (req, res) => {
  try {
    const { symbol, stockData, language } = req.body;

    console.log('📊 Stock Score API called for:', symbol);

    if (!symbol || !stockData) {
      return res.status(400).json({
        success: false,
        error: 'Missing symbol or stockData'
      });
    }

    const engine = new StockScoreEngine(symbol, stockData, {});
    const stockScore = engine.getScore();
    const scoreText = engine.getScoreText(language || 'en');

    return res.json({
      success: true,
      stockScore,
      scoreText
    });

  } catch (error) {
    console.error('❌ Stock Score API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to calculate stock score'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Stock Score API running on http://localhost:${PORT}`);
});