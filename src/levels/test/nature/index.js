import { Input, Models, INPUT_EVENTS, ENTITY_EVENTS } from "mage-engine";
import { NATURE_STARTING_POSITION, TILES_STATES, TILES_TYPES } from "../map/constants";
import TileMap from "../map/TileMap";
import { DEATH_REASONS } from '../constants';
class Nature {

    constructor() {
        this.builders = [];
        this.warriors = [];
        this.currentTile = null;
        this.selector = null;
    }

    start() {
        Input.enable();
        Input.addEventListener(INPUT_EVENTS.MOUSE_DOWN, this.handleMouseClick);
        TileMap.changeTile(NATURE_STARTING_POSITION, TILES_TYPES.FOREST, true);
        setInterval(this.handleMouseIntersection, 250)

        this.selector = Models.getModel('selector');
        this.selector.addScript('Selector', { position: NATURE_STARTING_POSITION });

        // this.sendBuilderToTile(TileMap.getTileAt({ x: 8, z: 8 }));
    }

    handleDuckDeath = (reason) => ({ target }) => {
        if (reason === DEATH_REASONS.BUILDING) {
            delete this.builders[target.uuid()];
        }

        if (reason === DEATH_REASONS.KILLED) {
            delete this.warriors[target.uuid()]
        }
    }

    sendBuilderToTile(tile) {
        const duck = Models.getModel('duck', { name: `duck_builder_${Math.random()}`});
        const behaviour = duck.addScript('DuckBehaviour', { position: NATURE_STARTING_POSITION, builder: true });

        behaviour
            .goTo(tile)
            .then(() => behaviour.buildAtPosition(tile));

        TileMap.setTileState(tile, TILES_STATES.BUILDING);
        duck.addEventListener(ENTITY_EVENTS.DISPOSE, this.handleDuckDeath(DEATH_REASONS.BUILDING));

        this.builders[duck.uuid()] = duck;

        return duck;
    }

    handleMouseClick = () => {
        const { visible, destination } = this.selector.getScript('Selector');

        if (visible && this.canMouseInteract(destination)) {
            this.sendBuilderToTile(TileMap.getTileAt(destination));
        }
    }

    canMouseInteract(destination) {
        return TileMap.isTileAdjacentToType(destination, TILES_TYPES.FOREST) && !TileMap.isTileType(destination, TILES_TYPES.FOREST)
    }

    handleMouseIntersection = () => {
        const intersections = Input.mouse.getIntersections(true, 'tile');

        if (intersections.length) {
            const destination = intersections[0].element.getPosition();

            this.selector.getScript('Selector').appearAt(destination);
            this.selector.getScript('Selector').markEnabled(this.canMouseInteract(destination))
        } else {
            this.selector.getScript('Selector').disappear();
        }
    }
}

export default new Nature();