import { ACTIONS } from "./DialogueStateMachine";
import { Component } from "inferno";

// TODO: this component needs to either leave space on the left, or on the right depending on who's talking
class Dialogue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        }
    }

    componentDidMount() {
        const { dialogue } = this.props;

        dialogue.subject.subscribe(text => this.setState({ text }));
        dialogue.stateMachine.start();
    }

    render() {
        const { text } = this.state;
        if (!text) return null;

        return (
            <div key={text} class='dialog-container'>
                <div class='dialog-box'>
                    <div className='dialog-text-row'>
                        <span class='text ducks' style={`--n:${text.length}`}>{ text }</span>
                    </div>
                    <div className='dialog-footer'>
                        <div className='btn' onClick={() => this.props.dialogue.stateMachine.send(ACTIONS.NEXT)}>next</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dialogue;