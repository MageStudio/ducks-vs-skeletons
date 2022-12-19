import { BaseScript, Scene, Controls, THREE, Element } from "mage-engine";

const CAMERA_TARGET = { x: 6.5, y: 0, z: 6.5 };

export default class CameraContainer extends BaseScript {

    start(container, { distance, height }) {
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