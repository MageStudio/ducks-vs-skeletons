import TileMap from '../../levels/Main/map/TileMap';
import { TILE_MAP_STATS_CHANGE } from '../actions/types';

const DEFAULT_STATE = {
    tileStats: {
        nature: 0,
        human: 0,
        desert: 0,
        total: 100
    }
};

export default (state = DEFAULT_STATE, action) => {
    switch(action.type) {
        case TILE_MAP_STATS_CHANGE: {
            const tileStats = TileMap.getStats();
    
            return {
                ...state,
                tileStats
            }
        }
        default:
            return state;
    }
}