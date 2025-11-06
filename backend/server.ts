import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from "./src/routes/user";

dotenv.config();

const app = express();
app.use(express.json());
// Mount user routes at /auth
app.use("/auth", userRoutes);

// Simple health route
app.get('/', (_req: Request, res: Response) => {
  res.send('<h1>Hello from Express + MongoDB (TypeScript)!</h1>');
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  console.error('❌ Missing MONGO_URI in .env');
  process.exit(1);
}

// Connect to Mongo
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('\n👋 Closed Mongo connection. Bye!');
  process.exit(0);
});
