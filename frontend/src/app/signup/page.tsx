"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiCall } from '@/lib/api';
import Link from 'next/link';

export default function Signup() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', securityQuestion: 'What is your pet name?', securityAnswer: '' });
    const [error, setError] = useState('');

    const questions = [
        'What is your pet name?',
        'What city were you born in?',
        'What is your favorite food?'
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.formEvent && e.preventDefault();
        e.preventDefault();
        setError('');
        try {
            const data = await apiCall('/auth/signup', 'POST', formData);
            localStorage.setItem('token', data.token);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 space-y-6">
                <h2 className="text-3xl font-bold text-gray-800 text-center">Create Account</h2>
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Full Name" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-black" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <input type="email" placeholder="Email Address" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-black" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    <div>
                        <input type="password" placeholder="Password" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-black" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                        <p className="text-xs text-gray-500 mt-1">Min 8 chars, 1 uppercase, 1 number, 1 special char.</p>
                    </div>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-black bg-white" value={formData.securityQuestion} onChange={e => setFormData({ ...formData, securityQuestion: e.target.value })}>
                        {questions.map(q => <option key={q} value={q}>{q}</option>)}
                    </select>
                    <input type="text" placeholder="Security Answer" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-black" value={formData.securityAnswer} onChange={e => setFormData({ ...formData, securityAnswer: e.target.value })} />

                    <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all">Sign Up</button>
                </form>
                <p className="text-center text-gray-600 text-sm">
                    Already have an account? <Link href="/login" className="text-indigo-600 font-semibold hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
}
