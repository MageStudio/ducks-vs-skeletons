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
} from "mage-engine";

import TileMap from "./map/TileMap";
import HumanBehaviour from "./players/humans/HumanBehaviour";
import Humans from "./players/humans";
import Nature from "./players/nature";
import Selector from "./players/nature/Selector";
import BulletBehaviour from "./players/BulletBehaviour";
import DuckBehaviour from "./players/nature/DuckBehaviour";
import CameraBehaviour from "./lib/CameraContainer";
import Bobbing from "./map/Bobbing";
import { TILES_TYPES, TILE_MATERIAL_PROPERTIES } from "./map/constants";
import TargetBehaviour from "./players/TargetBehaviour";
import CloudBehaviour from "./lib/CloudBehaviour";

import CameraContainer from "./lib/CameraContainer";
import CharacterFollowingCamera from "./lib/CharacterFollowingCamera";
import { Meteor } from "./lib/Meteor";

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

const CAMERA_TARGET = { x: 6.5, y: 0, z: 6.5 };
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
        this.clouds = Array(30)
            .fill(0)
            .map(() => {
                const { height, width, name, ratio } = this.pickRandomCloud();
                const cloud = new Sprite(width, height, name, {
                    depthWrite: false,
                });
                const randomScale = Math.random() * 2 + 0.5;

                cloud.addScript("CloudBehaviour", {
                    height: Math.random() * 2 + 2,
                    distance: Math.random() * 5 + 4,
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

    prepareSceneEffects() {
        Scene.setClearColor(PALETTES.FRENCH_PALETTE.MELON_MELODY);
        Scene.setBackground(PALETTES.FRENCH_PALETTE.MELON_MELODY);
        Scene.setRendererOutputEncoding(THREE.sRGBEncoding);
        PostProcessing.add(EFFECTS.HUE_SATURATION, SATURATION_OPTIONS);
        PostProcessing.add(EFFECTS.DEPTH_OF_FIELD, DOF_OPTIONS);
    }

    createWorld(level) {
        this.addLights();
        this.addBox();
        this.addDice();
        this.addClouds();
        this.prepareSceneEffects();

        TileMap.generate(level);
    }

    setUpOrbitControls() {
        const orbit = Controls.setOrbitControl();
        orbit.setTarget(CAMERA_TARGET);
        orbit.setMinPolarAngle(0);
        orbit.setMaxPolarAngle(Math.PI / 2.5);
        orbit.setMaxDistance(15);
    }

    startGame() {
        Scene.getCamera()
            .goTo(OBSERVING_POSITION, 5000)
            .then(() => {
                this.setUpOrbitControls();
            });

        this.storePlayers();
        this.startPlayers();
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
        Scripts.register("CameraBehaviour", CameraBehaviour);
        Scripts.register("CloudBehaviour", CloudBehaviour);
        Scripts.register("Meteor", Meteor);

        Scripts.register("CameraContainer", CameraContainer);
        Scripts.register("CharacterFollowingCamera", CharacterFollowingCamera);

        // TODO: get world level from props > /?level=2
        this.createWorld(0);
    }
}
