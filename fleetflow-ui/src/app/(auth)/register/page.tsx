'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Truck, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth, ROLE_LABELS, type UserRole, type RegisterData } from '@/context/AuthContext';

const ROLES: UserRole[] = ['fleet_manager', 'dispatcher', 'safety_officer', 'financial_analyst'];

const ROLE_DESC: Record<UserRole, string> = {
    fleet_manager: 'Full access to all fleet operations',
    dispatcher: 'Manage trips & dispatching only',
    safety_officer: 'Driver safety & compliance',
    financial_analyst: 'Reports & financial analytics',
};

export default function RegisterPage() {
    const { register, user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [form, setForm] = useState<RegisterData>({ name: '', email: '', password: '', role: 'fleet_manager', phone: '' });
    const [confirmPw, setConfirmPw] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [showCPw, setShowCPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && user) router.replace('/dashboard');
    }, [user, authLoading, router]);

    const set = (k: keyof RegisterData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(f => ({ ...f, [k]: e.target.value }));
        setError('');
    };

    const initials = form.name
        ? form.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
        : '?';

    const strength = (() => {
        const p = form.password;
        if (!p) return null;
        if (p.length < 6) return { label: 'Weak', color: 'bg-red-500', w: 'w-1/3' };
        if (p.length < 10) return { label: 'Good', color: 'bg-amber-500', w: 'w-2/3' };
        return { label: 'Strong', color: 'bg-emerald-500', w: 'w-full' };
    })();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (form.password !== confirmPw) { setError('Passwords do not match.'); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        setLoading(true);
        const result = await register(form);
        if (result.success) {
            router.push('/dashboard');
        } else {
            setError(result.error || 'Registration failed.');
            setLoading(false);
        }
    };

    if (authLoading) return null;

    return (
        <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <Truck className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tight">FleetFlow</span>
                    </div>
                    <p className="text-gray-500 text-sm">Create your account</p>
                </div>

                {/* Card */}
                <div className="bg-[#161616] border border-white/[0.08] rounded-2xl p-8 shadow-2xl">

                    {/* Live Avatar Preview */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl border-2 border-emerald-500/40 shadow-lg shadow-emerald-500/20 shrink-0">
                            {initials}
                        </div>
                        <div>
                            <p className="text-white font-semibold text-sm">{form.name || 'Your Name'}</p>
                            <p className="text-gray-500 text-xs">{form.email || 'your@email.com'}</p>
                            <p className="text-emerald-400 text-xs mt-0.5">{ROLE_LABELS[form.role]}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Full Name */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block">Full Name</label>
                            <input type="text" value={form.name} onChange={set('name')} required placeholder="John Doe"
                                className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-emerald-500/60 transition-all" />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block">Email</label>
                            <input type="email" value={form.email} onChange={set('email')} required placeholder="you@company.com"
                                className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-emerald-500/60 transition-all" />
                        </div>

                        {/* Role */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block">Role</label>
                            <select value={form.role} onChange={set('role')}
                                className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/60 transition-all cursor-pointer">
                                {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                            </select>
                            <p className="text-gray-600 text-xs mt-1.5">{ROLE_DESC[form.role]}</p>
                        </div>

                        {/* Phone (optional) */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block">
                                Phone <span className="text-gray-700 normal-case font-normal">(optional)</span>
                            </label>
                            <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210"
                                className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-emerald-500/60 transition-all" />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block">Password</label>
                            <div className="relative">
                                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} required placeholder="Min. 6 characters"
                                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-emerald-500/60 transition-all pr-11" />
                                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {strength && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all ${strength.color} ${strength.w}`} />
                                    </div>
                                    <span className="text-xs text-gray-500">{strength.label}</span>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block">Confirm Password</label>
                            <div className="relative">
                                <input type={showCPw ? 'text' : 'password'} value={confirmPw} onChange={e => { setConfirmPw(e.target.value); setError(''); }} required placeholder="Repeat password"
                                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-emerald-500/60 transition-all pr-11" />
                                <button type="button" onClick={() => setShowCPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                                    {showCPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                {confirmPw && form.password === confirmPw && (
                                    <CheckCircle2 className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 pointer-events-none" />
                                )}
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button type="submit" disabled={loading}
                            className="w-full py-3.5 mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</> : 'Register'}
                        </button>
                    </form>

                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-white/[0.08]" />
                        <span className="text-xs text-gray-600">or</span>
                        <div className="flex-1 h-px bg-white/[0.08]" />
                    </div>

                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
