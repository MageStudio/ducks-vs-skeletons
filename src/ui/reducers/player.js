import { TILES_TYPES } from "../../levels/test/map/constants";
import { NATURE_ENERGY_CHANGE, NATURE_SELECTION_CHANGE } from "../actions/types";

const DEFAULT_STATE = {
    energy: 0,
    selection: TILES_TYPES.FOREST
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
        default:
            return state;
    }
}