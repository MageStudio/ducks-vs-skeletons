import { SHOW_MAIN_MENU, HIDE_MAIN_MENU } from "./types";

export const showMainMenu = () => ({
    type: SHOW_MAIN_MENU,
});

export const hideMainMenu = () => ({
    type: HIDE_MAIN_MENU,
});
