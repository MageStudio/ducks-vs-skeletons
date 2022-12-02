export const INITIAL_DIALOGUE_STEPS = {
    START: 'initial_one',
    INTERMEDIATE: 'initial_two',
    FINAL: 'initial_three',
    DONE: 'initial_done'
};

export const DIALOGUE_TEXT = {
    [INITIAL_DIALOGUE_STEPS.START]: ".. what was that?",
    [INITIAL_DIALOGUE_STEPS.INTERMEDIATE]: "They don't seem particularly friendly, do they?",
    [INITIAL_DIALOGUE_STEPS.FINAL]: "Would you like to help us?"
};