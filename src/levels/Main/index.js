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
    Sprite,
    Element,
    store
} from 'mage-engine';

import TileMap, { HUMAN_DETAILS } from './map/TileMap';
import HumanBehaviour from './players/humans/HumanBehaviour';
import Humans from './players/humans';
import Nature from './players/nature';
import Selector from './players/nature/Selector';
import BulletBehaviour from './players/BulletBehaviour';
import DuckBehaviour from './players/nature/DuckBehaviour';
import CameraBehaviour from './worldScripts/CameraContainer';
import Bobbing from './map/Bobbing';
import { TILES_TYPES, TILE_MATERIAL_PROPERTIES } from './map/constants';
import TargetBehaviour from './players/TargetBehaviour';
import CloudBehaviour from './worldScripts/CloudBehaviour';

import CameraContainer from './worldScripts/CameraContainer';
import { DEFAULT_UNIT_SCALE } from './players/UnitBehaviour';
import CharacterFollowingCamera from './worldScripts/CharacterFollowingCamera';
import { gameStarted } from '../../ui/actions/game';

import studio from '@theatre/studio';
import intro from '../theatrejs/intro4.json';
import { getProject, types } from '@theatre/core';
import { Meteor } from './worldScripts/Meteor';
studio.initialize(); 

const project = getProject('Ducks vs Skeletons', { state: intro });
const cameraSheet = project.sheet('Intro', 'camera');
// const meteorSheet = project.sheet('Intro', 'meteor');
// window.sheet = meteorSheet;

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

const { EFFECTS, MATERIALS } = constants;
const CLOUDS = [
    { name: 'cloud1', height: 1.37, width: 2.64, ratio: 1.92 },
    { name: 'cloud2', height: 1.06, width: 2.7, ratio: 2.54 },
    { name: 'cloud3', height: 1.215, width: 2.495, ratio: 2.05 },
]

const CAMERA_TARGET = { x: 6.5, y: 0, z: 6.5 };
const OBSERVING_POSITION = {x: 2, y: 4, z: 0 };

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

    pickRandomCloud = () => CLOUDS[Math.floor(Math.random() * CLOUDS.length)];

    addClouds() {
        this.clouds = Array(30).fill(0).map(() => {
            const { height, width, name, ratio } = this.pickRandomCloud();
            const cloud = new Sprite(width, height, name, {
                depthWrite: false
            });
            const randomScale = Math.random() * 2 + .5;

            cloud.addScript('CloudBehaviour', {
                height: (Math.random() * 2) + 2,
                distance: (Math.random() * 5) + 4,
                angle: Math.random()* Math.PI * 2,
                speed:  Math.random() * 0.01,
                scale: { x: randomScale, y: randomScale / ratio }
            });
            return cloud;
        });
    }

    turnCloudsDark() {
        this.clouds.forEach(c => c.getScript('CloudBehaviour').turnDark());
    }

    turnCloudsWhite() {
        this.clouds.forEach(c => c.getScript('CloudBehaviour').turnWhite());
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
        this.addClouds();
        this.prepareSceneEffects();

        const {
            humanStartingPosition,
            natureStartingPosition
        } = TileMap.generate(0);

        window.n = Nature;
        window.h = Humans;
        window.tm = TileMap;

        return {
            humanStartingPosition,
            natureStartingPosition
        }
    }

    playIntroAnimation() {
        this.cameraContainer.getScript('CameraContainer').stopRotation();
        this.cameraContainer.setRotation({ x: 0, y: 0, z: 0 });
        this.cameraContainer.lookAt(this.playerPositions.humanStartingPosition);
        cameraSheet.sequence.play({ iterationCount: 1 })
        setTimeout(() => this.cameraContainer.getScript('CameraContainer').focusOnTarget(this.meteor), 1500);
        this.meteor.getScript('Meteor').playSequence(2000).then(() => {
        })
    }

    startDialogue() {
        project.ready.then(() => this.playIntroAnimation());
        this.addDuckToCameraContainer();
        this.createMeteor();
    }

    setUpOrbitControls() {
        const orbit = Controls.setOrbitControl();
        orbit.setTarget(CAMERA_TARGET);
        orbit.setMinPolarAngle(0);
        orbit.setMaxPolarAngle(Math.PI/2.5);
        orbit.setMaxDistance(15);
    }

    cleanupCameraContainer() {
        this.cameraContainer.remove(this.dialogueDuck);
        this.cameraContainer.remove(Scene.getCamera());
        this.cameraContainer.dispose();
    }

    startGame() {
        console.log('dispatghing gameStarted');
        store.dispatch(gameStarted());
        console.log('cleanup camera container');
        this.cleanupCameraContainer();

        console.log('moving camera to observing position');
        Scene.getCamera().goTo(OBSERVING_POSITION, 5000);

        console.log('set up orbit controls');
        this.setUpOrbitControls();

        this.storePlayers();
        console.log('starting players');
        this.startPlayers();
    }

    startPlayers() {
        Humans.start(this.playerPositions.humanStartingPosition);
        Nature.start(this.playerPositions.natureStartingPosition);
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

    createDuck() {
        this.dialogueDuck = Models.get('nature', { name: "dialogue_duck" });
        this.dialogueDuck.setScale(DEFAULT_UNIT_SCALE);
        this.dialogueDuck.addScript('CharacterFollowingCamera');

        window.duck = this.dialogueDuck;

        return this.dialogueDuck;
    }

    createCameraContainer() {
        this.cameraContainer = new Element({ body: new THREE.Object3D() });
        
        this.cameraContainer.addScript('CameraContainer', { distance: 7, height: 6 });
        this.cameraContainer.add(Scene.getCamera());
        
    }
    
    addDuckToCameraContainer() {
        this.cameraContainer.add(this.createDuck());
    }

    createMeteor() {
        this.meteor = Models.get('meteor');
        this.meteor.addScript('Meteor', { project });
        window.meteor = this.meteor;
        // this.meteor.setScale({ x: 0.01, y:  0.01, z: 0.01 });

        // meteorSheet
        //     .object('meteor', {
        //         rotation: types.compound({
        //             x: types.number(this.meteor.getRotation().x, { range: [-Math.PI, Math.PI] }),
        //             y: types.number(this.meteor.getRotation().y, { range: [-Math.PI, Math.PI] }),
        //             z: types.number(this.meteor.getRotation().z, { range: [-Math.PI, Math.PI] }),
        //         }),
        //         position: types.compound({
        //             x: types.number(this.meteor.getPosition().x, { range: [-20, 20] }),
        //             y: types.number(this.meteor.getPosition().y, { range: [-20, 20] }),
        //             z: types.number(this.meteor.getPosition().z, { range: [-20, 20] }),
        //         }),
        //     })
        //     .onValuesChange(values => {
        //         const { x, y, z } = values.rotation;
                
        //         this.meteor.setPosition(values.position);
        //         this.meteor.setRotation({ x: x * Math.PI, y: y * Math.PI, z: z * Math.PI });
        //     })
        
        // meteorSheet.
    }

    startTheatre() {
        cameraSheet
            .object('camera', {
                rotation: types.compound({
                    x: types.number(this.cameraContainer.getRotation().x, { range: [-Math.PI, Math.PI] }),
                    y: types.number(this.cameraContainer.getRotation().y, { range: [-Math.PI, Math.PI] }),
                    z: types.number(this.cameraContainer.getRotation().z, { range: [-Math.PI, Math.PI] }),
                }),
                position: types.compound({
                    x: types.number(this.cameraContainer.getPosition().x, { range: [-10, 10] }),
                    y: types.number(this.cameraContainer.getPosition().y, { range: [-10, 10] }),
                    z: types.number(this.cameraContainer.getPosition().z, { range: [-10, 10] }),
                }),
            })
            .onValuesChange(values => {
                const { x, y, z } = values.rotation;
                
                this.cameraContainer.setPosition(values.position);
                this.cameraContainer.setRotation({ x: x * Math.PI, y: y * Math.PI, z: z * Math.PI });
            });
    }

    onCreate() {
        Scripts.register('TargetBehaviour', TargetBehaviour);
        Scripts.register('HumanBehaviour', HumanBehaviour);
        Scripts.register('BulletBehaviour', BulletBehaviour);
        Scripts.register('DuckBehaviour', DuckBehaviour);
        Scripts.register('Selector', Selector);
        Scripts.register('Bobbing', Bobbing);
        Scripts.register('CameraBehaviour', CameraBehaviour);
        Scripts.register('CloudBehaviour', CloudBehaviour);
        Scripts.register('Meteor', Meteor);

        Scripts.register('CameraContainer', CameraContainer);
        Scripts.register('CharacterFollowingCamera', CharacterFollowingCamera);

        // TODO: get world level from props > /?level=2
        this.playerPositions = this.createWorld();

        this.createCameraContainer();
        this.startTheatre();

        window.Level = this;
    }
}