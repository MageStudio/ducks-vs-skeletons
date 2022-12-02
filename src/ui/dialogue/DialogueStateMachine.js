import { rxjs, xstate } from 'mage-engine';
import { DIALOGUE_TEXT, INITIAL_DIALOGUE_STEPS } from './text';

const { createMachine, interpret } = xstate;

export const ACTIONS = {
    NEXT: 'NEXT',
    PREVIOUS: 'PREVIOUS'
}

const INITIAL_DIALOGUE_DESCRIPTION = {
    id: 'dialogue_initial',
    initial: INITIAL_DIALOGUE_STEPS.START,
    context: {},
    states: {
        [INITIAL_DIALOGUE_STEPS.START]: {
            on: { [ACTIONS.NEXT]: INITIAL_DIALOGUE_STEPS.INTERMEDIATE },
        },
        [INITIAL_DIALOGUE_STEPS.INTERMEDIATE]: {
            on: { [ACTIONS.NEXT]: INITIAL_DIALOGUE_STEPS.FINAL }
        },
        [INITIAL_DIALOGUE_STEPS.FINAL]: {
            on: { [ACTIONS.NEXT]: INITIAL_DIALOGUE_STEPS.DONE }
        },
        [INITIAL_DIALOGUE_STEPS.DONE]: { type: 'final' }
    }
};

const initialDialogueSubject = new rxjs.Subject();
const initialDialogueStateMachine = interpret(createMachine(INITIAL_DIALOGUE_DESCRIPTION))
        .onTransition(state => initialDialogueSubject.next(DIALOGUE_TEXT[state.value]))

export const initialDialogue = {
    subject: initialDialogueSubject,
    stateMachine: initialDialogueStateMachine
}