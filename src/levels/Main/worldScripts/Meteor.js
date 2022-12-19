import { BaseScript } from "mage-engine";
import { types } from '@theatre/core';


export class Meteor extends BaseScript {

    start(meteor, { project }) {
        this.meteor = meteor;
        // this.meteor.setVisible(false);
        this.sheet = project.sheet('Intro', 'meteor');

        this.meteor.setScale({ x: 0.01, y:  0.01, z: 0.01 });

        this.sheet
            .object('meteor', {
                rotation: types.compound({
                    x: types.number(this.meteor.getRotation().x, { range: [-Math.PI, Math.PI] }),
                    y: types.number(this.meteor.getRotation().y, { range: [-Math.PI, Math.PI] }),
                    z: types.number(this.meteor.getRotation().z, { range: [-Math.PI, Math.PI] }),
                }),
                position: types.compound({
                    x: types.number(this.meteor.getPosition().x, { range: [-20, 20] }),
                    y: types.number(this.meteor.getPosition().y, { range: [-20, 20] }),
                    z: types.number(this.meteor.getPosition().z, { range: [-20, 20] }),
                }),
            })
            .onValuesChange(values => {
                const { x, y, z } = values.rotation;
                
                this.meteor.setPosition(values.position);
                this.meteor.setRotation({ x: x * Math.PI, y: y * Math.PI, z: z * Math.PI });
            })
    }

    playSequence(after = 1000) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(); // resolve when animation is about tos tart;
                this.sheet.sequence.play({ iterationCount: 1 }).then(() => {
                    // this.meteor.dispose();
                })
            }, after);
        })
        
    }
}