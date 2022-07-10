import { LabelComponent } from "mage-engine";

export default class WarriorLabel extends LabelComponent {

    constructor(props) {
        super(props);
        this.state = { ammo: [1,2,3] };
    }

    componentDidMount() {
        super.componentDidMount();
        const { unit, script } = this.props;
        unit
            .getScript(script)
            .ammo
            .subscribe((ammo) => {
                console.log('setting state here', ammo);
                this.setState({ ammo: Array(ammo).fill(1) })
            });
    }

    render() {
        const elements =  this.state.ammo.map(() => <li className="ammo"></li>);
        console.log(elements)
        return (
            <div
                className='warriorlabel'
                ref={this.element}>
                <ul>
                    { elements }
                </ul>
            </div>
        )
    }
}