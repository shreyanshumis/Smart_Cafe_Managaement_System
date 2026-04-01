import { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }) => {
    const [phase, setPhase] = useState('enter');   // enter → float → exit
    const [steamOpacity, setSteamOpacity] = useState(0);

    useEffect(() => {
        // Steam fades in
        const t1 = setTimeout(() => setSteamOpacity(1), 400);
        // Start exit
        const t2 = setTimeout(() => setPhase('exit'), 2600);
        // Tell App we're done
        const t3 = setTimeout(() => onComplete(), 3400);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [onComplete]);

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#F2F0E8',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '1.5rem',
            opacity:    phase === 'exit' ? 0 : 1,
            transform:  phase === 'exit' ? 'scale(1.04)' : 'scale(1)',
            transition: phase === 'exit'
                ? 'opacity 0.75s cubic-bezier(0.4,0,0.2,1), transform 0.75s cubic-bezier(0.4,0,0.2,1)'
                : 'none',
            pointerEvents: phase === 'exit' ? 'none' : 'all',
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap');

                @keyframes levitate {
                    0%,100% { transform: translateY(0px) rotate(-1deg); }
                    50%     { transform: translateY(-18px) rotate(1deg); }
                }
                @keyframes splashEnter {
                    from { opacity: 0; transform: translateY(30px) scale(0.92); }
                    to   { opacity: 1; transform: translateY(0)    scale(1); }
                }
                @keyframes steamRise1 {
                    0%   { transform: translateY(0)   scaleX(1);   opacity: 0.7; }
                    100% { transform: translateY(-28px) scaleX(1.4); opacity: 0; }
                }
                @keyframes steamRise2 {
                    0%   { transform: translateY(0)   scaleX(1);   opacity: 0.5; }
                    100% { transform: translateY(-22px) scaleX(0.8); opacity: 0; }
                }
                @keyframes steamRise3 {
                    0%   { transform: translateY(0)   scaleX(1);   opacity: 0.6; }
                    100% { transform: translateY(-32px) scaleX(1.2); opacity: 0; }
                }
                @keyframes subtitleFade {
                    from { opacity: 0; letter-spacing: 0.3em; }
                    to   { opacity: 1; letter-spacing: 0.18em; }
                }

                .splash-cup {
                    animation:
                        splashEnter 0.7s cubic-bezier(0.23,1,0.32,1) forwards,
                        levitate 3.2s ease-in-out 0.7s infinite;
                }
                .steam-1 { animation: steamRise1 1.4s ease-out infinite; }
                .steam-2 { animation: steamRise2 1.4s ease-out 0.3s infinite; }
                .steam-3 { animation: steamRise3 1.4s ease-out 0.6s infinite; }
                .splash-subtitle {
                    animation: subtitleFade 1s ease 1s both;
                }
            `}</style>

            {/* Steam */}
            <div style={{
                display: 'flex', gap: '10px', alignItems: 'flex-end',
                height: 36, opacity: steamOpacity,
                transition: 'opacity 0.8s ease',
                marginBottom: -8,
            }}>
                {[
                    { cls: 'steam-1', h: 18 },
                    { cls: 'steam-3', h: 26 },
                    { cls: 'steam-2', h: 14 },
                ].map((s, i) => (
                    <div key={i} className={s.cls} style={{
                        width: 3, height: s.h, borderRadius: 4,
                        background: 'rgba(200,169,110,0.55)',
                        transformOrigin: 'bottom center',
                    }} />
                ))}
            </div>

            {/* Cup — the floating device */}
            <div className="splash-cup" style={{ position: 'relative' }}>

                {/* Outer shell — like the rounded device in the image */}
                <div style={{
                    width: 140, height: 168,
                    background: 'linear-gradient(160deg, #FDFAF3 0%, #EDE8DA 60%, #DDD6C4 100%)',
                    borderRadius: 42,
                    boxShadow: `
                        0 40px 80px rgba(42,40,32,0.22),
                        0 12px 28px rgba(42,40,32,0.14),
                        inset 0 2px 4px rgba(255,255,255,0.9),
                        inset 0 -3px 8px rgba(120,100,60,0.12)
                    `,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'space-between',
                    padding: '18px 0 22px',
                    position: 'relative',
                    overflow: 'hidden',
                }}>

                    {/* Subtle sheen */}
                    <div style={{
                        position: 'absolute', top: 0, left: '15%',
                        width: '40%', height: '50%',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, transparent 100%)',
                        borderRadius: '0 0 50% 50%',
                        pointerEvents: 'none',
                    }} />

                    {/* Screen — the dark coffee surface */}
                    <div style={{
                        width: 96, height: 96,
                        borderRadius: 22,
                        background: 'radial-gradient(ellipse at 35% 35%, #4A3728 0%, #1C1008 55%, #0A0603 100%)',
                        boxShadow: `
                            inset 0 4px 12px rgba(0,0,0,0.8),
                            inset 0 -2px 6px rgba(80,50,20,0.4),
                            0 2px 6px rgba(0,0,0,0.3)
                        `,
                        position: 'relative', overflow: 'hidden',
                    }}>
                        {/* Coffee crema ring */}
                        <div style={{
                            position: 'absolute', inset: 10,
                            borderRadius: '50%',
                            border: '2px solid rgba(180,130,70,0.25)',
                            boxShadow: '0 0 12px rgba(180,130,70,0.15)',
                        }} />
                        {/* Latte art dot */}
                        <div style={{
                            position: 'absolute', top: '38%', left: '38%',
                            width: 14, height: 14, borderRadius: '50%',
                            background: 'rgba(200,160,80,0.18)',
                        }} />
                    </div>

                    {/* Scroll wheel — like the iPod / device */}
                    <div style={{
                        width: 72, height: 72, borderRadius: '50%',
                        background: 'linear-gradient(145deg, #E8E2D4, #D4CDB8)',
                        boxShadow: `
                            inset 0 3px 8px rgba(255,255,255,0.7),
                            inset 0 -3px 8px rgba(120,100,60,0.2),
                            0 2px 4px rgba(120,100,60,0.15)
                        `,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative',
                    }}>
                        {/* Centre button */}
                        <div style={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: 'linear-gradient(145deg, #EDE8DA, #C8C0A8)',
                            boxShadow: `
                                inset 0 2px 4px rgba(255,255,255,0.8),
                                inset 0 -2px 4px rgba(120,100,60,0.2),
                                0 1px 3px rgba(120,100,60,0.2)
                            `,
                        }} />
                    </div>
                </div>

                {/* Side button */}
                <div style={{
                    position: 'absolute', right: -4, top: '38%',
                    width: 6, height: 32, borderRadius: '0 4px 4px 0',
                    background: 'linear-gradient(180deg, #E0D8C8, #C8C0A8)',
                    boxShadow: '2px 0 6px rgba(42,40,32,0.15)',
                }} />
            </div>

            {/* Title */}
            <div style={{ textAlign: 'center', marginTop: 8 }}>
                <p style={{
                    fontFamily: "'DM Serif Display', Georgia, serif",
                    fontSize: '2rem', color: '#2A2820',
                    margin: '0 0 0.35rem',
                    letterSpacing: '-0.01em',
                    animation: 'splashEnter 0.8s cubic-bezier(0.23,1,0.32,1) 0.3s both',
                }}>Smart Café</p>
                <p className="splash-subtitle" style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontStyle: 'italic',
                    fontSize: '0.78rem', color: '#8A7A5A',
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    margin: 0,
                }}>fine dining &amp; coffee</p>
            </div>
        </div>
    );
};

export default SplashScreen;