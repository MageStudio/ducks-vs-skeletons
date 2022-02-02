const SelectionWidget = ({ selection }) => {
    return (
        <div className='row'>
            <div class='selection widget'>
                <div class='box'>
                    { selection }
                </div>

                <ul class='selection-list'>
                    <li class='item'></li>
                    <li class='item'></li>
                    <li class='item'></li>
                    <li class='item'></li>
                </ul>

            </div>
        </div>
    )
};

export default SelectionWidget;