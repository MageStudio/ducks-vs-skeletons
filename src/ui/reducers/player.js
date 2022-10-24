import { TILES_TYPES, TILES_VARIATIONS_TYPES } from "../../levels/Main/map/constants";
import {
    NATURE_ENERGY_CHANGE,
    NATURE_NEW_UNIT_BUILDERS,
    NATURE_NEW_UNIT_WARRIORS,
    NATURE_REMOVE_UNIT_BUILDERS,
    NATURE_REMOVE_UNIT_WARRIORS,
    NATURE_SELECTION_CHANGE,
    NATURE_SELECTION_OPTION_CHANGE
} from "../actions/types";

const DEFAULT_STATE = {
    energy: 0,
    units: {
        warriors: 0,
        builders: 0
    },
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
        case NATURE_NEW_UNIT_BUILDERS:
            return {
                ...state,
                units: {
                    warriors: state.units.warriors,
                    builders: state.units.builders + 1
                }
            }
        case NATURE_NEW_UNIT_WARRIORS:
            return {
                ...state,
                units: {
                    warriors: state.units.warriors + 1,
                    builders: state.units.builders
                }
            }
        case NATURE_REMOVE_UNIT_WARRIORS:
            return {
                ...state,
                units: {
                    warriors: state.units.warriors - 1,
                    builders: state.units.builders
                }
            }
        case NATURE_REMOVE_UNIT_BUILDERS:
            return {
                ...state,
                units: {
                    warriors: state.units.warriors ,
                    builders: state.units.builders - 1 
                }
            }
        default:
            return state;
    }
}