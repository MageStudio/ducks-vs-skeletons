import { ACTIONS } from "./DialogueStateMachine";
import { Component } from "inferno";
import { DIALOGUE_ACTIONS_TYPES } from "./text";

// TODO: dialog-box classname needs to change to either ducks or skleleton depending on who's talking
class Dialogue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            actions: []
        }
    }

    componentDidMount() {
        const { dialogue } = this.props;

        dialogue.subject.subscribe(({ text, actions } = {}) => this.setState({ text, actions }));
        dialogue.stateMachine.start();
    }

    render() {
        const { text, actions } = this.state;
        const { dialogue, id } = this.props;

        if (!text) return null;

        const onConfirm = () => {
            dialogue.stateMachine.send(ACTIONS.NEXT);
            this.props.onStopDialogue(id);
        }
        const onNext = () => dialogue.stateMachine.send(ACTIONS.NEXT);

        const mapActionsToBtn = ({ type, text }) => {
            const action = ({
                [DIALOGUE_ACTIONS_TYPES.CONFIRM]: onConfirm,
                [DIALOGUE_ACTIONS_TYPES.NEXT]: onNext
            })[type] || onNext;

            return (
                <div className={`btn ${type}`} onClick={action}>{text}</div>
            )
        }

        return (
            <div key={text} class='dialog-container'>
                <div class='dialog-box ducks'>
                    <div className='dialog-text-row'>
                        <span class='text ducks' style={`--n:${text.length}`}>{ text }</span>
                    </div>
                    <div className='dialog-footer'>
                        { actions.map(mapActionsToBtn) }
                    </div>
                </div>
            </div>
        );
    }
}

export default Dialogue;