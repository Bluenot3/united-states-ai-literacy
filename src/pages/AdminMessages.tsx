import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';

const AdminMessages: React.FC = () => {
    const { students, messages, sendMessage } = useAdmin();
    const [activeTab, setActiveTab] = useState<'compose' | 'sent' | 'templates'>('compose');
    const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [messageType, setMessageType] = useState<'direct' | 'announcement'>('direct');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const templates = [
        { id: 1, name: 'Welcome Message', subject: 'Welcome to ZEN Vanguard!', body: 'Welcome to the AI Professionals Program! We\'re excited to have you on this learning journey. Feel free to reach out if you have any questions.' },
        { id: 2, name: 'Module Reminder', subject: 'Don\'t forget to continue your learning!', body: 'We noticed you haven\'t logged in recently. Your next module is waiting for you! Remember, consistent practice is key to mastering AI literacy.' },
        { id: 3, name: 'Encouragement', subject: 'Keep up the great work!', body: 'Congratulations on your progress! You\'re doing an amazing job. Keep pushing forward - certification is just around the corner!' },
        { id: 4, name: 'At-Risk Outreach', subject: 'We miss you!', body: 'Hi there! We noticed you haven\'t been active lately. Is everything okay? We\'re here to help if you\'re facing any challenges with the program.' },
    ];

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSend = () => {
        if (messageType === 'announcement') {
            sendMessage(students.map(s => s.id), subject, body, 'announcement');
        } else {
            sendMessage(selectedRecipients, subject, body, 'direct');
        }
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setSubject('');
        setBody('');
        setSelectedRecipients([]);
    };

    const applyTemplate = (template: typeof templates[0]) => {
        setSubject(template.subject);
        setBody(template.body);
    };

    const toggleRecipient = (id: string) => {
        setSelectedRecipients(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="p-8 space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white">Communication Center</h1>
                <p className="text-slate-400 mt-1">Send messages, announcements, and notifications to students</p>
            </div>

            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed top-8 right-8 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-slide-in z-50">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-semibold">Message sent successfully!</span>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 bg-slate-800/30 p-1 rounded-xl w-fit">
                {(['compose', 'sent', 'templates'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${activeTab === tab
                                ? 'bg-brand-primary text-white'
                                : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Compose Tab */}
            {activeTab === 'compose' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left - Recipients */}
                    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 lg:col-span-1">
                        <h3 className="text-white font-bold mb-4">Recipients</h3>

                        {/* Message Type Toggle */}
                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={() => setMessageType('direct')}
                                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${messageType === 'direct' ? 'bg-brand-primary text-white' : 'bg-slate-700/50 text-slate-400'
                                    }`}
                            >
                                Direct
                            </button>
                            <button
                                onClick={() => setMessageType('announcement')}
                                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${messageType === 'announcement' ? 'bg-brand-primary text-white' : 'bg-slate-700/50 text-slate-400'
                                    }`}
                            >
                                Broadcast All
                            </button>
                        </div>

                        {messageType === 'direct' ? (
                            <>
                                {/* Search */}
                                <div className="relative mb-4">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search students..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-brand-primary"
                                    />
                                </div>

                                {/* Selected count */}
                                {selectedRecipients.length > 0 && (
                                    <div className="flex justify-between items-center mb-3 text-sm">
                                        <span className="text-brand-primary font-semibold">{selectedRecipients.length} selected</span>
                                        <button onClick={() => setSelectedRecipients([])} className="text-slate-400 hover:text-white">Clear</button>
                                    </div>
                                )}

                                {/* Student List */}
                                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                    {filteredStudents.map(student => (
                                        <label
                                            key={student.id}
                                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${selectedRecipients.includes(student.id)
                                                    ? 'bg-brand-primary/20 border border-brand-primary/30'
                                                    : 'bg-slate-900/30 hover:bg-slate-900/50 border border-transparent'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedRecipients.includes(student.id)}
                                                onChange={() => toggleRecipient(student.id)}
                                                className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-brand-primary focus:ring-brand-primary"
                                            />
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary/30 to-purple-600/30 flex items-center justify-center text-white text-sm font-bold">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-medium truncate">{student.name}</p>
                                                <p className="text-slate-500 text-xs truncate">{student.email}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                                <div className="flex items-center gap-3 text-amber-400 mb-2">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                    </svg>
                                    <span className="font-bold">Broadcast Mode</span>
                                </div>
                                <p className="text-amber-300/70 text-sm">
                                    This message will be sent to all <strong>{students.length} students</strong> in the program.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right - Compose */}
                    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 lg:col-span-2">
                        <h3 className="text-white font-bold mb-4">Compose Message</h3>

                        {/* Quick Templates */}
                        <div className="mb-6">
                            <p className="text-sm text-slate-400 mb-2">Quick templates:</p>
                            <div className="flex flex-wrap gap-2">
                                {templates.map(template => (
                                    <button
                                        key={template.id}
                                        onClick={() => applyTemplate(template)}
                                        className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
                                    >
                                        {template.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2">Subject</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    placeholder="Enter message subject..."
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2">Message Body</label>
                                <textarea
                                    value={body}
                                    onChange={e => setBody(e.target.value)}
                                    placeholder="Type your message here..."
                                    rows={10}
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-primary resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => { setSubject(''); setBody(''); }}
                                    className="px-6 py-3 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-600 transition-colors"
                                >
                                    Clear
                                </button>
                                <button
                                    onClick={handleSend}
                                    disabled={!subject || !body || (messageType === 'direct' && selectedRecipients.length === 0)}
                                    className="px-8 py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Sent Tab */}
            {activeTab === 'sent' && (
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
                    <div className="p-6 border-b border-slate-700/50">
                        <h3 className="text-white font-bold">Sent Messages</h3>
                        <p className="text-slate-500 text-sm">{messages.length} messages sent</p>
                    </div>

                    <div className="divide-y divide-slate-700/30">
                        {messages.length === 0 ? (
                            <div className="p-12 text-center">
                                <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <p className="text-slate-400">No messages sent yet</p>
                            </div>
                        ) : (
                            messages.slice(0, 20).map(msg => {
                                const recipient = students.find(s => s.id === msg.toId);
                                return (
                                    <div key={msg.id} className="p-4 hover:bg-slate-800/30">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                {msg.type === 'announcement' ? (
                                                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs font-bold">Broadcast</span>
                                                ) : (
                                                    <span className="px-2 py-0.5 bg-brand-primary/20 text-brand-primary rounded text-xs font-bold">Direct</span>
                                                )}
                                                <span className="text-white font-semibold">{msg.subject}</span>
                                            </div>
                                            <span className="text-slate-500 text-xs">
                                                {new Date(msg.sentAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm truncate">{msg.body}</p>
                                        {recipient && (
                                            <p className="text-slate-500 text-xs mt-2">To: {recipient.name}</p>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {/* Templates Tab */}
            {activeTab === 'templates' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {templates.map(template => (
                        <div key={template.id} className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-white font-bold">{template.name}</h3>
                                <button
                                    onClick={() => { applyTemplate(template); setActiveTab('compose'); }}
                                    className="px-3 py-1 bg-brand-primary/20 text-brand-primary rounded-lg text-sm font-semibold hover:bg-brand-primary/30 transition-colors"
                                >
                                    Use
                                </button>
                            </div>
                            <p className="text-slate-400 text-sm mb-2"><strong>Subject:</strong> {template.subject}</p>
                            <p className="text-slate-500 text-sm">{template.body}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminMessages;
