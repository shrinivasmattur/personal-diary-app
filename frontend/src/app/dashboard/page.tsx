"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiCall } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function Dashboard() {
    const router = useRouter();
    const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [noteText, setNoteText] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });

    const categories = ['Special Moment', 'Important Information', 'Bad News', 'Uncategorized'];

    useEffect(() => {
        // Check auth
        if (!localStorage.getItem('token')) {
            router.push('/login');
            return;
        }
        fetchNote(date);
    }, [date]);

    const fetchNote = async (selectedDate: string) => {
        setLoading(true);
        try {
            const data = await apiCall(`/notes/date/${selectedDate}`);
            setNoteText(data.noteText || '');
            setCategory(data.category || '');
        } catch (err: any) {
            if (err.message.includes('Token is not valid') || err.message.includes('No token')) {
                localStorage.removeItem('token');
                router.push('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        try {
            await apiCall('/notes', 'POST', { date, noteText, category: category === 'Uncategorized' ? '' : category });
            setMessage({ text: 'Note saved successfully!', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (err: any) {
            setMessage({ text: err.message || 'Failed to save', type: 'error' });
        }
    };

    if (loading && !noteText) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h1 className="text-2xl font-bold text-gray-800">My Diary</h1>
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-600">Select Date:</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {message.text && (
                        <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Note Category</label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Dear Diary...</label>
                            <textarea
                                value={noteText}
                                onChange={e => setNoteText(e.target.value)}
                                rows={12}
                                placeholder="Write about your day. Your memories are safe here and can never be deleted."
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition">
                                Save Note
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-center text-gray-400">
                        Rule Enforced: Diary notes cannot be deleted. They can only be added or updated.
                    </div>
                </div>
            </main>
        </div>
    );
}
