import { THREE } from "mage-engine";
import TileParticleSystem from "../players/nature/TileParticleSystem";

export const HUMAN_STARTING_POSITION = {
    x: 0,
    z: 0
};

export const NATURE_STARTING_POSITION = {
    x: 9,
    z: 9
};

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
    EMPTY: 'empty',
    WATER: 'waterTile',
    DESERT: 'desertTile',
    FOREST: 'forestTile',
    HUMAN: 'humanTile'
};

export const TILES_VARIATIONS_TYPES = {
    BASE: 'BASE',
    BUILDERS: 'BUILDERS',
    WARRIORS: 'WARRIORS',
    TOWER: 'TOWER'
};

export const TILES_TYPES_VARIATIONS_MAP = {
    [TILES_TYPES.HUMAN]: {
        [TILES_VARIATIONS_TYPES.BASE]: {
            tile: TILES_TYPES.HUMAN,
            detail: false
        },
        [TILES_VARIATIONS_TYPES.BUILDERS]: {
            tile: TILES_TYPES.HUMAN,
            detail: 'house'
        },
        [TILES_VARIATIONS_TYPES.WARRIORS]: {
            tile: TILES_TYPES.HUMAN,
            detail: 'barracks'
        },
        [TILES_VARIATIONS_TYPES.TOWER]: {
            tile: TILES_TYPES.HUMAN,
            detail: 'watchtower'
        },
    },
    [TILES_TYPES.FOREST]: {
        [TILES_VARIATIONS_TYPES.BASE]: {
            tile: TILES_TYPES.FOREST,
            detail: [
                'hill',
                'forest'
            ]
        },
        [TILES_VARIATIONS_TYPES.BUILDERS]: {
            tile: TILES_TYPES.FOREST,
            detail: 'market'
        },
        [TILES_VARIATIONS_TYPES.WARRIORS]: {
            tile: TILES_TYPES.FOREST,
            detail: 'farmplot'
        },
        [TILES_VARIATIONS_TYPES.TOWER]: {
            tile: TILES_TYPES.FOREST,
            detail: 'lumbermill'
        },
    },
    [TILES_TYPES.DESERT]: {
        [TILES_VARIATIONS_TYPES.BASE]: {
            tile: TILES_TYPES.DESERT,
            detail: [
                'details_rocks',
                false,
                false,
                false
            ]
        }
    },
    [TILES_TYPES.WATER]: {
        [TILES_VARIATIONS_TYPES.BASE]: {
            tile: TILES_TYPES.WATER,
            detail: false
        }
    }
};

export const TILE_PARTICLES = {
    [TILES_VARIATIONS_TYPES.BASE]: TileParticleSystem
};

// export const HUMAN_TILES = {
//     [TILES_TYPES.HUMAN]: TILES_TYPES.HUMAN,
//     HUMAN_TOWER: 'humanTileTower',
//     HUMAN_WARRIORS_HUT: 'humanTileWarriorsHut',
//     HUMAN_BUILDERS_HUT: 'humanTileBuildersHut'
// }

// export const FOREST_TILES = {
//     [TILES_TYPES.FOREST]: TILES_TYPES.FOREST,
//     FOREST_TOWER: 'forestTileTower',
//     FOREST_WARRIORS_HUT: 'forestTileWarriorsHut',
//     FOREST_BUILDERS_HUT: 'forestTileBuildersHut',
// };

export const FOREST_OPTIONS = {
    BASE_TILE: 'BASE_TILE',
    TOWER_TILE: 'TOWER_TILE',
    BUILDERS_HUT_TILE: 'BUILDERS_HUT_TILE',
    WARRIORS_HUT_TILE: 'WARRIORS_HUT_TILE',
    ATTACK: 'ATTACK'
}

export const WATER_TILE_BASE_VARIATIONS = [
    TILES_TYPES.WATER
];

export const DESERT_TILE_BASE_VARIATIONS = [
    TILES_TYPES.DESERT,
    TILES_TYPES.DESERT,
    TILES_TYPES.DESERT,
    'desertTileA'
];

export const FOREST_TILE_BASE_VARIATIONS = [
    TILES_TYPES.FOREST,
    TILES_TYPES.FOREST,
    'forestTileA',
    'forestTileB'
];

export const HUMAN_TILE_BASE_VARIATIONS = [
    TILES_TYPES.HUMAN
];

export const TILE_BASE_VARIATIONS_MAP = {
    [TILES_TYPES.WATER]: WATER_TILE_BASE_VARIATIONS,
    [TILES_TYPES.DESERT]: DESERT_TILE_BASE_VARIATIONS,
    [TILES_TYPES.FOREST]: FOREST_TILE_BASE_VARIATIONS,
    [TILES_TYPES.HUMAN]: HUMAN_TILE_BASE_VARIATIONS,
}

export const TILES_STATES = {
    BUILDING: 'BUILDING',
    FIGHTING: 'FIGHTING'
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
    // x: .97,
    // z: 1.12,
    // y: 1
    x: .50,
    y: .52,
    z: .56
};

export const TILE_LARGE_DETAILS_SCALE = {
    x: .8,
    y: .8,
    z: .8
};

export const TILE_DETAILS_SCALE = {
    x: .9,
    y: .9,
    z: .9
};

export const TILE_DETAILS_RELATIVE_POSITION = {
    y: 1
};

// export const TILE_MATERIAL_PROPERTIES = {
//     metalness: 0.2,
//     roughness: 1.0
// };

export const TILE_MATERIAL_PROPERTIES = {
    roughness: .5,
    metalness: 0
};

export const TILE_MATERIAL_PONG_PROPERTIES = {
    shininess: 0,
    reflectivity: 2.5,
    color: new THREE.Color()
        .setHSL(0, 0.5, 0.1)
        .multiplyScalar(1)
}

export const TILE_COLLECTIBLE_SCALE = {
    x: .3,
    y: .3,
    z: .3
}

export const WATER_TILE_OPACITY = .3;
export const WATER_TILE_COLOR = 0x00a8ff;