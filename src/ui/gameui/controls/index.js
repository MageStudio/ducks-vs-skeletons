import EnergyMeter from "./EnergyMeter"
import SelectionWidget from "./SelectionWidget";

const Controls = ({ energy }) => {
    return (
        <div className='controls-container'>
            <EnergyMeter energy={energy} />
            <SelectionWidget />
        </div>
    )
};

export default Controls;