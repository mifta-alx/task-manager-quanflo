import express from 'express';
import cors from 'cors';
import { errorHandler } from "#middlewares/errorHandler.js";
import taskRoutes from "#routes/taskRoutes.js";

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.use('/api', taskRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});