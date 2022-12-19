import { BaseScript, Scene, Controls, THREE, Element } from "mage-engine";
import { types } from '@theatre/core';

const CAMERA_TARGET = { x: 6.5, y: 0, z: 6.5 };

export default class CameraContainer extends BaseScript {

    start(container, { distance, height, project }) {
        this.container = container;
        // this.target = CAMERA_TARGET;
        this.target = new Element({ body: new THREE.Object3D() });
        this.target.setPosition(CAMERA_TARGET);
        this.distance = distance;
        this.height = height;
        this.origin = CAMERA_TARGET;
        this.angle = 0;
        this.rotating = true;
        this.focusingOnTarget = true;
        this.sheet = project.sheet('Intro', 'camera');

        this.sheet
            .object('camera', {
                rotation: types.compound({
                    x: types.number(this.container.getRotation().x, { range: [-Math.PI, Math.PI] }),
                    y: types.number(this.container.getRotation().y, { range: [-Math.PI, Math.PI] }),
                    z: types.number(this.container.getRotation().z, { range: [-Math.PI, Math.PI] }),
                }),
                position: types.compound({
                    x: types.number(this.container.getPosition().x, { range: [-10, 10] }),
                    y: types.number(this.container.getPosition().y, { range: [-10, 10] }),
                    z: types.number(this.container.getPosition().z, { range: [-10, 10] }),
                }),
            })
            .onValuesChange(values => {
                const { x, y, z } = values.rotation;
                
                this.container.setPosition(values.position);
                if (!this.focusingOnTarget) {
                    this.container.setRotation({ x: x * Math.PI, y: y * Math.PI, z: z * Math.PI });
                }
            });
    }

    playSequence() {
        this.sheet.sequence.play({ iterationCount: 1 })
    }

    transitionToPreSequence(position) {
        this.container.setRotation({ x: 0, y: 0, z: 0 });
        this.container.lookAt(position);
    }

    update(dt) {
        if (this.rotating) {
            this.angle += 0.1 * dt;
    
            this.container.setPosition({
                x: (Math.sin(this.angle) * this.distance) + this.origin.x,
                y: this.height,
                z: (Math.cos(this.angle) * this.distance) + this.origin.z
            });
            // this.container.lookAt(this.target);
            // Scene.getCamera().lookAt(this.target);
        }

        if (this.focusingOnTarget) {
            this.container.lookAt(this.target.getPosition());
            Scene.getCamera().lookAt(this.target.getPosition());
        }
    }

    focusOnTarget(target) {
        this.target = target;
        this.focusingOnTarget = true;
    }

    stopRotation() {
        this.rotating = false;
        this.focusingOnTarget = false;
    }
}