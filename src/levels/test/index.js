import {
    Level,
    Scene,
    Models,
    AmbientLight,
    HemisphereLight,
    Controls,
    constants,
    THREE,
    Cube,
    Scripts,
    SunLight,
} from 'mage-engine';

import TileMap, { HUMAN_DETAILS } from './map/TileMap';
import SlowRotation from './collectibles/slowRotation';
import Worm from './worm';
import WormBlock from './worm/wormBlock';
import HumanBehaviour from './humans/HumanBehaviour';
import Humans from './humans';

export const WHITE = 0xffffff;
export const SUNLIGHT = 0xffeaa7;
export const DARKER_GROUND = 0X78e08f;
export const GROUND = 0xb8e994;
export const BACKGROUND = 0xdff9fb;//0xddf3f5;

const DOF_OPTIONS = {
    focus: 1.0,
    aperture: 0.0001,
    maxblur: 0.01
};

// const SATURATION_OPTIONS = {
//     saturation: 0.2
// };

const { MATERIALS, EFFECTS } = constants;

export default class Test extends Level {

    addSunLight() {

        this.hemisphereLight = new HemisphereLight({
            color: {
                sky: SUNLIGHT,
                ground: GROUND
            },
            intensity: 1
        });

        this.sunLight = new SunLight({ color: SUNLIGHT, intensity: 1, far: 20 });
        this.sunLight.setPosition({ y: 4, z: -3, x: -3 });
    }

    prepareCamera() {
        Scene.getCamera().setPosition({ x: 7.8, y: 5.48, z: 12.8 });
        Controls.setOrbitControl({ target: { x: 5, y: 0, z: 5 } });
    }

    prepareSceneEffects() {
        Scene.setClearColor(SUNLIGHT);
        Scene.setBackground(SUNLIGHT);
        Scene.setRendererOutputEncoding(THREE.sRGBEncoding);
    }

    createWorld() {
        this.addSunLight();
        this.prepareSceneEffects();

        TileMap.generate();
        Humans.start();
        // const human = Humans.spawnHuman();
        // const head = Worm.start();
    }

    onCreate() {
        Scripts.create('WormBlock', WormBlock);
        Scripts.create('slowRotation', SlowRotation);
        Scripts.create('HumanBehaviour', HumanBehaviour);

        this.createWorld();
        this.prepareCamera();
    }
}