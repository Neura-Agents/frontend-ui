import React, { useState, useEffect } from 'react';
import { Typography } from '@/components/ui/typography';
import { useAuth } from '@/context/AuthContext';
import Footer from '@/components/landingPage/footer';
import AboutSpacer from '@/components/aboutUs/AboutSpacer';
import { cn } from '@/lib/utils';
import { useUmami } from '@/hooks/useUmami';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ContactPage: React.FC = () => {
  const { user } = useAuth();
  const [showFooterGlow, setShowFooterGlow] = useState(false);
  const { track } = useUmami();

  useEffect(() => {
    track('contact-page-view');
    window.scrollTo(0, 0);
  }, [track]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    company: '',
    product: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    track('contact-form-submit', { product: formData.product });
    // Handle submission logic here
    alert('Thank you for reaching out! Our sales team will get back to you shortly.');
  };

  const PageContent = (
    <div className={cn(
      "container mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-16 pb-24",
      user ? "pt-32" : "pt-24"
    )}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 px-4">
        {/* Left Side - Info */}
        <div className="space-y-8">
          <header className="space-y-6">
            <div className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-4">
              <Typography scale="xs" className="text-primary font-semibold uppercase tracking-widest">
                Get in Touch
              </Typography>
            </div>
            <Typography font="season-mix" className="text-4xl md:text-6xl leading-tight tracking-tight">
              Let's build the future of AI together.
            </Typography>
            <Typography className="text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed">
              Our sales team is ready to help you navigate the agentic landscape and find the perfect solution for your enterprise.
            </Typography>
          </header>

          <div className="space-y-10 pt-8">
            <div className="space-y-2">
              <Typography font="season-mix" className="text-xl md:text-2xl">
                Global Enterprise Support
              </Typography>
              <Typography className="text-muted-foreground">
                Dedicated partners for complex infrastructure, deployment, and security auditing.
              </Typography>
            </div>
            <div className="space-y-2">
              <Typography font="season-mix" className="text-xl md:text-2xl">
                Custom Solutions
              </Typography>
              <Typography className="text-muted-foreground">
                Tailored agent personas and specialized knowledge architectures built for your specific data silos.
              </Typography>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="relative">
          <div className="absolute -inset-4 bg-linear-to-tr from-primary/5 to-transparent blur-2xl -z-10 rounded-[3rem]" />
          
          <form 
            onSubmit={handleSubmit}
            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-8"
          >
            <Typography font="season-mix" className="text-3xl md:text-4xl text-center md:text-left mb-4">
              Contact Sales
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-[0.9rem] font-medium ml-1">First name*</Label>
                <Input 
                  id="firstName" 
                  placeholder="eg. John" 
                  required 
                  className="rounded-2xl h-12 bg-muted/20 border-border/40 focus:border-primary/50 transition-all"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-[0.9rem] font-medium ml-1">Last name*</Label>
                <Input 
                  id="lastName" 
                  placeholder="eg. Doe" 
                  required 
                  className="rounded-2xl h-12 bg-muted/20 border-border/40 focus:border-primary/50 transition-all"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[0.9rem] font-medium ml-1">Work Email*</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="eg. john.doe@company.com" 
                  required 
                  className="rounded-2xl h-12 bg-muted/20 border-border/40 focus:border-primary/50 transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[0.9rem] font-medium ml-1">Mobile phone number*</Label>
                <Input 
                  id="phone" 
                  placeholder="eg. 9129139145" 
                  required 
                  className="rounded-2xl h-12 bg-muted/20 border-border/40 focus:border-primary/50 transition-all"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="jobTitle" className="text-[0.9rem] font-medium ml-1">Job title*</Label>
                <Input 
                  id="jobTitle" 
                  placeholder="eg. Senior Product Manager" 
                  required 
                  className="rounded-2xl h-12 bg-muted/20 border-border/40 focus:border-primary/50 transition-all"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-[0.9rem] font-medium ml-1">Company name*</Label>
                <Input 
                  id="company" 
                  placeholder="eg. Acme Corp" 
                  required 
                  className="rounded-2xl h-12 bg-muted/20 border-border/40 focus:border-primary/50 transition-all"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product" className="text-[0.9rem] font-medium ml-1">Which product are you interested in?*</Label>
              <select 
                id="product"
                required
                className="w-full rounded-2xl h-12 bg-muted/20 border border-border/40 px-4 focus:outline-hidden focus:border-primary/50 transition-all appearance-none cursor-pointer"
                value={formData.product}
                onChange={(e) => setFormData({...formData, product: e.target.value})}
              >
                <option value="" disabled>Please Select</option>
                <option value="a2a">A2A Agents</option>
                <option value="orchestrator">Orchestrator Agents</option>
                <option value="capabilities">Platform Capabilities</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-[0.9rem] font-medium ml-1">Message*</Label>
              <textarea 
                id="message"
                placeholder="Tell us what you're looking for"
                required
                className="w-full rounded-2xl p-4 bg-muted/20 border border-border/40 min-h-[120px] focus:outline-hidden focus:border-primary/50 transition-all"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>

            <Button 
                type="submit" 
                className="w-full md:w-fit md:px-10 rounded-xl h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all"
            >
              Send Request
            </Button>
          </form>
        </div>
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

      {/* Footer */}
      <div className="fixed bottom-0 left-0 w-full z-0">
        <Footer animateGlow={showFooterGlow} />
      </div>
    </div>
  );
};

export default ContactPage;
