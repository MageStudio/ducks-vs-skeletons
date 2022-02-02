import { NATURE_ENERGY_CHANGE, NATURE_SELECTION_CHANGE } from "./types";

export const updateEnergyLevel = (energy) => ({
    type: NATURE_ENERGY_CHANGE,
    energy
});

export const changeSelection = selection => ({
    type: NATURE_SELECTION_CHANGE,
    selection
})