import { Input, Models, INPUT_EVENTS, ENTITY_EVENTS } from "mage-engine";
import { FOREST_TILES, NATURE_STARTING_POSITION, TILES_STATES, TILES_TYPES } from "../map/constants";
import TileMap from "../map/TileMap";
import { DEATH_REASONS } from '../constants';
class Nature {

    constructor() {
        this.builders = [];
        this.warriors = [];
        this.currentTile = null;
        this.selector = null;
    }

    start(position) {
        this.initialPosition = position;
        Input.enable();
        Input.addEventListener(INPUT_EVENTS.MOUSE_DOWN, this.handleMouseClick);
        TileMap.changeTile(this.initialPosition, TILES_TYPES.FOREST, { startingTile: true });
        setInterval(this.handleMouseIntersection, 250)

        this.selector = Models.getModel('selector');
        this.selector.addScript('Selector', { position });

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

    sendBuilderToTile(tile, variation) {
        const duck = Models.getModel('duck', { name: `duck_builder_${Math.random()}`});
        const behaviour = duck.addScript('DuckBehaviour', { position: this.initialPosition, builder: true });

        behaviour
            .goTo(tile)
            .then(() => behaviour.buildAtPosition(tile, variation));

        TileMap.setTileState(tile, TILES_STATES.BUILDING);
        duck.addEventListener(ENTITY_EVENTS.DISPOSE, this.handleDuckDeath(DEATH_REASONS.BUILDING));

        this.builders[duck.uuid()] = duck;

        return duck;
    }

    handleMouseClick = () => {
        const { visible, destination } = this.selector.getScript('Selector');

        if (visible && this.canMouseInteract(destination)) {
            this.sendBuilderToTile(TileMap.getTileAt(destination), FOREST_TILES.FOREST_TOWER);
        }
    }

    canMouseInteract(destination) {
        const destinationTile = TileMap.getTileAt(destination);

        return TileMap.isTileAdjacentToType(destination, TILES_TYPES.FOREST) &&
            !destinationTile.isForest() &&
            !destinationTile.isObstacle();
    }

    handleMouseIntersection = () => {
        const intersections = Input.mouse.getIntersections(true, 'tile');

        if (intersections.length) {
            const destinationIndex = intersections[0].element.getData('index');
            const position = intersections[0].element.getPosition();

            this.selector.getScript('Selector').appearAt(position, destinationIndex);
            this.selector.getScript('Selector').markEnabled(this.canMouseInteract(destinationIndex))
        } else {
            this.selector.getScript('Selector').disappear();
        }
    }
}

export default new Nature();