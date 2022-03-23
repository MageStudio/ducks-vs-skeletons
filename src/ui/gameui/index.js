import Controls from "./controls";

const Game = ({ option, energy, selection, onOptionClick }) => (
    <>
        <Controls
            option={option}
            energy={energy}
            selection={selection}
            onOptionClick={onOptionClick}/>
    </>
);

export default Game;