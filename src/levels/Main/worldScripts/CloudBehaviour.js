import { BaseScript, Scene, Controls, easing, Color } from "mage-engine";
import { distance } from "../utils";

const CENTER = { x: 6.5, y: 0, z: 6.5 };
const DEFAULT_OPACITY = .4;
const FADING_DISTANCE = 4;
const FADING_TIME = 500;

export default class CloudBehaviour extends BaseScript {
    start(cloud, { distance, height, angle, speed, scale }) {
        this.cloud = cloud;
        this.target = CENTER;
        this.distance = distance;
        this.height = height;
        this.origin = CENTER;
        this.angle = angle;
        this.speed = speed;
        this.faded = false;

        this.cloud.setOpacity(DEFAULT_OPACITY);
        this.cloud.setScale(scale);
        this.cloud.setColor(0xf5f6fa);
    }

    turnDark() {
        this.cloud.setColor(0x2d3436);
    }

    turnWhite() {
        this.cloud.setColor(0xf5f6fa);
    }

    disappear() {
        this.fading = true;
        this.cloud
            .fadeTo(0, FADING_TIME)
            .then(() => {
                this.faded = true;
                this.fading = false;
            })
    }

    appear() {
        this.fading = true;
        this.cloud
            .fadeTo(DEFAULT_OPACITY, FADING_TIME)
            .then(() => {
                this.faded = false;
                this.fading = false;
            });
    }

    update(dt) {
        this.angle += this.speed * dt;

        this.cloud.setPosition({
            x: (Math.sin(this.angle) * this.distance) + this.origin.x,
            y: this.height,
            z: (Math.cos(this.angle) * this.distance) + this.origin.z
        });

        const cameraDistance = this.cloud.getPosition().distanceTo(Scene.getCamera().getPosition());
        const shouldAppear = cameraDistance > FADING_DISTANCE && !this.fading && this.faded;
        const shouldDisappear = cameraDistance < FADING_DISTANCE && !this.fading && !this.faded;

        if (shouldDisappear) {
            this.disappear();
        } else if (shouldAppear) {
            this.appear();
        }
    }

}