import { math } from "mage-engine";
import { NATURE_ENERGY_CHANGE } from "../actions/types";

const DEFAULT_STATE = {
    energy: 0
};

export default (state = DEFAULT_STATE, action = {}) => {
    switch(action.type) {
        case NATURE_ENERGY_CHANGE:
            return {
                ...state,
                energy: action.energy
            };
        default:
            return state;
    }
}