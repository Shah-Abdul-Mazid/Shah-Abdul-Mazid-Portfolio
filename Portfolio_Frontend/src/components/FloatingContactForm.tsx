import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Phone, Mail, User, Bot, ArrowLeft } from 'lucide-react';

interface ChatMessage {
    sender: 'user' | 'agent';
    text: string;
    timestamp: Date;
}

const FloatingContactForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'chat' | 'contact'>('chat');
    
    // Chat state
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            sender: 'agent',
            text: "Hello! I am Shah Abdul Mazid's AI Portfolio Assistant. 🤖\n\nYou can ask me anything about his:\n• 🧠 Technical Skills & Tech Stack\n• 💼 Professional Work Experience\n• 🚀 Featured Projects\n• 📚 Published Research Papers\n• 🎓 Education & Academic Journey\n• 📞 Contact Details\n\nWhat would you like to know?",
            timestamp: new Date()
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Contact form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        query: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    // Auto-scroll chat to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen && mode === 'chat') {
            scrollToBottom();
        }
    }, [messages, isTyping, isOpen, mode]);

    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const queryText = chatInput.trim();
        if (!queryText) return;

        // Add user message
        const userMsg: ChatMessage = {
            sender: 'user',
            text: queryText,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setChatInput('');

        // Check if user wrote 'exit'
        if (queryText.toLowerCase() === 'exit') {
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                setMode('contact');
            }, 600);
            return;
        }

        // Show typing indicator
        setIsTyping(true);

        try {
            const res = await fetch('/api/agent/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: queryText })
            });

            if (res.ok) {
                const result = await res.json();
                setMessages(prev => [...prev, {
                    sender: 'agent',
                    text: result.response,
                    timestamp: new Date()
                }]);
            } else {
                setMessages(prev => [...prev, {
                    sender: 'agent',
                    text: "I'm sorry, I encountered an error communicating with the backend. Please type 'exit' to switch to the contact form.",
                    timestamp: new Date()
                }]);
            }
        } catch (err) {
            console.error('Chat error:', err);
            setMessages(prev => [...prev, {
                sender: 'agent',
                text: "Network error. Please make sure the backend is running. Type 'exit' to reach Shah Abdul Mazid directly.",
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', phone: '', query: '' });
                setTimeout(() => {
                    setStatus('idle');
                    setIsOpen(false);
                    // Reset to chat mode for next open
                    setMode('chat');
                }, 3000);
            } else {
                throw new Error('Failed to send message');
            }
        } catch (err) {
            console.error('Submission error:', err);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <div className="floating-container">
            {/* Toggle Button */}
            <button 
                className={`fab ${isOpen ? 'active' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Contact support"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>

            {/* Form/Chat Drawer */}
            <div className={`form-drawer ${isOpen ? 'open' : ''} ${mode === 'chat' ? 'chat-layout' : ''}`}>
                
                {mode === 'chat' ? (
                    // --- AI CHAT MODE ---
                    <>
                        <div className="drawer-header chat-header">
                            <div className="header-title-row">
                                <div className="bot-avatar">
                                    <Bot size={20} />
                                    <span className="online-indicator"></span>
                                </div>
                                <div>
                                    <h3>AI Portfolio Assistant</h3>
                                    <p>Online | Powered by RAG</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setMode('contact')}
                                className="direct-contact-btn"
                                title="Contact Directly"
                            >
                                <Mail size={16} /> Contact directly
                            </button>
                        </div>

                        <div className="chat-messages-container">
                            {messages.map((msg, i) => (
                                <div key={i} className={`chat-bubble-wrapper ${msg.sender}`}>
                                    {msg.sender === 'agent' && (
                                        <div className="bubble-avatar"><Bot size={14} /></div>
                                    )}
                                    <div className={`chat-bubble ${msg.sender}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="chat-bubble-wrapper agent">
                                    <div className="bubble-avatar"><Bot size={14} /></div>
                                    <div className="chat-bubble agent typing">
                                        <span className="dot"></span>
                                        <span className="dot"></span>
                                        <span className="dot"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleChatSubmit} className="chat-input-row">
                            <input 
                                type="text"
                                value={chatInput}
                                onChange={e => setChatInput(e.target.value)}
                                placeholder="Ask me anything... (or type 'exit')"
                                disabled={isTyping}
                            />
                            <button type="submit" className="send-btn" disabled={!chatInput.trim() || isTyping}>
                                <Send size={16} />
                            </button>
                        </form>
                        
                        <div className="chat-helper-footer">
                            <span>Type <strong>exit</strong> to contact directly.</span>
                        </div>
                    </>
                ) : (
                    // --- DIRECT CONTACT MODE ---
                    <>
                        <div className="drawer-header">
                            <button onClick={() => setMode('chat')} className="back-to-chat-btn">
                                <ArrowLeft size={16} /> Back to AI Chat
                            </button>
                            <h3>Send a Message</h3>
                            <p>I'll get back to you as soon as possible.</p>
                        </div>

                        <form onSubmit={handleContactSubmit} className="drawer-form">
                            <div className="input-group">
                                <label><User size={14} /> Name</label>
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="input-group">
                                <label><Mail size={14} /> Email</label>
                                <input 
                                    type="email" 
                                    required 
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                            <div className="input-group">
                                <label><Phone size={14} /> Phone (Optional)</label>
                                <input 
                                    type="tel" 
                                    placeholder="+880 1XXX-XXXXXX"
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>
                            <div className="input-group">
                                <label>Your Query</label>
                                <textarea 
                                    required 
                                    rows={4} 
                                    placeholder="How can I help you?"
                                    value={formData.query}
                                    onChange={e => setFormData({...formData, query: e.target.value})}
                                />
                            </div>

                            <button 
                                type="submit" 
                                className={`submit-btn ${status}`} 
                                disabled={status === 'submitting' || status === 'success'}
                            >
                                {status === 'submitting' ? 'Sending...' : 
                                 status === 'success' ? 'Sent successfully!' : 
                                 status === 'error' ? 'Failed to send' : 
                                 <><Send size={18} /> Send Message</>}
                            </button>
                        </form>
                    </>
                )}
            </div>

            <style>{`
                .floating-container { position: fixed; bottom: 30px; right: 30px; z-index: 9999; }
                
                .fab { 
                    width: 60px; height: 60px; border-radius: 50%; background: #3b82f6; color: white;
                    border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .fab:hover { transform: scale(1.1); box-shadow: 0 15px 30px rgba(59, 130, 246, 0.6); }
                .fab.active { background: #1e293b; transform: rotate(90deg); }

                .form-drawer {
                    position: absolute; bottom: 80px; right: 0; width: 360px; background: #0b1120;
                    border: 1px solid #1e293b; border-radius: 20px; padding: 24px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.5); opacity: 0; visibility: hidden;
                    transform: translateY(20px) scale(0.95); transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
                    display: flex; flex-direction: column;
                    box-sizing: border-box;
                }
                .form-drawer.open { opacity: 1; visibility: visible; transform: translateY(0) scale(1); }
                .form-drawer.chat-layout { padding: 18px 18px 12px 18px; width: 380px; }

                .drawer-header h3 { color: #f8fafc; margin-bottom: 4px; font-size: 1.25rem; font-family: 'Plus Jakarta Sans', sans-serif; }
                .drawer-header p { color: #94a3b8; font-size: 0.875rem; margin-bottom: 20px; }
                
                .chat-header {
                    display: flex; justify-content: space-between; align-items: center;
                    border-bottom: 1px solid #1e293b; padding-bottom: 12px; margin-bottom: 12px;
                }
                .header-title-row { display: flex; align-items: center; gap: 10px; }
                .header-title-row h3 { margin: 0; font-size: 0.95rem; font-weight: 700; color: #f8fafc; }
                .header-title-row p { margin: 0; font-size: 0.72rem; color: #10b981; font-weight: 500; }
                
                .bot-avatar {
                    width: 34px; height: 34px; background: rgba(59, 130, 246, 0.1);
                    border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 50%;
                    display: flex; align-items: center; justify-content: center; color: #3b82f6;
                    position: relative;
                }
                .online-indicator {
                    width: 8px; height: 8px; background: #10b981; border: 1.5px solid #0b1120;
                    border-radius: 50%; position: absolute; bottom: 0; right: 0;
                }

                .direct-contact-btn {
                    background: rgba(255, 255, 255, 0.05); border: 1px solid #1e293b;
                    color: #cbd5e1; font-size: 0.72rem; padding: 6px 10px; border-radius: 8px;
                    cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s;
                }
                .direct-contact-btn:hover { background: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.3); color: #3b82f6; }

                .back-to-chat-btn {
                    background: none; border: none; color: #3b82f6; font-size: 0.8rem;
                    display: flex; align-items: center; gap: 6px; cursor: pointer; padding: 0;
                    margin-bottom: 12px; font-weight: 600;
                }
                .back-to-chat-btn:hover { text-decoration: underline; }

                /* Chat bubbles area */
                .chat-messages-container {
                    height: 300px; overflow-y: auto; display: flex; flex-direction: column;
                    gap: 12px; padding-right: 4px; margin-bottom: 12px;
                }
                .chat-messages-container::-webkit-scrollbar { width: 4px; }
                .chat-messages-container::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }

                .chat-bubble-wrapper { display: flex; gap: 8px; max-width: 85%; }
                .chat-bubble-wrapper.user { align-self: flex-end; flex-direction: row-reverse; }
                .chat-bubble-wrapper.agent { align-self: flex-start; }

                .bubble-avatar {
                    width: 24px; height: 24px; background: rgba(255, 255, 255, 0.05);
                    border: 1px solid #1e293b; border-radius: 50%; display: flex;
                    align-items: center; justify-content: center; color: #94a3b8; flex-shrink: 0;
                }

                .chat-bubble {
                    padding: 10px 14px; border-radius: 12px; font-size: 0.82rem; line-height: 1.4;
                    word-wrap: break-word; font-family: 'Plus Jakarta Sans', sans-serif;
                }
                .chat-bubble.user {
                    background: #3b82f6; color: white; border-top-right-radius: 2px;
                }
                .chat-bubble.agent {
                    background: #1e293b; color: #cbd5e1; border-top-left-radius: 2px;
                    white-space: pre-wrap;
                }

                /* Typing indicator animation */
                .chat-bubble.typing { display: flex; gap: 4px; align-items: center; padding: 12px 16px; }
                .chat-bubble.typing .dot {
                    width: 6px; height: 6px; background: #64748b; border-radius: 50%;
                    animation: bounce 1.4s infinite ease-in-out both;
                }
                .chat-bubble.typing .dot:nth-child(1) { animation-delay: -0.32s; }
                .chat-bubble.typing .dot:nth-child(2) { animation-delay: -0.16s; }
                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1.0); }
                }

                /* Input row */
                .chat-input-row { display: flex; gap: 8px; align-items: center; margin-top: auto; }
                .chat-input-row input {
                    flex: 1; background: #0f172a; border: 1px solid #1e293b; border-radius: 10px;
                    padding: 12px 14px; color: #f8fafc; font-size: 0.88rem; outline: none; transition: border 0.2s;
                }
                .chat-input-row input:focus { border-color: #3b82f6; }
                .chat-input-row input:disabled { opacity: 0.7; }

                .send-btn {
                    width: 42px; height: 42px; background: #3b82f6; color: white;
                    border: none; border-radius: 10px; display: flex; align-items: center;
                    justify-content: center; cursor: pointer; transition: all 0.2s; flex-shrink: 0;
                }
                .send-btn:hover:not(:disabled) { background: #2563eb; }
                .send-btn:disabled { background: #1e293b; color: #64748b; cursor: not-allowed; }

                .chat-helper-footer {
                    font-size: 0.7rem; color: #64748b; text-align: center; margin-top: 10px;
                    border-top: 1px solid #1e293b; padding-top: 8px;
                }

                /* Drawer Form styling */
                .drawer-form { display: flex; flex-direction: column; gap: 16px; }
                .input-group label { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; font-weight: 700; }
                .input-group input, .input-group textarea {
                    width: 100%; background: #0f172a; border: 1px solid #1e293b; border-radius: 10px;
                    padding: 12px 14px; color: #f8fafc; font-family: inherit; font-size: 0.9rem; transition: border 0.2s;
                    box-sizing: border-box;
                }
                .input-group input:focus, .input-group textarea:focus { outline: none; border-color: #3b82f6; }

                .submit-btn {
                    margin-top: 8px; padding: 14px; border-radius: 10px; border: none; background: #3b82f6;
                    color: white; font-weight: 700; cursor: pointer; display: flex; align-items: center;
                    justify-content: center; gap: 10px; transition: all 0.2s;
                }
                .submit-btn:hover { background: #2563eb; }
                .submit-btn.success { background: #10b981; }
                .submit-btn.error { background: #ef4444; }
                .submit-btn:disabled { cursor: not-allowed; opacity: 0.8; }

                @media (max-width: 480px) {
                    .form-drawer { width: calc(100vw - 40px); right: -10px; bottom: 80px; }
                    .form-drawer.chat-layout { width: calc(100vw - 40px); }
                }
            `}</style>
        </div>
    );
};

export default FloatingContactForm;
