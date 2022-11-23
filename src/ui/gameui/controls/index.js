import EnergyMeter from "./EnergyMeter"
import SelectionWidget from "./SelectionWidget";
import UnitCount from './UnitCount';

const Controls = ({ energy, selection, option, units, onOptionClick }) => {
    console.log('controls', units);
    return (
        <div className='controls'>
            <SelectionWidget
                option={option}
                selection={selection}
                onOptionClick={onOptionClick}/>
            <EnergyMeter energy={energy} />
            <div className="count-column">
                <UnitCount count={units.builders} type='builders' />
                <UnitCount count={units.warriors} type='warriors' />
            </div>
        </div>
    )
};

export default Controls;