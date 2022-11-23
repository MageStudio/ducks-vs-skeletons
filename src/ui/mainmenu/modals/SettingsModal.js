import Modal from "./Modal"

const SettingsModal = ({ visible, onClose }) => {
    return (
        <Modal
            title="Settings"
            visible={visible}
            cancelLabel='cancel'
            confirmLabel='confirm'
            onConfirm={onClose}
            onCancel={onClose}
            onClose={onClose}>
            here are settings
        </Modal>
    )
};

export default SettingsModal;