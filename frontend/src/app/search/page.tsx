"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiCall } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function Search() {
    const router = useRouter();
    const [tab, setTab] = useState<'month' | 'category'>('month');

    // Month Search
    const [monthStr, setMonthStr] = useState(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    });

    // Category Search
    const [category, setCategory] = useState('Special Moment');
    const categories = ['Special Moment', 'Important Information', 'Bad News'];

    const [notes, setNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            router.push('/login');
        }
    }, []);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            let url = '/notes/search?';
            if (tab === 'month') {
                const [y, m] = monthStr.split('-');
                url += `year=${y}&month=${m}`;
            } else {
                url += `category=${encodeURIComponent(category)}`;
            }
            const data = await apiCall(url);
            setNotes(data);
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch();
    }, [tab, monthStr, category]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Search Diary</h1>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="flex border-b border-gray-200 mb-6">
                        <button
                            className={`pb-4 px-6 text-sm font-semibold transition ${tab === 'month' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setTab('month')}
                        >
                            By Month & Year
                        </button>
                        <button
                            className={`pb-4 px-6 text-sm font-semibold transition ${tab === 'category' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setTab('category')}
                        >
                            By Category
                        </button>
                    </div>

                    <div className="flex items-center space-x-4">
                        {tab === 'month' ? (
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Month</label>
                                <input
                                    type="month"
                                    value={monthStr}
                                    onChange={e => setMonthStr(e.target.value)}
                                    className="w-full max-w-xs px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            </div>
                        ) : (
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Category</label>
                                <select
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    className="w-full max-w-xs px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                >
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">Results ({notes.length})</h2>
                    {loading ? (
                        <div className="text-gray-500">Loading notes...</div>
                    ) : notes.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">
                            No notes found for this filter.
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {notes.map(note => (
                                <div key={note._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-64">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">
                                            {note.date}
                                        </span>
                                        {note.category && (
                                            <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full">
                                                {note.category}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-700 text-sm flex-1 overflow-y-auto whitespace-pre-wrap pr-2 custom-scrollbar">
                                        {note.noteText}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
