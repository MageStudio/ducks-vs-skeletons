import intro from "../../theatrejs/intro4.json";
import { getProject } from "@theatre/core";
import { Element, Models, Scene, THREE, constants, math } from "mage-engine";
import {
    DEFAULT_UNIT_SCALE,
    UNIT_ANIMATIONS,
    UNIT_MATERIAL_PROPERTIES,
} from "../players/UnitBehaviour";
import TileMap from "../map/TileMap";
import { TILE_LARGE_DETAILS_SCALE } from "../map/constants";
import { getPointAtDistance } from "./utils";

const { MATERIALS } = constants;
const project = getProject("Ducks vs Skeletons", { state: intro });

let cameraContainer;
export const setupCameraContainerForIntro = () => {
    cameraContainer = new Element({ body: new THREE.Object3D() });

    cameraContainer.addScript("CameraContainer", { distance: 7, height: 6, project });
    cameraContainer.add(Scene.getCamera());

    window.camContainer = cameraContainer;
};

export const cleanupCameraContainer = () => {
    cameraContainer.remove(dialogueDuck);
    cameraContainer.remove(Scene.getCamera());
    cameraContainer.dispose();
};

export const addDuckToCameraContainer = () => {
    cameraContainer.add(createDialogDuck());
};

let dialogueDuck;
export const createDialogDuck = () => {
    dialogueDuck = Models.get("nature", { name: "dialogue_duck" });
    dialogueDuck.setScale(DEFAULT_UNIT_SCALE);
    dialogueDuck.addScript("CharacterFollowingCamera");
    dialogueDuck.toggleShadows(false);

    window.duck = dialogueDuck;

    return dialogueDuck;
};

export const playAnimationForMood = mood =>
    dialogueDuck.getScript("CharacterFollowingCamera").playAnimationForMood(mood);

let meteor;
export const createMeteor = () => {
    meteor = Models.get("meteor");
    meteor.addScript("Meteor", {
        project,
        cameraContainer,
        landing: TileMap.getStartingPositions().humanStartingPosition,
    });
};

export const playMeteorSequence = () => {
    const cameraContainerScript = cameraContainer.getScript("CameraContainer");
    cameraContainerScript.stopRotation();
    cameraContainerScript.transitionToPreSequence(
        TileMap.getStartingPositions().humanStartingPosition,
    );
    cameraContainerScript.playSequence();

    meteor.getScript("Meteor").playSequence(4000);
};

let skeleton;
export const playSkeletonAwakeSequence = () => {
    skeleton = Models.get("human", { name: "intro_skeleton" });

    skeleton.setMaterialFromName(MATERIALS.STANDARD, UNIT_MATERIAL_PROPERTIES);
    skeleton.setScale(DEFAULT_UNIT_SCALE);
    skeleton.playAnimation(UNIT_ANIMATIONS.DEATH);
    skeleton.setPosition({
        ...TileMap.getStartingPositions().humanStartingPosition,
        y: 0.2,
    });
    skeleton.setRotation({ y: Math.PI });

    window.skeleton = skeleton;
};

export const playFirstDialogueSequence = ({ mood }) => {
    project.ready.then(playMeteorSequence);
    addDuckToCameraContainer();
    createMeteor();
};

export const playStandingSkeletonSequence = () => {
    setTimeout(() => skeleton.playAnimation(UNIT_ANIMATIONS.IDLE), 2000);
};

let castle;
export const playSkeletonBuildingSequence = () => {
    skeleton.playAnimation(UNIT_ANIMATIONS.RUN);
    skeleton
        .goTo({ z: 10 }, 1000)
        .then(() => skeleton.rotateTo({ y: -Math.PI / 8 }, 500))
        .then(() => {
            skeleton.playAnimation(UNIT_ANIMATIONS.SUMMONING);
            castle = Models.get("humanStart");
            castle.setOpacity(0);
            castle.setScale({ x: 0.6, y: 0.6, z: 0.6 });
            castle.setRotation({ y: Math.PI });
            castle.setPosition(TileMap.getStartingPositions().humanStartingPosition);
            window.castle = castle;
            return castle.fadeTo(1, 5000);
        });
};

const MINIONS_AMOUNT = 6;
let minions = [];
export const playSkeletonSpawningSequence = () => {
    skeleton.playAnimation(UNIT_ANIMATIONS.RUN);
    skeleton
        .goTo(TileMap.getStartingPositions().humanStartingPosition, 1000)
        .then(() => skeleton.dispose());

    const startingPosition = { ...TileMap.getStartingPositions().humanStartingPosition, y: 0.2 };
    const step = Math.PI / MINIONS_AMOUNT;
    const MINIONS_ANIMATIONS_SPREAD = [
        UNIT_ANIMATIONS.IDLE,
        UNIT_ANIMATIONS.SUMMONING,
        UNIT_ANIMATIONS.ATTACK,
        UNIT_ANIMATIONS.ATTACK_COMBO,
    ];

    let angle = Math.PI / 1.6;
    for (let i = 0; i < MINIONS_AMOUNT; i++) {
        const minion = Models.get("human", { name: `dialogue_minion_${i}` });
        minion.setScale({
            x: 0.002,
            y: 0.002,
            z: 0.002,
        });

        angle += step;

        minion.playAnimation(UNIT_ANIMATIONS.RUN);
        minion.setRotation({ y: Math.PI });
        minion.setPosition(startingPosition);
        minion.goTo(getPointAtDistance(startingPosition, 1, angle), 2000).then(() => {
            minion.playAnimation(math.pickRandom(MINIONS_ANIMATIONS_SPREAD));
        });
        minions.push(minion);
    }
};

export const removeAllIntroSequenceElements = () => {
    skeleton.dispose();
    dialogueDuck.dispose();
    meteor.dispose();
    castle.dispose();
    minions.forEach(m => m.dispose());
};
