import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders } from '../redux/slices/orderSlice';
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tableNumber: { type: Number },
    orderType: {
        type: String,
        enum: ['dine-in', 'delivery'],
        default: 'dine-in',
    },
    deliveryAddress: { type: String },
    deliveryLat:     { type: Number },
    deliveryLng:     { type: Number },
    items: [{
        menuItem:  { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
        name:      String,
        quantity:  { type: Number, required: true, min: 1 },
        price:     Number,
    }],
    totalAmount:   { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending','approved','preparing','ready','out_for_delivery','delivered','served','completed'],
        default: 'pending',
    },
    paymentStatus: { type: String, enum: ['pending','paid','failed'], default: 'pending' },
    approvedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt:    Date,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
const statusConfig = {
    pending:   { label: 'Pending',   bg: '#88888822', text: '#555',    border: '#88888844' },
    approved:  { label: 'Approved',  bg: '#C8A96E22', text: '#8A6830', border: '#C8A96E55' },
    preparing: { label: 'Preparing', bg: '#5A7A8A22', text: '#2A5A6A', border: '#5A7A8A55' },
    ready:     { label: 'Ready',     bg: '#5A8A6A22', text: '#2A6A4A', border: '#5A8A6A55' },
    served:    { label: 'Served',    bg: '#C8A96E11', text: '#8A6830', border: '#C8A96E33' },
};

// ── Receipt Modal ─────────────────────────────────────────────────────
const Receipt = ({ order, onClose }) => {
    if (!order) return null;

    const tax   = Math.round(order.totalAmount * 0.05);
    const grand = order.totalAmount + tax;
    const date  = new Date(order.createdAt);

    const dayNames  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const monthNames= ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const humanDate = `${dayNames[date.getDay()]}, ${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    const humanTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 1000,
                background: 'rgba(42,40,32,0.55)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '1.5rem',
                backdropFilter: 'blur(3px)',
                animation: 'fadeIn 0.2s ease',
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
                @keyframes fadeIn  { from { opacity:0 }            to { opacity:1 } }
                @keyframes slideUp { from { transform:translateY(32px); opacity:0 } to { transform:translateY(0); opacity:1 } }
                @keyframes spin    { to   { transform:rotate(360deg) } }
                .receipt-row:not(:last-child) { border-bottom: 1px dashed rgba(120,100,60,0.18); }
                @media print {
                    body > * { display: none !important; }
                    .receipt-printable { display: block !important; position: static !important; }
                }
            `}</style>

            {/* Paper */}
            <div
                className="receipt-printable"
                onClick={e => e.stopPropagation()}
                style={{
                    width: '100%', maxWidth: 420,
                    background: '#FDFAF3',
                    borderRadius: '3px 3px 0 0',
                    boxShadow: '0 20px 60px rgba(42,40,32,0.35), 0 2px 8px rgba(42,40,32,0.15)',
                    position: 'relative',
                    animation: 'slideUp 0.3s cubic-bezier(0.23,1,0.32,1)',
                    overflow: 'visible',
                }}
            >
                {/* Torn top edge */}
                <div style={{
                    position: 'absolute', top: -10, left: 0, right: 0, height: 12,
                    background: '#FDFAF3',
                    clipPath: 'polygon(0% 100%,2% 20%,4% 80%,6% 10%,8% 90%,10% 20%,12% 70%,14% 5%,16% 85%,18% 25%,20% 75%,22% 15%,24% 80%,26% 30%,28% 70%,30% 10%,32% 90%,34% 20%,36% 75%,38% 5%,40% 85%,42% 25%,44% 70%,46% 15%,48% 80%,50% 20%,52% 75%,54% 10%,56% 90%,58% 20%,60% 75%,62% 5%,64% 85%,66% 25%,68% 70%,70% 15%,72% 80%,74% 30%,76% 70%,78% 10%,80% 90%,82% 20%,84% 75%,86% 15%,88% 80%,90% 25%,92% 70%,94% 10%,96% 85%,98% 20%,100% 100%)',
                }} />

                <div style={{ padding: '2rem 2.25rem 0' }}>

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <p style={{
                            fontFamily: "'Caveat', cursive",
                            fontSize: '2.6rem', fontWeight: 700,
                            color: '#2A2820', margin: '0 0 0.1rem',
                            letterSpacing: '-0.01em',
                            lineHeight: 1,
                        }}>Smart Café</p>
                        <p style={{
                            fontFamily: "'DM Serif Display', serif",
                            fontStyle: 'italic',
                            fontSize: '0.82rem', color: '#8A7A5A',
                            margin: '0 0 0.5rem', letterSpacing: '0.08em',
                        }}>est. 2024 — fine dining &amp; coffee</p>

                        {/* Divider with flourish */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.75rem 0' }}>
                            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(120,100,60,0.3))' }} />
                            <span style={{ fontSize: '0.75rem', color: '#C8A96E' }}>✦</span>
                            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(120,100,60,0.3))' }} />
                        </div>

                        <p style={{ fontFamily: "'Caveat', cursive", fontSize: '1rem', color: '#6B6858', margin: '0 0 0.15rem' }}>
                            {humanDate}
                        </p>
                        <p style={{ fontFamily: "'Caveat', cursive", fontSize: '0.95rem', color: '#8A7A5A', margin: 0 }}>
                            {humanTime} · Table {order.tableNumber}
                        </p>
                    </div>

                    {/* Order ID */}
                    <div style={{
                        background: 'rgba(200,169,110,0.1)',
                        border: '1px dashed rgba(200,169,110,0.45)',
                        borderRadius: 6, padding: '0.5rem 0.9rem',
                        marginBottom: '1.5rem',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                        <span style={{ fontFamily: "'Caveat', cursive", fontSize: '0.9rem', color: '#8A7A5A' }}>Order no.</span>
                        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1rem', color: '#2A2820', letterSpacing: '0.08em' }}>
                            #{order._id.slice(-6).toUpperCase()}
                        </span>
                    </div>

                    {/* Items heading */}
                    <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        marginBottom: '0.5rem', paddingBottom: '0.4rem',
                        borderBottom: '1.5px solid rgba(120,100,60,0.25)',
                    }}>
                        <span style={{ fontFamily: "'Caveat', cursive", fontSize: '0.82rem', color: '#8A7A5A', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Item</span>
                        <span style={{ fontFamily: "'Caveat', cursive", fontSize: '0.82rem', color: '#8A7A5A', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Amount</span>
                    </div>

                    {/* Items */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        {order.items.map((item, idx) => (
                            <div key={idx} className="receipt-row" style={{
                                display: 'flex', justifyContent: 'space-between',
                                alignItems: 'baseline', padding: '0.55rem 0',
                            }}>
                                <div>
                                    <span style={{
                                        fontFamily: "'DM Serif Display', serif",
                                        fontSize: '1rem', color: '#2A2820',
                                    }}>{item.name}</span>
                                    <span style={{
                                        fontFamily: "'Caveat', cursive",
                                        fontSize: '0.85rem', color: '#8A7A5A',
                                        marginLeft: '0.5rem',
                                    }}>× {item.quantity}</span>
                                </div>
                                <span style={{
                                    fontFamily: "'Caveat', cursive",
                                    fontSize: '1rem', color: '#2A2820', fontWeight: 600,
                                }}>₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>

                    {/* Subtotals */}
                    <div style={{
                        borderTop: '1.5px solid rgba(120,100,60,0.25)',
                        paddingTop: '0.9rem', marginBottom: '1.25rem',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                            <span style={{ fontFamily: "'Caveat', cursive", fontSize: '0.95rem', color: '#6B6858' }}>Subtotal</span>
                            <span style={{ fontFamily: "'Caveat', cursive", fontSize: '0.95rem', color: '#2A2820' }}>₹{order.totalAmount}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                            <span style={{ fontFamily: "'Caveat', cursive", fontSize: '0.95rem', color: '#6B6858' }}>GST (5%)</span>
                            <span style={{ fontFamily: "'Caveat', cursive", fontSize: '0.95rem', color: '#2A2820' }}>₹{tax}</span>
                        </div>
                    </div>

                    {/* Grand total */}
                    <div style={{
                        background: '#2A2820',
                        margin: '0 -2.25rem',
                        padding: '1rem 2.25rem',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    }}>
                        <span style={{
                            fontFamily: "'Caveat', cursive",
                            fontSize: '1.1rem', fontWeight: 700,
                            color: '#C8A96E', letterSpacing: '0.05em',
                        }}>Total</span>
                        <span style={{
                            fontFamily: "'DM Serif Display', serif",
                            fontSize: '1.9rem', color: '#F5F0E8',
                            letterSpacing: '-0.01em',
                        }}>₹{grand}</span>
                    </div>
                </div>

                {/* Footer — thank you note */}
                <div style={{
                    background: '#2A2820',
                    padding: '0.85rem 2.25rem 1.25rem',
                    textAlign: 'center',
                    borderRadius: '0 0 3px 3px',
                }}>
                    <p style={{
                        fontFamily: "'Caveat', cursive",
                        fontSize: '1.05rem', fontWeight: 600,
                        color: '#C8A96E', margin: '0 0 0.2rem',
                        letterSpacing: '0.03em',
                    }}>thank you for dining with us</p>
                    <p style={{
                        fontFamily: "'DM Serif Display', serif",
                        fontStyle: 'italic',
                        fontSize: '0.78rem', color: '#6B6858', margin: 0,
                    }}>Please visit again ✦</p>
                </div>

                {/* Torn bottom edge */}
                <div style={{
                    height: 14, background: '#2A2820',
                    clipPath: 'polygon(0% 0%,2% 80%,4% 20%,6% 90%,8% 10%,10% 80%,12% 30%,14% 95%,16% 15%,18% 75%,20% 25%,22% 85%,24% 20%,26% 70%,28% 10%,30% 90%,32% 30%,34% 80%,36% 25%,38% 95%,40% 15%,42% 75%,44% 25%,46% 85%,48% 20%,50% 80%,52% 25%,54% 90%,56% 10%,58% 80%,60% 25%,62% 95%,64% 15%,66% 75%,68% 30%,70% 85%,72% 20%,74% 70%,76% 10%,78% 90%,80% 30%,82% 80%,84% 25%,86% 85%,88% 20%,90% 75%,92% 30%,94% 90%,96% 15%,98% 80%,100% 0%)',
                }} />

                {/* Action buttons */}
                <div style={{
                    display: 'flex', gap: '0.75rem',
                    padding: '1rem 2.25rem 1.5rem',
                    background: '#1E1C16',
                    borderRadius: '0 0 3px 3px',
                }}>
                    <button
                        onClick={() => window.print()}
                        style={{
                            flex: 1, padding: '10px',
                            background: 'transparent',
                            border: '1px solid rgba(200,169,110,0.4)',
                            borderRadius: 8, color: '#C8A96E',
                            fontFamily: "'Caveat', cursive",
                            fontSize: '1rem', fontWeight: 600,
                            cursor: 'pointer', letterSpacing: '0.03em',
                        }}
                    >print receipt</button>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1, padding: '10px',
                            background: '#C8A96E',
                            border: 'none', borderRadius: 8,
                            color: '#2A2820',
                            fontFamily: "'Caveat', cursive",
                            fontSize: '1rem', fontWeight: 700,
                            cursor: 'pointer', letterSpacing: '0.03em',
                        }}
                    >close</button>
                </div>
            </div>
        </div>
    );
};

// ── Main Orders page ──────────────────────────────────────────────────
const Orders = () => {
    const dispatch = useDispatch();
    const { orders, isLoading } = useSelector((state) => state.orders);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => { dispatch(getOrders()); }, [dispatch]);

    if (isLoading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: 36, height: 36, border: '3px solid var(--accent-muted)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading your orders…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <>
            {selectedOrder && (
                <Receipt order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            )}

            <div style={{ maxWidth: 750, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <p style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.25rem' }}>History</p>
                    <h1 style={{ fontSize: '2.2rem', margin: 0 }}>My Orders</h1>
                </div>

                {(!orders || orders.length === 0) ? (
                    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '4rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</p>
                        <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No orders yet</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Head to the menu and place your first order!</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {orders.map(order => {
                            const cfg = statusConfig[order.status] || statusConfig.pending;
                            return (
                                <div key={order._id} style={{
                                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                                    borderRadius: 14, padding: '1.25rem', boxShadow: 'var(--shadow-sm)',
                                    transition: 'box-shadow 0.2s, transform 0.2s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none'; }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                        <div>
                                            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', margin: '0 0 0.2rem' }}>
                                                Order #{order._id.slice(-6).toUpperCase()}
                                            </p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                                                Table {order.tableNumber} · {new Date(order.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                                            <span style={{
                                                fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px',
                                                borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.05em',
                                                background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`,
                                            }}>{cfg.label}</span>
                                            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', color: 'var(--accent)' }}>
                                                ₹{order.totalAmount}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '0.9rem' }}>
                                        {order.items.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                                <span style={{ color: 'var(--text-secondary)' }}>{item.quantity}× {item.name}</span>
                                                <span style={{ fontWeight: 500 }}>₹{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* View Bill button */}
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        style={{
                                            width: '100%', padding: '9px',
                                            background: 'transparent',
                                            border: '1px dashed rgba(200,169,110,0.5)',
                                            borderRadius: 8, cursor: 'pointer',
                                            fontFamily: "'DM Serif Display', serif",
                                            fontStyle: 'italic',
                                            fontSize: '0.9rem', color: 'var(--accent)',
                                            letterSpacing: '0.02em',
                                            transition: 'background 0.2s, border-color 0.2s',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,169,110,0.07)'; e.currentTarget.style.borderColor = 'rgba(200,169,110,0.8)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(200,169,110,0.5)'; }}
                                    >
                                        view bill ✦
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
};

export default Orders;