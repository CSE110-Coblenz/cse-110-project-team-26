/**
 * Model for the Statistics screen.
 *
 * Manages user statistics data fetched from the backend.
 */
export type StatsCategory =
	| "Solving Linear Equations"
	| "Solving Quadratic Equations"
	| "One-Step Algebraic Equations"
	| "Multi-Step Algebraic Equations"
	| "Drawing Linear Equations"
	| "Drawing Quadratic Equations"
	| "Drawing Absolute Value Equations";

export interface UserStats {
	total: {
		answered: number;
		correct: number;
	};
	categories: Record<StatsCategory, { answered: number; correct: number }>;
	lastAnsweredAt?: string;
}

/**
 * All possible statistics categories in the order they should be displayed.
 */
export const ALL_CATEGORIES: StatsCategory[] = [
	"Solving Linear Equations",
	"Solving Quadratic Equations",
	"One-Step Algebraic Equations",
	"Multi-Step Algebraic Equations",
	"Drawing Linear Equations",
	"Drawing Quadratic Equations",
	"Drawing Absolute Value Equations",
];

export interface StatisticsState {
	stats: UserStats | null;
	loading: boolean;
	error: string | null;
}

export class StatisticsScreenModel {
	private state: StatisticsState;

	constructor() {
		this.state = {
			stats: null,
			loading: false,
			error: null,
		};
	}

	getState(): StatisticsState {
		return this.state;
	}

	/**
	 * Fetches user statistics from the backend.
	 * Requires authentication token in localStorage or cookies.
	 */
	async fetchStats(): Promise<void> {
		this.state = { ...this.state, loading: true, error: null };

		try {
			// Get auth token from localStorage (adjust based on your auth implementation)
			const token = localStorage.getItem("authToken");

			if (!token) {
				this.state = {
					...this.state,
					loading: false,
					error: "Not authenticated. Please log in.",
				};
				return;
			}

			const res = await fetch("http://localhost:4000/auth/me", {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				credentials: "include",
			});

			if (!res.ok) {
				const data = (await res.json().catch(() => null)) as
					| { error?: string }
					| null;
				this.state = {
					...this.state,
					loading: false,
					error: data?.error ?? "Failed to fetch statistics.",
				};
				return;
			}

			const data = (await res.json()) as { stats: UserStats };
			this.state = {
				...this.state,
				stats: data.stats,
				loading: false,
			};
		} catch (err) {
			console.error("Statistics fetch error:", err);
			this.state = {
				...this.state,
				loading: false,
				error: "Network error. Is the backend running?",
			};
		}
	}

	/**
	 * Calculates accuracy percentage for a category or total.
	 */
	getAccuracy(answered: number, correct: number): number {
		if (answered === 0) return 0;
		return Math.round((correct / answered) * 100);
	}
}

