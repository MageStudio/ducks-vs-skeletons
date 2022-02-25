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
    Universe,
    PostProcessing,
    PALETTES,
    Sky
} from 'mage-engine';

import TileMap, { HUMAN_DETAILS } from './map/TileMap';
import SlowRotation from './collectibles/slowRotation';
import Worm from './worm';
import WormBlock from './worm/wormBlock';
import HumanBehaviour from './players/humans/HumanBehaviour';
import Humans from './players/humans';
import Nature from './players/nature';
import Selector from './players/nature/Selector';
import BulletBehaviour from './players/humans/BulletBehaviour';
import DuckBehaviour from './players/nature/DuckBehaviour';
import Bobbing from './map/Bobbing';

export const WHITE = 0xffffff;
export const SUNLIGHT = 0xffeaa7;
export const DARKER_GROUND = 0X78e08f;
export const GROUND = 0xb8e994;
export const BACKGROUND = 0xdff9fb;//0xddf3f5;

const DOF_OPTIONS = {
    focus: 1.0,
    aperture: .001,//0.0002,//0.0001,
    maxblur: 0.01//0.01
};

const SATURATION_OPTIONS = {
    saturation: 0.4
};

const { EFFECTS } = constants;

export default class Test extends Level {

    addSunLight() {
        const ambientLight = new AmbientLight({
            color: PALETTES.FRENCH_PALETTE.SPRAY,
            intensity: .5
        });

        this.hemisphereLight = new HemisphereLight({
            color: {
                sky: PALETTES.FRENCH_PALETTE.SQUASH_BLOSSOM,
                ground: PALETTES.FRENCH_PALETTE.REEF_ENCOUNTER
            },
            intensity: .5
        });
    
        const sunLight = new SunLight({
            color: PALETTES.FRENCH_PALETTE.MELON_MELODY,
            intensity: 1,
            far: 20,
            mapSize: 2048
        });
        sunLight.setPosition({ y: 4, z: -3, x: -3 });
    }

    addSky() {
        this.sky = new Sky({});
        this.sky.setSun(.1, .1, 100);
    }

    prepareCamera() {
        Scene.getCamera().setPosition({x: 2, y: 4, z: 0 });
        const orbit = Controls.setOrbitControl();

        orbit.setTarget({ x: 5, y: 0, z: 5 });
        orbit.setMinPolarAngle(0);
        orbit.setMaxPolarAngle(Math.PI/2.5);
        orbit.setMaxDistance(10);

        window.camera = Scene.getCamera();
    }

    prepareSceneEffects() {
        Scene.setClearColor(0xff9f43);
        Scene.setBackground(0xff9f43);
        Scene.setRendererOutputEncoding(THREE.sRGBEncoding);
        // PostProcessing.add(EFFECTS.HUE_SATURATION, SATURATION_OPTIONS);
        // PostProcessing.add(EFFECTS.DEPTH_OF_FIELD, DOF_OPTIONS);
    }

    createWorld() {
        this.addSunLight();
        this.addSky();
        this.prepareSceneEffects();

        const { human, nature } = TileMap.generate(0);
        Humans.start(human);
        Nature.start(nature);

        window.n = Nature;
        window.tm = TileMap;
    }

    // onUpdate = (dt) => {
    //     this.azimuth += 0.001 * dt;
    //     if (this.sky) {
    //         console.log(this.azimuth);
    //         this.sky.setSun(30, this.azimuth, 100);
    //     }
    // }

    onCreate() {
        Scripts.create('WormBlock', WormBlock);
        Scripts.create('slowRotation', SlowRotation);
        Scripts.create('HumanBehaviour', HumanBehaviour);
        Scripts.create('BulletBehaviour', BulletBehaviour);
        Scripts.create('DuckBehaviour', DuckBehaviour);
        Scripts.create('Selector', Selector);
        Scripts.create('Bobbing', Bobbing);

        this.createWorld();
        this.prepareCamera();
    }
}