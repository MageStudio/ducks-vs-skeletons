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
        <div className='tile-control-bar-container widget'>
            <div className='tile-control-bar'>
                <div className='human tile-control-bar-item' style={getStyleString(human)}/>
                <div className='desert tile-control-bar-item' style={getStyleString(desert)}/>
                <div className='nature tile-control-bar-item' style={getStyleString(nature)}/>
            </div>
        </div>
    );
}

export default TileControlBar;