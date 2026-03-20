import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { processInput } from './gemini.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Bridge API is running.' });
});

// Main processing endpoint
app.post('/api/process', upload.single('image'), async (req, res) => {
  try {
    const { textContext } = req.body;
    const file = req.file;

    if (!textContext && !file) {
      return res.status(400).json({ error: 'Please provide textContext or an image file.' });
    }

    const { result, error } = await processInput({ text: textContext, image: file });
    
    if (error) {
      return res.status(500).json({ error });
    }

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error while processing input.' });
  }
});

app.listen(port, () => {
  console.log(`Universal Context Bridge API listening on port ${port}`);
});
