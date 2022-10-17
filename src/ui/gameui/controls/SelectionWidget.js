import {
    FOREST_OPTIONS,
    TILES_VARIATIONS_TYPES
} from "../../../levels/Main/map/constants";
import { UNIT_TYPES } from "../../../levels/Main/players/UnitBehaviour";

const LABELS_MAP = {
    [FOREST_OPTIONS.BASE_TILE]: 'forest',
    [FOREST_OPTIONS.BUILDERS_HUT_TILE]: 'builders',
    [FOREST_OPTIONS.WARRIORS_HUT_TILE]: 'warriors',
    [FOREST_OPTIONS.TOWER_TILE]: 'tower'
};

const getSingleItem = (optionName, option, onClick) => (
    <div
        class={`option ${option === optionName ? 'selected' : ''}`}
        onClick={() => onClick(optionName)} >
            { mapSelectionTypeToImage(optionName) }
            <span className="label">{LABELS_MAP[optionName]}</span>
    </div>
);

const mapSelectionTypeToOptions = (selectionType, option, onClick) => ({
    [TILES_VARIATIONS_TYPES.BASE]: [
        getSingleItem(FOREST_OPTIONS.BASE_TILE, option, onClick),
        getSingleItem(FOREST_OPTIONS.BUILDERS_HUT_TILE, option, onClick),
        getSingleItem(FOREST_OPTIONS.WARRIORS_HUT_TILE, option, onClick),
        getSingleItem(FOREST_OPTIONS.TOWER_TILE, option, onClick),
    ],
    [TILES_VARIATIONS_TYPES.BUILDERS]: [
        getSingleItem(FOREST_OPTIONS.BASE_TILE, option, onClick),
        getSingleItem(FOREST_OPTIONS.BUILDERS_HUT_TILE, option, onClick),
        getSingleItem(FOREST_OPTIONS.WARRIORS_HUT_TILE, option, onClick),
        getSingleItem(FOREST_OPTIONS.TOWER_TILE, option, onClick),
    ],
    [TILES_VARIATIONS_TYPES.TOWER]: [

    ],
    [TILES_VARIATIONS_TYPES.WARRIORS]: [
        getSingleItem(FOREST_OPTIONS.ATTACK, option, onClick),
    ],
    [UNIT_TYPES.WARRIOR]: [
        getSingleItem(FOREST_OPTIONS.ATTACK, option, onClick),
    ]
}[selectionType])

const mapSelectionTypeToImage = (selectionType) => ({
    [FOREST_OPTIONS.BASE_TILE]: <img src='/img/forest.png' />,
    [FOREST_OPTIONS.BUILDERS_HUT_TILE]: <img src='/img/builders.png' />,
    [FOREST_OPTIONS.TOWER_TILE]: <img src='/img/tower.png' />,
    [FOREST_OPTIONS.WARRIORS_HUT_TILE]: <img src='/img/warriors.png' />
}[selectionType])

const SelectionWidget = ({ selection: { type }, option, onOptionClick }) => (
        <div class='widget'>
            <h1 class='title'>{ type }</h1>
            <div class='content'>
                { mapSelectionTypeToOptions(type, option, onOptionClick) }
            </div>
        </div>
);

// {/* <div class='selection widget'>
//             <div class='box'>
//                 { mapSelectionTypeToImage(type) }
//             </div>
//             <ul class='selection-list'>
//                 { mapSelectionTypeToOptions(type, option, onOptionClick)}
//             </ul>

//         </div> */}

export default SelectionWidget;