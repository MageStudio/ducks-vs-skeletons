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
    PostProcessing,
    Sprite,
    easing,
    Element,
} from "mage-engine";

import TileMap from "./map/TileMap";
import HumanBehaviour from "./players/humans/HumanBehaviour";
import Humans from "./players/humans";
import Nature from "./players/nature";
import Selector from "./players/nature/Selector";
import BulletBehaviour from "./players/BulletBehaviour";
import DuckBehaviour from "./players/nature/DuckBehaviour";
import Bobbing from "./map/Bobbing";
import { TILES_TYPES, TILE_MATERIAL_PROPERTIES } from "./map/constants";
import TargetBehaviour from "./players/TargetBehaviour";
import CloudBehaviour from "./lib/CloudBehaviour";

import CameraContainer from "./lib/CameraContainer";
import CharacterFollowingCamera from "./lib/CharacterFollowingCamera";
import { Meteor } from "./lib/Meteor";

import { fragmentShader, vertexShader } from "./lib/SkyShader";
import CameraShake from "./lib/CameraShake";

export const WHITE = 0xffffff;
export const SUNLIGHT = 0xffeaa7;
export const DARKER_GROUND = 0x78e08f;
export const GROUND = 0xb8e994;
export const BACKGROUND = 0xdff9fb; //0xddf3f5;

const DOF_OPTIONS = {
    focus: 1.0,
    aperture: 0.0003, //0.0002,//0.0001,
    maxblur: 0.01, //0.01
};

const SATURATION_OPTIONS = {
    saturation: 0.2,
};

const AMBIENT_LIGHTS_OPTIONS = {
    color: PALETTES.FRENCH_PALETTE.SPRAY,
    intensity: 0.5,
};

const HEMISPHERELIGHT_OPTIONS = {
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

const { EFFECTS, MATERIALS } = constants;
const CLOUDS = [
    { name: "cloud1", height: 1.37, width: 2.64, ratio: 1.92 },
    { name: "cloud2", height: 1.06, width: 2.7, ratio: 2.54 },
    { name: "cloud3", height: 1.215, width: 2.495, ratio: 2.05 },
];

const MAP_CENTER = { x: 6.5, y: 0, z: 6.5 };
const OBSERVING_POSITION = { x: 2, y: 4, z: 0 };

export default class Main extends Level {
    addLights() {
        AmbientLight.create(AMBIENT_LIGHTS_OPTIONS);
        HemisphereLight.create(HEMISPHERELIGHT_OPTIONS);

        SunLight.create(SUNLIGHT_OPTIONS).setPosition(SUNLIGHT_POSITION);
    }

    addBox() {
        this.box = Models.get("box");
        this.box.setMaterialFromName(MATERIALS.STANDARD, TILE_MATERIAL_PROPERTIES);
        this.box.setScale({ x: 0.6, y: 0.6, z: 0.6 });
        this.box.setPosition({ x: 6.5, y: -0.3, z: 6.5 });
    }

    addDice() {
        const die_1 = Models.get("die", { name: "die:1" });
        const die_2 = Models.get("die", { name: "die:2" });

        die_1.setMaterialFromName(MATERIALS.STANDARD, TILE_MATERIAL_PROPERTIES);
        die_2.setMaterialFromName(MATERIALS.STANDARD, TILE_MATERIAL_PROPERTIES);

        die_1.setPosition({ z: 5.5, x: -1 });
        die_2.setPosition({ z: 6.3, x: -0.7 });
        die_1.setRotation({ y: 0.3, z: Math.PI / 2 });
    }

    pickRandomCloud = () => CLOUDS[Math.floor(Math.random() * CLOUDS.length)];

    addClouds() {
        this.clouds = Array(50)
            .fill(0)
            .map(() => {
                const { height, width, name, ratio } = this.pickRandomCloud();
                const cloud = new Sprite(width, height, name, {
                    depthWrite: false,
                });
                const randomScale = Math.random() * 3 + 0.5;

                cloud.addScript("CloudBehaviour", {
                    height: Math.random() * 2 + 2,
                    distance: Math.random() * 8 + 4,
                    angle: Math.random() * Math.PI * 2,
                    speed: Math.random() * 0.01,
                    scale: { x: randomScale, y: randomScale / ratio },
                });
                return cloud;
            });
    }

    turnCloudsDark() {
        this.clouds.forEach(c => c.getScript("CloudBehaviour").turnDark());
    }

    turnCloudsWhite() {
        this.clouds.forEach(c => c.getScript("CloudBehaviour").turnWhite());
    }

    addSky() {
        const uniforms = {
            topColor: { value: new THREE.Color(PALETTES.FRENCH.SPRAY) },
            bottomColor: { value: new THREE.Color(PALETTES.FRENCH.PARADISE_GREEN) },
            offset: { value: 200 },
            exponent: { value: 0.6 },
        };

        const geometry = new THREE.SphereGeometry(250, 32, 15);
        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader,
            fragmentShader,
            side: THREE.BackSide,
        });

        const body = new THREE.Mesh(geometry, material);
        const sky = new Element({ body });
        sky.setPosition(MAP_CENTER);

        return sky;
    }

    prepareSceneEffects() {
        // Scene.setClearColor(PALETTES.FRENCH_PALETTE.MELON_MELODY);
        // Scene.setBackground(PALETTES.FRENCH_PALETTE.MELON_MELODY);
        Scene.setRendererOutputEncoding(THREE.sRGBEncoding);
        PostProcessing.add(EFFECTS.HUE_SATURATION, SATURATION_OPTIONS);
        PostProcessing.add(EFFECTS.DEPTH_OF_FIELD, DOF_OPTIONS);
    }

    createWorld(level) {
        this.addLights();
        this.addBox();
        this.addDice();
        this.addSky();
        this.addClouds();
        this.prepareSceneEffects();

        TileMap.generate(level);
    }

    setUpOrbitControls() {
        const orbit = Controls.setOrbitControl();
        orbit.setTarget(MAP_CENTER);
        orbit.setMinPolarAngle(0);
        orbit.setMaxPolarAngle(Math.PI / 2.5);
        orbit.setMaxDistance(15);
    }

    startGame() {
        const { x, y, z } = Scene.getCamera().getPosition();
        easing
            .tweenTo({ x, y, z }, OBSERVING_POSITION, {
                time: 5000,
                onUpdate: position => {
                    Scene.getCamera().lookAt(MAP_CENTER);
                    Scene.getCamera().setPosition(position);
                },
            })
            .then(() => {
                this.setUpOrbitControls();
            });

        this.storePlayers();
        window.tm = TileMap;
        // this.startPlayers();
    }

    startPlayers() {
        Humans.start(TileMap.getStartingPositions().humanStartingPosition);
        Nature.start(TileMap.getStartingPositions().natureStartingPosition);
    }

    storePlayers() {
        this.players = {
            [TILES_TYPES.FOREST]: Nature,
            [TILES_TYPES.HUMAN]: Humans,
        };
    }

    getPlayerByType(type) {
        return this.players[type];
    }

    getUnitsByType(type) {
        return this.getPlayerByType(type).getUnits();
    }

    onCreate() {
        Scripts.register("TargetBehaviour", TargetBehaviour);
        Scripts.register("HumanBehaviour", HumanBehaviour);
        Scripts.register("BulletBehaviour", BulletBehaviour);
        Scripts.register("DuckBehaviour", DuckBehaviour);
        Scripts.register("Selector", Selector);
        Scripts.register("Bobbing", Bobbing);
        Scripts.register("CloudBehaviour", CloudBehaviour);
        Scripts.register("Meteor", Meteor);

        Scripts.register("CameraShake", CameraShake);
        Scripts.register("CameraContainer", CameraContainer);
        Scripts.register("CharacterFollowingCamera", CharacterFollowingCamera);

        Scene.getCamera().addScript("CameraShake", { duration: 1, shakeAmount: 0.2 });
        window.cam = Scene.getCamera();

        // TODO: get world level from props > /?level=2
        this.createWorld(0);
    }
}
