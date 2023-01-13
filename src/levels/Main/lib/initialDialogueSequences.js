import intro from "../../theatrejs/intro4.json";
import { getProject } from "@theatre/core";
import { Element, Models, Scene, THREE, constants } from "mage-engine";
import {
    DEFAULT_UNIT_SCALE,
    UNIT_ANIMATIONS,
    UNIT_MATERIAL_PROPERTIES,
} from "../players/UnitBehaviour";
import TileMap from "../map/TileMap";

const { MATERIALS } = constants;
const project = getProject("Ducks vs Skeletons", { state: intro });

let cameraContainer;
export const setupCameraContainerForIntro = () => {
    cameraContainer = new Element({ body: new THREE.Object3D() });

    cameraContainer.addScript("CameraContainer", { distance: 7, height: 6, project });
    cameraContainer.add(Scene.getCamera());
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

    window.duck = dialogueDuck;

    return dialogueDuck;
};

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
};

export const playFirstDialogueSequence = () => {
    project.ready.then(playMeteorSequence);
    addDuckToCameraContainer();
    createMeteor();
};

export const playStandingSkeletonSequence = () => {
    setTimeout(() => skeleton.playAnimation(UNIT_ANIMATIONS.IDLE), 2000);
};

export const playSkeletonBuildingSequence = () => {
    skeleton.playAnimation(UNIT_ANIMATIONS.RUN);
    skeleton
        .goTo({ z: 10 }, 1000)
        .then(() => skeleton.rotateTo({ y: -Math.PI / 8 }, 500))
        .then(() => skeleton.playAnimation(UNIT_ANIMATIONS.BUILD));
};
