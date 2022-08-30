
import { math } from 'mage-engine';
import TileMap from '../../map/TileMap';
import { HUMAN_TILES, TILES_TYPES, TILES_VARIATIONS_TYPES } from '../../map/constants';
import Player from '../Player';

const MAX_BUILDERS = 2;
const HUMAN_EXPANSION_INTERVAL = 7000;
const ENEMY_PROXIMITY = 6;

class Humans extends Player {

    constructor() {
        super("human");
    }

    start(initialPosition) {
        super.start(initialPosition);

        const initialTile = TileMap.changeTile(initialPosition, TILES_TYPES.HUMAN, {
            variation: TILES_VARIATIONS_TYPES.BASE,
            startingTile: true
        });

        this.saveTile(initialTile);
        // this.expansionIntervalId = setInterval(this.expand, HUMAN_EXPANSION_INTERVAL);
    }

    getUnitScriptName = () => 'HumanBehaviour';

    hasTooManyBuildersOnMap = () => Object.keys(this.builders).length >= MAX_BUILDERS;

    isValidTile = tile => !tile.isBuilding() && !tile.isType(TILES_TYPES.HUMAN) && !tile.isObstacle();

    stopExpansion() {
        clearInterval(this.expansionIntervalId);
    }

    isTileCloseToEnemy = (tile) => (
        tile
            .getPosition()
            .distanceTo(TileMap.getTileAt(this.getEnemyPlayer().initialPosition).getPosition()) < ENEMY_PROXIMITY
    )

    expand = async () => {
        if (this.hasTooManyBuildersOnMap()) return;

        if (this.isGameOver()) {
            this.stopExpansion();
            // handle game over
            return;
        }

        const nextTile = math.pickRandom(
            TileMap
                .getTilesByType(TILES_TYPES.HUMAN)
                .map(tile => (
                    TileMap
                        .getAdjacentTiles(tile.getIndex())
                        .filter(this.isValidTile)
                ))
                .filter(adjacents => adjacents.length)
                .sort(list => list.length)
                // .sort(tile => (
                //     tile
                //         .getPosition()
                //         .distanceTo(TileMap.getTileAt(this.getEnemyPlayer().initialPosition).getPosition()))
                // )
                .pop()
        );

        if (nextTile) {
            if (this.isUnderAttack() || this.isTileCloseToEnemy(nextTile)) {
                // tries to send warriors somewhere
                if (this.getWarriorsTiles().length && this.canSendWarrior()) { 
                    const warriorTile = math.pickRandom(this.getWarriorsTiles());
                    this.sendWarriorToTile(nextTile.getIndex(), warriorTile.getIndex());
                } else {
                    if (this.canBuildVariation(TILES_VARIATIONS_TYPES.TOWER)) {
                        this.buildTower(nextTile.getIndex());
                        return;
                    } else if (this.canBuildVariation(TILES_VARIATIONS_TYPES.WARRIORS)) {
                        this.buildWarriorsHut(nextTile.getIndex());
                        return;
                    }
                }

            } else {
                if (this.canBuildVariation(TILES_VARIATIONS_TYPES.TOWER)) {
                    this.buildTower(nextTile.getIndex());
                    return;
                } else if (this.canBuildVariation(TILES_VARIATIONS_TYPES.WARRIORS)) {
                    this.buildWarriorsHut(nextTile.getIndex());
                    return;
                } else if (this.canBuildVariation(TILES_VARIATIONS_TYPES.BUILDERS)) {
                    this.buildBuildersHut(nextTile.getIndex());
                    return;
                }
            }
            this.buildBaseTile(nextTile.getIndex())
        }
    }

}

export default new Humans();