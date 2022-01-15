import { Router, store, constants } from 'mage-engine';
import Test from './levels/test';
import Root from './ui/root';

const { SHADOW_TYPES } = constants;

const assets = {
    '/test': {
        models: {
            'selector': 'assets/models/selector.glb',
            
            'human': 'assets/models/human.fbx',
            'nature': 'assets/models/duck.fbx',
            
            'forestTile': 'assets/models/forestTile.glb',
            'forestTileA': 'assets/models/forestTile_variation_A.glb',
            'forestTileB': 'assets/models/forestTile_variation_B.glb',
            'forestTileBuildersHut': 'assets/models/forestTileBuildersHut.glb',
            'forestTileTower': 'assets/models/forestTileTower.glb',
            'forestTileWarriorsHut': 'assets/models/forestTileWarriorsHut.glb',
            
            'desertTile': 'assets/models/desertTile.glb',
            'desertTileA': 'assets/models/desertTile_variation_A.glb',
            // 'forestTile': 'assets/models/tileLow_forest.gltf.glb',
            // 'desertTile': 'assets/models/tileLow_desert.gltf.glb',
            // 'humanTile': 'assets/models/tileLow_teamBlue.gltf.glb',
            // 'humanTile': 'assets/models/building_village.glb',
            'humanTile': 'assets/models/humanTile.glb',
            'humanTileTower': 'assets/models/humanTileTower.glb',
            'humanTileWarriorsHut': 'assets/models/humanTileWarriorsHut.glb',
            'humanTileBuildersHut': 'assets/models/humanTileBuildersHut.glb',
            
            'waterTile': 'assets/models/waterTile.glb',

            'humanStart': 'assets/models/skyscraperD.glb',
            'forestStart': 'assets/models/tree.glb',

            'star': 'assets/models/star.gltf.glb',

            'shotgun': 'assets/models/shotgun.glb',
            
            'desertDetail': 'assets/models/detail_desert.gltf.glb',
            'desertRockA': 'assets/models/rocksA_desert.gltf.glb',
            'desertRockB': 'assets/models/rocksB_desert.gltf.glb',
            'desertPlantA': 'assets/models/plantA_desert.gltf.glb',
            'desertPlantB': 'assets/models/plantB_desert.gltf.glb',
            'desertTree': 'assets/models/tree_desert.gltf.glb',

            'forestDetail': 'assets/models/detail_forest.gltf.glb',
            'forestRockA': 'assets/models/rocksA_forest.gltf.glb',
            'forestRockB': 'assets/models/rocksB_forest.gltf.glb',
            'forestPlantA': 'assets/models/plantA_forest.gltf.glb',
            'forestPlantB': 'assets/models/plantB_forest.gltf.glb',
            'forestTree': 'assets/models/tree.glb',

            'largeBuildingA': 'assets/models/large_buildingA.glb',
            'largeBuildingB': 'assets/models/large_buildingB.glb',
            'largeBuildingC': 'assets/models/large_buildingC.glb',
            'largeBuildingD': 'assets/models/large_buildingD.glb',
            'largeBuildingE': 'assets/models/large_buildingE.glb',
            'largeBuildingG': 'assets/models/large_buildingG.glb',
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
        shadowType: SHADOW_TYPES.SOFT,
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
    // store.createStore(reducers, {}, true);

    Router.on('/test', Test);
    Router.start(config, assets);
});
