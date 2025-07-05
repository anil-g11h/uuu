import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const MessageScreen = ({
    user,
    messages,
    newMessage,
    setNewMessage,
    replyingTo,
    setReplyingTo,
    handleSendMessage,
    handleLogout,
    messagesEndRef,
    messageInputRef,
    onOpenModal,
    getOriginalMessage,
    loadMoreMessages,
    hasMore,
    onScrollToMessage,
    highlightedMessage
}) => {
    return (
        <div className="screen active" id="messageScreen">
            {/* <div className="user-info">
                <div>
                    Logged in as: <strong>{user.username} ({user.userType})</strong>
                </div>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div> */}
            <MessageList
                user={user}
                messages={messages}
                setReplyingTo={setReplyingTo}
                messagesEndRef={messagesEndRef}
                onOpenModal={onOpenModal}
                getOriginalMessage={getOriginalMessage}
                loadMoreMessages={loadMoreMessages}
                hasMore={hasMore}
                onScrollToMessage={onScrollToMessage}
                highlightedMessage={highlightedMessage}
            />
            <MessageInput
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                handleSendMessage={handleSendMessage}
                messageInputRef={messageInputRef}
            />
        </div>
    );
};

export default MessageScreen;
