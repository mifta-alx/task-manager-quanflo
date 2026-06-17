import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Test Route
app.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
});