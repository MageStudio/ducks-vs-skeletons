import { GameRunner, rxjs, xstate } from "mage-engine";
import {
    playFirstDialogueSequence,
    playSkeletonBuildingSequence,
    playStandingSkeletonSequence,
} from "../../levels/Main/lib/initialDialogueSequences";
import { DIALOGUE_CONFIG, INITIAL_DIALOGUE_STEPS } from "./text";

const { createMachine, interpret, assign } = xstate;

export const ACTIONS = {
    NEXT: "NEXT",
    PREVIOUS: "PREVIOUS",
};

export const assignStep = step => assign({ step });

const INITIAL_DIALOGUE_DESCRIPTION = [
    {
        id: "dialogue_initial",
        initial: INITIAL_DIALOGUE_STEPS.START,
        context: {
            step: INITIAL_DIALOGUE_STEPS.START,
        },
        states: {
            [INITIAL_DIALOGUE_STEPS.START]: {
                entry: ["onStep", assignStep(INITIAL_DIALOGUE_STEPS.START)],
                after: {
                    7000: {
                        target: INITIAL_DIALOGUE_STEPS.FIRST,
                    },
                },
            },
            [INITIAL_DIALOGUE_STEPS.FIRST]: {
                entry: ["onStep", assignStep(INITIAL_DIALOGUE_STEPS.FIRST)],
                on: { [ACTIONS.NEXT]: INITIAL_DIALOGUE_STEPS.INTERMEDIATE },
            },
            [INITIAL_DIALOGUE_STEPS.INTERMEDIATE]: {
                entry: ["onStep", assignStep(INITIAL_DIALOGUE_STEPS.INTERMEDIATE)],
                on: { [ACTIONS.NEXT]: INITIAL_DIALOGUE_STEPS.FINAL },
            },
            [INITIAL_DIALOGUE_STEPS.FINAL]: {
                entry: ["onStep", assignStep(INITIAL_DIALOGUE_STEPS.FINAL)],
                on: { [ACTIONS.NEXT]: INITIAL_DIALOGUE_STEPS.DONE },
            },
            [INITIAL_DIALOGUE_STEPS.DONE]: { type: "final" },
        },
    },
    {
        actions: {
            onStep: context => {
                switch (context.step) {
                    case INITIAL_DIALOGUE_STEPS.START:
                        onStartStep();
                        break;
                    case INITIAL_DIALOGUE_STEPS.FIRST:
                        onFirstStep();
                        break;
                    case INITIAL_DIALOGUE_STEPS.INTERMEDIATE:
                        onIntermediateStep();
                        break;
                    case INITIAL_DIALOGUE_STEPS.FINAL:
                        onFinalStep();
                        break;
                    default:
                        break;
                }
            },
        },
    },
];

export const onStartStep = () => {
    playFirstDialogueSequence();
    // GameRunner.getCurrentLevel().playFirstDialogueSequence();
};
export const onFirstStep = () => {
    playStandingSkeletonSequence();
    // GameRunner.getCurrentLevel().playStandingSkeletonSequence();
};
export const onIntermediateStep = () => {
    playSkeletonBuildingSequence();
    // GameRunner.getCurrentLevel().playSkeletonBuildingSequence();
};

export const onFinalStep = () => {};

const initialDialogueSubject = new rxjs.Subject();
const initialDialogueStateMachine = interpret(
    createMachine(...INITIAL_DIALOGUE_DESCRIPTION),
).onTransition(state => initialDialogueSubject.next(DIALOGUE_CONFIG[state.value]));

export const initialDialogue = {
    subject: initialDialogueSubject,
    stateMachine: initialDialogueStateMachine,
};
