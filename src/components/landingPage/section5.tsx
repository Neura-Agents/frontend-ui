import React, { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

const Section5: React.FC<{ onVisible: (visible: boolean) => void }> = ({ onVisible }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { amount: 0.5 }); // trigger when 50% visible

    useEffect(() => {
        onVisible(isInView);
    }, [isInView]);

    return (
        <div
            ref={ref}
            className="w-screen h-screen md:h-[60vh] flex flex-col gap-10 items-center justify-center pointer-events-none"
        />
    );
};

export default Section5;