'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const FRAME_COUNT = 3;
const IMAGES = [
    '/assets/moto-viva/moto_assembled.png',
    '/assets/moto-viva/moto_semi_exploded.png',
    '/assets/moto-viva/moto_exploded.png',
];

interface MotoHealthMonitorProps {
    progress: number;
    oilStatus?: string;
    brakeStatus?: string;
}

export default function MotoHealthMonitor({ progress, oilStatus = 'warning', brakeStatus = 'optimal' }: MotoHealthMonitorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
        const loadImages = async () => {
            const loadedImages = await Promise.all(
                IMAGES.map((src) => {
                    return new Promise<HTMLImageElement>((resolve, reject) => {
                        const img = new Image();
                        img.src = src;
                        img.onload = () => resolve(img);
                        img.onerror = reject;
                    });
                })
            );
            setImages(loadedImages);
            setImagesLoaded(true);
        };

        loadImages();
    }, []);

    useEffect(() => {
        if (!imagesLoaded || !canvasRef.current || images.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);

        // Helper: Object-fit contain
        const drawImageContain = (img: HTMLImageElement, opacity: number) => {
            const imgRatio = img.width / img.height;
            const canvasRatio = width / height;

            let drawWidth, drawHeight, offsetX, offsetY;

            if (imgRatio > canvasRatio) {
                drawWidth = width;
                drawHeight = width / imgRatio;
                offsetX = 0;
                offsetY = (height - drawHeight) / 2;
            } else {
                drawHeight = height;
                drawWidth = height * imgRatio;
                offsetY = 0;
                offsetX = (width - drawWidth) / 2;
            }

            ctx.globalAlpha = opacity;
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };

        // Transition Logic
        let frameIndex = 0;
        let nextFrameIndex = 0;
        let currentOpacity = 1;
        let nextOpacity = 0;

        if (progress < 0.5) {
            frameIndex = 0;
            nextFrameIndex = 1;
            const localProgress = progress / 0.5;
            currentOpacity = 1;
            nextOpacity = localProgress;
        } else {
            frameIndex = 1;
            nextFrameIndex = 2;
            const localProgress = (progress - 0.5) / 0.5;
            currentOpacity = 1;
            nextOpacity = localProgress;
        }

        if (images[frameIndex]) drawImageContain(images[frameIndex], 1);
        if (images[nextFrameIndex]) drawImageContain(images[nextFrameIndex], nextOpacity);

        ctx.globalAlpha = 1;
    }, [progress, images, imagesLoaded]);

    const isOilOptimal = oilStatus === 'optimal';
    const isOilWarning = oilStatus === 'warning';
    const isOilCritical = oilStatus === 'critical';

    const isBrakesOptimal = brakeStatus === 'optimal';
    const isBrakesWarning = brakeStatus === 'warning';
    const isBrakesCritical = brakeStatus === 'critical';

    return (
        <div className="relative w-full h-full flex items-center justify-center font-eurostile">
            <canvas
                ref={canvasRef}
                width={1920}
                height={1080}
                className="max-w-full max-h-full object-contain"
            />

            {/* CARD 1: ACEITE */}
            <motion.div
                className={`absolute top-1/4 left-[10%] md:left-1/4 p-6 backdrop-blur-xl border rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-colors duration-500
                    ${isOilCritical ? 'bg-red-950/20 border-red-500/50' : isOilWarning ? 'bg-yellow-950/20 border-yellow-500/50' : 'bg-green-950/20 border-green-500/50'}
                `}
                initial={{ opacity: 0, x: -30 }}
                animate={{
                    opacity: progress > 0.2 ? 1 : 0,
                    x: progress > 0.2 ? 0 : -30,
                    scale: progress > 0.2 ? 1 : 0.95
                }}
                transition={{ duration: 0.6 }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full animate-pulse shadow-[0_0_10px] ${isOilCritical ? 'bg-red-500 shadow-red-500' : isOilWarning ? 'bg-yellow-500 shadow-yellow-500' : 'bg-green-500 shadow-green-500'}`}></div>
                    <h3 className={`text-2xl font-black tracking-wider ${isOilCritical ? 'text-red-500' : isOilWarning ? 'text-yellow-500' : 'text-green-500'}`}>ACEITE</h3>
                </div>
                <p className={`text-sm font-bold uppercase tracking-widest mb-1 ${isOilCritical ? 'text-red-100' : isOilWarning ? 'text-yellow-100' : 'text-green-100'}`}>
                    {isOilCritical ? 'Estado Crítico' : isOilWarning ? 'Revisar Nivel' : 'Nivel Óptimo'}
                </p>
                <p className={`text-xs opacity-80 ${isOilCritical ? 'text-red-400' : isOilWarning ? 'text-yellow-400' : 'text-green-400'}`}>
                    {isOilCritical ? 'Cambio Urgente' : isOilWarning ? 'Agendar Service' : 'V4 Granturismo'}
                </p>
            </motion.div>

            {/* CARD 2: FRENOS */}
            <motion.div
                className={`absolute bottom-1/3 right-[5%] md:right-1/4 p-6 backdrop-blur-xl border rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] text-right
                    ${isBrakesCritical ? 'bg-red-950/20 border-red-500/30' : isBrakesWarning ? 'bg-yellow-950/20 border-yellow-500/30' : 'bg-green-950/20 border-green-500/30'}
                `}
                initial={{ opacity: 0, x: 30 }}
                animate={{
                    opacity: progress > 0.5 ? 1 : 0,
                    x: progress > 0.5 ? 0 : 30
                }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                <div className="flex items-center gap-3 mb-2 justify-end">
                    <h3 className={`text-2xl font-black tracking-wider ${isBrakesCritical ? 'text-red-500' : isBrakesWarning ? 'text-yellow-500' : 'text-green-500'}`}>FRENOS</h3>
                    <div className={`w-3 h-3 rounded-full shadow-[0_0_10px] ${isBrakesCritical ? 'bg-red-500 shadow-red-500' : isBrakesWarning ? 'bg-yellow-500 shadow-yellow-500' : 'bg-green-500 shadow-green-500'}`}></div>
                </div>
                <p className={`text-sm font-bold uppercase tracking-widest mb-1 ${isBrakesCritical ? 'text-red-100' : isBrakesWarning ? 'text-yellow-100' : 'text-green-100'}`}>
                    {isBrakesCritical ? 'Desgastados' : isBrakesWarning ? 'Revisión Sugerida' : 'Óptimo (95%)'}
                </p>
                <p className={`text-xs opacity-80 ${isBrakesCritical ? 'text-red-400' : isBrakesWarning ? 'text-yellow-400' : 'text-green-400'}`}>
                    Brembo Stylema
                </p>
            </motion.div>

            {/* CARD 3: SERVICE (WARNING/TIMER) - Appears late-scroll */}
            <motion.div
                className="absolute top-[15%] right-[10%] md:right-[20%] p-6 bg-zinc-900/40 backdrop-blur-xl border border-orange-500/50 rounded-xl shadow-[0_0_30px_rgba(249,115,22,0.1)]"
                initial={{ opacity: 0, y: -20 }}
                animate={{
                    opacity: progress > 0.8 ? 1 : 0,
                    y: progress > 0.8 ? 0 : -20
                }}
                transition={{ duration: 0.6 }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500 animate-bounce"></div>
                    <h3 className="text-2xl font-black text-white tracking-wider">SERVICE</h3>
                </div>
                <p className="text-xl font-bold text-orange-500 uppercase tracking-widest">En 15 días</p>
                <p className="text-xs text-zinc-400 mt-1">Agendar ahora</p>
            </motion.div>

        </div>
    );
}
