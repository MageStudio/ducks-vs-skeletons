const EnergyMeter = ({ energy = 52 }) => {
    return (
        <div className='EnergyMeter bar-container widget'>
            <span class="material-icons icon">bolt</span>
            <div class='bar'>
                <div class='bar-loader' style={`width: ${energy}%;`}></div>
                <span class='value'>{energy}%</span>
            </div>

            <ul class='marker-list'>
                <li class='marker'/>
                <li class='marker'/>
                <li class='marker'/>
                <li class='marker'/>
                <li class='marker'/>
                <li class='marker'/>
                <li class='marker'/>
                <li class='marker'/>
                <li class='marker'/>
                <li class='marker'/>
            </ul>
        </div>
    );
}

export default EnergyMeter;