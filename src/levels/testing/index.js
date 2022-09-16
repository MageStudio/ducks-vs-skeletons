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
    ENTITY_EVENTS,
    Particles,
} from 'mage-engine';
import TileParticleSystem from '../Main/players/nature/TileParticleSystem';

const { Vector3 } = THREE;
window.ENTITY_EVENTS = ENTITY_EVENTS;

const AMBIENT_LIGHT_OPTIONS = {
    color: PALETTES.FRENCH_PALETTE.SPRAY,
    intensity: 0.5,
};

const HEMISPHERE_LIGHT_OPTIONS = {
    color: {
        sky: PALETTES.FRENCH_PALETTE.SQUASH_BLOSSOM,
        ground: PALETTES.FRENCH_PALETTE.REEF_ENCOUNTER,
    },
    intensity: 0.5,
};

const SUNLIGHT_OPTIONS = {
    color: PALETTES.FRENCH_PALETTE.MELON_MELODY,
    intensity: 1,
    far: 20,
    mapSize: 2048,
};

const SUNLIGHT_POSITION = { y: 4, z: -3, x: -3 };

export default class Testing extends Level {
    addLights() {
        AmbientLight.create(AMBIENT_LIGHT_OPTIONS);
        HemisphereLight.create(HEMISPHERE_LIGHT_OPTIONS);
        SunLight.create(SUNLIGHT_OPTIONS).setPosition(SUNLIGHT_POSITION);
    }

    onCreate() {
        this.addLights();
        // const warrior = Models.get('human');
        // window.warrior = warrior;
        const SMOKE_PARTICLES_OPTIONS = {
            direction: new Vector3(0, 1, 0),
            texture: 'fire',
            size: 0.7,
            radius: 0.7,
            life: 2,
            color: [0xffffff, [0x555555, 0x000000]],
            rate: 3,
            frequency: 0,
            strength: 0.1,
            initialVelocity: false,
            useRepulsion: true,
        };

        const smoke = Particles.add(
            new TileParticleSystem(SMOKE_PARTICLES_OPTIONS)
        );
        smoke.emit(Infinity);
        smoke.setPosition({ y: 1 });

        Scene.getCamera().setPosition({ x: 2, y: 4, z: 0 });
        Controls.setOrbitControl();
    }
}
