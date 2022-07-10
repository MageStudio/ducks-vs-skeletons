import { Models, constants, math, Particles, PARTICLES, THREE, Scripts } from 'mage-engine';
import EnergyParticleSystem from '../players/nature/EnergyParticleSystem';
import { TARGET_DEAD_EVENT_TYPE, TARGET_HEALTH_MAP, TARGET_HIT_EVENT_TYPE } from '../players/TargetBehaviour';
import {
    TILES_DETAILS_MAP,
    TILES_TYPES,
    TILE_DETAILS_SCALE,
    TILE_LARGE_DETAILS_SCALE,
    TILE_MATERIAL_PROPERTIES,
    TILES_RANDOMNESS_MAP,
    DESERT_DETAILS,
    TILE_SCALE,
    TILES_STATES,
    STARTING_TILE_DETAILS_MAP,
    TILE_DETAILS_RELATIVE_POSITION,
    WATER_TILE_COLOR,
    WATER_TILE_OPACITY,
    TILE_BASE_VARIATIONS_MAP,
    TILES_VARIATIONS_TYPES,
    TILES_TYPES_VARIATIONS_MAP
} from './constants';
import TileMap from './TileMap';

const { Vector3 } = THREE;
const { MATERIALS } = constants;

const FIRE_OPTIONS = {
    texture: 'fire',
    size: .1,
    strength: 1.5 ,
    direction: new Vector3( 0, 1, 0)
};
const FIRE_DAMAGE = .2;
const FIRE_DAMAGE_TICK = 500;

const ENERGY_PARTICLES_OPTIONS = {
    texture: 'greenEnergy',
    strength: 1,
    size: .2,
    radius: .5,
    direction: new Vector3( 0, 1, 0)
};

const TILE_LIFE = 20;
const STARTING_TILE_LIFE_FACTOR = 4;
const TILE_LIFE_FACTOR = 1;
const TILE_CRITICAL_DAMAGE_PERCENTAGE = .4;

const getDetailsListFromTileType = (tileType) =>  (TILES_DETAILS_MAP[tileType]) || DESERT_DETAILS;
const getRandomDetailForTile = (tileType) => math.pickRandom(getDetailsListFromTileType(tileType));
const shouldRenderDetailsForTiletype = (tileType) => Math.random() > TILES_RANDOMNESS_MAP[tileType];
const getVariationsForTyleTipe = tileType => TILE_BASE_VARIATIONS_MAP[tileType] || [tileType];
const getRandomVariationForTile = tileType => math.pickRandom(getVariationsForTyleTipe(tileType));

const convertTileTypeToHeight = (tileType) => ({
    [TILES_TYPES.WATER]: -.5, 
    [TILES_TYPES.DESERT]: -.4,
    [TILES_TYPES.HUMAN]: -.4,
    [TILES_TYPES.FOREST]: -.4
})[tileType] || -.4;

const calculatePosition = ({ x, z }) => ({
    x: z % 2 === 0 ? x + .5 : x,
    z
});

export default class Tile { 

    constructor(tileType, options = {}) {
        const {
            variation = TILES_VARIATIONS_TYPES.BASE,
            startingTile = false,
            position
        } = options;
        
        this.tileType = tileType;
        this.variation = variation;

        this.index = position;
        this.position = {
            ...calculatePosition(position),
            y: convertTileTypeToHeight(this.tileType)
        };
        
        this.id = `${position.x}${position.z}`;

        this.startingTile = startingTile;
        this.burning = false;

        // this.setLife();
        this.create(variation);
    }

    distanceToTile(tile) {
        const { x, z } = tile.getIndex();
        const { x: _x, z: _z } = this.getIndex();

        return (
            Math.sqrt(
                Math.pow((_x - x), 2) +
                Math.pow((_z - z), 2)
            )
        );
    }

    getHealth() {
        return TILE_LIFE * (this.startingTile ? STARTING_TILE_LIFE_FACTOR : TILE_LIFE_FACTOR);
    }

    // repair(amount) {
    //     this.life = math.clamp(this.life + amount, 0, this.maxLife);
    // }

    // takeDamage(amount) {
    //     this.life = math.clamp(this.life - amount, 0, this.maxLife);
    // }

    isDesert = () => this.tileType === TILES_TYPES.DESERT;
    isForest = () => this.tileType === TILES_TYPES.FOREST;
    isHuman = () => this.tileType === TILES_TYPES.HUMAN;
    isWater = () => this.tileType === TILES_TYPES.WATER;
    isEmpty = () => this.tileType === TILES_TYPES.EMPTY;
    isWarriorsHut = () => this.variation === TILES_VARIATIONS_TYPES.WARRIORS;
    isBuildersHut = () => this.variation === TILES_VARIATIONS_TYPES.BUILDERS;
    isTower = () => this.variation === TILES_VARIATIONS_TYPES.TOWER;

    isBaseTile = () => this.variation === TILES_VARIATIONS_TYPES.BASE;
    isStartingTile = () => Boolean(this.startingTile);
    isObstacle = () => this.isWater() || this.isEmpty();

    isType = tileType => this.tileType === tileType;
    getType = () => this.tileType;
    getVariation = () => this.variation;

    setState = state => this.state = state;
    getState = () => this.state;

    isBuilding = () => this.state === TILES_STATES.BUILDING;

    getModelNameFromVariationAndTileType = () => {
        const { tile, detail } = TILES_TYPES_VARIATIONS_MAP[this.tileType][this.variation];

        return {
            tile,
            detail: Array.isArray(detail) ? math.pickRandom(detail) : detail
        };
    }

    create() {
        if (this.isEmpty()) return;

        const { tile, detail } = this.getModelNameFromVariationAndTileType();

        this.tile = Models.get(tile, { name: `tile_${this.index.x}_${this.index.z}`});
        this.tile.setData('index', this.index);
        this.tile.setPosition(this.position);
        this.tile.setScale(TILE_SCALE);
        this.tile.setMaterialFromName(MATERIALS.STANDARD, TILE_MATERIAL_PROPERTIES);
        this.tile.addTag('tile');

        if (this.startingTile) {
            this.addStartingDetail();
        } else if (detail) {
            this.addDetail(detail);
        }

        if (this.isWater()) {
            this.applyWaterTileStyle();
        }

        if (this.isHuman() || this.isForest()) {
            this.setUpTargetBehaviour();
        }
    }

    postDestruction = () => {
        this.stopBurning();
        TileMap.changeTile(this.getIndex(), TILES_TYPES.DESERT);
    }

    setUpTargetBehaviour() {
        this.tile.addScript('TargetBehaviour', { health: this.getHealth() });
        this.tile.addEventListener(TARGET_DEAD_EVENT_TYPE, this.postDestruction);
        this.tile.addEventListener(TARGET_HIT_EVENT_TYPE, this.startBurning);
    }

    getTile() { return this.tile; }

    applyWaterTileStyle() {
        this.tile.setOpacity(WATER_TILE_OPACITY);
        this.tile.setColor(WATER_TILE_COLOR);
        this.tile.toggleShadows(false);
        this.tile.addScript('Bobbing', { angleOffset: this.position.x, offset: this.position.y  });
    }

    isDetailATreeOrLargeBuilding(detailName) {
        return detailName.includes('Tree') //|| detailName.includes('largeBuilding');
    }

    addStartingDetail() {
        const startingDetail = Models.get(STARTING_TILE_DETAILS_MAP[this.tileType], { name: `tile_detail_${Math.random()}` });
        startingDetail.setMaterialFromName(MATERIALS.STANDARD, TILE_MATERIAL_PROPERTIES);
        
        this.tile.add(startingDetail);
        startingDetail.setScale(TILE_LARGE_DETAILS_SCALE);

        startingDetail.setPosition({ y: 1 });
    }

    addDetail(detail) {
        const details = Models.get(detail, { name: `tile_detail_${Math.random()}` });

        details.setMaterialFromName(MATERIALS.STANDARD, TILE_MATERIAL_PROPERTIES);
        this.tile.add(details);

        details.setScale(TILE_DETAILS_SCALE);
        details.setPosition(TILE_DETAILS_RELATIVE_POSITION);
    }

    addEnergyParticleEmitter() {
        const particles = Particles.add(new EnergyParticleSystem(ENERGY_PARTICLES_OPTIONS));

        particles.emit(Infinity);
        this.tile.add(particles);
    }

    startBurning = () => {
        if (!this.burning) {
            this.burning = true;
            this.fire = Particles.add(PARTICLES.FIRE, FIRE_OPTIONS);
            this.fire.emit(Infinity);
            this.tile.add(this.fire);

            this.burningDamageInterval = setInterval(() => this.tile
                .getScript('TargetBehaviour')
                .processHit(FIRE_DAMAGE)
            , FIRE_DAMAGE_TICK);
        }
    }

    stopBurning() {
        if (this.burning) {
            this.fire.stop();
        }
    }

    setOpacity(value) {
        this.tile.setOpacity(value);
    }

    getPosition() { return new Vector3(this.position.x, this.position.y, this.position.z); }

    getIndex() { return this.index; }

    dispose() {
        this.tile.removeEventListener(TARGET_DEAD_EVENT_TYPE, this.postDestruction);
        this.tile.removeEventListener(TARGET_HIT_EVENT_TYPE, this.startBurning);
        clearInterval(this.burningDamageInterval);

        this.tile.dispose();
    }
}