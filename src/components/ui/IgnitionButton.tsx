'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';

export default function IgnitionButton() {
    const [holding, setHolding] = useState(false);
    const [audioContext, setAudioContext] = useState<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const holdTimeout = useRef<NodeJS.Timeout | null>(null);
    const holdDuration = 3000; // 3 seconds
    const startTime = useRef<number>(0);
    const animationFrame = useRef<number>(0);

    // Supabase client creation inside component for now to ensure it works
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
    );

    const startHold = () => {
        if (status === 'success' || status === 'loading') return;
        setHolding(true);
        startTime.current = Date.now();

        // Animation loop for smooth progress
        const updateProgress = () => {
            const elapsed = Date.now() - startTime.current;
            const p = Math.min(elapsed / holdDuration, 1);
            setProgress(p * 100);

            if (p < 1) {
                animationFrame.current = requestAnimationFrame(updateProgress);
            } else {
                triggerAction();
            }
        };
        animationFrame.current = requestAnimationFrame(updateProgress);
    };

    const endHold = () => {
        if (status === 'success' || status === 'loading') return;
        setHolding(false);
        setProgress(0);
        if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };

    const triggerAction = async () => {
        setStatus('loading');
        setHolding(false);

        try {
            // Call the Database Function
            const { data, error } = await supabase.rpc('request_aid');

            if (error) throw error;

            // Check custom response structure
            // request_aid returns json: { success: boolean, message?: string, remaining?: number }
            // supabase rpc returns data as 'any' usually if not typed

            if (data && data.success) {
                setStatus('success');
                setTimeout(() => setStatus('idle'), 5000); // Reset after 5s
            } else {
                setStatus('error');
                setMessage(data?.message || 'Error desconocido');
                setTimeout(() => {
                    setStatus('idle');
                    setMessage('');
                }, 3000);
            }
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            setStatus('error');
            setMessage(err.message || 'Error de conexión');
            setTimeout(() => {
                setStatus('idle');
                setMessage('');
            }, 3000);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center gap-4">
            {/* Status Message */}
            <AnimatePresence>
                {(status === 'error' || status === 'success') && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={`px-4 py-2 rounded-lg font-bold backdrop-blur-md border ${status === 'success'
                            ? 'bg-green-900/50 border-green-500 text-green-400'
                            : 'bg-red-900/50 border-red-500 text-red-400'
                            }`}
                    >
                        {status === 'success' ? 'AUXILIO SOLICITADO' : message || 'ERROR'}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Button Container */}
            <div className="relative group">
                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 ${holding ? 'bg-red-600/60 scale-150' :
                    status === 'success' ? 'bg-green-500/60 scale-150' :
                        'bg-red-600/20 group-hover:bg-red-600/40'
                    }`}></div>

                {/* Progress Ring SVG */}
                <svg className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] rotate-[-90deg] pointer-events-none">
                    <circle
                        cx="50%" cy="50%" r="48%"
                        fill="none"
                        stroke="transparent"
                        strokeWidth="4"
                    />
                    <motion.circle
                        cx="50%" cy="50%" r="48%"
                        fill="none"
                        stroke={status === 'success' ? '#22c55e' : '#ef4444'}
                        strokeWidth="4"
                        strokeDasharray="300" // approx circumference
                        strokeDashoffset={300 - (300 * progress) / 100}
                        strokeLinecap="round"
                    />
                </svg>

                {/* The Button */}
                <button
                    onMouseDown={startHold}
                    onMouseUp={endHold}
                    onMouseLeave={endHold}
                    onTouchStart={startHold}
                    onTouchEnd={endHold}
                    disabled={status === 'loading' || status === 'success'}
                    className={`
                relative w-20 h-20 rounded-full border-4 shadow-2xl transition-all duration-200
                flex items-center justify-center
                ${status === 'success'
                            ? 'border-green-500 bg-green-950 shadow-[0_0_30px_#22c55e]'
                            : 'border-red-600 bg-zinc-900 shadow-[0_0_20px_#dc2626] active:scale-95'
                        }
            `}
                >
                    <div className={`text-white font-black uppercase text-[10px] tracking-widest transition-opacity ${holding ? 'opacity-100' : 'opacity-80'}`}>
                        {status === 'loading' ? '...' : status === 'success' ? 'OK' : 'SOS'}
                    </div>

                    {/* Inner Ring */}
                    <div className={`absolute inset-2 rounded-full border-2 border-dashed border-white/20 ${holding ? 'animate-spin-slow' : ''}`}></div>
                </button>

                <p className="absolute top-24 left-1/2 -translate-x-1/2 w-max text-[10px] font-bold text-zinc-500 uppercase tracking-widest pointer-events-none">
                    {status === 'idle' && 'Mantener 3s'}
                </p>
            </div>
        </div>
    );
}
