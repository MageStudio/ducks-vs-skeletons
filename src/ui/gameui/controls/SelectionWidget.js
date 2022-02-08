import {
    TILES_TYPES,
    FOREST_TILES,
    FOREST_OPTIONS
} from "../../../levels/test/map/constants";

const IMAGES_MAP = {
    [FOREST_OPTIONS.BASE_TILE]: '/img/forestBase.png',
    [FOREST_OPTIONS.BUILDERS_HUT_TILE]: '/img/forestBuildersHut.png',
    [FOREST_OPTIONS.WARRIORS_HUT_TILE]: '/img/forestWarriorsHut.png',
    [FOREST_OPTIONS.TOWER_TILE]: '/img/forestTower.png'
};

const LABELS_MAP = {
    [FOREST_OPTIONS.BASE_TILE]: 'forest',
    [FOREST_OPTIONS.BUILDERS_HUT_TILE]: 'builders',
    [FOREST_OPTIONS.WARRIORS_HUT_TILE]: 'warriors',
    [FOREST_OPTIONS.TOWER_TILE]: 'tower'
};

const getSingleItem = (optionName, option, onClick) => (
    <li class={`item ${option === optionName ? 'selected' : ''}`}  onClick={() => onClick(optionName)} >
        <img src={IMAGES_MAP[optionName]} />
        <span className="label">{LABELS_MAP[optionName]}</span>
    </li>
);

const mapSelectionTypeToOptions = (selectionType, option, onClick) => ({
    [TILES_TYPES.FOREST]: [
        getSingleItem(FOREST_OPTIONS.BASE_TILE, option, onClick),
        getSingleItem(FOREST_OPTIONS.BUILDERS_HUT_TILE, option, onClick),
        getSingleItem(FOREST_OPTIONS.WARRIORS_HUT_TILE, option, onClick),
        getSingleItem(FOREST_OPTIONS.TOWER_TILE, option, onClick),
    ],
    [FOREST_TILES.FOREST_BUILDERS_HUT]: [
        getSingleItem(FOREST_OPTIONS.BASE_TILE, option, onClick),
        getSingleItem(FOREST_OPTIONS.BUILDERS_HUT_TILE, option, onClick),
        getSingleItem(FOREST_OPTIONS.WARRIORS_HUT_TILE, option, onClick),
        getSingleItem(FOREST_OPTIONS.TOWER_TILE, option, onClick),
    ],
    [FOREST_TILES.FOREST_TOWER]: [

    ],
    [FOREST_TILES.FOREST_WARRIORS_HUT]: [
        getSingleItem(FOREST_OPTIONS.ATTACK, option, onClick),,
    ]
}[selectionType])

const mapSelectionTypeToImage = (selectionType) => ({
    [TILES_TYPES.FOREST]: <img src='/img/forestBase.png' />,
    [FOREST_TILES.FOREST_BUILDERS_HUT]: <img src='/img/forestBuildersHut.png' />,
    [FOREST_TILES.FOREST_TOWER]: <img src='/img/forestTower.png' />,
    [FOREST_TILES.FOREST_WARRIORS_HUT]: <img src='/img/forestWarriorsHut.png' />
}[selectionType])

const SelectionWidget = ({ selection: { type }, option, onOptionClick }) => {
console.log(type, option);
return (
    <div className='row'>
        <div class='selection widget'>
            <div class='box'>
                { mapSelectionTypeToImage(type) }
            </div>
            <ul class='selection-list'>
                { mapSelectionTypeToOptions(type, option, onOptionClick)}
            </ul>

        </div>
    </div>
);
}
export default SelectionWidget;