import axios, { AxiosError } from "axios";

//sanity check
console.log("🚀 userTests.ts starting...");

const BASE_URL = process.env.API_BASE_URL || "http://localhost:4000";
const PATHS = {
  register: "/auth/register",
  login: "/auth/login",
  me: "/auth/me",
  delete: "/auth/delete",
};

type MaybeToken = string | undefined;

function logStep(n: number, title: string) {
  console.log(`\n${"=".repeat(8)} Step ${n}: ${title} ${"=".repeat(8)}`);
}

function logResponse(res: any) {
  console.log(`Status: ${res.status}`);
  if (res.data) console.log("Body:", JSON.stringify(res.data, null, 2));
}

function logAxiosError(e: AxiosError) {
  if (e.response) {
    console.error(`Status: ${e.response.status}`);
    console.error("Body:", JSON.stringify(e.response.data, null, 2));
  } else if (e.request) {
    console.error("No response received");
  } else {
    console.error("Error:", e.message);
  }
}

async function post(path: string, body: any, token?: MaybeToken) {
  try {
    const res = await axios.post(BASE_URL + path, body, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      validateStatus: () => true, // don't throw on non-2xx
    });
    logResponse(res);
    return res;
  } catch (err: any) {
    logAxiosError(err);
    throw err;
  }
}

async function get(path: string, token?: MaybeToken) {
  try {
    const res = await axios.get(BASE_URL + path, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      validateStatus: () => true,
    });
    logResponse(res);
    return res;
  } catch (err: any) {
    logAxiosError(err);
    throw err;
  }
}

async function del(path: string, token?: MaybeToken) {
  try {
    const res = await axios.delete(BASE_URL + path, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      validateStatus: () => true,
    });
    logResponse(res);
    return res;
  } catch (err: any) {
    logAxiosError(err);
    throw err;
  }
}

(async () => {
  // generate a unique test user each run
  const runId = Date.now();
  const email = `user_${runId}@example.com`;
  const goodPassword = "hunter42!";
  const badPassword = "123"; // too short

  let tokenFromRegister: string | undefined;
  let tokenFromLogin: string | undefined;

  // 1) create a user with no input in username or password
  logStep(1, "Register with empty body (should be 400)");
  await post(PATHS.register, {});

  // 2) create a user with a password too short
  logStep(2, "Register with short password (should be 400)");
  await post(PATHS.register, { email, password: badPassword });

  // 3) create a valid user
  logStep(3, "Register valid user (should be 201)");
  const regRes = await post(PATHS.register, { email, password: goodPassword });
  tokenFromRegister = regRes?.data?.token;

  // 4) call getuserprofile on newly created user
  logStep(4, "Get profile with token from register (should be 200)");
  await get(PATHS.me, tokenFromRegister);

  // 5) login with empty username and password
  logStep(5, "Login with empty creds (should be 400)");
  await post(PATHS.login, {});

  // 6) login with correct username but incorrect password
  logStep(6, "Login with wrong password (should be 401)");
  await post(PATHS.login, { email, password: "wrong-password" });

  // 7) login with correct username and password
  logStep(7, "Login with correct creds (should be 200)");
  const loginRes = await post(PATHS.login, { email, password: goodPassword });
  tokenFromLogin = loginRes?.data?.token;

  // 8) delete the user created
  logStep(8, "Delete user (should be 200)");
  await del(PATHS.delete, tokenFromLogin);

  // 9) call getuserprofile on deleted account
  logStep(9, "Get profile after deletion (should be 404 or 401 depending on middleware)");
  await get(PATHS.me, tokenFromLogin);

  // 10) call login with deleted user credentials
  logStep(10, "Login after deletion (should be 401)");
  await post(PATHS.login, { email, password: goodPassword });

  console.log("\n✅ Test sequence completed.");
})().catch((e) => {
  console.error("\n❌ Test sequence failed.");
  process.exit(1);
});
