import React, { useRef, useEffect } from 'react';
import Message from './Message';

const MessageList = ({ user, messages, messagesEndRef, onOpenModal, getOriginalMessage, loadMoreMessages, hasMore, onScrollToMessage, highlightedMessage }) => {
    const listRef = useRef();

    useEffect(() => {
        const listElement = listRef.current;

        const handleScroll = () => {
            if (listElement.scrollTop === 0 && hasMore) {
                loadMoreMessages();
            }
        };

        listElement.addEventListener('scroll', handleScroll);

        return () => {
            listElement.removeEventListener('scroll', handleScroll);
        };
    }, [hasMore, loadMoreMessages]);

    return (
        <div className="message-list" ref={listRef}>
            {hasMore && <div className="loading-indicator">Loading more...</div>}
            {messages.map(msg => (
                <Message
                    key={msg.id}
                    user={user}
                    message={msg}
                    getOriginalMessage={getOriginalMessage}
                    onOpenModal={onOpenModal}
                    onScrollToMessage={onScrollToMessage}
                    isHighlighted={highlightedMessage === msg.id}
                />
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;
