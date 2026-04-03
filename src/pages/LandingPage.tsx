import Section1 from "@/components/landingPage/section1";
import Section2 from "@/components/landingPage/section2";
import Section3 from "@/components/landingPage/section3";
import Section4 from "@/components/landingPage/section4";
import Section5 from "@/components/landingPage/section5";
import Footer from "@/components/landingPage/footer";
import { useEffect, useState } from "react";


const LandingPage: React.FC = () => {
    const [showFooterGlow, setShowFooterGlow] = useState(false);
    const APP_NAME = import.meta.env.VITE_APP_NAME || "WormLabs";

    useEffect(() => {
        document.title = `${APP_NAME} | Build and deploy AI agents effortlessly`;
    }, [APP_NAME]);

    return (
        <div className="relative min-h-screen w-screen">

            {/* Main Content */}
            <div className="relative z-10 rounded-b-4xl pointer-events-none">
                <Section1 />
                <Section2 />
                <Section3 />
                <Section4 />
                <Section5 onVisible={setShowFooterGlow} />
            </div>

            {/* Footer (behind) */}
            <div className="fixed bottom-0 left-0 w-full z-0">
                <Footer animateGlow={showFooterGlow} />
            </div>

        </div>
    );
};

export default LandingPage;
