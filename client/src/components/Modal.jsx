import React from 'react';
import Message from './Message';

const Modal = ({ isOpen, onClose, message, onReply, user, getOriginalMessage }) => {
    if (!isOpen || !message) return null;

    const handleReply = () => {
        onReply(message);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <Message
                    user={user}
                    message={message}
                    getOriginalMessage={getOriginalMessage}
                    onOpenModal={() => {}} // Don't do anything when clicking message in modal
                    isModal={true}
                />
                <div className="modal-footer">
                    <div className="timestamp" style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                    <button className="reply-btn-modal" onClick={handleReply}>↩️ Reply</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
