import { math, PALETTES } from 'mage-engine';

const getClassnameFromEnergyLevel = (energy) => {
    return math.isWithin(energy, 0, 20) ?
        'low' :
        (math.isWithin(energy, 20, 50) ?
            'average' :
            'ok'
        );
} 

const EnergyMeter = ({ energy = 0 }) => {
    return (
        <div className='EnergyMeter bar-container widget'>
            <span class="material-icons icon">bolt</span>
            <div class='bar'>
                <div class={`bar-loader ${getClassnameFromEnergyLevel(energy)}`}  style={`width: ${energy}%;`}></div>
                <span class='value'>{Math.floor(energy)}%</span>
            </div>
        </div>
    );
}

export default EnergyMeter;