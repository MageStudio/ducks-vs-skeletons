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
}

export const getClickSound = singleton(() => new AmbientSound(SOUNDS.CLICK));

export const getHammerSound = () => new DirectionalSound(math.pickRandom(SOUNDS.HAMMER));
export const getSawSound = () => new DirectionalSound(SOUNDS.SAW);
export const getBuildingFinishedSound = () => new DirectionalSound(math.pickRandom(SOUNDS.BUILDING.FINISHED));