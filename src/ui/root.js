import { connect } from 'mage-engine';
import Game from './gameui';
import LoadingScreen from './LoadingScreen';

const Root = ({ loadingScreenVisible, tileStats, energy, selection }) => (
    loadingScreenVisible ?
        <LoadingScreen/> :
        <Game
            tileStats={tileStats}
            energy={energy}
            selection={selection} />
);

const mapStateToProps = ({ ui, game, player }) => ({
    loadingScreenVisible: ui.loadingScreenVisible,
    ...game,
    ...player
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Root);