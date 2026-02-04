'use client';

import { useRef, useState, useEffect } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import MotoHealthMonitor from './MotoHealthMonitor';

export default function ScrollytellingContainer() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // We map the scroll progress to a value we can pass to the canvas
    const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

    // Transform progress to a regular number for the canvas component
    // Since canvas needs raw values, we'll pass the motion value and handle subscription inside, 
    // OR for simplicity in this MVP, we can just pass the motion value to a wrapper that extracts it.
    // Actually, MotoExplosion accepts a number. 
    // We can use a MotionValue subscription in a wrapper component or pass the raw value if we rerender.
    // Let's modify this slightly to pass the motion value or use a changing state.

    // However, passing a MotionValue directly to a component that uses hooks might be tricky if not handling change.
    // Let's create a small wrapper that subscribes to the motion value and updates state, 
    // OR better, make MotoExplosion accept a MotionValue and genericize it.

    // For now, let's just make a state update wrapper here for simplicity, 
    // though for perf it's better to do it inside.

    // Actually, let's keep it simple. We will use a Motion component that acts as a bridge?
    // No, let's just use `useMotionValue` inside MotoExplosion if needed, or pass the `scrollYProgress` directly if we update MotoExplosion.
    // But MotoExplosion as written takes `progress: number`.
    // Let's change MotoExplosion to use `progress` as a prop that updates. 
    // But wait, `render` is in `useEffect`. If `progress` changes, it re-renders.
    // We need to bridge the MotionValue to the React state or prop.

    return (
        <div ref={containerRef} className="relative h-[300vh] bg-[#121212]">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <MotoExplosionWrapper scrollYProgress={scrollYProgress} />
                </div>

                <div className="relative z-10 pointer-events-none">
                    {/* Overlay content that might stay fixed or change */}
                    <motion.h1
                        className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 font-eurostile uppercase tracking-tighter"
                        style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
                    >
                        MOTO VIVA
                    </motion.h1>
                    <motion.p
                        className="text-xl md:text-2xl text-orange-500 font-bold mt-4 text-center"
                        style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
                    >
                        EXPERIENCE THE MACHINE
                    </motion.p>
                </div>
            </div>

            {/* Scroll triggers / spacers */}
            <div className="absolute top-0 w-full h-full pointer-events-none">
                {/* Helps defining the scroll logic, but the sticky container handles display */}
            </div>
        </div>
    );
}

function MotoExplosionWrapper({ scrollYProgress }: { scrollYProgress: any }) {
    // This is a "dirty" bridge to force re-render on scroll for the canvas
    // In a prod app we'd trigger the canvas draw directly from the motion value change listener
    // to avoid React render cycles.
    // For this MVP, we'll trust React 18+ handling or just add a listener.




    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<{ oil: string, brakes: string }>({ oil: 'loading', brakes: 'loading' });

    // Fetch Moto Status on Mount
    useEffect(() => {
        const fetchStatus = async () => {
            // We need a client-side instance
            const { createBrowserClient } = await import('@supabase/ssr');
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            // Get user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // Fallback or Redirect
                return;
            }

            // Get client -> moto
            const { data: client } = await supabase.from('clientes').select('id').eq('user_id', user.id).single();
            if (!client) return;

            // Get first moto (MVP)
            const { data: moto } = await supabase.from('motos')
                .select('brake_status, oil_status')
                .eq('cliente_id', client.id)
                .limit(1)
                .single();

            if (moto) {
                setStatus({
                    oil: moto.oil_status || 'warning', // fallback to warning if not set
                    brakes: moto.brake_status || 'optimal'
                });
            }
        };

        fetchStatus();
    }, []);

    useEffect(() => {
        return scrollYProgress.on("change", (latest: number) => {
            setProgress(latest);
        });
    }, [scrollYProgress]);

    return <MotoHealthMonitor progress={progress} oilStatus={status.oil} brakeStatus={status.brakes} />;
}
