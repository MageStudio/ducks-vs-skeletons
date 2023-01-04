import { Component } from "inferno";
import { connect } from "mage-engine";
import { GameState, GAME_ACTIONS } from "../GameState";
import Nature from "../levels/Main/players/nature";
import { getClickSound, VOLUMES } from "../sounds";
import { changeSelectionOption } from "./actions/player";
import Game from "./gameui";
import LoadingScreen from "./LoadingScreen";

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
                    fading: true,
                });
            }, 5000);

            setTimeout(() => {
                this.setState({ fading: false, loading: false });
            }, 7500);
        }
    }

    onClick(option) {
        const { onOptionClick } = this.props;
        getClickSound().play(VOLUMES.CLICK);
        Nature.showAllowedTilesForOption(option);
        onOptionClick(option);
    }

    onStartClick() {
        GameState.send(GAME_ACTIONS.START);
    }

    render() {
        const { energy, selection, option, units, game, dialogue, menu } = this.props;
        const { loading, fading } = this.state;
        return (
            <>
                {loading && <LoadingScreen fading={fading} />}
                <Game
                    menu={menu}
                    dialogue={dialogue}
                    game={game}
                    option={option}
                    energy={energy}
                    selection={selection}
                    units={units}
                    onOptionClick={this.onClick}
                />
            </>
        );
    }
}

const mapStateToProps = ({ ui, game, player, dialogue, menu }) => ({
    loadingScreenVisible: ui.loadingScreenVisible,
    ...player,
    game,
    dialogue,
    menu,
});

const mapDispatchToProps = dispatch => ({
    onOptionClick: option => dispatch(changeSelectionOption(option)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Root);
