import EnergyMeter from "./EnergyMeter"
import SelectionWidget from "./SelectionWidget";

const Controls = ({ energy, selection, option, onOptionClick }) => {
    return (
        <div className='controls-container'>
            <SelectionWidget
                option={option}
                selection={selection}
                onOptionClick={onOptionClick}/>
            <EnergyMeter energy={energy} />
        </div>
    )
};

export default Controls;