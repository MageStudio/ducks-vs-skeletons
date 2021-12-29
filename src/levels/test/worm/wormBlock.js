import { BaseScript } from "mage-engine";
import TileMap, { TILES_TYPES } from "../TileMap";

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
        this.block.goTo(newPosition, 150);

        if (this.isHead) {
            TileMap.changeTile(position.x, position.z, TILES_TYPES.HUMAN);
        }

        if (this.tail) {
            this.tail.getScript('WormBlock').script.move(position);
        }
    }
}


