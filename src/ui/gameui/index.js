import Dialogue from "../dialogue/Dialogue";
import { initialDialogue } from "../dialogue/DialogueStateMachine";
import MainMenu from "../mainmenu";
import Controls from "./controls";

const Game = ({ game, option, energy, selection, units, onOptionClick, onStartClick, dialogue, onStopDialogue }) => {
    const shouldShowDialogue = dialogue.started;
    const shouldShowMainMenu = !dialogue.started && !game.started;
    const shouldShowControls = !dialogue.started && game.started;

    return (
        <>
            { shouldShowMainMenu && <MainMenu onStartClick={onStartClick}/> }
            { shouldShowDialogue && <Dialogue dialogue={initialDialogue} id={dialogue.id} onStopDialogue={onStopDialogue}/>}
            { shouldShowControls && <Controls
                option={option}
                energy={energy}
                selection={selection}
                units={units}
                onOptionClick={onOptionClick}/>
            }
        </>
    )
}
export default Game;