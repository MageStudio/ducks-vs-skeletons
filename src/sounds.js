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
        ]
    }
};

export const VOLUMES = {
    CLICK: 0.5,
    HAMMER: 0.5,
    SAW: 0.5,
    BUILDING: {
        FINISHED: 0.5
    }
}

export const getClickSound = singleton(() => new AmbientSound(SOUNDS.CLICK));

export const getHammerSound = singleton((options = {}) => new DirectionalSound(math.pickRandom(SOUNDS.HAMMER), options));
export const getSawSound = singleton((options = {}) => new DirectionalSound(SOUNDS.SAW, options));
export const getBuildingFinishedSound = singleton((options = {}) => new DirectionalSound(math.pickRandom(SOUNDS.BUILDING.FINISHED), options));