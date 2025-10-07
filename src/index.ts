import express from 'express';
import { User, StudyMaterial } from './types';

const app = express();
const port = 3000;

app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'PrepMaster API is running!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
}); 