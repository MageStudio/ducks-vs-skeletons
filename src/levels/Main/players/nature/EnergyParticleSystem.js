import { Proton, ProtonParticleEmitter, THREE } from 'mage-engine';

const { Vector3 } = THREE;

const getRate = () => new Proton.Rate(new Proton.Span(1, 3), new Proton.Span(2, 2.1));

const getInitializers = (direction, strength, size, radius, life) => ([
    new Proton.Mass(1),
    new Proton.Life(life, life * 1.2),
    new Proton.Radius(size, size / 1.5, 'center'),
    new Proton.Position(new Proton.SphereZone(radius)),
    new Proton.V(new Proton.Span(strength / 2, strength), new Proton.Vector3D(direction.x, direction.y, direction.z), 5), //new Proton.Span(200, 500)
]);

const getBehaviours = () => ([
    new Proton.Scale(new Proton.Span(1, .8), 0.5),
    new Proton.Alpha(1, 0),
    new Proton.Color('#FF0026', ['#ffff00', '#ffff11'], Infinity, Proton.easeOutSine)
]);

export default class EnergyParticleSystem extends ProtonParticleEmitter {

    constructor(options) {
        const  {
            texture,
            direction = new Vector3(0, 1, 0),
            size = 20,
            radius = 1,
            strength = 100,
            life = 2
        } = options;

        const fireOptions = {
            rate: getRate(),
            texture,
            initializers: getInitializers(direction, strength, size, radius, life),
            behaviours: getBehaviours()
        }

        super(fireOptions);
    }
}