import { NATURE_ENERGY_CHANGE } from "./types";

const updateEnergyLevel = (amount) => ({
    type: NATURE_ENERGY_CHANGE,
    amount
});