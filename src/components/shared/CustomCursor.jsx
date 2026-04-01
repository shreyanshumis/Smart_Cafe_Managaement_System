import { useEffect, useRef } from 'react';

const CustomCursor = () => {
    const cursorRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        let mx = 0, my = 0, cx = 0, cy = 0;
        let animId;
        let lastFocused = null;

        const onMouseMove = (e) => {
            mx = e.clientX;
            my = e.clientY;

            // Find the element directly under the cursor
            const el = document.elementFromPoint(mx, my);
            if (!el) return;

            // Walk up to find the nearest paragraph or text container
            const textEl = el.closest('p, span, li, td, .card-text');
            if (textEl && textEl !== lastFocused) {
                // Unfocus previous
                if (lastFocused) {
                    lastFocused.classList.remove('cursor-focus');
                    lastFocused.classList.add('cursor-unfocus');
                    // Clean up unfocus class after transition
                    setTimeout(() => lastFocused?.classList.remove('cursor-unfocus'), 400);
                }
                // Focus current
                textEl.classList.remove('cursor-unfocus');
                textEl.classList.add('cursor-focus');
                lastFocused = textEl;
            } else if (!textEl && lastFocused) {
                lastFocused.classList.remove('cursor-focus');
                lastFocused.classList.add('cursor-unfocus');
                setTimeout(() => lastFocused?.classList.remove('cursor-unfocus'), 400);
                lastFocused = null;
            }
        };

        const loop = () => {
            cx += (mx - cx) * 0.12;
            cy += (my - cy) * 0.12;
            cursor.style.left = cx - 14 + 'px';
            cursor.style.top  = cy - 14 + 'px';
            animId = requestAnimationFrame(loop);
        };

        loop();
        document.addEventListener('mousemove', onMouseMove);

        // Big cursor on interactive elements
        const addBig    = () => cursor.classList.add('cursor-big');
        const removeBig = () => cursor.classList.remove('cursor-big');

        const delegateIn  = (e) => {
            if (e.target.closest('a, button, h1, h2, h3, select, input, textarea, [role="button"]'))
                addBig();
        };
        const delegateOut = (e) => {
            if (e.target.closest('a, button, h1, h2, h3, select, input, textarea, [role="button"]'))
                removeBig();
        };

        document.addEventListener('mouseover',  delegateIn);
        document.addEventListener('mouseout',   delegateOut);

        const hideCursor = () => cursor.classList.add('cursor-hidden');
        const showCursor = () => cursor.classList.remove('cursor-hidden');
        document.addEventListener('mouseleave', hideCursor);
        document.addEventListener('mouseenter', showCursor);

        return () => {
            cancelAnimationFrame(animId);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseover',  delegateIn);
            document.removeEventListener('mouseout',   delegateOut);
            document.removeEventListener('mouseleave', hideCursor);
            document.removeEventListener('mouseenter', showCursor);
        };
    }, []);

    return <div ref={cursorRef} id="custom-cursor" />;
};

export default CustomCursor;