import Modal from "./Modal"

const InfoModal = ({ visible, onClose }) => {
    return (
        <Modal title="Info" visible={visible} confirmLabel="confirm" onConfirm={onClose} onClose={onClose}>
            here are the info
        </Modal>
    )
};

export default InfoModal;