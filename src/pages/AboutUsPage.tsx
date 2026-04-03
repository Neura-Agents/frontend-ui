import React, { useEffect, useState } from 'react';
import AboutHero from '@/components/aboutUs/AboutHero';
import AboutSpacer from '@/components/aboutUs/AboutSpacer';
import Footer from '@/components/landingPage/footer';

const AboutUsPage: React.FC = () => {
    const [showFooterGlow, setShowFooterGlow] = useState(false);
    const APP_NAME = import.meta.env.VITE_APP_NAME || "WormLabs";

    useEffect(() => {
        document.title = `About Us | ${APP_NAME}`;
    }, [APP_NAME]);

    return (
        <div className="relative min-h-screen w-screen overflow-x-hidden">
            {/* Main Content */}
            <div className="relative z-10 rounded-b-4xl pointer-events-none">
                <div className="pointer-events-auto rounded-b-4xl overflow-hidden">
                    <AboutHero />
                </div>
                {/* AboutVision removed for now */}
                <AboutSpacer onVisible={setShowFooterGlow} />
            </div>

            {/* Footer (behind) */}
            <div className="fixed bottom-0 left-0 w-full z-0">
                <Footer animateGlow={showFooterGlow} />
            </div>
        </div>
    );
};

export default AboutUsPage;
