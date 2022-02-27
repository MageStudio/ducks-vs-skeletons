import { Router, store, constants } from 'mage-engine';
import Test from './levels/test';
import Root from './ui/root';
import reducers from './ui/reducers';

const { SHADOW_TYPES } = constants;

const assets = {
    '/test': {
        models: {
            'selector': 'assets/models/selector.glb',
            
            'human': 'assets/models/human.fbx',
            'nature': 'assets/models/duck.fbx',
            
            'forestTile': 'assets/models/hex_forest_detail.gltf.glb',//'assets/models/forestTile.glb',
            'lumbermill': 'assets/models/lumbermill.gltf.glb',
            'farmplot': 'assets/models/farm_plot.gltf.glb',
            'market': 'assets/models/market.gltf.glb',
            'hill': 'assets/models/detail_hill.gltf.glb',
            'forest': 'assets/models/forest.gltf.glb',

            'desertTile': 'assets/models/hex_sand_detail.gltf.glb',//'assets/models/desertTile.glb',
            'details_rocks': 'assets/models/detail_rocks.gltf.glb',

            'humanTile': 'assets/models/hex_rock_detail.gltf.glb', //'assets/models/humanTile.glb',
            'watchtower': 'assets/models/watchtower.gltf.glb',
            'house': 'assets/models/house.gltf.glb',
            'barracks': 'assets/models/barracks.gltf.glb',

            
            'waterTile': 'assets/models/hex_water.gltf.glb',//'assets/models/waterTile.glb',

            'humanStart': 'assets/models/castle.gltf.glb',//'assets/models/skyscraperD.glb',
            'forestStart': 'assets/models/mill.gltf.glb',//'assets/models/tree.glb',

            'star': 'assets/models/star.gltf.glb',

            'shotgun': 'assets/models/shotgun.glb'
        },
        textures: {
            'zombie': 'assets/textures/zombieA.png',
            'fire': 'assets/textures/fire.png',
            'waterNormal': 'assets/textures/waterNormals.jpg'
        }
    }
}

const config = {
    screen: {
        h: window ? window.innerHeight : 800,
        w: window ? window.innerWidth : 600,
        ratio: window ? window.innerWidth / window.innerHeight : 600 / 800,
        frameRate: 60,
        alpha: true,
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

    Router.on('/test', Test);
    Router.start(config, assets);
});
