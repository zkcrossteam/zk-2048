import '../styles/shepherd.scss';

import Shepherd from 'shepherd.js';
import Step from 'shepherd.js/src/types/step';

export const tour = new Shepherd.Tour({
  useModalOverlay: true,
  defaultStepOptions: {
    classes: 'intro common-card-bg-box',
    scrollTo: true,
  },
});

const defaultStepOption: Step.StepOptions = {
  id: 'intro',
  text: 'Default Text',
  attachTo: {
    element: '.lead-step-1',
    on: 'bottom',
  },
  buttons: [
    {
      text: '<span class="gradient-content">Skip</span>',
      classes: 'rounded-pill px-4 py-2 fs-5 fw-semibold border-button',
      action: tour.cancel,
    },
    {
      text: '<span class="gradient-content">Next</span>',
      classes: 'rounded-pill px-4 py-2 fs-5 fw-semibold border-button',
      action: tour.next,
    },
  ],
};

const customSteps: Pick<Step.StepOptions, 'text' | 'attachTo'>[] = [
  {
    text: 'Click button or use your keyboard to sum the potions. Each step will cost 1 score balance',
    attachTo: {
      element: '.lead-step-1',
      on: 'bottom',
    },
  },
  {
    text: 'Sell the highest level potion to charge gold balance, get gold balance as high as you can to break the record',
    attachTo: {
      element: '.lead-step-2',
      on: 'right',
    },
  },
  {
    text: 'Submit ZK Proof to update your score with ZK Proof on chain and get rewards',
    attachTo: {
      element: '.lead-step-2',
      on: 'right',
    },
  },
];

tour.addSteps(customSteps.map(step => ({ ...defaultStepOption, ...step })));
