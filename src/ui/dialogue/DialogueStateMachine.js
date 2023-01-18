import { GameRunner, rxjs, xstate } from "mage-engine";
import {
    playAnimationForMood,
    playFirstDialogueSequence,
    playSkeletonBuildingSequence,
    playSkeletonSpawningSequence,
    playStandingSkeletonSequence,
    removeAllIntroSequenceElements,
} from "../../levels/Main/lib/initialDialogueSequences";
import { DIALOGUE_CONFIG, INITIAL_DIALOGUE_STEPS } from "./text";

const { createMachine, interpret, assign } = xstate;

export const ACTIONS = {
    NEXT: "NEXT",
    PREVIOUS: "PREVIOUS",
};

export const MOODS = {
    WELCOME: "WELCOME",
    EXCITED: "EXCITED",
    SURPRISED: "SURPRISED",
    NORMAL: "NORMAL",
};

export const assignStep = step => assign({ step });
export const assignMood = mood => assign({ mood });

const INITIAL_DIALOGUE_DESCRIPTION = [
    {
        id: "dialogue_initial",
        initial: INITIAL_DIALOGUE_STEPS.START,
        context: {
            step: INITIAL_DIALOGUE_STEPS.START,
            mood: MOODS.WELCOME,
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
                entry: [
                    "onStep",
                    assignStep(INITIAL_DIALOGUE_STEPS.FIRST),
                    assignMood(MOODS.SURPRISED),
                ],
                on: { [ACTIONS.NEXT]: INITIAL_DIALOGUE_STEPS.INTERMEDIATE },
            },
            [INITIAL_DIALOGUE_STEPS.INTERMEDIATE]: {
                entry: [
                    "onStep",
                    assignStep(INITIAL_DIALOGUE_STEPS.INTERMEDIATE),
                    assignMood(MOODS.NORMAL),
                ],
                on: { [ACTIONS.NEXT]: INITIAL_DIALOGUE_STEPS.FINAL },
            },
            [INITIAL_DIALOGUE_STEPS.FINAL]: {
                entry: [
                    "onStep",
                    assignStep(INITIAL_DIALOGUE_STEPS.FINAL),
                    assignMood(MOODS.EXCITED),
                ],
                on: { [ACTIONS.NEXT]: INITIAL_DIALOGUE_STEPS.DONE },
            },
            [INITIAL_DIALOGUE_STEPS.DONE]: {
                entry: ["onStep", assignStep(INITIAL_DIALOGUE_STEPS.DONE)],
                type: "final",
            },
        },
    },
    {
        actions: {
            onStep: context => {
                switch (context.step) {
                    case INITIAL_DIALOGUE_STEPS.START:
                        onStartStep(context);
                        break;
                    case INITIAL_DIALOGUE_STEPS.FIRST:
                        onFirstStep(context);
                        break;
                    case INITIAL_DIALOGUE_STEPS.INTERMEDIATE:
                        onIntermediateStep(context);
                        break;
                    case INITIAL_DIALOGUE_STEPS.FINAL:
                        onFinalStep(context);
                        break;
                    case INITIAL_DIALOGUE_STEPS.DONE:
                        onInitialDialogueDone();
                    default:
                        break;
                }
            },
        },
    },
];

export const onStartStep = context => {
    playFirstDialogueSequence(context);
    playAnimationForMood(context.mood);
};

export const onFirstStep = context => {
    playStandingSkeletonSequence(context);
    playAnimationForMood(context.mood);
};

export const onIntermediateStep = context => {
    playSkeletonBuildingSequence(context);
    playAnimationForMood(context.mood);
};

export const onFinalStep = context => {
    playSkeletonSpawningSequence();
    playAnimationForMood(context.mood);
};

export const onInitialDialogueDone = context => {
    removeAllIntroSequenceElements();
};

const initialDialogueSubject = new rxjs.Subject();
const initialDialogueStateMachine = interpret(
    createMachine(...INITIAL_DIALOGUE_DESCRIPTION),
).onTransition(state => initialDialogueSubject.next(DIALOGUE_CONFIG[state.value]));

export const initialDialogue = {
    subject: initialDialogueSubject,
    stateMachine: initialDialogueStateMachine,
};
