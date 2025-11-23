/**
 * Model for the Tutorial screen.
 *
 * Manages tutorial state, progress, and content.
 * TODO(team): Add tutorial step tracking, content management, etc.
 */
export class TutorialScreenModel {
	private currentStep: number;
	private totalSteps: number;

	constructor() {
		this.currentStep = 0;
		this.totalSteps = 1; // Placeholder - update when tutorial content is added
	}

	getCurrentStep(): number {
		return this.currentStep;
	}

	getTotalSteps(): number {
		return this.totalSteps;
	}

	nextStep(): void {
		if (this.currentStep < this.totalSteps - 1) {
			this.currentStep++;
		}
	}

	previousStep(): void {
		if (this.currentStep > 0) {
			this.currentStep--;
		}
	}

	reset(): void {
		this.currentStep = 0;
	}
}

