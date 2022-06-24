import { TILES_TYPES, TILES_VARIATIONS_TYPES } from "../../levels/Main/map/constants";
import {
    NATURE_ENERGY_CHANGE,
    NATURE_SELECTION_CHANGE,
    NATURE_SELECTION_OPTION_CHANGE
} from "../actions/types";

const DEFAULT_STATE = {
    energy: 0,
    selection: {
        type: TILES_VARIATIONS_TYPES.BASE,
        index: {
            x: 2,
            z: 2
        }
    },
    option: false
};

export default (state = DEFAULT_STATE, action = {}) => {
    switch(action.type) {
        case NATURE_ENERGY_CHANGE:
            return {
                ...state,
                energy: action.energy
            };
        case NATURE_SELECTION_CHANGE:
            return {
                ...state,
                selection: action.selection
            };
        case NATURE_SELECTION_OPTION_CHANGE:
            return {
                ...state,
                option: action.option
            }
        default:
            return state;
    }
}