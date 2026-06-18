import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { errorHandler } from "#middlewares/errorHandler.js";
import taskRoutes from "#routes/taskRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use('/api', taskRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running dynamically on port ${PORT}`);
});