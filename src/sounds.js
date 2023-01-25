import { AmbientSound, DirectionalSound, math, Sound } from "mage-engine";

const singleton = creator => {
    const factory = (() => {
        let instance;
        return (...props) => {
            if (!instance) {
                instance = creator(...props);
            }
            return instance;
        };
    })();

    return factory;
};

const SOUNDS = {
    CLICK: "click",
    HAMMER: ["hammer", "hammerLight"],
    SAW: "saw",
    BUILDING: {
        FINISHED: ["buildingFinished", "buildingFinishedA"],
        PLACED: "buildingPlaced",
    },
    UNIT: {
        ATTACK: "unitAttack",
    },
    BACKGROUND: {
        DESERT: "desertBackground",
        NATURE: "natureBackground",
        HUMANS: "humansBackground",
    },
    FIRE: "fire",
    METEOR: {
        TRAVEL: "meteorTravel",
        IMPACT: "meteorImpact",
    },
};

export const VOLUMES = {
    CLICK: 2,
    HAMMER: 0.2,
    SAW: 0.2,
    BUILDING: {
        FINISHED: 1,
        PLACED: 1.5,
    },
    FIRE: 2,
    UNIT: {
        ATTACK: 0.2,
    },
    BACKGROUND: 0.02,
    METEOR: {
        TRAVEL: 4,
        IMPACT: 8,
    },
};

export const getClickSound = singleton(() => new AmbientSound(SOUNDS.CLICK));

export const getBuildingPlacedSound = singleton(() => new DirectionalSound(SOUNDS.BUILDING.PLACED));
export const getHammerSound = (options = {}) =>
    new DirectionalSound(math.pickRandom(SOUNDS.HAMMER), options);
export const getSawSound = (options = {}) => new DirectionalSound(SOUNDS.SAW, options);
export const getBuildingFinishedSound = (options = {}) =>
    new DirectionalSound(math.pickRandom(SOUNDS.BUILDING.FINISHED), options);

export const getFireSound = (options = {}) => new DirectionalSound(SOUNDS.FIRE, options);

export const getUnitAttackSound = (options = {}) =>
    new DirectionalSound(SOUNDS.UNIT.ATTACK, options);

export const playBuildingPlacedSound = position => {
    const sound = getBuildingPlacedSound();
    sound.setPosition(position);
    sound.play(VOLUMES.BUILDING.PLACED);
};

export const playBuildingSound = (position, buildingTime) => {
    const saw = getSawSound({ loop: true }).play(VOLUMES.SAW).stop(buildingTime);
    const hammer = getHammerSound({ loop: true })
        .play(VOLUMES.HAMMER)
        .stop(buildingTime + 1000);

    saw.setPosition(position);
    hammer.setPosition(position);

    setTimeout(
        () => getBuildingFinishedSound().play(VOLUMES.BUILDING.FINISHED).stop(2000),
        buildingTime,
    );
};

export const playBackgroundSound = (background = SOUNDS.BACKGROUND.DESERT) =>
    AmbientSound.create(background, { loop: true }).play(VOLUMES.BACKGROUND);

export const getMeteorSound = () => new DirectionalSound(SOUNDS.METEOR.TRAVEL);
export const getMeteorImpactSound = () => new DirectionalSound(SOUNDS.METEOR.IMPACT);
