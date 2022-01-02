
export const DESERT_DETAILS = [
    'desertDetail',
    'desertRockA',
    'desertRockB',
    'desertPlantA',
    'desertPlantB',
    'desertTree',
];

export const FOREST_DETAILS = [
    'forestDetail',
    'forestRockA',
    'forestRockB',
    'forestPlantA',
    'forestPlantB',
    'forestTree',
];

export const HUMAN_DETAILS = [
    'largeBuildingA',
    'largeBuildingB',
    'largeBuildingC',
    'largeBuildingD',
    'largeBuildingE',
    'largeBuildingG'
];

export const TILES_TYPES = {
    FOREST: 'forestTile',
    DESERT: 'desertTile',
    HUMAN: 'humanTile'
};

export const TILES_STATES = {
    BUILDING: 'BUILDING'
};

export const TILES_DETAILS_MAP = {
    [TILES_TYPES.DESERT]: DESERT_DETAILS,
    [TILES_TYPES.FOREST]: FOREST_DETAILS,
    [TILES_TYPES.HUMAN]: HUMAN_DETAILS
};

export const STARTING_TILE_DETAILS_MAP = {
    [TILES_TYPES.HUMAN]: 'humanStart',
    [TILES_TYPES.FOREST]: 'forestStart'
};

export const TILES_RANDOMNESS_MAP = {
    [TILES_TYPES.DESERT]: .7,
    [TILES_TYPES.FOREST]: .3,
    [TILES_TYPES.HUMAN]: 0
};

export const TILE_SCALE = {
    x: .5,
    z: .5,
    y: .5
};

export const TILE_DETAILS_SCALE = {
    x: .4,
    y: .4,
    z: .4
};

export const TILE_MATERIAL_PROPERTIES = {
    metalness: 0.2,
    roughness: 1.0
};

export const TILE_COLLECTIBLE_SCALE = {
    x: .3,
    y: .3,
    z: .3
}