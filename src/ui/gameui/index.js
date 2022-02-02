import Controls from "./controls";
import EnergyMeter from "./controls/EnergyMeter";
import Map from "./Map";
import TileControlBar from "./TileControlBar";

const Game = ({ tileStats, energy, selection }) => (
    <>
        <TileControlBar tileStats={tileStats}/>
        <Controls
            energy={energy}
            selection={selection}/>
        <Map/>
    </>
);

export default Game;