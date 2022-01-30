import { math } from "mage-engine";
import { NATURE_ENERGY_CHANGE } from "../actions/types";

const DEFAULT_STATE = {
    energy: 0
};

const MIN_ENERGY = 0;
const MAX_ENERGY = 100;

export default (state = DEFAULT_STATE, action = {}) => {
    switch(action.type) {
        case NATURE_ENERGY_CHANGE:
            const energy = math.clamp(action.amount, MIN_ENERGY, MAX_ENERGY);

            return {
                ...state,
                energy
            };
        default:
            return state;
    }
}