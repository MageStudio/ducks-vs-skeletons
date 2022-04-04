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
    PostProcessing
} from 'mage-engine';

import TileMap, { HUMAN_DETAILS } from './map/TileMap';
import SlowRotation from './collectibles/slowRotation';
import HumanBehaviour from './players/humans/HumanBehaviour';
import Humans from './players/humans';
import Nature from './players/nature';
import Selector from './players/nature/Selector';
import BulletBehaviour from './players/humans/BulletBehaviour';
import DuckBehaviour from './players/nature/DuckBehaviour';
import Bobbing from './map/Bobbing';
import { TILE_MATERIAL_PROPERTIES } from './map/constants';

export const WHITE = 0xffffff;
export const SUNLIGHT = 0xffeaa7;
export const DARKER_GROUND = 0X78e08f;
export const GROUND = 0xb8e994;
export const BACKGROUND = 0xdff9fb;//0xddf3f5;

const DOF_OPTIONS = {
    focus: 1.0,
    aperture: .0003,//0.0002,//0.0001,
    maxblur: 0.006//0.01
};

const SATURATION_OPTIONS = {
    saturation: 0.2
};

const { EFFECTS, MATERIALS, TEXTURES } = constants;

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

    addBox() {
        this.box = Models.getModel('box');
        this.box.setMaterialFromName(MATERIALS.STANDARD, TILE_MATERIAL_PROPERTIES);
        this.box.setScale({ x: .6, y: .6, z: .6 });
        this.box.setPosition({ x: 6.5, y: -.3, z: 6.5});
    }
    
    addDice() {
        const die_1 = Models.getModel('die', { name: 'die:1' });
        const die_2 = Models.getModel('die', { name: 'die:2' });

        die_1.setMaterialFromName(MATERIALS.STANDARD, TILE_MATERIAL_PROPERTIES);
        die_2.setMaterialFromName(MATERIALS.STANDARD, TILE_MATERIAL_PROPERTIES);

        die_1.setPosition({ z: 5.5, x: -1 });
        die_2.setPosition({ z: 6.3, x: -.7 });
        die_1.setRotation({ y: 0.3, z: Math.PI / 2 })
    }

    prepareCamera() {
        Scene.getCamera().setPosition({x: 2, y: 4, z: 0 });
        const orbit = Controls.setOrbitControl();

        orbit.setTarget({ x: 6.5, y: 0, z: 6.5 });
        orbit.setMinPolarAngle(0);
        orbit.setMaxPolarAngle(Math.PI/2.5);
        orbit.setMaxDistance(15);

        window.camera = Scene.getCamera();
    }

    prepareSceneEffects() {
        Scene.setClearColor(PALETTES.FRENCH_PALETTE.MELON_MELODY);
        Scene.setBackground(PALETTES.FRENCH_PALETTE.MELON_MELODY);
        Scene.setRendererOutputEncoding(THREE.sRGBEncoding);
        PostProcessing.add(EFFECTS.HUE_SATURATION, SATURATION_OPTIONS);
        // PostProcessing.add(EFFECTS.DEPTH_OF_FIELD, DOF_OPTIONS);
    }

    createWorld() {
        this.addSunLight();
        // this.addSky();
        this.addBox();
        this.addDice();
        this.prepareSceneEffects();

        const { human, nature } = TileMap.generate(0);
        Humans.start(human);
        Nature.start(nature);

        window.n = Nature;
        window.tm = TileMap;
    }

    onCreate() {
        Scripts.register('slowRotation', SlowRotation);
        Scripts.register('HumanBehaviour', HumanBehaviour);
        Scripts.register('BulletBehaviour', BulletBehaviour);
        Scripts.register('DuckBehaviour', DuckBehaviour);
        Scripts.register('Selector', Selector);
        Scripts.register('Bobbing', Bobbing);

        this.createWorld();
        this.prepareCamera();

        const txt = document.querySelector('#txt');
        const changeFPS = (fps) => {
            txt.innerText = Math.floor(fps);
        };
        Stats.subscribe(changeFPS);
    }
}