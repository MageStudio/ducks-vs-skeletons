import { Cube, Input, INPUT_EVENTS } from "mage-engine";

export class Worm {

    constructor() {
        this.body = [];
        this.index = 0;
    }

    createBlock(position, isHead = false) {
        const block = new Cube(1, 0xff0000);

        block.setName(`${this.body.length}`);
        block.addScript('WormBlock', { position, isHead });
        this.body.push(block);

        const previous = this.getPreviousBlock();
        if (previous) {
            previous.getScript('WormBlock').addTail(block);
        }

        return block;
    }

    getPreviousBlock() {
        return this.body[this.body.length - 2];
    }

    addBlock(position) {
        if (this.index > 5 ) return;
        this.createBlock(position);
        // this.body.push(block);
        // block.setName(`${this.index}`);
        
        // block.addScript('WormBlock', { position });
        
        // const head = this.body[this.index - 1];
        // if (head) {
        //     head.getScript('WormBlock').addTail(block);
        // }
        // this.index++;
    }

    // createBody(position) {
    //     const block = this.createBlock();
    //     block.setName('0');
    //     this.body.push(block);
    //     this.index++;

    //     block.addScript('WormBlock', { position, isHead: true });

    //     return block;
    // }

    start() {
        this.position = { x: 0, y: 1, z: 0 };
        this.direction =  { x: 1, z: 0 };

        const head = this.createBlock(this.position, true);

        Input.enable();
        Input.addEventListener(INPUT_EVENTS.KEY_DOWN, this.handleKeyDown.bind(this));

        this.movingInterval = setInterval(this.move.bind(this), 1000);

        return head;
    }

    move = () => {
        this.position = {
            x: this.position.x + this.direction.x,
            y: 1,
            z: this.position.z + this.direction.z,
        };

        this.body[0]
            .getScript('WormBlock')
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