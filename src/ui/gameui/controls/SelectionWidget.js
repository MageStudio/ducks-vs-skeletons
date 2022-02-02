import { store } from "mage-engine";
import { TILES_TYPES, FOREST_TILES, FOREST_OPTIONS } from "../../../levels/test/map/constants";
import { changeSelectionOption } from "../../actions/player";

const mapSelectionTypeToOptions = (selectionType, onClick) => ({
    [TILES_TYPES.FOREST]: [
        <li class='item' onClick={() => onClick(FOREST_OPTIONS.BASE_TILE)} >BASE</li>,
        <li class='item' onClick={() => onClick(FOREST_OPTIONS.BUILDERS_HUT_TILE)} >BUILDERS</li>,
        <li class='item' onClick={() => onClick(FOREST_OPTIONS.WARRIORS_HUT_TILE)}>WARRIORS</li>,
        <li class='item'onClick={() => onClick(FOREST_OPTIONS.TOWER_TILE)} >TOWER</li>,
    ],
    [FOREST_TILES.FOREST_BUILDERS_HUT]: [
        <li class='item' onClick={() => onClick(FOREST_OPTIONS.BASE_TILE)} >BASE</li>,
        <li class='item' onClick={() => onClick(FOREST_OPTIONS.BUILDERS_HUT_TILE)} >BUILDERS</li>,
        <li class='item' onClick={() => onClick(FOREST_OPTIONS.WARRIORS_HUT_TILE)}>WARRIORS</li>,
        <li class='item'onClick={() => onClick(FOREST_OPTIONS.TOWER_TILE)} >TOWER</li>,
    ],
    [FOREST_TILES.FOREST_TOWER]: [

    ],
    [FOREST_TILES.FOREST_WARRIORS_HUT]: [
        <li class='item' onClick={() => onClick(FOREST_OPTIONS.ATTACK)} >ATTACK</li>,
    ]
}[selectionType])

const SelectionWidget = ({ selection, onOptionClick }) => (
    <div className='row'>
        <div class='selection widget'>
            <div class='box'>
                { selection.type }
            </div>

            <ul class='selection-list'>
                { mapSelectionTypeToOptions(selection.type, onOptionClick)}
            </ul>

        </div>
    </div>
);

export default SelectionWidget;