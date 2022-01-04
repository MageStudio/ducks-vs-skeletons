import { Models, constants, math, Particles, PARTICLES } from 'mage-engine';
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

        this.burning = false;

        this.setLife();
        this.create();
    }

    setLife() {
        let factor = this.startingTile ? 4 : 1;
        const life = 20 * factor;

        this.life = life;
        this.maxLife = life;
    }

    repair(amount) {
        this.life = math.clamp(this.life + amount, 0, this.maxLife);
    }

    damage(amount) {
        this.life = math.clamp(this.life - amount, 0, this.maxLife);
    }

    isDesert = () => this.tileType === TILES_TYPES.DESERT;
    isForest = () => this.tileType === TILES_TYPES.FOREST;
    isHuman = () => this.tileType === TILES_TYPES.HUMAN;
    isType = tileType => this.tileType === tileType;

    setState = state => this.state = state;
    getState = () => this.state;

    isBuilding = () => this.state === TILES_STATES.BUILDING;

    create() {
        this.tile = Models.getModel(this.tileType, { name: `tile_${this.position.x}_${this.position.z}`});
        this.tile.setPosition(this.position);
        this.tile.setScale(TILE_SCALE);
        this.tile.setMaterialFromName(MATERIALS.STANDARD, TILE_MATERIAL_PROPERTIES);
        this.tile.addTag('tile');

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
        const startingDetail = Models.getModel(STARTING_TILE_DETAILS_MAP[this.tileType], { name: `tile_detail_${Math.random()}` });
        startingDetail.setMaterialFromName(MATERIALS.STANDARD, TILE_MATERIAL_PROPERTIES);
        
        this.tile.add(startingDetail);

        startingDetail.setPosition({ y: 1 });
    }

    addRandomDetail() {
        if (shouldRenderDetailsForTiletype(this.tileType)) {
            const detailName = getRandomDetailForTile(this.tileType);
            const details = Models.getModel(detailName, { name: `tile_detail_${Math.random()}` });

            details.setMaterialFromName(MATERIALS.STANDARD, TILE_MATERIAL_PROPERTIES);
            this.tile.add(details);

            if (this.isDetailATreeOrLargeBuilding(detailName)) {
                details.setScale(TILE_DETAILS_SCALE);
            }

            details.setPosition({ y: 1 });
        }
    }

    startBurning() {
        if (!this.burning) {
            this.burning = true;
            this.fire = Particles.addParticleEmitter(PARTICLES.FIRE, { fire: { size: 1 }, sparks: { size: 0.1 }});
            this.fire.start();
            this.fire.setPosition(this.getPosition());
            console.log(this.fire);
        }
    }

    processHit(damage) {
        this.damage(damage);
        this.startBurning();
    }

    setOpacity(value) {
        this.tile.setOpacity(value);
    }

    getPosition() { return this.tile.getPosition(); }

    dispose() {
        this.tile.dispose();
    }
}