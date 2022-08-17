import { Models, constants, math, store } from "mage-engine";
import Tile from './Tile';
import {
    TILE_COLLECTIBLE_SCALE,
    TILES_TYPES,
    TILE_MATERIAL_PROPERTIES
} from './constants';

import MAP_DESCRIPTIONS from './descriptions';
import { updateTileMapStats } from "../../../ui/actions/game";

const { MATERIALS } = constants;

const convertIntegerToTileType = integer => Object.values(TILES_TYPES)[integer] || TILES_TYPES.DESERT

class TileMap {

    constructor() {
        this.size = 10;
        this.tiles = [];
    }

    generate(level) {
        const {
            MAP,
            HUMAN_STARTING_POSITION,
            NATURE_STARTING_POSITION
        } = MAP_DESCRIPTIONS[level];

        this.level = level;
        this.size = MAP.length;

        for (let x=0; x<MAP.length; x++) {
            const row = MAP[x];
            this.tiles.push([]);

            for (let z=0; z<row.length; z++) {
                const tileType = convertIntegerToTileType(MAP[x][z]);
                const tile = new Tile(tileType, { position: { x, z } });
                this.tiles[x].push(tile);
            }
        }

        return {
            human: HUMAN_STARTING_POSITION,
            nature: NATURE_STARTING_POSITION
        };
    }

    isValidTile = ({ x, z }) => {
        return (x >= 0 && x < this.size) && (z >= 0 && z < this.size);
    }

    getRandomAdjacentTile(position, tileType) {
        return math.pickRandom(this.getAdjacentTiles(position, tileType));
    }

    getTileAt = ({ x, z }) => this.tiles[x][z];

    getSize = () => this.size;

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
        .map(this.getTileAt)
        .filter(t => !t.isObstacle())
    }

    isTileAdjacentToType = (position, tileType) => {
        return this.getAdjacentTiles(position)
            .filter(tile => tile.isType(tileType))
            .length > 0
    }

    setTileState(tile, state) {
        const { x, z } = tile.getIndex();
        this.tiles[x][z].setState(state);
    }

    changeTile({ x, z }, tileType, { variation, startingTile = false } = {} ) {
        const _x = Math.floor(math.clamp(x, 0, this.size - 1 ));
        const _z = Math.floor(math.clamp(z, 0, this.size - 1 ));

        this.tiles[_x][_z].dispose();
        this.tiles[_x][_z] = new Tile(tileType, { variation, position: { x: _x, z: _z }, startingTile });

        store.dispatch(updateTileMapStats());

        return this.tiles[_x][_z];
    }

    isTileType({ x, z }, tileType) {
        return this.tiles[x][z] && this.tiles[x][z].isType(tileType);
    }

    getPathToTile(start, end) {
        if (!this.isValidTile(end.getIndex())) return;

        const calculatePath = (current, end, path) => {
            if (current.id === end.id) {
                return path;
            }
            const endPosition = end.getPosition();
            const adjacent = this.getAdjacentTiles(current.getIndex());
            const [closest, secondClosest] = adjacent.sort((a,b) => a.getPosition().distanceTo(endPosition) - b.getPosition().distanceTo(endPosition));

            path.push(closest);
            // if (secondClosest) {
            //     path.push(secondClosest);
            // }
            return calculatePath(closest, end, path);
        }

        return calculatePath(start, end, []);
    }

    addEnergyParticlesToTile(destination) {
        this.getTileAt(destination)
            .addEnergyParticleEmitter();
    }

    getStats() {
        return this.tiles
            .flat()
            .reduce((acc, tile) => {
            return {
                desert: acc.desert + tile.isDesert(),
                nature: acc.nature + tile.isForest(),
                human: acc.human + tile.isHuman(),
                total: acc.total + !tile.isObstacle()
            }
        }, {
            desert: 0,
            human: 0,
            nature: 0,
            total: 0
        })
    }
}

export default new TileMap();