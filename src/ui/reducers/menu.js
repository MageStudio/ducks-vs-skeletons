import { HIDE_MAIN_MENU, SHOW_MAIN_MENU } from "../actions/types";

const DEFAULT_STATE = {
    visible: false,
};

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case SHOW_MAIN_MENU:
            return {
                ...DEFAULT_STATE,
                visible: true,
            };
        case HIDE_MAIN_MENU:
            return {
                ...DEFAULT_STATE,
                visible: false,
            };
        default:
            return state;
    }
};
