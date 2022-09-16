import { Proton, ProtonParticleEmitter, THREE } from 'mage-engine';

const { Vector3 } = THREE;

const getRate = (rate = 3, frequency = 2) => new Proton.Rate(new Proton.Span(1, rate), new Proton.Span(frequency, frequency + .1));

const getInitializers = (size, radius, life) => ([
    new Proton.Mass(1),
    new Proton.Life(life, life * 1.2),
    new Proton.Radius(size, size / 1.5, 'center'),
    new Proton.Position(new Proton.SphereZone(radius))
]);

const getBehaviours = (color) => ([
    new Proton.Scale(new Proton.Span(1, .8), 0.5),
    new Proton.Alpha(1, 0),
    new Proton.Color(...color, Infinity, Proton.easeOutSine)
]);

export default class TileParticleSystem extends ProtonParticleEmitter {

    constructor(options) {
        const  {
            texture,
            direction = new Vector3(0, 1, 0),
            size = 20,
            radius = 1,
            strength = 100,
            life = 2,
            color = ['#FF0026', ['#ffff00', '#ffff11'] ],
            rate,
            frequency,
            initialVelocity = true,
            useRepulsion = false
        } = options;

        const initializers = [
            ...getInitializers(size, radius, life),
            ...( initialVelocity ? [new Proton.V(new Proton.Span(strength / 2, strength), new Proton.Vector3D(direction.x, direction.y, direction.z), 5)] : [] )
        ];

        const behaviours = [
            ...getBehaviours(color),
            ...( useRepulsion ? [new Proton.Repulsion(new Proton.Vector3D(), .1, 1)] : [] )
        ];

        super({
            rate: getRate(rate, frequency),
            texture,
            initializers,
            behaviours
        });
    }
}