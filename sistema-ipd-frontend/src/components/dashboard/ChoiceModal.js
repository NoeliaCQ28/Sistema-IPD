import React from 'react';
import Modal from 'react-modal';
import './ModalStyles.css';

Modal.setAppElement('#root');

const ChoiceModal = ({ isOpen, onClose, onChoose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal"
      overlayClassName="overlay"
    >
      <h2>¿Qué deseas crear?</h2>
      <p>Selecciona una opción para continuar.</p>
      <div className="modal-buttons choice-buttons">
        <button onClick={() => onChoose('evento')} className="choice-button evento">
          Nuevo Evento
        </button>
        <button onClick={() => onChoose('torneo')} className="choice-button torneo">
          Nuevo Torneo
        </button>
      </div>
      <div className="modal-buttons">
        <button onClick={onClose} className="cancel-button" style={{ marginTop: '1rem', width: '100%' }}>
            Cancelar
        </button>
      </div>
    </Modal>
  );
};

export default ChoiceModal;