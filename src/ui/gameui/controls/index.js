import EnergyMeter from "./EnergyMeter"

const Controls = ({ energy }) => {
    return (
        <div className='controls-container'>
            <EnergyMeter energy={energy} />
            <div className='row'>
                <div class='map widget'></div>

                <div class='selection widget'>
                    <div class='box'>
                        here goes the image of the selected building
                    </div>

                    <ul class='selection-list'>
                        <li class='item'></li>
                        <li class='item'></li>
                        <li class='item'></li>
                        <li class='item'></li>
                    </ul>

                </div>
            </div>
        </div>
    )
};

export default Controls;