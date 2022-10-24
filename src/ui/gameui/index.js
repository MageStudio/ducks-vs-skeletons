import Controls from "./controls";

const Game = ({ option, energy, selection, units, onOptionClick }) => (
    <>
        <Controls
            option={option}
            energy={energy}
            selection={selection}
            units={units}
            onOptionClick={onOptionClick}/>
    </>
);

export default Game;