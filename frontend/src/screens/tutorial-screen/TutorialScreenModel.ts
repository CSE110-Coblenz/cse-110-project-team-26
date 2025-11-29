/**
 * Model for the Tutorial screen.
 *
 * Manages tutorial state, progress, and content.
 */
export class TutorialScreenModel {
	private currentStep: number;
	private totalSteps: number;

	constructor(screenCount: number) {
		this.currentStep = 0;
		this.totalSteps = screenCount;
	}

	getCurrentStep(): number {
		return this.currentStep;
	}

	getTotalSteps(): number {
		return this.totalSteps;
	}

	nextStep(): boolean {
    const isLastScreen = this.currentStep >= this.totalSteps - 1;
		if (!isLastScreen) this.currentStep++;
    return isLastScreen;
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

