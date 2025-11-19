// src/server.ts
import { app, connectDB } from "./app";

(async () => {
  await connectDB();

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})();
