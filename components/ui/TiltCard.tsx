import React, { useRef, useState } from 'react';

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
}

const TiltCard: React.FC<TiltCardProps> = ({ children, className = '', glowColor = 'rgba(6, 182, 212, 0.4)' }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
        const rotateY = ((x - centerX) / centerX) * 10;

        setRotation({ x: rotateX, y: rotateY });
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
        setOpacity(0);
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative transition-transform duration-100 ease-out preserve-3d ${className}`}
            style={{
                transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transformStyle: 'preserve-3d',
            }}
        >
            <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
                {children}
            </div>

            {/* Holographic Glare */}
            <div
                className="absolute inset-0 pointer-events-none rounded-xl z-20"
                style={{
                    background: `radial-gradient(circle at ${50 + rotation.y * 3}% ${50 + rotation.x * 3}%, ${glowColor}, transparent 40%)`,
                    opacity: opacity * 0.6,
                    mixBlendMode: 'screen',
                    transition: 'opacity 0.2s ease',
                }}
            />
        </div>
    );
};

export default TiltCard;
