import { BaseScript, constants, Models, PALETTES } from 'mage-engine';
import { FOREST_OPTIONS, FOREST_TILES, TILES_TYPES, TILE_SCALE } from '../../map/constants';

const CURSOR_HEIGHT = .25;
const CURSOR_SCALE = {
    x: .5,
    y: .3,
    z: .62
};

const CURSOR_DEFAULT_DESTINATION = {
    x: Infinity,
    z: Infinity
}

const CURSOR_MATERIAL_PROPERTIES = {
    metalness: 0.2,
    roughness: 1.0
};

const { MATERIALS } = constants;
export default class Selector extends BaseScript {

    constructor() {
        super('Selector');
    }

    start(selector, { position }) {
        this.selector = selector;
        this.visible = false;
        this.enabled = false;
        this.destination = CURSOR_DEFAULT_DESTINATION;

        this.initialColor = this.selector.getColor();

        this.selector.setPosition({
            ...position,
            y: CURSOR_HEIGHT
        });
        this.selector.setMaterialFromName(MATERIALS.STANDARD, CURSOR_MATERIAL_PROPERTIES);
        this.selector.setScale(CURSOR_SCALE);
        this.selector.setOpacity(0);

        this.previewModel = undefined;
        this.previewOption = undefined;
    }

    appearAt({ x, z }, destination) {
        this.destination = destination;
        this.selector.goTo({ x, y: CURSOR_HEIGHT, z }, 75);
        this.selector.setVisible(true);
        this.selector.fadeTo(1, 125);
        this.visible = true;
    }

    markEnabled = flag => {
        const color = flag ? this.initialColor : PALETTES.FRENCH_PALETTE.MANDARIN_RED;
        this.enabled = flag;
        this.selector.setColor(color);
    }

    disappear() {
        this.selector.fadeTo(0, 125)
            .then(() => this.selector.setVisible(false));
        this.visible = false;
        this.destination = CURSOR_DEFAULT_DESTINATION;
    }

    showPreview(option) {
        if (this.previewOption === option) return;
        this.previewOption = option;

        if (this.previewModel) {
           this.removePreview();
        }

        const requiredModel = ({
            [FOREST_OPTIONS.BASE_TILE]: TILES_TYPES.FOREST,
            [FOREST_OPTIONS.BUILDERS_HUT_TILE]: FOREST_TILES.FOREST_WARRIORS_HUT,
            [FOREST_OPTIONS.WARRIORS_HUT_TILE]: FOREST_TILES.FOREST_BUILDERS_HUT,
            [FOREST_OPTIONS.TOWER_TILE]: FOREST_TILES.FOREST_TOWER
        })[option];

        console.log('requiredModel', requiredModel);

        this.previewModel = Models.getModel(requiredModel, { name: `preview_forest_${requiredModel}` });
        this.selector.add(this.previewModel);
        this.previewModel.setPosition({ y: .5 });
        this.previewModel.setScale({ x: 1.8, y: 1.8, z: 1.8});
        this.previewModel.setOpacity(.6);
        this.previewModel.toggleShadows(false);
    }

    removePreview() {
        if (this.previewModel) {
            this.selector.remove(this.previewModel);
            this.previewModel.dispose();
            this.previewModel = null;
            this.previewOption = undefined;
        }
    }
}