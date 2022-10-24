import { connect } from 'mage-engine';
import Nature from '../levels/Main/players/nature';
import { getClickSound, playClickSound, VOLUMES } from '../sounds';
import { changeSelectionOption } from './actions/player';
import Game from './gameui';
import LoadingScreen from './LoadingScreen';

const Root = ({ loadingScreenVisible, tileStats, energy, selection, option, units, onOptionClick }) => {

    console.log(units);
    const onClick = (option) => {
        getClickSound().play(VOLUMES.CLICK);
        Nature.showAllowedTilesForOption(option);
        onOptionClick(option);
    };

    return(
        loadingScreenVisible ?
            <LoadingScreen/> :
            <Game
                option={option}
                tileStats={tileStats}
                energy={energy}
                selection={selection}
                units={units}
                onOptionClick={onClick}/>
    );
}


const mapStateToProps = ({ ui, game, player }) => ({
    loadingScreenVisible: ui.loadingScreenVisible,
    ...game,
    ...player
});

const mapDispatchToProps = dispatch => ({
    onOptionClick: option => dispatch(changeSelectionOption(option))
});

export default connect(mapStateToProps, mapDispatchToProps)(Root);