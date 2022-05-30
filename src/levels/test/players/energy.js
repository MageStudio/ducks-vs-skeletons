import { TILES_VARIATIONS_TYPES } from "../map/constants";
import { UNIT_TYPES } from "./UnitBehaviour";

export const ENERGY_REQUIREMENTS = {
    [TILES_VARIATIONS_TYPES.BASE]: 0,
    [TILES_VARIATIONS_TYPES.BUILDERS]: 10,
    [TILES_VARIATIONS_TYPES.WARRIORS]: 25,
    [TILES_VARIATIONS_TYPES.TOWER]: 40
};

export const ENERGY_UNIT_REQUIREMENTS = {
    [UNIT_TYPES.BUILDER]: 0,
    [UNIT_TYPES.WARRIOR]: 5
}

export const getEnergyRequirementForTileVariation = variation => (
    ENERGY_REQUIREMENTS[variation]
);
