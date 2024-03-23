import { Collapse, Fade, useSteps } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { ReactElement } from "react";

interface StepFormAction {
  activeForm: ReactElement;
  activeStep: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  goToNext: () => void;
  goToPrevious: () => void;
  resetStep: () => void;
}

export const useStepform = (forms: ReactElement[]): StepFormAction => {
  const { activeStep, goToNext, goToPrevious, setActiveStep, isActiveStep } =
    useSteps({ index: 0, count: forms.length });

  return {
    activeForm: forms[activeStep],
    activeStep,
    isFirstStep: isActiveStep(0),
    isLastStep: isActiveStep(forms.length),
    goToNext,
    goToPrevious,
    resetStep: () => setActiveStep(0),
  };
};
