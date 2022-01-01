import { Models, constants } from 'mage-engine';
import {
    TILES_DETAILS_MAP,
    TILES_TYPES,
    TILE_DETAILS_SCALE,
    TILE_MATERIAL_PROPERTIES,
    TILES_RANDOMNESS_MAP,
    DESERT_DETAILS,
    TILE_SCALE,
    TILES_STATES,
    STARTING_TILE_DETAILS_MAP
} from './constants';

const { MATERIALS } = constants;

const getDetailsListFromTileType = (tileType) =>  (TILES_DETAILS_MAP[tileType]) || DESERT_DETAILS;
const getRandomDetailForTile = (tileType) => {
    const detailsList = getDetailsListFromTileType(tileType);
    return detailsList[Math.floor(Math.random() * detailsList.length)];
};
const shouldRenderDetailsForTiletype = (tileType) => Math.random() > TILES_RANDOMNESS_MAP[tileType];

export default class Tile {
    constructor(tileType, position, startingTile) {
        this.tileType = tileType;
        this.position = position;
        this.startingTile = startingTile;

        this.create();
    }

    isDesert = () => this.tileType === TILES_TYPES.DESERT;
    isForest = () => this.tileType === TILES_TYPES.FOREST;
    isHuman = () => this.tileType === TILES_TYPES.HUMAN;
    isType = tileType => this.tileType === tileType;

    setState = state => this.state = state;
    getState = () => this.state;

    isBuilding = () => this.state === TILES_STATES.BUILDING;

    create() {
        this.tile = Models.getModel(this.tileType);
        this.tile.setPosition(this.position);
        this.tile.setScale(TILE_SCALE);
        this.tile.setMaterialFromName(MATERIALS.STANDARD, TILE_MATERIAL_PROPERTIES);

        if (this.startingTile) {
            this.addStartingDetail();
        } else {
            this.addRandomDetail();
        }
    }

    isDetailATreeOrLargeBuilding(detailName) {
        return detailName.includes('Tree') //|| detailName.includes('largeBuilding');
    }

    addStartingDetail() {
        const startingDetail = Models.getModel(STARTING_TILE_DETAILS_MAP[this.tileType]);
        startingDetail.setMaterialFromName(MATERIALS.STANDARD, TILE_MATERIAL_PROPERTIES);
        
        this.tile.add(startingDetail);

        startingDetail.setPosition({ y: 1 });
    }

    addRandomDetail() {
        if (shouldRenderDetailsForTiletype(this.tileType)) {
            const detailName = getRandomDetailForTile(this.tileType);
            const details = Models.getModel(detailName);

            details.setMaterialFromName(MATERIALS.STANDARD, TILE_MATERIAL_PROPERTIES);
            this.tile.add(details);

            if (this.isDetailATreeOrLargeBuilding(detailName)) {
                details.setScale(TILE_DETAILS_SCALE);
            }

            details.setPosition({ y: 1 });
        }
    }

    setOpacity(value) {
        this.tile.setOpacity(value);
    }

    getPosition() { return this.tile.getPosition(); }

    dispose() {
        this.tile.dispose();
    }
}