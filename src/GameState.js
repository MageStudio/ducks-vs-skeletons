import { GameRunner, store, xstate } from "mage-engine";
import {
    cleanupCameraContainer,
    setupCameraContainerForIntro,
} from "./levels/Main/lib/initialDialogueSequences";
import { startDialogue, stopDialogue } from "./ui/actions/dialogue";
import { gameStarted } from "./ui/actions/game";
import { hideMainMenu, showMainMenu } from "./ui/actions/menu";

const { createMachine, interpret, assign } = xstate;

export const GAME_STATES = {
    MAIN_MENU: "main_menu",
    STARTING_DIALOGUE: "starting_dialogue",
    FIRST_LEVEL: "first_level",
    SECOND_LEVEL: "second_level",
    THIRD_LEVEL: "third_level",
    FAILURE_SCREEN: "failure_screen",
    SUCCESS_SCREEN: "success_screen",
    GAME_OVER: "game_over",
    // should loading screen be a game state? this should be inside the engine
};

export const GAME_LEVELS = [
    GAME_STATES.FIRST_LEVEL,
    GAME_STATES.SECOND_LEVEL,
    GAME_STATES.THIRD_LEVEL,
];

export const GAME_ACTIONS = {
    START: "START",
    DIALOGUE_COMPLETE: "DIALOGUE_COMPLETE",
    SUCCESS: "SUCCESS",
    FAILURE: "FAILURE",
    RETRY: "RETRY",
    GIVEUP: "GIVEUP",
};

export const assignLevel = level => assign({ level });
export const assignPreviousLevel = assign({ previousLevel: context => context.level });
export const assignScreen = screen => assign({ screen });

const createLevelGuard = level => () => context.previousLevel === level;

export const GAME_DESCRIPTION = [
    {
        id: "game_state",
        initial: GAME_STATES.MAIN_MENU,
        context: {
            level: GAME_STATES.FIRST_LEVEL,
            screen: GAME_STATES.MAIN_MENU,
            previousLevel: undefined,
        },
        states: {
            // loading state is currently not being used as it's being handled by the engine
            // the loading state will be part of the engine in upcoming release
            [GAME_STATES.MAIN_MENU]: {
                entry: ["showScreen", assignScreen(GAME_STATES.MAIN_MENU)],
                exit: ["removeScreen"],
                on: {
                    [GAME_ACTIONS.START]: GAME_STATES.STARTING_DIALOGUE,
                },
            },
            [GAME_STATES.STARTING_DIALOGUE]: {
                entry: ["showScreen", assignScreen(GAME_STATES.STARTING_DIALOGUE)],
                exit: ["removeScreen"],
                on: {
                    [GAME_ACTIONS.DIALOGUE_COMPLETE]: GAME_STATES.FIRST_LEVEL,
                },
            },
            [GAME_STATES.FIRST_LEVEL]: {
                entry: ["startLevel", assignLevel(GAME_STATES.FIRST_LEVEL)],
                exit: [assignPreviousLevel],
                on: {
                    [GAME_ACTIONS.SUCCESS]: GAME_STATES.SECOND_LEVEL,
                    [GAME_ACTIONS.FAILURE]: GAME_STATES.FAILURE_SCREEN,
                },
            },
            [GAME_STATES.SECOND_LEVEL]: {
                entry: ["startLevel", assignLevel(GAME_STATES.SECOND_LEVEL)],
                exit: [assignPreviousLevel],
                on: {
                    [GAME_ACTIONS.SUCCESS]: GAME_STATES.THIRD_LEVEL,
                    [GAME_ACTIONS.FAILURE]: GAME_STATES.FAILURE_SCREEN,
                },
            },
            [GAME_STATES.THIRD_LEVEL]: {
                entry: ["startLevel", assignLevel(GAME_STATES.THIRD_LEVEL)],
                exit: [assignPreviousLevel],
                on: {
                    [GAME_ACTIONS.SUCCESS]: GAME_STATES.SUCCESS_SCREEN,
                    [GAME_ACTIONS.FAILURE]: GAME_STATES.FAILURE_SCREEN,
                },
            },
            [GAME_STATES.FAILURE_SCREEN]: {
                entry: ["showScreen", assignScreen(GAME_STATES.FAILURE_SCREEN)],
                exit: ["handleRetryOrGiveup"],
                on: {
                    [GAME_ACTIONS.RETRY]: GAME_LEVELS.map(level => ({
                        target: level,
                        guard: createLevelGuard(level),
                    })),
                    [GAME_ACTIONS.GIVEUP]: GAME_STATES.GAME_OVER,
                },
            },
            [GAME_STATES.SUCCESS_SCREEN]: {
                entry: ["showScreen", assignScreen(GAME_STATES.SUCCESS_SCREEN)],
                type: "final",
            },
            [GAME_STATES.GAME_OVER]: {
                entry: ["showScreen", assignScreen(GAME_STATES.GAME_OVER)],
                type: "final",
            },
        },
    },
    {
        actions: {
            startLevel: context => {
                switch (context.level) {
                    case GAME_STATES.FIRST_LEVEL:
                        startFirstLevel();
                        break;
                    case GAME_STATES.SECOND_LEVEL:
                        startSecondLevel();
                        break;
                    case GAME_STATES.THIRD_LEVEL:
                        startThirdLevel();
                        break;
                    default:
                        break;
                }
            },

            stopLevel: () => {
                // perform cleanup on leaving the level?
            },

            showScreen: context => {
                switch (context.screen) {
                    case GAME_STATES.MAIN_MENU:
                        displayMainMenuScreen();
                        break;
                    case GAME_STATES.STARTING_DIALOGUE:
                        displayStartingDialogue();
                        break;
                    case GAME_STATES.FAILURE_SCREEN:
                        displayFailureScreen();
                        break;
                    case GAME_STATES.GAME_OVER:
                        displayGameOverScreen();
                        break;
                    case GAME_STATES.SUCCESS_SCREEN:
                        displaySuccessScreen();
                        break;
                    default:
                        break;
                }
            },
        },
    },
];

export const displayMainMenuScreen = () => {
    store.dispatch(showMainMenu());
    setupCameraContainerForIntro();
    // GameRunner.getCurrentLevel().setupCameraContainerForIntro();
};

export const displayStartingDialogue = () => {
    store.dispatch(hideMainMenu());
    store.dispatch(startDialogue("initial"));
    // GameRunner.getCurrentLevel().setupDialogue();
};

export const displayFailureScreen = () => {
    console.log("display failure screen");
    // update ui to display failure screen
};

export const displayGameOverScreen = () => {
    console.log("display gameover screen");
    // ui to display game over and score
};

export const displaySuccessScreen = () => {
    console.log("display success screen");
    // game is done, display ui with success screen
    // links?
};

export const startFirstLevel = () => {
    store.dispatch(stopDialogue("initial"));
    store.dispatch(gameStarted());
    cleanupCameraContainer();
    GameRunner.getCurrentLevel().startGame();
};

export const startSecondLevel = () => {
    console.log("starting second level");
    // if needed, second dialogue
    // then start players again
};

export const startThirdLevel = () => {
    console.log("starting third level");
    // if needed, third and final dialogue
    // start players again like second and first
};

export const GameState = interpret(createMachine(...GAME_DESCRIPTION)).onTransition(console.log);
