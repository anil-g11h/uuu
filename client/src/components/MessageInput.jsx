import React from 'react';

const MessageInput = ({ newMessage, setNewMessage, replyingTo, setReplyingTo, handleSendMessage, messageInputRef }) => {
    return (
        <div className="message-input-container">
            {replyingTo && (
                <div className="reply-preview">
                    Replying to <strong>{replyingTo.username}</strong>: "{replyingTo.message}"
                    <button onClick={() => setReplyingTo(null)}>X</button>
                </div>
            )}
            <form onSubmit={handleSendMessage} className="message-form">
                <textarea
                    ref={messageInputRef}
                    className="message-input"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                {newMessage && <button type="submit" className="send-btn">👍</button>}
            </form>
        </div>
    );
};

export default MessageInput;
