import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, register, reset } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

const Spline = lazy(() => import('@splinetool/react-spline'));

const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    border: '1px solid var(--border)',
    borderRadius: 10,
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    background: 'var(--bg-base)',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
};

const labelStyle = {
    display: 'block',
    fontSize: '0.72rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
};

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [splineLoaded, setSplineLoaded] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: '', role: 'user',
    });

    const { name, email, password, confirmPassword, role } = formData;
    const dispatch   = useDispatch();
    const navigate   = useNavigate();
    const { user, isLoading, isError, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) navigate('/');
        if (isError) { toast.error(message); dispatch(reset()); }
    }, [user, isError, message, dispatch, navigate]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isLogin) {
            if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
            dispatch(register({ name, email, password, role }));
        } else {
            dispatch(login({ email, password }));
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            background: 'var(--bg-base)',
            overflow: 'hidden',
        }}>
            <style>{`
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeSlideRight {
                    from { opacity: 0; transform: translateX(20px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes splineReveal {
                    from { opacity: 0; transform: scale(0.96); }
                    to   { opacity: 1; transform: scale(1); }
                }
                .spline-wrap { animation: splineReveal 1s cubic-bezier(0.23,1,0.32,1) 0.3s both; }
                .form-wrap   { animation: fadeSlideRight 0.7s cubic-bezier(0.23,1,0.32,1) 0.2s both; }
                .auth-input:focus {
                    border-color: rgba(200,169,110,0.7) !important;
                    box-shadow: 0 0 0 3px rgba(200,169,110,0.15) !important;
                }
                .tab-btn {
                    flex: 1; padding: 9px; border: none; border-radius: 9px;
                    font-family: inherit; font-size: 0.875rem; font-weight: 600;
                    cursor: pointer; transition: all 0.2s;
                }
                .tab-btn.active {
                    background: var(--bg-card);
                    color: var(--text-primary);
                    box-shadow: 0 2px 8px rgba(42,40,32,0.1);
                }
                .tab-btn.inactive {
                    background: transparent;
                    color: var(--text-secondary);
                }
                .submit-btn {
                    width: 100%; padding: 13px;
                    background: var(--accent);
                    color: #F5F3EC;
                    border: none; border-radius: 10px;
                    font-size: 0.95rem; font-weight: 600;
                    font-family: inherit; cursor: pointer;
                    box-shadow: 0 4px 14px rgba(200,169,110,0.4);
                    transition: opacity 0.2s, transform 0.2s;
                }
                .submit-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
                .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; box-shadow: none; }
                .spline-loader {
                    position: absolute; inset: 0;
                    display: flex; align-items: center; justify-content: center;
                    flex-direction: column; gap: 1rem;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>

            {/* ── LEFT — Spline 3D cup ────────────────────────── */}
            <div className="spline-wrap" style={{
                flex: 1,
                position: 'relative',
                background: 'linear-gradient(135deg, #EDEADE 0%, #F2F0E8 50%, #E8E4D8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                minHeight: '100vh',
            }}>
                {/* Decorative warm glow behind the cup */}
                <div style={{
                    position: 'absolute',
                    width: 420, height: 420,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(200,169,110,0.18) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                {/* Spline scene */}
                <div style={{
                    width: '100%', height: '100%',
                    position: 'absolute', inset: 0,
                    opacity: splineLoaded ? 1 : 0,
                    transition: 'opacity 0.8s ease',
                }}>
                    <Suspense fallback={null}>
                        <Spline
                            scene="https://prod.spline.design/JcB3upp6RG4aCLS7/scene.splinecode"
                            onLoad={() => setSplineLoaded(true)}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </Suspense>
                </div>

                {/* Loading spinner shown until Spline is ready */}
                {!splineLoaded && (
                    <div className="spline-loader">
                        <div style={{
                            width: 36, height: 36,
                            border: '3px solid rgba(200,169,110,0.3)',
                            borderTopColor: 'var(--accent)',
                            borderRadius: '50%',
                            animation: 'spin 0.9s linear infinite',
                        }} />
                        <p style={{
                            fontFamily: "'DM Serif Display', serif",
                            fontStyle: 'italic',
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem',
                        }}>brewing something special…</p>
                    </div>
                )}

                {/* Bottom label */}
                <div style={{
                    position: 'absolute', bottom: '2.5rem', left: 0, right: 0,
                    textAlign: 'center', pointerEvents: 'none',
                    opacity: splineLoaded ? 1 : 0,
                    transition: 'opacity 1s ease 0.5s',
                }}>
                    <p style={{
                        fontFamily: "'DM Serif Display', Georgia, serif",
                        fontSize: '1.6rem', color: '#2A2820',
                        margin: '0 0 0.2rem', letterSpacing: '-0.01em',
                    }}>Smart Café</p>
                    <p style={{
                        fontFamily: "'DM Serif Display', serif",
                        fontStyle: 'italic',
                        fontSize: '0.78rem', color: '#8A7A5A',
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        margin: 0,
                    }}>fine dining &amp; coffee</p>
                </div>
            </div>

            {/* ── RIGHT — Login / Register form ──────────────── */}
            <div className="form-wrap" style={{
                width: '100%',
                maxWidth: 480,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem 3.5rem',
                background: 'var(--bg-card)',
                borderLeft: '1px solid var(--border)',
                minHeight: '100vh',
                boxSizing: 'border-box',
            }}>
                <div style={{ width: '100%', maxWidth: 360 }}>

                    {/* Greeting */}
                    <div style={{ marginBottom: '2rem' }}>
                        <p style={{
                            color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 600,
                            textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.4rem',
                        }}>Welcome</p>
                        <h1 style={{
                            fontFamily: "'DM Serif Display', Georgia, serif",
                            fontSize: '2rem', margin: '0 0 0.4rem', letterSpacing: '-0.01em',
                        }}>
                            {isLogin ? 'Welcome back' : 'Join Smart Café'}
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
                            {isLogin ? 'Sign in to your account' : 'Create your account today'}
                        </p>
                    </div>

                    {/* Tab switcher */}
                    <div style={{
                        display: 'flex', background: 'var(--bg-base)',
                        borderRadius: 12, padding: 4, marginBottom: '1.75rem',
                    }}>
                        {['Login', 'Register'].map(tab => (
                            <button
                                key={tab}
                                className={`tab-btn ${(isLogin && tab === 'Login') || (!isLogin && tab === 'Register') ? 'active' : 'inactive'}`}
                                onClick={() => setIsLogin(tab === 'Login')}
                            >{tab}</button>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={labelStyle}>Full Name</label>
                                <input
                                    className="auth-input"
                                    type="text" name="name" value={name}
                                    onChange={handleChange} placeholder="Your name"
                                    style={inputStyle} required
                                />
                            </div>
                        )}

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={labelStyle}>Email</label>
                            <input
                                className="auth-input"
                                type="email" name="email" value={email}
                                onChange={handleChange} placeholder="you@email.com"
                                style={inputStyle} required
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={labelStyle}>Password</label>
                            <input
                                className="auth-input"
                                type="password" name="password" value={password}
                                onChange={handleChange} placeholder="••••••••"
                                style={inputStyle} required
                            />
                        </div>

                        {!isLogin && (
                            <>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={labelStyle}>Confirm Password</label>
                                    <input
                                        className="auth-input"
                                        type="password" name="confirmPassword"
                                        value={confirmPassword} onChange={handleChange}
                                        placeholder="••••••••" style={inputStyle} required
                                    />
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={labelStyle}>Role</label>
                                    <select
                                        name="role" value={role} onChange={handleChange}
                                        style={{ ...inputStyle, cursor: 'pointer' }}
                                    >
                                        <option value="user">Customer</option>
                                        <option value="admin">Admin</option>
                                        <option value="kitchen">Kitchen Staff</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="submit-btn"
                            style={{ marginTop: isLogin ? '0.5rem' : 0 }}
                        >
                            {isLoading ? 'Processing…' : isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{
                        display: 'flex', alignItems: 'center',
                        gap: '0.75rem', margin: '1.5rem 0',
                    }}>
                        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>✦</span>
                        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                    </div>

                    <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                        {isLogin ? "Don't have an account? " : 'Already have an account? '}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            style={{
                                background: 'none', border: 'none', padding: 0,
                                color: 'var(--accent)', fontWeight: 600,
                                fontSize: '0.85rem', fontFamily: 'inherit',
                                cursor: 'pointer', textDecoration: 'underline',
                                textUnderlineOffset: 3,
                            }}
                        >
                            {isLogin ? 'Register here' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;