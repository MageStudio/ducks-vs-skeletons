import { GameRunner } from "mage-engine";
import { DIALOGUE_START, DIALOGUE_STOP } from "./types";

export const startDialogue = (id) => {
    if (id === 'initial') {
        GameRunner
            .getCurrentLevel()
            .startDialogue();
    }
    return {
        type: DIALOGUE_START,
        id
    };
}

export const stopDialogue = (id) =>{
    if (id === 'initial') {
        GameRunner
            .getCurrentLevel()
            .startGame();
    }
    
    return {
        type: DIALOGUE_STOP
    }
};