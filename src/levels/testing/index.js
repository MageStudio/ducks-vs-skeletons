import {
    Level,
    Scene,
    Models,
    AmbientLight,
    HemisphereLight,
    Controls,
    constants,
    THREE,
    Scripts,
    SunLight,
    PALETTES,
    Sky,
    Stats,
    PostProcessing,
    ENTITY_EVENTS
} from 'mage-engine';

window.ENTITY_EVENTS = ENTITY_EVENTS;

const AMBIENT_LIGHT_OPTIONS = {
    color: PALETTES.FRENCH_PALETTE.SPRAY,
    intensity: .5
};

const HEMISPHERE_LIGHT_OPTIONS = {
    color: {
        sky: PALETTES.FRENCH_PALETTE.SQUASH_BLOSSOM,
        ground: PALETTES.FRENCH_PALETTE.REEF_ENCOUNTER
    },
    intensity: .5
};

const SUNLIGHT_OPTIONS = {
    color: PALETTES.FRENCH_PALETTE.MELON_MELODY,
    intensity: 1,
    far: 20,
    mapSize: 2048
};

const SUNLIGHT_POSITION = { y: 4, z: -3, x: -3 };

export default class Testing extends Level {

    addLights() {
        AmbientLight
            .create(AMBIENT_LIGHT_OPTIONS);
        HemisphereLight
            .create(HEMISPHERE_LIGHT_OPTIONS);
        SunLight
            .create(SUNLIGHT_OPTIONS)
            .setPosition(SUNLIGHT_POSITION);
    }

    onCreate() {
        this.addLights();
        const warrior = Models.get('human');
        window.warrior = warrior;

        Scene.getCamera().setPosition({x: 2, y: 4, z: 0 });
        Controls.setOrbitControl();
    }
}