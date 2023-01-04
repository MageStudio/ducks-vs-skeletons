import { DIALOGUE_START, DIALOGUE_STOP } from "./types";

export const startDialogue = id => ({
    type: DIALOGUE_START,
    id,
    visible: true,
});

export const stopDialogue = id => ({
    type: DIALOGUE_STOP,
    visible: false,
});
