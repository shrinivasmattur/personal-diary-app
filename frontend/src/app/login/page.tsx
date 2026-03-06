"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiCall } from '@/lib/api';
import Link from 'next/link';

export default function Login() {
    const router = useRouter();
    const [isForgot, setIsForgot] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [forgotData, setForgotData] = useState({ email: '', securityQuestion: '', securityAnswer: '', newPassword: '', step: 1 });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const data = await apiCall('/auth/login', 'POST', formData);
            localStorage.setItem('token', data.token);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleForgotStep1 = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const data = await apiCall('/auth/forgot-password/question', 'POST', { email: forgotData.email });
            setForgotData({ ...forgotData, securityQuestion: data.securityQuestion, step: 2 });
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleForgotStep2 = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const data = await apiCall('/auth/forgot-password/reset', 'POST', {
                email: forgotData.email,
                securityAnswer: forgotData.securityAnswer,
                newPassword: forgotData.newPassword
            });
            setSuccess(data.message);
            setTimeout(() => {
                setIsForgot(false);
                setForgotData({ email: '', securityQuestion: '', securityAnswer: '', newPassword: '', step: 1 });
                setSuccess('');
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 space-y-6">
                <h2 className="text-3xl font-bold text-gray-800 text-center">{isForgot ? 'Reset Password' : 'Welcome Back'}</h2>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">{error}</div>}
                {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm text-center">{success}</div>}

                {!isForgot ? (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input type="email" placeholder="Email Address" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-black" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        <input type="password" placeholder="Password" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-black" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                        <div className="text-right">
                            <button type="button" onClick={() => setIsForgot(true)} className="text-sm text-indigo-600 font-semibold hover:underline">Forgot password?</button>
                        </div>
                        <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all">Log In</button>
                        <p className="text-center text-gray-600 text-sm mt-4">
                            Don't have an account? <Link href="/signup" className="text-indigo-600 font-semibold hover:underline">Sign up</Link>
                        </p>
                    </form>
                ) : (
                    forgotData.step === 1 ? (
                        <form onSubmit={handleForgotStep1} className="space-y-4">
                            <input type="email" placeholder="Enter Email to Reset" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-black" value={forgotData.email} onChange={e => setForgotData({ ...forgotData, email: e.target.value })} />
                            <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all">Get Security Question</button>
                            <button type="button" onClick={() => setIsForgot(false)} className="w-full py-3 text-gray-600 font-bold">Cancel</button>
                        </form>
                    ) : (
                        <form onSubmit={handleForgotStep2} className="space-y-4">
                            <p className="text-sm font-semibold text-gray-700">Question: {forgotData.securityQuestion}</p>
                            <input type="text" placeholder="Your Answer" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-black" value={forgotData.securityAnswer} onChange={e => setForgotData({ ...forgotData, securityAnswer: e.target.value })} />
                            <input type="password" placeholder="New Password" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-black" value={forgotData.newPassword} onChange={e => setForgotData({ ...forgotData, newPassword: e.target.value })} />
                            <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all">Reset Password</button>
                        </form>
                    )
                )}
            </div>
        </div>
    );
}
