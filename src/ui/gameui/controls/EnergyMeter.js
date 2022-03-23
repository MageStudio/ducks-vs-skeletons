import { math } from 'mage-engine';

const getClassnameFromEnergyLevel = (energy) => {
    return math.isWithin(energy, 0, 20) ?
        'low' :
        (math.isWithin(energy, 20, 50) ?
            'average' :
            'ok'
        );
}

const maxHeight = 200;
const getStyleFromEnergyLevel = energy => {
    const height = math.clamp(maxHeight * (energy / 100), 40, maxHeight);
    return `height: ${height}px; margin-top:${maxHeight - height}px;`;
}

const EnergyMeter = ({ energy = 0 }) => {
    return (
        <div class='energy'>
            <span class={`energy-level ${getClassnameFromEnergyLevel(energy)}`} style={getStyleFromEnergyLevel(energy)}></span>
            <span class="material-icons energy-icon">bolt</span>
        </div>
    );
}

export default EnergyMeter;