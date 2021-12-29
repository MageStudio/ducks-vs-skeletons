
import { Models } from 'mage-engine';
class Humans {

    constructor() {
        this.humans = [];
    }

    spawnHuman() {
        const human = Models.getModel('human');
        human.addScript('HumanBehaviour');

        this.humans.push(human);

        return human;
    }
}

export default new Humans();