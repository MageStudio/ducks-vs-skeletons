import { NATURE_ENERGY_CHANGE, NATURE_SELECTION_CHANGE, NATURE_SELECTION_OPTION_CHANGE } from "./types";

export const updateEnergyLevel = (energy) => ({
    type: NATURE_ENERGY_CHANGE,
    energy
});

export const changeSelection = selection => ({
    type: NATURE_SELECTION_CHANGE,
    selection
});

export const changeSelectionOption = option => ({
    type: NATURE_SELECTION_OPTION_CHANGE,
    option
});

export const addNewUnit = (type) => ({
    type
});

export const removeUnit = type => ({
    type
});