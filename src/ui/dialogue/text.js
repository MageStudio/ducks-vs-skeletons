export const INITIAL_DIALOGUE_STEPS = {
    START: "initial_start",
    FIRST: "initial_one",
    INTERMEDIATE: "initial_two",
    FINAL: "initial_three",
    DONE: "initial_done",
};

export const DIALOGUE_ACTIONS_TYPES = {
    NEXT: "next",
    CONFIRM: "confirm",
};

export const DIALOGUE_CONFIG = {
    [INITIAL_DIALOGUE_STEPS.START]: {
        text: "This is such a nice and calm place, don't you think? ",
        actions: [],
    },
    [INITIAL_DIALOGUE_STEPS.FIRST]: {
        text: ".. what was that? I think I spoke too soon..",
        actions: [{ type: DIALOGUE_ACTIONS_TYPES.NEXT, text: "next" }],
    },
    [INITIAL_DIALOGUE_STEPS.INTERMEDIATE]: {
        text: "They don't seem particularly friendly, do they?",
        actions: [{ type: DIALOGUE_ACTIONS_TYPES.NEXT, text: "next" }],
    },
    [INITIAL_DIALOGUE_STEPS.FINAL]: {
        text: "Would you like to help us?",
        actions: [{ type: DIALOGUE_ACTIONS_TYPES.CONFIRM, text: "Yes!" }],
    },
};
