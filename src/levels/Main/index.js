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
import HumanBehaviour from './players/humans/HumanBehaviour';
import Humans from './players/humans';
import Nature from './players/nature';
import Selector from './players/nature/Selector';
import BulletBehaviour from './players/BulletBehaviour';
import DuckBehaviour from './players/nature/DuckBehaviour';
import Bobbing from './map/Bobbing';
import { TILES_TYPES, TILE_MATERIAL_PROPERTIES } from './map/constants';
import TargetBehaviour from './players/TargetBehaviour';

export const WHITE = 0xffffff;
export const SUNLIGHT = 0xffeaa7;
export const DARKER_GROUND = 0X78e08f;
export const GROUND = 0xb8e994;
export const BACKGROUND = 0xdff9fb;//0xddf3f5;

const DOF_OPTIONS = {
    focus: 1.0,
    aperture: .0003,//0.0002,//0.0001,
    maxblur: 0.01//0.01
};

const SATURATION_OPTIONS = {
    saturation: 0.2
};

const AMBIENT_LIGHTS_OPTIONS = {
    color: PALETTES.FRENCH_PALETTE.SPRAY,
    intensity: .5
};

const HEMISPHERELIGHT_OPTIONS = {
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

const { EFFECTS, MATERIALS, TEXTURES } = constants;

export default class Main extends Level {

    addLights() {
        AmbientLight.create(AMBIENT_LIGHTS_OPTIONS);
        HemisphereLight.create(HEMISPHERELIGHT_OPTIONS);
    
        SunLight
            .create(SUNLIGHT_OPTIONS)
            .setPosition(SUNLIGHT_POSITION);
    }

    addSky() {
        this.sky = new Sky({});
        this.sky.setSun(.1, .1, 100);
    }

    addBox() {
        this.box = Models.get('box');
        this.box.setMaterialFromName(MATERIALS.STANDARD, TILE_MATERIAL_PROPERTIES);
        this.box.setScale({ x: .6, y: .6, z: .6 });
        this.box.setPosition({ x: 6.5, y: -.3, z: 6.5});
    }
    
    addDice() {
        const die_1 = Models.get('die', { name: 'die:1' });
        const die_2 = Models.get('die', { name: 'die:2' });

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
        window.orbit = orbit;
    }

    prepareSceneEffects() {
        Scene.setClearColor(PALETTES.FRENCH_PALETTE.MELON_MELODY);
        Scene.setBackground(PALETTES.FRENCH_PALETTE.MELON_MELODY);
        Scene.setRendererOutputEncoding(THREE.sRGBEncoding);
        PostProcessing.add(EFFECTS.HUE_SATURATION, SATURATION_OPTIONS);
        PostProcessing.add(EFFECTS.DEPTH_OF_FIELD, DOF_OPTIONS);
    }

    createWorld() {
        this.addLights();
        this.addBox();
        this.addDice();
        this.prepareSceneEffects();

        window.n = Nature;
        window.h = Humans;
        window.tm = TileMap;
    }

    startGame() {
        this.storePlayers();
        this.startPlayers();
    }

    startPlayers() {
        const {
            humanStartingPosition,
            natureStartingPosition
        } = TileMap.generate(0);

        Humans.start(humanStartingPosition);
        Nature.start(natureStartingPosition);
    }

    storePlayers() {
        this.players = {
            [TILES_TYPES.FOREST]: Nature,
            [TILES_TYPES.HUMAN]: Humans
        };
    }

    getPlayerByType(type) {
        return this.players[type];
    }

    getUnitsByType(type) {
        return this
            .getPlayerByType(type)
            .getUnits();
    }

    onCreate() {
        Scripts.register('TargetBehaviour', TargetBehaviour);
        Scripts.register('HumanBehaviour', HumanBehaviour);
        Scripts.register('BulletBehaviour', BulletBehaviour);
        Scripts.register('DuckBehaviour', DuckBehaviour);
        Scripts.register('Selector', Selector);
        Scripts.register('Bobbing', Bobbing);

        this.createWorld();
        this.startGame();
        this.prepareCamera();

        const txt = document.querySelector('#txt');
        const changeFPS = (fps) => {
            txt.innerText = Math.floor(fps);
        };
        Stats.subscribe(changeFPS);
    }
}