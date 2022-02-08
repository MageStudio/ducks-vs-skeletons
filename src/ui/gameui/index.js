import Controls from "./controls";
import EnergyMeter from "./controls/EnergyMeter";
import Map from "./Map";
import TileControlBar from "./TileControlBar";

const Game = ({ option, energy, selection, onOptionClick }) => (
    <>
        {/* <TileControlBar tileStats={tileStats}/> */}
        <Controls
            option={option}
            energy={energy}
            selection={selection}
            onOptionClick={onOptionClick}/>
        <Map/>
    </>
);

export default Game;