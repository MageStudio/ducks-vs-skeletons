import { xstate } from 'mage-engine';

const { createMachine, interpret, assign } = xstate;

export const GAME_STATES = {
    MAIN_MENU: 'main_menu',
    STARTING_DIALOGUE: 'starting_dialogue',
    FIRST_LEVEL: 'first_level',
    SECOND_LEVEL: 'second_level',
    THIRD_LEVEL: 'third_level',
    FAILURE_SCREEN: 'failure_screen',
    SUCCESS_SCREEN: 'success_screen',
    GAME_OVER: 'game_over'
};

export const GAME_ACTIONS = {
    START: 'START',
    COMPLETE: 'COMPLETE',
    SUCCESS: 'SUCCESS',
    FAILURE: 'FAILURE',
    RETRY: 'RETRY',
    GIVEUP: 'GIVEUP'
}

export const assignLevel = (level) => assign({ level });
export const assignPreviousLevel = assign({ previousLevel: (context) => context.level });
export const assignScreen = screen => assign({ screen });

export const GAME_DESCRIPTION = [{
    id: "game_state",
    initial: GAME_STATES.MAIN_MENU,
    context: {
        level: undefined,
        screen: 'main_menu',
        previousLevel: undefined
    },
    states: {
        [GAME_STATES.MAIN_MENU]: {
            entry: ['showScreen', assignScreen(GAME_STATES.MAIN_MENU)],
            exit: ['removeScreen'],
            on: {
                [GAME_ACTIONS.START]: GAME_STATES.STARTING_DIALOGUE,
            },
        },
        [GAME_STATES.STARTING_DIALOGUE]: {
            entry: ['showDialogue', assignScreen(GAME_STATES.STARTING_DIALOGUE)],
            exit: ['removeDialogue'],
            on: {
                [GAME_ACTIONS.COMPLETE]: GAME_STATES.FIRST_LEVEL,
            },
        },
        [GAME_STATES.FIRST_LEVEL]: {
            entry: ['startLevel', assignLevel(GAME_STATES.FIRST_LEVEL) ],
            exit: [assignPreviousLevel],
            on: {
                [GAME_ACTIONS.SUCCESS]: GAME_STATES.SECOND_LEVEL,
                [GAME_ACTIONS.FAILURE]: GAME_STATES.FAILURE_SCREEN,
            },
        },
        [GAME_STATES.SECOND_LEVEL]: {
            entry: ['startLevel', assignLevel(GAME_STATES.SECOND_LEVEL) ],
            exit: [assignPreviousLevel],
            on: {
                [GAME_ACTIONS.SUCCESS]: GAME_STATES.THIRD_LEVEL,
                [GAME_ACTIONS.FAILURE]: GAME_STATES.FAILURE_SCREEN,
            },
        },
        [GAME_STATES.THIRD_LEVEL]: {
            entry: ['startLevel', assignLevel(GAME_STATES.THIRD_LEVEL) ],
            exit: [assignPreviousLevel],
            on: {
                [GAME_ACTIONS.SUCCESS]: GAME_STATES.SUCCESS_SCREEN,
                [GAME_ACTIONS.FAILURE]: GAME_STATES.FAILURE_SCREEN,
            },
        },
        [GAME_STATES.FAILURE_SCREEN]: {
            entry: ['showScreen', assignScreen(GAME_STATES.FAILURE_SCREEN)],
            exit: ['handleRetryOrGiveup'],
            on: {
                [GAME_ACTIONS.RETRY]: GAME_STATES.FIRST_LEVEL,
                [GAME_ACTIONS.GIVEUP]: GAME_STATES.GAME_OVER,
            },
        },
        [GAME_STATES.SUCCESS_SCREEN]: { type: "final" },
        [GAME_STATES.GAME_OVER]: { type: "final" },
    }
},
{
    actions: {
        startLevel: (context, event) => {
            console.log('starting level', context.level);
        },
        stopLevel: console.log,

        showScreen: (context, event) => {
            console.log('showing screen ', context.screen);
        }
    }
}]


export const GameState = interpret(createMachine(...GAME_DESCRIPTION)).onStateChange(state => {})