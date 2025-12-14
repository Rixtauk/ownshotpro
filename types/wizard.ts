export type WizardStep = 'upload' | 'configure' | 'results';

export interface WizardState {
  currentStep: WizardStep;
  canProceed: boolean;
}

export const WIZARD_STEPS: { id: WizardStep; label: string; number: number }[] = [
  { id: 'upload', label: 'Upload', number: 1 },
  { id: 'configure', label: 'Configure', number: 2 },
  { id: 'results', label: 'Results', number: 3 },
];
