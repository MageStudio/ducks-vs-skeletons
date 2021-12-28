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

import TileMap from './TileMap';
import SlowRotation from './collectibles/slowRotation';
import Worm from './worm';
import WormBlock from './worm/wormBlock';

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
        // this.sunLight.addHelper();

        window.sun = this.sunLight;
    }

    prepareCamera() {
        Controls.setOrbitControl();
        Scene.getCamera().setPosition({ x: 7.8, y: 5.48, z: 12.8 });
        Scene.getCamera().lookAt({ x: 5, y: 0, z: 5 });
        window.camera = Scene.getCamera();
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
        //Worm.start();
    }

    onCreate() {
        Scripts.create('WormBlock', WormBlock);
        Scripts.create('slowRotation', SlowRotation);

        this.createWorld();
        this.prepareCamera();

        const human = Models.getModel('human');
        human.setMaterialFromName(MATERIALS.STANDARD, {
            metalness: 0.2,
            roughness: 1.0
        });
        human.setScale({ x: 0.001, y: 0.001, z: 0.001 });
        human.playAnimation('Root|Idle');
        human.setPosition({ y: 0.5 });
        window.human = human;
    }
}