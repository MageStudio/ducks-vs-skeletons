const TileControlBar = ({ tileStats = {} }) => {
    const {
        nature,
        human,
        desert,
        total
    } = tileStats;

    const getRatio = value => value * 100 / total;
    const getStyleString = value => `width: ${getRatio(value)}%;`;

    return (
        <div className='tile-control-bar-container bar-container widget'>
            <div className='bar'>
                <div className='human bar-section' style={getStyleString(human)}/>
                <div className='desert bar-section' style={getStyleString(desert)}/>
                <div className='nature bar-section' style={getStyleString(nature)}/>
            </div>
        </div>
    );
}

export default TileControlBar;