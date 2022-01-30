import { NATURE_ENERGY_CHANGE } from "./types";

export const BASE_TILE_ENERGY_INCREASE = 5;

export const updateEnergyLevel = (tiles) => ({
    type: NATURE_ENERGY_CHANGE,
    amount: tiles * BASE_TILE_ENERGY_INCREASE
});