import { BaseScript, constants, Models, PALETTES } from 'mage-engine';
import { FOREST_OPTIONS, TILES_TYPES, TILE_SCALE } from '../../map/constants';

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

const PREVIEW_MATERIAL_PROPERTIES = {
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

        this.selector.setPosition({
            ...position,
            y: CURSOR_HEIGHT
        });
        this.selector.setScale(CURSOR_SCALE);
        this.selector.setOpacity(0);

        this.previewModel = undefined;
        this.previewOption = undefined;
    }

    appearAt({ x, z }, destination) {
        this.destination = destination;
        this.selector.setPosition({ x, y: CURSOR_HEIGHT, z });
        this.selector.setVisible(true);
        this.visible = true;
    }

    markEnabled = flag => {
        const opacity = flag ? 1 : 0.2 ;
        this.enabled = flag;
        if (this.previewModel) {
            this.previewModel.setOpacity(opacity);
        }
    }

    disappear() {
        this.selector.setVisible(false);
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
            [FOREST_OPTIONS.BUILDERS_HUT_TILE]: 'market',
            [FOREST_OPTIONS.WARRIORS_HUT_TILE]: 'farmplot',
            [FOREST_OPTIONS.TOWER_TILE]: 'lumbermill',
            [FOREST_OPTIONS.ATTACK]: 'flag'
        })[option];

        const previewHeightOffset = ({
            [FOREST_OPTIONS.BASE_TILE]: .5,
            [FOREST_OPTIONS.BUILDERS_HUT_TILE]: .5,
            [FOREST_OPTIONS.WARRIORS_HUT_TILE]: .5,
            [FOREST_OPTIONS.TOWER_TILE]: .5,
            [FOREST_OPTIONS.ATTACK]: 0
        })[option];

        this.previewModel = Models.getModel(requiredModel, { name: `preview_forest_${requiredModel}` });
        this.selector.add(this.previewModel);
        this.previewModel.setMaterialFromName(MATERIALS.STANDARD, PREVIEW_MATERIAL_PROPERTIES)
        this.previewModel.setPosition({ y: previewHeightOffset });
        this.previewModel.setScale({ x: .7, y: .7, z: .7 });
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