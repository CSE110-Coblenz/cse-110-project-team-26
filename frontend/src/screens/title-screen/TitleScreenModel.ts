export interface AuthState {
	mode: "login" | "register";
	email: string;
	password: string;
	loading: boolean;
	error: string | null;
}

/**
 * Model for the Title/Login/Register screen.
 *
 * Keeps track of basic auth state and talks to the backend auth endpoints.
 * This is intentionally minimal so it can be extended later (e.g. validation, tokens).
 */
export class TitleScreenModel {
	private state: AuthState;

	constructor() {
		this.state = {
			mode: "login",
			email: "",
			password: "",
			loading: false,
			error: null,
		};
	}

	getState(): AuthState {
		return this.state;
	}

	setCredentials(email: string, password: string): void {
		this.state = { ...this.state, email, password };
	}

	switchMode(mode: AuthState["mode"]): void {
		if (this.state.mode === mode) return;
		this.state = { ...this.state, mode, error: null };
	}

	private setLoading(loading: boolean): void {
		this.state = { ...this.state, loading };
	}

	private setError(error: string | null): void {
		this.state = { ...this.state, error };
	}

	async submitAuth(screenSwitcher?: import("../../types").ScreenSwitcher): Promise<{ success: boolean; message?: string }> {
		const { mode, email, password } = this.state;
		if (!email || !password) {
			this.setError("Email and password are required.");
			return { success: false, message: "Email and password are required." };
		}

		this.setLoading(true);
		this.setError(null);

		try {
			const endpoint = mode === "login" ? "/login" : "/register";
			const res = await fetch(`http://localhost:4000/auth${endpoint}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
				credentials: "include",
			});

			const data = (await res.json().catch(() => null)) as
				| { token?: string; user?: { id: string; email: string }; error?: string }
				| null;

			if (res.status === 401) {
				const message = data?.error ?? "Invalid credentials.";
				this.setError(message);
				return { success: false, message };
			}

			if (!res.ok) {
				this.setError(data?.error ?? "Request failed.");
				return { success: false, message: data?.error ?? "Request failed." };
			}

			// Store auth token in localStorage
			if (data?.token) {
				localStorage.setItem("authToken", data.token);
			}

			// On success, route to tutorial screen
			if (screenSwitcher) {
				// TODO(team): Decide if tutorial should be skipped for returning users
				screenSwitcher.switchToScreen({ type: "tutorial" });
			}

			return { success: true };
		} catch (err) {
			console.error("Auth error:", err);
			this.setError("Network error. Is the backend running?");
			return { success: false, message: "Network error. Is the backend running?" };
		} finally {
			this.setLoading(false);
		}
	}
}
