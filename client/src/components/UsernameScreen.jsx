import React, { useState } from 'react';

const UsernameScreen = ({ onLogin }) => {
    const [username, setUsername] = useState('uuu');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            onLogin(username, username);
        }
    };

    return (
        <div className="screen active" id="usernameScreen">
            <div style={{width: "100%", padding: "2rem"}}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <div className="user-type">
                            <div className={`radio-option ${username === 'uuu' ? 'selected' : ''}`} onClick={() => setUsername('uuu')}>
                                uuu
                            </div>
                            <div className={`radio-option ${username === 'g11h' ? 'selected' : ''}`} onClick={() => setUsername('g11h')}>
                                g11h
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="submit-btn">🔥</button>
                </form>
            </div>
        </div>
    );
};

export default UsernameScreen;
