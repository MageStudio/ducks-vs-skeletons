import { getClickSound, VOLUMES } from "../../../sounds";

const Modal = ({ children, title, visible, onConfirm, onCancel, onClose, cancelLabel, confirmLabel, extraFooterContent }) => {
    const showCancel = onCancel && cancelLabel;
    const showConfirm = onConfirm && confirmLabel;

    if (!visible) return null;

    const onCloseClick = (e) => {
        getClickSound().play(VOLUMES.CLICK);
        onClose(e);
    };

    const onCancelClick = (e) => {
        getClickSound().play(VOLUMES.CLICK);
        onCancel(e);
    };

    const onConfirmClick = e => {
        getClickSound().play(VOLUMES.CLICK);
        onConfirm(e);
    }

    return (
        <div class='modal-backdrop'>
            <div class='modal'>
                <div class='modal-header'>
                    <h2>{ title }</h2>
                    { onClose && <button class='modal-btn close' onClick={onCloseClick}>x</button> }
                </div>
                <div class='modal-body'>
                { children }
                </div>
                <div class='modal-footer'>
                    { extraFooterContent }
                    { showCancel && <button class='modal-btn cancel' onClick={onCancelClick}>{ cancelLabel }</button> }
                    { showConfirm && <button class='modal-btn confirm' onClick={onConfirmClick}>{ confirmLabel }</button> }
                </div>
            </div>
        </div>
    )
};

export default Modal;