import { Cube, Input, INPUT_EVENTS } from "mage-engine";

export class Worm {

    constructor() {
        this.body = [];
        this.index = 0;
    }

    createBlock() {
        return new Cube(1, 0xff0000);
    }

    addBlock(position) {
        if (this.index > 5 ) return;
        const block = this.createBlock();
        this.body.push(block);
        block.setName(`${this.index}`);
        
        block.addScript('WormBlock', { position });
        
        const head = this.body[this.index - 1];
        if (head) {
            head.getScript('WormBlock').script.addTail(block);
        }
        this.index++;
    }

    createBody(position) {
        const block = this.createBlock();
        block.setName('0');
        this.body.push(block);
        this.index++;

        block.addScript('WormBlock', { position, isHead: true });
    }

    start() {
        this.position = { x: 0, y: 1, z: 0 };
        this.direction =  { x: 1, z: 0 };

        this.createBody(this.position);

        Input.enable();
        Input.addEventListener(INPUT_EVENTS.KEY_DOWN, this.handleKeyDown.bind(this));

        this.movingInterval = setInterval(this.move.bind(this), 500);
    }

    move = () => {
        this.position = {
            x: this.position.x + this.direction.x,
            y: 1,
            z: this.position.z + this.direction.z,
        };

        this.body[0]
            .getScript('WormBlock').script
            .move(this.position);

        // this.addBlock(this.position);
    }

    handleKeyDown = ({ event }) => {
        switch(event.key) {
            case 'w':
                this.direction.z = -1;
                this.direction.x = 0;
                break;
            case 's':
                this.direction.z = 1;
                this.direction.x = 0;
                break;
            case 'a':
                this.direction.x = -1;
                this.direction.z = 0;
                break;
            case 'd':
                this.direction.x = 1;
                this.direction.z = 0;
                break;
        }
    }
}

export default new Worm();