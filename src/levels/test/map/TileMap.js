import { Models, constants, math } from "mage-engine";
import Tile from './Tile';
import {
    TILE_COLLECTIBLE_SCALE,
    TILES_TYPES,
    TILE_MATERIAL_PROPERTIES
} from './constants';

import MAP_DESCRIPTIONS from './descriptions';

const { MATERIALS } = constants;

const convertIntegerToTileType = integer => Object.values(TILES_TYPES)[integer] || TILES_TYPES.DESERT

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

    generate(level) {
        const { MAP, HUMAN_STARTING_POSITION, NATURE_STARTING_POSITION } = MAP_DESCRIPTIONS[level];
        this.size = MAP.length;
        for (let x=0; x<MAP.length; x++) {
            const row = MAP[x];
            this.tiles.push([]);

            for (let z=0; z<row.length; z++) {
                const tileType = convertIntegerToTileType(MAP[x][z]);
                const tile = new Tile(tileType, { x, z });
                this.tiles[x].push(tile);
            }
        }

        return {
            human: HUMAN_STARTING_POSITION,
            nature: NATURE_STARTING_POSITION
        };

        // this.createCollectible();

        // const path = this.getPathToTile(this.getTileAt({x: 4, z: 3 }), this.getTileAt({x: 10, z: 10}))
        // path.forEach(t => t.setOpacity(.3));
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

    changeTile({ x, z }, tileType, startingTile = false) {
        const _x = Math.floor(math.clamp(x, 0, this.size - 1 ));
        const _z = Math.floor(math.clamp(z, 0, this.size - 1 ));

        this.tiles[_x][_z].dispose();
        this.tiles[_x][_z] = new Tile(tileType, { x: _x, z: _z }, startingTile);
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
            if (secondClosest) {
                path.push(secondClosest);
            }
            return calculatePath(closest, end, path);
        }

        return calculatePath(start, end, []);
    }
}

export default new TileMap();