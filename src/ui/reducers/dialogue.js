import { DIALOGUE_START, DIALOGUE_STOP } from "../actions/types";

const DEFAULT_STATE = {
    visible: false,
    id: undefined,
};

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case DIALOGUE_START:
            return {
                ...state,
                visible: true,
                id: action.id,
            };
        case DIALOGUE_STOP:
            return {
                ...state,
                visible: false,
            };
        default:
            return state;
    }
};
