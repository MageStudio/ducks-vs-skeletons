import { useState} from 'xferno';
import { getClickSound, VOLUMES } from '../../sounds';
import InfoModal from './modals/InfoModal';
import SettingsModal from "./modals/SettingsModal";

const MainMenu = ({ onStartClick }) => {
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [infoVisible, setInfoVisible] = useState(false);

    const onInfoClick = () => {
        getClickSound().play(VOLUMES.CLICK);
        setInfoVisible(true);
    }

    const onSettingsClick = () => {
        getClickSound().play(VOLUMES.CLICK);
        setSettingsVisible(true);
    }

    const onStartGameClick = () => {
        getClickSound().play(VOLUMES.CLICK);
        onStartClick();
    }

    return (
        <Fragment>
            <div class="mainmenu_background"></div>
            <div class="mainmenu">
                <img class="title" src="img/title.png"/>
                <div class="options">
                    <div class="btn-row">
                        <div class="btn start" onClick={onStartGameClick}>START</div>
                    </div>
                    <div class="btn-row">
                        <div class="btn settings" onClick={onSettingsClick}>
                            SETTINGS
                        </div>
                    </div>
                    <div class="btn-row">
                        <div class="btn info" onClick={onInfoClick}>
                            INFO
                        </div>
                    </div>
                </div>
            </div>
            <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)}/>
            <InfoModal visible={infoVisible} onClose={() => setInfoVisible(false)}/>
        </Fragment>
    )
};

export default MainMenu;