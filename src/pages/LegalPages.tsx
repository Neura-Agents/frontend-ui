import React, { useState, useEffect } from 'react';
import { Typography } from '@/components/ui/typography';
import { useAuth } from '@/context/AuthContext';
import Footer from '@/components/landingPage/footer';
import AboutSpacer from '@/components/aboutUs/AboutSpacer';
import { cn } from '@/lib/utils';
import { useUmami } from '@/hooks/useUmami';

interface LegalPageProps {
  title: string;
  updatedDate: string;
  sections: React.ReactNode;
}

const APP_NAME = "Agentic AI";
const PLATFORM_URL = "https://wormlabs.in";
const CONTACT_EMAIL = "support@wormlabs.in";

const LegalPage: React.FC<LegalPageProps> = ({ title, updatedDate, sections }) => {
  const { user } = useAuth();
  const [showFooterGlow, setShowFooterGlow] = useState(false);
  const { track } = useUmami();

  useEffect(() => {
    track('legal-page-view', { page: title });
    window.scrollTo(0, 0);
  }, [track, title]);

  const PageContent = (
    <div className={cn(
      "container mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-24 px-6",
      user ? "pt-32" : "pt-24"
    )}>
      <header className="space-y-4 mb-16">
        <Typography font="season-mix" className="text-4xl md:text-6xl leading-tight tracking-tight">
          {title}
        </Typography>
        <Typography className="text-muted-foreground">
          Updated on: {updatedDate}
        </Typography>
        <div className="h-px bg-border/50 w-full mt-10" />
      </header>

      <div className="max-w-none space-y-12 text-foreground/80 leading-relaxed font-sans">
        {sections}
      </div>
    </div>
  );

  if (user) {
    return <div className="min-h-screen bg-background">{PageContent}</div>;
  }

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden bg-background">
      <div className="relative z-10 pointer-events-none">
        <div className="pointer-events-auto bg-card rounded-b-[3rem] pb-10 shadow-xl border-b border-border/10">
          {PageContent}
        </div>
        <AboutSpacer onVisible={setShowFooterGlow} />
      </div>
      <div className="fixed bottom-0 left-0 w-full z-0">
        <Footer animateGlow={showFooterGlow} />
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <LegalPage 
      title="Terms of Use" 
      updatedDate="1st January, 2026"
      sections={
        <div className="space-y-10">
          <section className="space-y-6">
            <Typography>
                This terms of use ("Terms of Use") govern your use of our website {PLATFORM_URL} ("Platform") and product offered through the Platform (hereinafter collectively referred to as "Offerings") which are owned, controlled and operated by the Company, and having its registered office as per the details provided on the Platform.
            </Typography>
            <Typography>
                By accessing or using either or both the Offerings, you signify that you have read, understood and agree to be bound by these Terms of Use. If you do not agree with these Terms of Use, please do not access and/or use the Offerings.
            </Typography>
            <Typography>
                These Terms of Use will be treated as an 'electronic record' as defined under the Information Technology Act, 2000 and the rules made thereunder. Further, these Terms of Use are published in accordance with the provisions of Rule 3(1) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.
            </Typography>
            <Typography>
                For the purposes of these Terms of Use, "we", "our" and "us" shall mean the Company and "you" and "your", shall mean a user of the Offerings, whether registered or not ("User").
            </Typography>
          </section>

          <section className="space-y-4">
            <Typography font="season-mix" className="text-2xl text-foreground">Permitted Users</Typography>
            <Typography>
                You represent and warrant that you have the legal capacity and authority to agree to and accept these Terms of Use on behalf of yourself and any person you purport to represent, being either a company, partnership firm, sole proprietorship or any other organisation.
            </Typography>
            <Typography>
                You shall not access and/or use the Offerings if you are not competent to contract under the applicable laws, rules and regulations. Persons below the age of 18 (eighteen) years shall use the Service only under strict guidance and supervision of their parents/guardians.
            </Typography>
          </section>

          <section className="space-y-4">
            <Typography font="season-mix" className="text-2xl text-foreground">Access</Typography>
            <Typography>
                Subject to the terms hereof, {APP_NAME} grants you permission to use the Offerings as set forth in this Terms of Use, provided that: (i) you will not copy or distribute, any part of the Offerings in any medium or in any manner whatsoever without explicit authorisation; (ii) you will not alter or modify any part of the Offerings; and (iii) you will comply with these Terms of Use.
            </Typography>
            <Typography>
                In order to access and use the Product, you will need to register on the Platform and create a "User" account. Your account gives you access to the Product and its functionality that we may establish and maintain from time to time and in our sole discretion on the Platform.
            </Typography>
          </section>

          <section className="space-y-4">
            <Typography font="season-mix" className="text-2xl text-foreground">Fees and Payment</Typography>
            <Typography>
                The Company shall charge you fees for your use of the Product ("Fees"). The Company may, at its discretion, modify the Fees from time to time. Subsequent to payment of the Fees, any and all Fees paid by you to the Company shall be non-refundable.
            </Typography>
            <Typography>
                You agree and understand that you will be redirected to third-party payment gateway websites in order to avail the Product. You agree to fully cooperate with us in an effort to resolve any problems we encounter while processing your requested order.
            </Typography>
          </section>

          <section className="space-y-4">
            <Typography font="season-mix" className="text-2xl text-foreground">Cancellation Policy</Typography>
            <ul className="list-disc pl-6 space-y-3">
                <li>You may cancel your subscription or plan at any time.</li>
                <li>You will continue to have access to the Offerings until the end of your current billing period.</li>
                <li>No refunds will be provided for any fees already paid or for any unused portion of the billing period.</li>
                <li>Cancellation may be completed through your account dashboard or by contacting the Company through designated support channels.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <Typography font="season-mix" className="text-2xl text-foreground">Ownership of the Offerings</Typography>
            <Typography>
                You agree and acknowledge that the Company has the worldwide ownership of the software code, models, training methodology, process flows, proprietary technology, and all the trademarks, copyright and any other intellectual property rights in the Offerings.
            </Typography>
            <Typography>
                You are not entitled to duplicate, distribute, create derivative works of, display, or commercially exploit any intellectual property rights associated with the Offerings without our prior written permission.
            </Typography>
          </section>

          <section className="space-y-4">
            <Typography font="season-mix" className="text-2xl text-foreground">User Content</Typography>
            <Typography>
                While using the Product, you may provide various forms of inputs, such as text, image, voice or other data ("Input"). You represent and warrant that you have all necessary rights to provide the Input. Once the Product receives your Inputs, it will generate results ("Output"). Content (Input and Output) shall be owned by you.
            </Typography>
            <Typography>
                The Company reserves the right to use the Content to train, improve, and further develop the Product. The User explicitly consents to the use of their Input and Output for these purposes.
            </Typography>
          </section>

          <section className="space-y-4">
            <Typography font="season-mix" className="text-2xl text-foreground">AI Specific Disclaimers & Output Reliability</Typography>
            <Typography>
              The Output generated by {APP_NAME} is based on advanced machine learning algorithms and automated processes. These technologies are probabilistic by nature and are therefore intended for informational purposes only. The Output may not always accurately reflect real-world facts or reliable circumstances.
            </Typography>
            <Typography>
              You acknowledge that you should not solely rely on the Output for critical decision-making. It is your responsibility to independently verify any information obtained from the Platform and to consult with qualified professionals before making any decisions that could affect your financial, legal, or physical status.
            </Typography>
          </section>

          <section className="space-y-4">
            <Typography font="season-mix" className="text-2xl text-foreground">Third Party Services & Model Providers</Typography>
            <Typography>
                Our Offerings may utilize services and models from third-party providers (such as OpenAI, Anthropic, or LiteLLM). By using the Platform, you acknowledge that your Inputs may be processed by these external services in accordance with their respective privacy and safety policies. {APP_NAME} does not control and is not liable for the conduct or accuracy of these external third-party models.
            </Typography>
          </section>

          <section className="space-y-4">
            <Typography font="season-mix" className="text-2xl text-foreground">Limitation of Liability</Typography>
            <Typography variant="page-description">
                IN NO EVENT SHALL THE COMPANY BE LIABLE FOR ANY DIRECT, INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF OR IN ANY WAY CONNECTED WITH THE ACCESS, USE OR PERFORMANCE OF THE OFFERINGS.
            </Typography>
          </section>

          <section className="space-y-4">
            <Typography font="season-mix" className="text-2xl text-foreground">Governing Law</Typography>
            <Typography>
                These Terms of Use shall be governed by the laws of India. Any dispute arising shall be subject to the exclusive jurisdiction of the courts at Bengaluru, India.
            </Typography>
          </section>
        </div>
      }
    />
  );
};

export const PrivacyPage: React.FC = () => {
  return (
    <LegalPage 
      title="Privacy Policy" 
      updatedDate="21st August, 2024"
      sections={
        <div className="space-y-10">
          <section className="space-y-6">
            <Typography>
                This Privacy Policy ("Privacy Policy") applies to your use of our website {PLATFORM_URL} ("Platform") and product offered through the Platform which are owned, controlled and operated by the Company.
            </Typography>
            <Typography className="font-bold text-foreground">
                BY ACCEPTING THE TERMS OF THE PRIVACY POLICY, YOU EXPRESSLY CONSENT TO OUR COLLECTION, RETENTION, ANALYSIS, USE AND DISCLOSURE OF YOUR PERSONAL DATA IN ACCORDANCE THEREOF.
            </Typography>
          </section>

          <section className="space-y-4">
            <Typography font="season-mix" className="text-2xl text-foreground">Objective & Scope</Typography>
            <Typography>
                We are committed to protect Users' privacy and appropriately and responsibly use collected data. This Privacy Policy covers the categories of personal data collected, how we use or process such data, and your associated rights under applicable laws.
            </Typography>
          </section>

          <section className="space-y-4">
            <Typography font="season-mix" className="text-2xl text-foreground">Data Collected</Typography>
            <Typography>
                We collect personal data including your first and last names, email address, mobile number, and location data. When you use our Product, we collect the inputs, file uploads, and outputs generated by the Product.
            </Typography>
            <Typography>
                We also automatically receive anonymous data sourced by your usage, such as standard usage logs, IP address, browser type, and device model.
            </Typography>
          </section>

          <section className="space-y-4">
            <Typography font="season-mix" className="text-2xl text-foreground">Method and Manner of Use of Data</Typography>
            <ul className="list-disc pl-6 space-y-3">
                <li>To provide troubleshooting and maintenance of our Offerings.</li>
                <li>To develop and improve our existing products and develop new ones.</li>
                <li>To identify a User and communicate regarding queries or requests.</li>
                <li>To enhance security and processes.</li>
                <li>To be compliant with applicable law.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <Typography font="season-mix" className="text-2xl text-foreground">Sharing of Data</Typography>
            <Typography>
                We will not use User data for any purpose other than in connection with Offerings. We may share the User data with required third parties in connection with our Offerings.
            </Typography>
          </section>

          <section className="space-y-4">
            <Typography font="season-mix" className="text-2xl text-foreground">Data Retention & Security</Typography>
            <Typography>
                We take reasonable steps to ensure that User data is available only for so long as is necessary. User data transmitted over the internet is protected through encryption (SSL).
            </Typography>
          </section>

          <section className="space-y-4">
            <Typography font="season-mix" className="text-2xl text-foreground">Cookies</Typography>
            <Typography>
                When you use our Offerings, one or more cookies will be sent to your device to improve the quality of our service and store your preferences. You have the option of disabling cookies via your device settings.
            </Typography>
          </section>

          <section className="space-y-4">
            <Typography font="season-mix" className="text-2xl text-foreground">International Data Transfers</Typography>
            <Typography>
                In providing the access to the Offerings, you understand that your information may be transferred to and stored at locations around the world. We ensure that any such transfers comply with applicable data protection laws through Standard Contractual Clauses or other approved legal frameworks.
            </Typography>
          </section>

          <section className="space-y-4">
            <Typography font="season-mix" className="text-2xl text-foreground">Grievance Redressal & Contact</Typography>
            <Typography>
                For the purposes of addressing complaints or exercising your rights (such as data deletion or access requests), you may contact our nodal grievance redressal officer at {CONTACT_EMAIL}.
            </Typography>
          </section>
        </div>
      }
    />
  );
};
