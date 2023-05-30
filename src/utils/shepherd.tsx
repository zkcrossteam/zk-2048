import '../styles/shepherd.scss';

import { renderToStaticMarkup } from 'react-dom/server';
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

const renderContent = (text: string, current: number, max: number = 3) =>
  renderToStaticMarkup(
    <>
      <h3 className="text-white">
        Step
        <span className="gradient-content mx-2">{current}</span>
        Of {max}
      </h3>
      <p className="text-white">{text}</p>
    </>,
  );

const customSteps: Pick<Step.StepOptions, 'text' | 'attachTo' | 'buttons'>[] = [
  {
    text: renderContent(
      'Click button or use your keyboard to sum the potions. Each step will cost 1 score balance',
      1,
    ),
    attachTo: {
      element: '.lead-step-1',
      on: 'bottom',
    },
  },
  {
    text: renderContent(
      'Sell the highest level potion to charge gold balance, get gold balance as high as you can to break the record',
      2,
    ),
    attachTo: {
      element: '.lead-step-2',
      on: 'right',
    },
  },
  {
    text: renderContent(
      'Submit ZK Proof to update your score with ZK Proof on chain and get rewards',
      3,
    ),
    attachTo: {
      element: '.lead-step-2',
      on: 'right',
    },
    buttons: [
      {
        text: '<span class="gradient-content">Ok</span>',
        classes: 'rounded-pill px-4 py-2 fs-5 fw-semibold border-button',
        action: tour.next,
      },
    ],
  },
];

tour.addSteps(customSteps.map(step => ({ ...defaultStepOption, ...step })));
