import EnergyMeter from "./EnergyMeter"
import SelectionWidget from "./SelectionWidget";

const Controls = ({ energy, selection, option, onOptionClick }) => {
    return (
        <div className='controls-container'>
            <EnergyMeter energy={energy} />
            <SelectionWidget
                option={option}
                selection={selection}
                onOptionClick={onOptionClick}/>
        </div>
    )
};

export default Controls;