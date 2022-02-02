import EnergyMeter from "./EnergyMeter"
import SelectionWidget from "./SelectionWidget";

const Controls = ({ energy, selection, onOptionClick }) => {
    return (
        <div className='controls-container'>
            <EnergyMeter energy={energy} />
            <SelectionWidget
                selection={selection}
                onOptionClick={onOptionClick}/>
        </div>
    )
};

export default Controls;