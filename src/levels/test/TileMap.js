import { Models, constants } from "mage-engine";

const { MATERIALS } = constants;

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

export const TILES_DETAILS_MAP = {
    [TILES_TYPES.DESERT]: DESERT_DETAILS,
    [TILES_TYPES.FOREST]: FOREST_DETAILS,
    [TILES_TYPES.HUMAN]: HUMAN_DETAILS
};

export const TILES_RANDOMNESS_MAP = {
    [TILES_TYPES.DESERT]: .7,
    [TILES_TYPES.FOREST]: .3,
    [TILES_TYPES.HUMAN]: 0
}

const getDetailsListFromTileType = (tileType) =>  (TILES_DETAILS_MAP[tileType]) || DESERT_DETAILS;
const getRandomDetailForTile = (tileType) => {
    const detailsList = getDetailsListFromTileType(tileType);
    return detailsList[Math.floor(Math.random() * detailsList.length)];
};
const shouldRenderDetailsForTiletype = (tileType) => Math.random() > TILES_RANDOMNESS_MAP[tileType];

const TILE_MATERIAL_PROPERTIES = {
    metalness: 0.2,
    roughness: 1.0
};

const TILE_SCALE = {
    x: .5,
    z: .5,
    y: .5
};

const TILE_DETAILS_SCALE = {
    x: .4,
    y: .4,
    z: .4
}

const TILE_COLLECTIBLE_SCALE = {
    x: .3,
    y: .3,
    z: .3
}

class TileMap {

    constructor() {
        this.size = 10;
        this.tiles = [];
    }

    isDetailATreeOrLargeBuilding(detailName) {
        return detailName.includes('Tree') || detailName.includes('largeBuilding');
    }

    addRandomDetail(tile, tileType) {
        if (shouldRenderDetailsForTiletype(tileType)) {
            const detailName = getRandomDetailForTile(tileType);
            const details = Models.getModel(detailName);

            details.setMaterialFromName(MATERIALS.STANDARD, TILE_MATERIAL_PROPERTIES);
            tile.add(details);

            if (detailName.endsWith('Tree')) {
                details.setScale(TILE_DETAILS_SCALE);
            }

            details.setPosition({ y: 1 });
        }
    }

    createTile(tileType, position) {
        const tile = Models.getModel(tileType);
        tile.setPosition(position);
        tile.setScale(TILE_SCALE);
        tile.setMaterialFromName(MATERIALS.STANDARD, TILE_MATERIAL_PROPERTIES);

        this.addRandomDetail(tile, tileType);

        return tile;
    }

    createCollectible() {
        const position = {
            x: Math.floor(Math.random() * this.size),
            z: Math.floor(Math.random() * this.size),
            y: 1.5
        }
        const collectible = Models.getModel('star');

        collectible.setScale(TILE_COLLECTIBLE_SCALE);
        collectible.setMaterialFromName(MATERIALS.STANDARD, TILE_MATERIAL_PROPERTIES);
        collectible.setColor(0xffffff);
        collectible.addScript('slowRotation', { position, offset: 1 });
    }

    generate() {
        for (let x=0; x<this.size; x++) {
            this.tiles.push([]);
            for (let z=0; z<this.size; z++) {
                const tile = this.createTile(TILES_TYPES.DESERT, { x, z });
                tile.setOpacity(0.9);

                this.tiles[x].push(tile);
            }
        }

        this.createCollectible();
    }

    changeTile(x, z, tileType) {
        this.tiles[x][z].dispose();
        this.tiles[x][z] = this.createTile(tileType, { x, z });
    }
}

export default new TileMap();