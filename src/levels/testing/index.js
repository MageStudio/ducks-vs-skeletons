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
    Cube,
    BaseScript,
    Element,
    Config,
} from 'mage-engine';
import { TILE_MATERIAL_PROPERTIES } from '../Main/map/constants';
import TileParticleSystem from '../Main/players/nature/TileParticleSystem';
import CameraBehaviour from '../Main/worldScripts/CameraContainer';

// import studio from '@theatre/studio';
// import { getProject, types } from '@theatre/core';
// studio.initialize(); 

// const project = getProject('Ducks vs Skeletons');
// const sheet = project.sheet('Intro');

const { Vector3 } = THREE;
window.ENTITY_EVENTS = ENTITY_EVENTS;

const { EFFECTS, MATERIALS } = constants;

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

const DOF_OPTIONS = {
    focus: 1.0,
    aperture: .0003,//0.0002,//0.0001,
    maxblur: 0.01//0.01
};

const SATURATION_OPTIONS = {
    saturation: 0.2
};

const CAMERA_TARGET = { x: 6.5, y: 0, z: 6.5 };
const OBSERVING_POSITION = {x: 2, y: 4, z: 0 };

class Follow extends BaseScript {

    start(element) {
        this.element = element;
        const offset = this.calculateOffset();
        this.element.setRotation({ y: 3 + offset, x: -.2 });
        this.element.playAnimation('Root|Cheer');

        this.positionVector = new THREE.Vector3();
        this.rotationVector = new THREE.Vector3();
    }

    calculateOffset() {
        const { w } = Config.screen();
        const offset = w * 0.0006;

        return offset;
    }

    update(dt) {
        const offset = this.calculateOffset();
        this.positionVector.set(offset, -.8, 1.2);
        this.rotationVector.set(-.2, 3 + offset, 0);

        this.element.setPosition(this.positionVector);
        this.element.setRotation(this.rotationVector);
    }
}

export default class Testing extends Level {
    addLights() {
        // AmbientLight.create(AMBIENT_LIGHT_OPTIONS);
        // HemisphereLight.create(HEMISPHERE_LIGHT_OPTIONS);
        // SunLight.create(SUNLIGHT_OPTIONS).setPosition(SUNLIGHT_POSITION);

        AmbientLight.create(AMBIENT_LIGHTS_OPTIONS);
        HemisphereLight.create(HEMISPHERELIGHT_OPTIONS);
    
        SunLight
            .create(SUNLIGHT_OPTIONS)
            .setPosition(SUNLIGHT_POSITION);
    }

    onCreate() {
        this.addLights();
        this.prepareSceneEffects();
        this.addBox();

        // Scripts.register('Follow', Follow);
        // Scripts.register('CameraBehaviour', CameraBehaviour);
        // const warrior = Models.get('human');
        // window.warrior = warrior;
        // const SMOKE_PARTICLES_OPTIONS = {
        //     direction: new Vector3(0, 1, 0),
        //     texture: 'fire',
        //     size: 0.7,
        //     radius: 0.7,
        //     life: 2,
        //     color: [0xffffff, [0x555555, 0x000000]],
        //     rate: 3,
        //     frequency: 0,
        //     strength: 0.1,
        //     initialVelocity: false,
        //     useRepulsion: true,
        // };

        // const smoke = Particles.add(
        //     new TileParticleSystem(SMOKE_PARTICLES_OPTIONS)
        // );
        // smoke.emit(Infinity);
        // smoke.setPosition({ y: 1 });

        
        // Scene.getCamera().setPosition({ x: 2, y: 4, z: 0 });
        // Scene.getCamera().lookAt({ x: 0, y: 0, z: 0 });
        // Controls.setOrbitControl();
        // const duck = this.addDuckToCamera();
        // const container = new Element({ body: new THREE.Object3D() })
        // window.container = container;
        // const second = new Cube(2, 0x00ffff);
        // window.second = second;
        
        // Scene.getCamera().add(container);
        // container.addScript('Follow');
        
        // container.setPosition({ x: 10 });
        
        // container.addScript('CameraBehaviour', { distance: 7, height: 6 });
        // container.add(Scene.getCamera());
        // container.add(duck);
        // duck.addScript('Follow');

        // setTimeout(() => {
        //     container.remove(Scene.getCamera());
        //     duck.goTo({
        //         y: 10
        //     }, 1000).then(() => {
        //         duck.dispose();
        //         container.dispose();
        //         Scene
        //             .getCamera()
        //             .goTo(OBSERVING_POSITION, 5000)
        //             .then(() => {
        //                 const orbit = Controls.setOrbitControl();
        //                 orbit.setTarget(CAMERA_TARGET);
        //                 orbit.setMinPolarAngle(0);
        //                 orbit.setMaxPolarAngle(Math.PI/2.5);
        //                 orbit.setMaxDistance(15);
        //             });
        //     })
        // }, 10000);

        // const cameraTheatre = sheet.object('camera', {
        //     rotation: types.compound({
        //         x: types.number(Scene.getCamera().getRotation().x, { range: [-Math.PI, Math.PI] }),
        //         y: types.number(Scene.getCamera().getRotation().y, { range: [-Math.PI, Math.PI] }),
        //         z: types.number(Scene.getCamera().getRotation().z, { range: [-Math.PI, Math.PI] }),
        //     }),
        //     position: types.compound({
        //         x: types.number(Scene.getCamera().getPosition().x, { range: [-10, 10] }),
        //         y: types.number(Scene.getCamera().getPosition().y, { range: [-10, 10] }),
        //         z: types.number(Scene.getCamera().getPosition().z, { range: [-10, 10] }),
        //     }),
        // });
        
        // cameraTheatre.onValuesChange(values => {
        //     const { x, y, z } = values.rotation;
            
        //     Scene.getCamera().setPosition(values.position);
        //     Scene.getCamera().setRotation({ x: x * Math.PI, y: y * Math.PI, z: z * Math.PI });
        // })
        
    }

    addBox() {
        this.box = Models.get('box');
        this.box.setMaterialFromName(MATERIALS.STANDARD, TILE_MATERIAL_PROPERTIES);
        this.box.setScale({ x: .6, y: .6, z: .6 });
        this.box.setPosition({ x: 6.5, y: -.3, z: 6.5});
    }

    prepareSceneEffects() {
        Scene.setClearColor(PALETTES.FRENCH_PALETTE.MELON_MELODY);
        Scene.setBackground(PALETTES.FRENCH_PALETTE.MELON_MELODY);
        Scene.setRendererOutputEncoding(THREE.sRGBEncoding);
        PostProcessing.add(EFFECTS.HUE_SATURATION, SATURATION_OPTIONS);
        PostProcessing.add(EFFECTS.DEPTH_OF_FIELD, DOF_OPTIONS);
    }

    addDuckToCamera() {
        const duck = Models.get('nature', { name: "dialogue_duck" });
        window.duck = duck;
        duck.setScale({
            x: 0.005,
            z: 0.005,
            y: 0.005,
        });

        // Scene.getCamera().add(duck);
        window.camera = Scene.getCamera();
        window.duck = duck;

        return duck;
    }
}
