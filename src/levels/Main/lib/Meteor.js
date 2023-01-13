import { BaseScript, GameRunner, PARTICLES, Particles, THREE } from "mage-engine";
import { types } from "@theatre/core";
import { getFireSound, getMeteorImpactSound, getMeteorSound, VOLUMES } from "../../../sounds";
import CustomExplosion from "./CustomExplosion";
import { playSkeletonAwakeSequence } from "./initialDialogueSequences";

const FIRE_OPTIONS = {
    texture: "fire",
    size: 0.5,
    strength: 1.5,
    direction: new THREE.Vector3(0, 1, 0),
};

const EXPLOSION_OPTIONS = {
    texture: "fire",
    // hasDebris: true,
    size: 0.6,
    life: 15,
};

export class Meteor extends BaseScript {
    start(meteor, { project, cameraContainer, landing }) {
        this.meteor = meteor;
        this.sheet = project.sheet("Intro", "meteor");
        this.cameraContainer = cameraContainer;
        this.landing = landing;

        this.meteor.setScale({ x: 0.01, y: 0.01, z: 0.01 });

        this.sheet
            .object("meteor", {
                rotation: types.compound({
                    x: types.number(this.meteor.getRotation().x, { range: [-Math.PI, Math.PI] }),
                    y: types.number(this.meteor.getRotation().y, { range: [-Math.PI, Math.PI] }),
                    z: types.number(this.meteor.getRotation().z, { range: [-Math.PI, Math.PI] }),
                }),
                position: types.compound({
                    x: types.number(this.meteor.getPosition().x, { range: [-100, 100] }),
                    y: types.number(this.meteor.getPosition().y, { range: [-100, 100] }),
                    z: types.number(this.meteor.getPosition().z, { range: [-100, 100] }),
                }),
            })
            .onValuesChange(values => {
                const { x, y, z } = values.rotation;

                this.meteor.setPosition(values.position);
                this.meteor.setRotation({ x: x * Math.PI, y: y * Math.PI, z: z * Math.PI });
            });
    }

    playMeteorSound() {
        const meteorSound = getMeteorSound();
        this.meteor.add(meteorSound);
        meteorSound.play(VOLUMES.METEOR.TRAVEL);
        return meteorSound;
    }

    playMeteorImpact() {
        const meteorImpact = getMeteorImpactSound();
        this.meteor.add(meteorImpact);
        meteorImpact.play(VOLUMES.METEOR.IMPACT);
    }

    playExplosion() {
        const explosion = Particles.add(new CustomExplosion(EXPLOSION_OPTIONS));
        this.meteor.add(explosion);

        explosion.emit("once");
    }

    playAudioSequence() {
        return new Promise(resolve => {
            const sound = this.playMeteorSound();
            const timeout = sound.duration - 400;

            setTimeout(() => {
                this.playMeteorImpact();
                this.playExplosion();
                resolve(timeout);
            }, timeout);
        });
    }

    addFire() {
        const fire = Particles.add(PARTICLES.FIRE, FIRE_OPTIONS);
        const fireSound = getFireSound();

        fire.emit(Infinity);
        fireSound.play(VOLUMES.FIRE);

        this.meteor.add(fire);
        this.meteor.add(fireSound);

        return fireSound;
    }

    startSkeletonAWakeSequence() {
        playSkeletonAwakeSequence();
        // GameRunner.getCurrentLevel().playSkeletonAwakeSequence();
    }

    playSequence(after = 1000) {
        return new Promise(resolve => {
            setTimeout(() => {
                this.cameraContainer.getScript("CameraContainer").focusOnTarget(this.meteor);
                resolve();
                const fireSound = this.addFire();
                this.playAudioSequence().then(() => {
                    this.startSkeletonAWakeSequence();
                    fireSound.stop();
                    this.meteor.fadeTo(0, 250);
                    setTimeout(() => this.meteor.dispose(), 3000);
                });
                this.sheet.sequence.play({ iterationCount: 1 });
            }, after);
        });
    }
}
