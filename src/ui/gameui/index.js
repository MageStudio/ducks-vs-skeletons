import Controls from "./controls";
import EnergyMeter from "./controls/EnergyMeter";
import TileControlBar from "./TileControlBar";

const Game = ({ tileStats, energy }) => (
    <>
        <TileControlBar tileStats={tileStats}/>
        <Controls energy={energy} />
        {/* <EnergyMeter energy={energy} /> */}
    </>
);

export default Game;