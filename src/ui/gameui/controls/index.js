import EnergyMeter from "./EnergyMeter"
import SelectionWidget from "./SelectionWidget";

const Controls = ({ energy, selection }) => {
    return (
        <div className='controls-container'>
            <EnergyMeter energy={energy} />
            <SelectionWidget selection={selection} />
        </div>
    )
};

export default Controls;