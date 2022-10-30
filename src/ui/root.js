import { Component } from 'inferno';
import { connect } from 'mage-engine';
import Nature from '../levels/Main/players/nature';
import { getClickSound, playClickSound, VOLUMES } from '../sounds';
import { changeSelectionOption } from './actions/player';
import Game from './gameui';
import LoadingScreen from './LoadingScreen';

class Root extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fading: false,
            loading: props.loadingScreenVisible,
        };

        this.onClick = this.onClick.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.loadingScreenVisible && !this.props.loadingScreenVisible) {
            setTimeout(() => {
                this.setState({
                    fading: true
                })
            },  10000);

            setTimeout(() => {
                this.setState({ fading: false, loading: false })
            }, 11200);
        }
    }

    onClick(option) {
        const { onOptionClick } = this.props;
        getClickSound().play(VOLUMES.CLICK);
        Nature.showAllowedTilesForOption(option);
        onOptionClick(option);
    };

    render() {
        const { tileStats, energy, selection, option, units } = this.props;
        const { loading, fading } = this.state;
        return (
            <>
                { loading && <LoadingScreen fading={fading}/> }
                <Game
                    option={option}
                    tileStats={tileStats}
                    energy={energy}
                    selection={selection}
                    units={units}
                    onOptionClick={this.onClick}/>
            </>
        );
    }
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