import React from 'react';

const Message = ({ user, message, getOriginalMessage, onOpenModal, isModal = false, onScrollToMessage, isHighlighted }) => {
    const currentUser = localStorage.getItem('user')
    const originalMessage = message.replyingTo ? getOriginalMessage(message.replyingTo) : null;

    const handleScrollToOriginal = (e) => {
        e.stopPropagation(); // prevent modal from opening
        if (originalMessage) {
            onScrollToMessage(originalMessage.id);
        }
    };

    const handleContainerClick = () => {
        if (!isModal) {
            onOpenModal(message);
        }
    }

    return (
        <div id={`message-${message.id}`} className={`message-container ${message.username === currentUser ? 'user-i' : 'user-uuu'} ${isHighlighted ? 'highlight' : ''}`} onClick={handleContainerClick}>
            <div className="message-bubble">
                {originalMessage && (
                    <div className={`reply-context ${originalMessage.username === currentUser ? 'user-i' : 'user-uuu'}`} onClick={handleScrollToOriginal} style={{ cursor: 'pointer' }}>
                        {/* <div className="reply-context-header">Replying to {originalMessage.u}</div> */}
                        <div className="reply-context-body">{originalMessage.message}</div>
                    </div>
                )}
                <div className="message-header">
                    {/* <strong>{message.u}</strong> */}
                </div>
                <div>{message.message}</div>
            </div>
        </div>
    );
};

export default Message;
