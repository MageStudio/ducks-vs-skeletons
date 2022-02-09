import { connect } from 'mage-engine';
import { changeSelectionOption } from './actions/player';
import Game from './gameui';
import LoadingScreen from './LoadingScreen';

const Root = ({ loadingScreenVisible, tileStats, energy, selection, option, onOptionClick }) => (
    loadingScreenVisible ?
        <LoadingScreen/> :
        <Game
            option={option}
            tileStats={tileStats}
            energy={energy}
            selection={selection}
            onOptionClick={onOptionClick}/>
);

const mapStateToProps = ({ ui, game, player }) => ({
    loadingScreenVisible: ui.loadingScreenVisible,
    ...game,
    ...player
});

const mapDispatchToProps = dispatch => ({
    onOptionClick: option => dispatch(changeSelectionOption(option))
});

export default connect(mapStateToProps, mapDispatchToProps)(Root);