import { Router, store, constants } from 'mage-engine';
import Main from './levels/Main';
import Root from './ui/root';
import reducers from './ui/reducers';
import Testing from './levels/testing';

const { SHADOW_TYPES } = constants;
const ASSETS_MODELS_BASE_PATH = 'assets/models';
const ASSETS_TEXTURES_BASE_PATH = 'assets/textures';
const ASSETS_AUDIO_BASE_PATH = 'assets/audio';

const assets = {
    '/': {
        audio: {
            click: `${ASSETS_AUDIO_BASE_PATH}/button.mp3`,
            hammer: `${ASSETS_AUDIO_BASE_PATH}/hammer.wav`,
            saw: `${ASSETS_AUDIO_BASE_PATH}/saw.wav`,
            hammerLight: `${ASSETS_AUDIO_BASE_PATH}/hammer_light.wav`,
            buildingFinished: `${ASSETS_AUDIO_BASE_PATH}/building_finished.wav`,
            buildingFinishedA: `${ASSETS_AUDIO_BASE_PATH}/building_finished_1.wav`,
        },
        models: {
            'box': `${ASSETS_MODELS_BASE_PATH}/box.glb`,
            'die': `${ASSETS_MODELS_BASE_PATH}/die.glb`,
            'selector': `${ASSETS_MODELS_BASE_PATH}/selector.glb`,
            'flag': `${ASSETS_MODELS_BASE_PATH}/flag_teamRed.gltf.glb`,
            
            'human': `${ASSETS_MODELS_BASE_PATH}/skeleton_animation.fbx`,
            'nature': `${ASSETS_MODELS_BASE_PATH}/duck_animation.fbx`,
            'duck_animated': `${ASSETS_MODELS_BASE_PATH}/animated.fbx`,
            
            'forestTile': `${ASSETS_MODELS_BASE_PATH}/hex_forest_detail.gltf.glb`, //${ASSETS_MODELS_BASE_PATH}/forestTile.glb,
            'lumbermill': `${ASSETS_MODELS_BASE_PATH}/lumbermill.gltf.glb`,
            'farmplot': `${ASSETS_MODELS_BASE_PATH}/farm_plot.gltf.glb`,
            'market': `${ASSETS_MODELS_BASE_PATH}/market.gltf.glb`,
            'hill': `${ASSETS_MODELS_BASE_PATH}/detail_hill.gltf.glb`,
            'forest': `${ASSETS_MODELS_BASE_PATH}/forest.gltf.glb`,

            'desertTile': `${ASSETS_MODELS_BASE_PATH}/hex_sand_detail.gltf.glb`, //${ASSETS_MODELS_BASE_PATH}/desertTile.glb,
            'details_rocks': `${ASSETS_MODELS_BASE_PATH}/detail_rocks.gltf.glb`,

            'humanTile': `${ASSETS_MODELS_BASE_PATH}/hex_rock_detail.gltf.glb`, //${ASSETS_MODELS_BASE_PATH}/humanTile.glb,
            'watchtower': `${ASSETS_MODELS_BASE_PATH}/watchtower.gltf.glb`,
            'house': `${ASSETS_MODELS_BASE_PATH}/house.gltf.glb`,
            'barracks': `${ASSETS_MODELS_BASE_PATH}/barracks.gltf.glb`,

            
            'waterTile': `${ASSETS_MODELS_BASE_PATH}/hex_water.gltf.glb`, //${ASSETS_MODELS_BASE_PATH}/waterTile.glb,

            'humanStart': `${ASSETS_MODELS_BASE_PATH}/castle.gltf.glb`, //${ASSETS_MODELS_BASE_PATH}/skyscraperD.glb,
            'forestStart': `${ASSETS_MODELS_BASE_PATH}/mill.gltf.glb`, //${ASSETS_MODELS_BASE_PATH}/tree.glb,

            'star': `${ASSETS_MODELS_BASE_PATH}/star.gltf.glb`,

            'shotgun': `${ASSETS_MODELS_BASE_PATH}/shotgun.glb`
        },
        textures: {
            'zombie': `${ASSETS_TEXTURES_BASE_PATH}/zombieA.png`,
            'fire': `${ASSETS_TEXTURES_BASE_PATH}/fire.png`,
            'waterNormal': `${ASSETS_TEXTURES_BASE_PATH}/waterNormals.jpg`,
            'greenEnergy': `${ASSETS_TEXTURES_BASE_PATH}/green_energy.png`,

            'woodMap': `${ASSETS_TEXTURES_BASE_PATH}/Wood_025_basecolor.jpg`,
            'woodAO': `${ASSETS_TEXTURES_BASE_PATH}/Wood_025_ambientOcclusion.jpg`,
            'woodBump': `${ASSETS_TEXTURES_BASE_PATH}/Wood_025_height.png`,
            'woodNormal': `${ASSETS_TEXTURES_BASE_PATH}/Wood_025_normal.jpg`,
            'woodRoughness': `${ASSETS_TEXTURES_BASE_PATH}/Wood_025_roughness.jpg`,
        }
    },
    '/testing': {
        models: {
            'human': `${ASSETS_MODELS_BASE_PATH}/skeleton_animation.fbx`,
            'nature': `${ASSETS_MODELS_BASE_PATH}/duck_animation.fbx`,
            'duck_animated': `${ASSETS_MODELS_BASE_PATH}/animated.fbx`,
        }
    }
}

const config = {
    screen: {
        h: window ? window.innerHeight : 800,
        w: window ? window.innerWidth : 600,
        ratio: window ? window.innerWidth / window.innerHeight : 600 / 800,
        frameRate: 120,
        alpha: true,
    },

    postprocessing: {
        enabled: true
    },

    lights: {
        shadows: true,
        shadowType: SHADOW_TYPES.HARD,
        textureAnisotropy: 1
    },

    physics: {
        enabled: false,
        path: 'ammo.js',
        gravity: { x: 0, y: -9.8, z: 0 },
        fixedUpdate: 60
    },

    tween: {
        enabled: false,
    },

    camera: {
        fov: 75,
        near: 0.1,
        far: 300,
    },

    ui: {
        root: Root
    },

    selector: 'body'
};

window.addEventListener('load', () => {
    store.createStore(reducers, {}, true);

    Router.on('/', Main);
    Router.on('/test', Testing);
    Router.start(config, assets);
});
