import Dialogue from "../dialogue/Dialogue";
import { initialDialogue } from "../dialogue/DialogueStateMachine";
import MainMenu from "../mainmenu";
import Controls from "./controls";

const Game = ({ game, option, energy, selection, units, onOptionClick, dialogue, menu }) => (
    <>
        {menu.visible && <MainMenu />}
        {dialogue.visible && <Dialogue dialogue={initialDialogue} id={dialogue.id} />}
        {game.started && (
            <Controls
                option={option}
                energy={energy}
                selection={selection}
                units={units}
                onOptionClick={onOptionClick}
            />
        )}
    </>
);
export default Game;
