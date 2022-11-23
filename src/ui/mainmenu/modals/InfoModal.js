import Modal from "./Modal"
import packageJson from '../../../../package.json';

const VersionInfo = () => (
    <div className='version-info'>
        <h5 className="subtitle">Current version: <span>{ packageJson.version }</span></h5>
    </div>
)

const InfoModal = ({ visible, onClose }) => {
    return (
        <Modal
            title="Info"
            visible={visible}
            confirmLabel="confirm"
            onConfirm={onClose}
            onClose={onClose}
            extraFooterContent={<VersionInfo/>} >
            <span className="text">A small game about ducks and skeletons.</span>
            
            <div className="text-row first">
                <h3 className="subtitle">Made by:</h3>
                <a
                    target="_blank"
                    className="text-link"
                    href="mailto:marco@mage.studio">
                    Me, Marco Stagni  &lt;marco@mage.studio&gt;
                </a>
            </div>
            
            <div className="text-row">
                <h3 className="subtitle">Built with:</h3>
                <a
                    target="_blank"
                    className="text-link logo"
                    href="https://www.mage.studio/docs/#/">
                    Mage, a javascript game engine.
            </a>
            </div>

            <div className="links-container">
                <h3 className="subtitle">Links:</h3>
                <ul className="text-link-list">
                    <li>
                        <a
                            target="_blank"
                            className="text-link"
                            href="https://discord.gg/YvyMRcvd77">
                            <img src="/img/discord.png" alt="discord" />
                        </a>
                    </li>
                    <li>
                        <a
                            target="_blank"
                            className="text-link"
                            href="https://github.com/MageStudio/ducks-vs-skeletons">
                            <img src="/img/github.png" alt="github" />
                        </a>
                    </li>
                    <li>
                        <a
                            target="_blank"
                            className="text-link"
                            href="https://www.instagram.com/wearemagestudio/">
                            <img src="/img/instagram.png" alt="instagram"/>
                        </a>
                    </li>
                </ul>
            </div>
        </Modal>
    )
};

export default InfoModal;