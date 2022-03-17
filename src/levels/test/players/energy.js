import { TILES_VARIATIONS_TYPES } from "../map/constants";

export const ENERGY_REQUIREMENTS = {
    [TILES_VARIATIONS_TYPES.BASE]: 0,
    [TILES_VARIATIONS_TYPES.BUILDERS]: 10,
    [TILES_VARIATIONS_TYPES.WARRIORS]: 25,
    [TILES_VARIATIONS_TYPES.TOWER]: 40
};

export const getEnergyRequirementForTileVariation = variation => (
    ENERGY_REQUIREMENTS[variation]
);
