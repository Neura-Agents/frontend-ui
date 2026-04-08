import React, { useState, useEffect } from 'react';
import { Typography } from '@/components/ui/typography';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import Footer from '@/components/landingPage/footer';
import AboutSpacer from '@/components/aboutUs/AboutSpacer';
import { cn } from '@/lib/utils';
import { useUmami } from '@/hooks/useUmami';
import { Card, CardContent } from '@/components/ui/card';

const CapabilitiesPage: React.FC = () => {
  const { user } = useAuth();
  const [showFooterGlow, setShowFooterGlow] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { track } = useUmami();

  useEffect(() => {
    track('capabilities-page-view');
    window.scrollTo(0, 0);
  }, [track]);

  const capabilities = [
    {
      title: "Knowledge Bases (KBs)",
      description: "Our RAG-powered Knowledge Bases allow agents to instantly ingest, index, and retrieve information from your documents. Whether it's a 500-page manual or a collection of research papers, your agents can talk to your data with perfect citation and context.",
      details: "Support for all major document formats. Our advanced indexing ensures that your agents always find the right answer, reducing hallucinations and providing reliable, source-backed responses."
    },
    {
      title: "Knowledge Graphs (KGs)",
      description: "Moving beyond simple text search, our Knowledge Graphs map the complex relationships between entities in your data. This allows agents to understand nested hierarchies, trace historical lineages, and find non-obvious connections that traditional AI systems miss.",
      details: "Perfect for complex organizational data. Our graphs provide a layer of relational intelligence that helps agents understand the 'big picture' of how your business information is connected."
    },
    {
      title: "API & Tool Integration",
      description: "Agents aren't just thinkers—they're doers. With native support for external API tools, your agents can browse the web, send emails, schedule meetings, or interact with your proprietary internal software in real-time.",
      details: "Connect your agents to the tools you already use. With secure integration, agents can perform complex actions across your existing software ecosystem, turning insights into immediate results."
    },
    {
      title: "Model Context Protocol (MCP)",
      description: "We support the standardized Model Context Protocol, allowing you to connect agents to specialized data servers seamlessly. This creates a plug-and-play ecosystem where you can bring your own tools and data sources into our agent environment.",
      details: "An open approach to connectivity. By supporting global standards, we ensure your agents can grow and adapt as your enterprise data needs evolve, without being locked into a single provider."
    },
    {
      title: "Persistent Memory",
      description: "Most AI forgets. Ours remembers. With persistent memory, agents carry state, preferences, and context across multiple sessions. They learn your working style over time, becoming more personalized and effective the more you use them.",
      details: "A long-term memory that respects your privacy. Every interaction builds on the last, allowing your agents to become true digital partners that understand your unique goals and constraints."
    }
  ];

  const PageContent = (
    <div className={cn(
      "container mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-20 pb-24",
      user ? "pt-32" : "pt-24"
    )}>
      {/* Hero Section */}
      <header className="space-y-6 px-4 text-center">
        <div className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-4">
          <Typography scale="xs" className="text-primary font-semibold uppercase tracking-widest">
            Platform Infrastructure
          </Typography>
        </div>
        <Typography font="season-mix" className="text-3xl md:text-5xl leading-tight tracking-tight max-w-4xl mx-auto">
          Infinite Possibilities with Advanced Agentic Infrastructure
        </Typography>
        <Typography className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Our platform isn't just a place to talk to AI. It's a comprehensive ecosystem designed to empower agents with memory, tools, and world-class intelligence.
        </Typography>
      </header>

      {/* Featured Banner Image */}
      <div className="px-4">
        <div className="relative rounded-[3rem] overflow-hidden aspect-21/9 bg-muted shadow-2xl border border-border/10">
          {!imageLoaded && (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}
          <img
            src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=2000"
            alt="Capabilities Banner"
            className={cn(
              "w-full h-full object-cover transition-opacity duration-1000",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent" />
        </div>
      </div>

      {/* Intro Box */}
      <div className="px-4">
        <section className="relative py-10 px-8 md:px-16 overflow-hidden rounded-[2.5rem] bg-card/40 border border-border/50 shadow-sm backdrop-blur-sm mx-auto max-w-4xl">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <Typography font="season-mix" className="relative z-10 leading-relaxed text-foreground/90 text-center text-lg md:text-xl">
             We bridge the gap between static LLMs and dynamic agents by providing the underlying connective tissue that allows for multi-modal, long-term collaboration.
          </Typography>
        </section>
      </div>

      {/* Capabilities List (Full Width) */}
      <div className="flex flex-col gap-10 px-4">
        {capabilities.map((cap, idx) => (
          <Card key={idx} className="group overflow-hidden rounded-[2.5rem] bg-card/30 hover:bg-card/40 transition-all duration-500 shadow-sm border border-border/50 hover:border-primary/50">
            <CardContent className="p-10 md:p-14 space-y-8 relative overflow-hidden">
                <div className="space-y-4 max-w-3xl">
                  <Typography font="season-mix" className="text-3xl md:text-4xl group-hover:text-primary transition-colors duration-500">
                    {cap.title}
                  </Typography>
                  <Typography className="text-lg md:text-xl text-foreground/80 leading-relaxed font-medium">
                    {cap.description}
                  </Typography>
                </div>

                <div className="h-px bg-border/40 w-full" />

                <div className="max-w-3xl">
                    <Typography className="text-base md:text-lg text-muted-foreground leading-relaxed">
                        {cap.details}
                    </Typography>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Closing CTA */}
      <div className="px-4">
        <section className="text-center py-20 px-6 md:px-12 space-y-8 bg-primary/5 rounded-[3rem] md:rounded-[4rem] border border-primary/10">
          <Typography font="season-mix" className="text-3xl md:text-5xl leading-tight">
            Ready to build something extraordinary?
          </Typography>
          <Typography className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Combine these capabilities to create the next generation of autonomous agents customized for your specific business needs.
          </Typography>
        </section>
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

export default CapabilitiesPage;
