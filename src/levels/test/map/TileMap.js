import { Models, constants, math } from "mage-engine";
import Tile from './Tile';
import {
    TILE_COLLECTIBLE_SCALE,
    TILES_TYPES,
    TILE_MATERIAL_PROPERTIES
} from './constants';

const { MATERIALS } = constants;

class TileMap {

    constructor() {
        this.size = 10;
        this.tiles = [];
    }

    createCollectible() {
        const position = {
            x: Math.floor(Math.random() * this.size),
            z: Math.floor(Math.random() * this.size),
            y: 1.5
        }
        const collectible = Models.getModel('star', { name: `star_${Math.random()}`});

        collectible.setScale(TILE_COLLECTIBLE_SCALE);
        collectible.setMaterialFromName(MATERIALS.STANDARD, TILE_MATERIAL_PROPERTIES);
        collectible.setColor(0xffffff);
        collectible.addScript('slowRotation', { position, offset: 1 });
    }

    generate() {
        for (let x=0; x<this.size; x++) {
            this.tiles.push([]);
            for (let z=0; z<this.size; z++) {
                const tile = new Tile(TILES_TYPES.DESERT, { x, z });
                // tile.setOpacity(0.9);

                this.tiles[x].push(tile);
            }
        }

        this.createCollectible();
    }

    isValidTile = ({ x, z }) => {
        return (x >= 0 && x < this.size) && (z >= 0 && z < this.size);
    }

    getRandomAdjacentTile(position, tileType) {
        return math.pickRandom(this.getAdjacentTiles(position, tileType));
    }

    getTileAt = ({ x, z }) => this.tiles[x][z];

    getTilesByType(tileType) {
        const list = [];
        for (let x=0; x<this.size; x++) {
            for (let z=0; z<this.size; z++) {
                const tile = this.tiles[x][z];
                if (tile.isType(tileType)) {
                    list.push(tile);
                }
            }
        }

        return list;
    }

    getAdjacentTiles({ x, z }) {
        return [
            { x: x-1, z: z-1 },
            { x: x, z: z-1 },
            { x: x+1, z: z-1 },

            { x: x-1, z },
            { x: x+1, z },

            { x: x-1, z: z+1 },
            { x: x, z: z+1 },
            { x: x+1, z: z+1 },
        ]
        .filter(this.isValidTile)
        .map(({ x, z }) => this.tiles[x][z])
    }

    isTileAdjacentToType = (position, tileType) => {
        return this.getAdjacentTiles(position)
            .filter(tile => tile.isType(tileType))
            .length > 0
    }

    setTileState(tile, state) {
        const { x, z } = tile.getPosition();
        this.tiles[x][z].setState(state);
    }

    changeTile({ x, z }, tileType, startingTile = false) {
        const _x = Math.floor(math.clamp(x, 0, this.size - 1 ));
        const _z = Math.floor(math.clamp(z, 0, this.size - 1 ));

        this.tiles[_x][_z].dispose();
        this.tiles[_x][_z] = new Tile(tileType, { x: _x, z: _z }, startingTile);
    }

    isTileType({ x, z }, tileType) {
        return this.tiles[x][z] && this.tiles[x][z].isType(tileType);
    }
}

export default new TileMap();