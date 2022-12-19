import { Component } from 'inferno';
import { connect, GameRunner } from 'mage-engine';
import Nature from '../levels/Main/players/nature';
import { getClickSound, playClickSound, VOLUMES } from '../sounds';
import { startDialogue, stopDialogue } from './actions/dialogue';
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
        this.onStartClick = this.onStartClick.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.loadingScreenVisible && !this.props.loadingScreenVisible) {
            setTimeout(() => {
                this.setState({
                    fading: true
                })
            },  5000);

            setTimeout(() => {
                this.setState({ fading: false, loading: false })
            }, 7500);
        }
    }

    onClick(option) {
        const { onOptionClick } = this.props;
        getClickSound().play(VOLUMES.CLICK);
        Nature.showAllowedTilesForOption(option);
        onOptionClick(option);
    };

    onStartClick() {
        const { onStartClick } = this.props;
        onStartClick();
    }

    render() {
        const { energy, selection, option, units, game, onStopDialogue, dialogue } = this.props;
        const { loading, fading } = this.state;
        return (
            <>
                { loading && <LoadingScreen fading={fading}/> }
                <Game
                    dialogue={dialogue}
                    game={game}
                    onStopDialogue={onStopDialogue}
                    onStartClick={this.onStartClick}
                    option={option}
                    energy={energy}
                    selection={selection}
                    units={units}
                    onOptionClick={this.onClick}/>
            </>
        );
    }
}


const mapStateToProps = ({ ui, game, player, dialogue }) => ({
    loadingScreenVisible: ui.loadingScreenVisible,
    ...player,
    game,
    dialogue
});

const mapDispatchToProps = dispatch => ({
    onOptionClick: option => dispatch(changeSelectionOption(option)),
    onStartClick: () => dispatch(startDialogue('initial')),
    onStopDialogue: (id) => dispatch(stopDialogue(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Root);