import { AmbientSound, DirectionalSound, math, Sound } from "mage-engine";

const singleton = (creator) => {
    const factory = (() => {
      let instance;
      return (...props) => {
          if (!instance) { instance = creator(...props); }
          return instance;
      };
      })();
    
    return factory;
};

const SOUNDS = {
    CLICK: 'click',
    HAMMER: [
        'hammer',
        'hammerLight'
    ],
    SAW: 'saw',
    BUILDING: {
        FINISHED: [
            'buildingFinished',
            'buildingFinishedA'
        ],
        PLACED: 'buildingPlaced'
    }
};

export const VOLUMES = {
    CLICK: 2,
    HAMMER: 0.2,
    SAW: 0.2,
    BUILDING: {
        FINISHED: 1,
        PLACED: 1.5
    }
}

export const getClickSound = singleton(() => new AmbientSound(SOUNDS.CLICK));

export const getBuildingPlacedSound = singleton(() => new DirectionalSound(SOUNDS.BUILDING.PLACED));
export const getHammerSound = (options = {}) => new DirectionalSound(math.pickRandom(SOUNDS.HAMMER), options);
export const getSawSound = (options = {}) => new DirectionalSound(SOUNDS.SAW, options);
export const getBuildingFinishedSound = (options = {}) => new DirectionalSound(math.pickRandom(SOUNDS.BUILDING.FINISHED), options);

export const playBuildingPlacedSound = position => {
    const sound = getBuildingPlacedSound();
    sound.setPosition(position);
    sound.play(VOLUMES.BUILDING.PLACED);
};

export const playBuildingSound = (position, buildingTime) => {
    const saw = getSawSound({ loop: true })
        .play(VOLUMES.SAW)
        .stop(buildingTime);
    const hammer = getHammerSound({ loop: true })
        .play(VOLUMES.HAMMER)
        .stop(buildingTime + 1000);

    saw.setPosition(position);
    hammer.setPosition(position);

    setTimeout(() => 
        getBuildingFinishedSound()
            .play(VOLUMES.BUILDING.FINISHED)
            .stop(2000), buildingTime)
}