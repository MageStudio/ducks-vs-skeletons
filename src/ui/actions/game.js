import { GAME_STARTED, TILE_MAP_STATS_CHANGE } from "./types";

export const updateTileMapStats = () => ({
    type: TILE_MAP_STATS_CHANGE
});

export const gameStarted = () => ({
    type: GAME_STARTED
})