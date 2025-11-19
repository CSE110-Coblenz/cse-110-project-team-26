// npx vitest --run

import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app, connectDB, disconnectDB } from "../../app";

const PATHS = {
    register: "/auth/register",
    login: "/auth/login",
    me: "/auth/me",
    delete: "/auth/delete",
    attempt: "/auth/stats/attempt",
  };
  
  const CATEGORIES = [
    "Solving Linear Equations",
    "Solving Quadratic Equations",
    "One-Step Algebraic Equations",
    "Multi-Step Algebraic Equations",
    "Drawing Linear Equations",
    "Drawing Quadratic Equations",
    "Drawing Absolute Value Equations",
  ] as const;
  
  let mongo: MongoMemoryServer;
  
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    process.env.JWT_SECRET = "dev_only_secret_for_tests_change_me";
    await connectDB(mongo.getUri());
  }, 30000);
  
  afterAll(async () => {
    await disconnectDB();
    await mongo.stop();
  }, 30000);

  /* 
     SECTION A: Account lifecycle & error handling progression
     Mirrors your 10-step script:
     1. Register empty
     2. Register short password
     3. Register valid user
     4. /me with register token
     5. Login empty
     6. Login wrong password
     7. Login correct
     8. Delete user
     9. /me after delete
     10. Login after delete
  */
  describe("SECTION A — Account lifecycle & error handling progression", () => {
    const email = `lifecycle_user_${Date.now()}@example.com`;
    const goodPassword = "MyStrongPass123!";
    const badPassword = "123";
    let tokenFromRegister: string | undefined;
    let tokenFromLogin: string | undefined;
  
    test("1) Register with empty body -> 400", async () => {
      const res = await request(app).post(PATHS.register).send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/email.*password/i);
    });
  
    test("2) Register with short password -> 400", async () => {
      const res = await request(app).post(PATHS.register).send({ email, password: badPassword });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/password.*8/i);
    });
  
    test("3) Register valid user -> 201", async () => {
      const res = await request(app).post(PATHS.register).send({ email, password: goodPassword });
      expect(res.status).toBe(201);
      tokenFromRegister = res.body.token;
      expect(tokenFromRegister).toBeDefined();
    });
  
    test("4) /auth/me with register token -> 200", async () => {
      const res = await request(app).get(PATHS.me).set("Authorization", `Bearer ${tokenFromRegister}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("user");
    });
  
    test("5) Login with empty body -> 400", async () => {
      const res = await request(app).post(PATHS.login).send({});
      expect(res.status).toBe(400);
    });
  
    test("6) Login wrong password -> 401", async () => {
      const res = await request(app).post(PATHS.login).send({ email, password: "wrong-password" });
      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/invalid credentials/i);
    });
  
    test("7) Login correct -> 200", async () => {
      const res = await request(app).post(PATHS.login).send({ email, password: goodPassword });
      expect(res.status).toBe(200);
      tokenFromLogin = res.body.token;
      expect(tokenFromLogin).toBeDefined();
    });
  
    test("8) Delete the user -> 200", async () => {
      const res = await request(app).delete(PATHS.delete).set("Authorization", `Bearer ${tokenFromLogin}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted/i);
    });
  
    test("9) /auth/me after deletion -> 404 or 401", async () => {
      const res = await request(app).get(PATHS.me).set("Authorization", `Bearer ${tokenFromLogin}`);
      expect([404, 401]).toContain(res.status);
    });
  
    test("10) Login after deletion -> 401", async () => {
      const res = await request(app).post(PATHS.login).send({ email, password: goodPassword });
      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/invalid credentials/i);
    });
  });


    /* 
     SECTION B: User/Account creation with statistics
     - 1) create an account
     - 2) check /me at initialization
     - 3) call update stats for each category
     - 4) check /me after
    */
     describe("SECTION B — User/Account creation with statistics", () => {
        const email = `stats_user_${Date.now()}@example.com`;
        const password = "hunter42!";
        let token: string | undefined;
      
        test("1) create an account", async () => {
          const res = await request(app).post(PATHS.register).send({ email, password });
          expect(res.status).toBe(201);
          expect(res.body).toHaveProperty("token");
          expect(res.body.user.email).toBe(email);
          token = res.body.token;
        });
      
        test("2) /auth/me at initialization", async () => {
          const res = await request(app).get(PATHS.me).set("Authorization", `Bearer ${token}`);
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty("user");
          expect(res.body).toHaveProperty("stats");
          expect(res.body.stats.total).toMatchObject({ answered: 0, correct: 0 });
          expect(typeof res.body.stats.categories).toBe("object");
        });
      
        test("3) update stats for each category", async () => {
          for (const category of CATEGORIES) {
            const res = await request(app)
              .post(PATHS.attempt)
              .set("Authorization", `Bearer ${token}`)
              .send({ category, isCorrect: true });
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({ ok: true });
          }
        });
      
        test("4) /auth/me after attempts", async () => {
          const res = await request(app).get(PATHS.me).set("Authorization", `Bearer ${token}`);
          expect(res.status).toBe(200);
          const { stats } = res.body;
          expect(stats.total.answered).toBe(CATEGORIES.length);
          expect(stats.total.correct).toBe(CATEGORIES.length);
          for (const cat of CATEGORIES) {
            const b = stats.categories?.[cat];
            expect(b, `Missing bucket for ${cat}`).toBeDefined();
            expect(b.answered).toBe(1);
            expect(b.correct).toBe(1);
          }
        });
      });
      