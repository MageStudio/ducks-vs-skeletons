import Controls from "./controls";
import EnergyMeter from "./controls/EnergyMeter";
import Map from "./Map";
import TileControlBar from "./TileControlBar";

const Game = ({ tileStats, energy }) => (
    <>
        <TileControlBar tileStats={tileStats}/>
        <Controls energy={energy} />
        <Map/>
    </>
);

export default Game;