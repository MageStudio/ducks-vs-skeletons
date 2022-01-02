import { BaseScript } from "mage-engine";
import TileMap from "../map/TileMap";
import { TILES_TYPES } from "../map/constants";

export default class WormBlock extends BaseScript {
    constructor() {
        super('WormBlock');
    }

    start(block, { position, isHead = false}) {
        this.block = block;
        this.isHead = isHead;

        this.block.setWireframe(true);
        this.block.setScale({ x: .5, z: .5, y: .5 });
        this.block.setPosition(position);
    }

    addTail(tail) {
        this.tail = tail;
    }

    move(newPosition) {
        const position = this.block.getPosition();
        this.block.goTo(newPosition, 300);

        if (this.isHead && !TileMap.isTileType(position, TILES_TYPES.FOREST)) {
            TileMap.changeTile(position, TILES_TYPES.FOREST);
        }

        if (this.tail) {
            this.tail.getScript('WormBlock').script.move(position);
        }
    }
}


