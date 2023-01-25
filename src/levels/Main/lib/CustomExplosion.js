import { Proton, ProtonParticleEmitter, ParticleEmitterGroup } from "mage-engine";

const DEFAULT_SIZE = 4;
const DEFAULT_LIFE = 2;

const getSparksInitializers = (size = DEFAULT_SIZE, life = DEFAULT_LIFE) => [
    new Proton.Mass(0.1),
    new Proton.Radius(size * 0.3),
    new Proton.Life(1),
    new Proton.Position(new Proton.SphereZone(size * 1.5)),
];

const getSparksBehaviours = (size = DEFAULT_SIZE) => [
    new Proton.RandomDrift(size * 0.75, size * 0.75, size * 0.75, 0.5),
    new Proton.Color("#ffffff"),
    new Proton.Scale(1, 0.1),
];

const getSparksRate = () => new Proton.Rate(50, 0.5);
const getDebrisRate = () => new Proton.Rate(10, 0.4);
const getFireRate = () => new Proton.Rate(10, 0.4);

const getDebrisInitializers = (size = DEFAULT_SIZE, life = DEFAULT_LIFE) => [
    new Proton.Mass(10),
    new Proton.Radius(size * 0.25),
    new Proton.Life(life),
    new Proton.Position(new Proton.SphereZone(size * 0.75)),
];

const getDebrisBehaviours = (size = DEFAULT_SIZE) => {
    const zone = new Proton.BoxZone(0, 50, 0, 300, 100, 300);
    zone.friction = 0.95;
    zone.max = 7;
    return [
        new Proton.CrossZone(zone, "bound"),
        new Proton.Repulsion(new Proton.Vector3D(0, 0, 0), size * 12.5, size * 1.5),
        new Proton.G(3),
        new Proton.Color("#95a5a6", "#000000"),
    ];
};

const getFireInitializers = (size = DEFAULT_SIZE, life = DEFAULT_LIFE) => [
    new Proton.Mass(1),
    new Proton.Radius(size * 1.5),
    new Proton.Life(life / 10, life / 4),
    new Proton.Position(new Proton.SphereZone(size * 1.25)),
];

const getFireBehaviours = () => [new Proton.Scale(1, 2), new Proton.Color("#c0392b", "#f1c40f")];
export default class CustomExplosion extends ParticleEmitterGroup {
    constructor(options = {}) {
        const {
            texture = false,
            hasDebris = false,
            size = DEFAULT_SIZE,
            life = DEFAULT_LIFE,
        } = options;

        const sparks = new ProtonParticleEmitter({
            rate: getSparksRate(),
            texture,
            initializers: getSparksInitializers(size, life),
            behaviours: getSparksBehaviours(size, life),
        });
        const fire = new ProtonParticleEmitter({
            rate: getFireRate(),
            texture,
            initializers: getFireInitializers(size, life),
            behaviours: getFireBehaviours(size, life),
        });

        const system = [sparks, fire];

        if (hasDebris) {
            system.push(
                new ProtonParticleEmitter({
                    rate: getDebrisRate(),
                    texture,
                    initializers: getDebrisInitializers(size),
                    behaviours: getDebrisBehaviours(size),
                }),
            );
        }

        const name = "ExplosionGroup";

        super({ system, name });
    }
}
