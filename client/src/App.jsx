import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import UsernameScreen from './components/UsernameScreen';
import MessageScreen from './components/MessageScreen';
import Modal from './components/Modal';

const App = () => {
    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const messagesEndRef = useRef(null);
    const messageInputRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [highlightedMessage, setHighlightedMessage] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(storedUser);
        }
        fetchMessages(page);
    }, []);

    const handleScrollToMessage = (messageId) => {
        const messageElement = document.getElementById(`message-${messageId}`);
        if (messageElement) {
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setHighlightedMessage(messageId);
            setTimeout(() => {
                setHighlightedMessage(null);
            }, 2000); // Highlight for 2 seconds
        }
    };

    console.log('App component rendered', user);

    const fetchMessages = async (currentPage) => {
        try {
            const response = await fetch(`/api/data?page=${currentPage}&limit=2000`);
            const data = await response.json();
            setMessages(prevMessages => [ ...data.items]);
            setHasMore(data.hasMore);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const loadMoreMessages = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchMessages(nextPage);
    };

    const handleLogin = (username) => {
        const newUser = { username };
        setUser(newUser);
        localStorage.setItem('user', username);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        const messageData = {
            username: user,
            message: newMessage,
            timestamp: new Date().toISOString(),
            replyingTo: replyingTo ? replyingTo.id : null,
        };

        try {
            const response = await fetch('/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageData),
            });

            if (response.ok) {
                setNewMessage('');
                setReplyingTo(null);
                fetchMessages(1);
                setPage(1); // Reset page to 1 after sending a message
            } else {
                console.error('Error sending message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const getOriginalMessage = (replyToId) => {
        return messages.find(m => m.id === replyToId);
    };

    const handleOpenModal = (message) => {
        setSelectedMessage(message);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMessage(null);
    };

    const handleReplyFromModal = (message) => {
        setReplyingTo(message);
        handleCloseModal();
        messageInputRef.current.focus();
    };

    if (!user) {
        return <UsernameScreen onLogin={handleLogin} />;
    }

    return (
        <div className="app-container">
            <MessageScreen
                user={user}
                messages={messages}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                handleSendMessage={handleSendMessage}
                handleLogout={handleLogout}
                messagesEndRef={messagesEndRef}
                messageInputRef={messageInputRef}
                onOpenModal={handleOpenModal}
                getOriginalMessage={getOriginalMessage}
                loadMoreMessages={loadMoreMessages}
                hasMore={hasMore}
                onScrollToMessage={handleScrollToMessage}
                highlightedMessage={highlightedMessage}
            />
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                message={selectedMessage}
                onReply={handleReplyFromModal}
                user={user}
                getOriginalMessage={getOriginalMessage}
            />
        </div>
    );
};

export default App;
