
const UnitCount = ({ count = 0, type }) => (
    <span className='unitcount'>
        <span class="material-icons material-symbols-outlined unit-count-icon">{ type === 'builders' ? 'handyman' : 'swords' }</span>
        { count }
    </span>
)

export default UnitCount;