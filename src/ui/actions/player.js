import { NATURE_ENERGY_CHANGE } from "./types";

export const updateEnergyLevel = (energy) => ({
    type: NATURE_ENERGY_CHANGE,
    energy
});