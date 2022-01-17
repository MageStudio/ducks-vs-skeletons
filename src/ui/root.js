import { connect } from 'mage-engine';
import Game from './gameui';
import LoadingScreen from './LoadingScreen';

const Root = ({ loadingScreenVisible, tileStats }) => {
    return (
        loadingScreenVisible ?
            <LoadingScreen /> :
            <Game tileStats={tileStats}/>
    );
}

const mapStateToProps = ({ ui, game }) => ({
    loadingScreenVisible: ui.loadingScreenVisible,
    ...game
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Root);