import { connect } from 'mage-engine';
import Game from './gameui';
import LoadingScreen from './LoadingScreen';

const Root = ({ loadingScreenVisible, tileStats, energy }) => (
    loadingScreenVisible ?
        <LoadingScreen/> :
        <Game
            tileStats={tileStats}
            energy={energy}/>
);

const mapStateToProps = ({ ui, game, player }) => ({
    loadingScreenVisible: ui.loadingScreenVisible,
    ...game,
    ...player
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Root);