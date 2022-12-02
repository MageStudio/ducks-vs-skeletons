import Dialogue from "../dialogue/Dialogue";
import { initialDialogue } from "../dialogue/DialogueStateMachine";
import MainMenu from "../mainmenu";
import Controls from "./controls";

const Game = ({ started, option, energy, selection, units, onOptionClick, onStartClick }) => (
    <>
        { !started && <MainMenu onStartClick={onStartClick}/> }
        { started && <Dialogue dialogue={initialDialogue} />}
        {/* { started && <Controls
            option={option}
            energy={energy}
            selection={selection}
            units={units}
            onOptionClick={onOptionClick}/>
        } */}
    </>
);

export default Game;