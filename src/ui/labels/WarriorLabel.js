import { LabelComponent } from "mage-engine";

export default class WarriorLabel extends LabelComponent {

    constructor(props) {
        super(props);
        this.state = { ammo: 0 };
    }

    componentDidMount() {
        super.componentDidMount();
        const { unit, script } = this.props;
        unit
            .getScript(script)
            .ammo
            .subscribe((ammo) => {
                console.log('setting state here', ammo);
                this.setState({ ammo })
            });
    }

    render() {
        return (
            <div ref={this.element} class='ammo'>
                <h4>AMMO left</h4>
                <span>{ this.state.ammo }</span>
            </div>
        )
    }
}