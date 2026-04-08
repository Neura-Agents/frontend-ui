import React, { useState, useEffect } from 'react';
import { Typography } from '@/components/ui/typography';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import Footer from '@/components/landingPage/footer';
import AboutSpacer from '@/components/aboutUs/AboutSpacer';
import { cn } from '@/lib/utils';
import { useUmami } from '@/hooks/useUmami';

interface AgentInfoPageProps {
  type: 'a2a' | 'orchestrator';
}

const AgentInfoPage: React.FC<AgentInfoPageProps> = ({ type }) => {
  const { user } = useAuth();
  const [showFooterGlow, setShowFooterGlow] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { track } = useUmami();

  useEffect(() => {
    track('agent-info-view', { type });
    window.scrollTo(0, 0);
  }, [type, track]);

  const content = {
    a2a: {
      title: "Agent-to-Agent (A2A) Collaboration",
      subtitle: "The future of autonomous systems isn't a single AI, but a network of them.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1600",
      intro: "In the evolving landscape of Artificial Intelligence, the era of the 'lone genius' agent is giving way to collaborative networks. Agent-to-Agent (A2A) communication is the protocol that allows specialized AI entities to talk, negotiate, and work together.",
      sections: [
        {
          heading: "A Network of Specialists",
          body: "Imagine a world where your research agent doesn't just browse the web, but autonomously hires a data-analysis agent to process complex findings, then consults a design agent to visualize the results. This is A2A. Instead of one massive, general-purpose model, A2A relies on modular, highly-specialized agents that excel in specific domains."
        },
        {
          heading: "Autonomous Negotiation",
          body: "In a collaborative ecosystem, agents don't just pass data; they negotiate. One agent might request a specific dataset, while another verifies the credentials and security clearance before granting access. This decentralized approach ensures that every step of a workflow is handled by the most qualified 'expert' in the network."
        },
        {
          heading: "Swarm Intelligence",
          body: "When many agents work together, they exhibit swarm intelligence. This allows for massive scaling—solving problems that would be too large for any single AI to compute in a reasonable timeframe. It's the difference between a single powerful engine and a specialized factory floor where every movement is optimized for completion."
        },
        {
          heading: "The Security of Modular Systems",
          body: "Because agents are modular, security is inherently better. You can grant an agent access to a specific tool or knowledge base without exposing your entire system. If an agent is compromised or errors out, it remains isolated, protecting the integrity of the overall workflow."
        }
      ]
    },
    orchestrator: {
      title: "The Orchestrator Agent",
      subtitle: "The conductor of the AI symphony.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1600",
      intro: "As AI networks grow more complex, they need a central brain to manage the flow of information and tasks. Enter the Orchestrator—the high-level intelligence designed to oversee multiple specialized agents.",
      sections: [
        {
          heading: "The Brain Behind the Operation",
          body: "An Orchestrator Agent doesn't do the 'dirty work'; it manages it. It takes a high-level goal from a user ('Build me a marketing campaign'), decomposes it into smaller actionable steps, and assigns those steps to the best-suited agents in the network."
        },
        {
          heading: "Strategic Resource Planning",
          body: "Orchestration isn't just about routing; it's about strategy. The Orchestrator decides which agents to use based on accuracy requirements, speed, and cost. It acts as a project manager, ensuring that every piece of the puzzle fits into the larger strategic roadmap."
        },
        {
          heading: "Dynamic Feedback Loops",
          body: "Orchestrators monitor progress in real-time. If a specialized agent returns a subpar result, the Orchestrator catches it, provides feedback, and asks for a revision—or redirects the task to a different agent. It ensures the final output meets the user's standards through a continuous cycle of validation."
        },
        {
          heading: "Unified Interface for Complexity",
          body: "For the user, the Orchestrator acts as a single point of contact. You don't need to know which agent searched the web or which one analyzed the PDF; you just interact with the Orchestrator. This simplifies the user experience while allowing for infinite complexity behind the curtain."
        }
      ]
    }
  }[type];

  const BlogContent = (
    <div className={cn(
      "container mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12 pb-24",
      user ? "pt-32" : "pt-24"
    )}>
      {/* Header Section */}
      <header className="space-y-4 px-4 text-center md:text-left">
        <div className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-2">
          <Typography scale="xs" className="text-primary font-medium uppercase tracking-wider">
            {type === 'a2a' ? 'Collaboration' : 'Management'}
          </Typography>
        </div>
        <Typography font="season-mix" className="text-3xl md:text-5xl leading-tight">
          {content.title}
        </Typography>
        <Typography scale="lg" className="text-muted-foreground max-w-2xl">
          {content.subtitle}
        </Typography>
      </header>

      {/* Featured Image Section */}
      <div className="px-4">
        <div className="relative rounded-3xl overflow-hidden aspect-video bg-muted shadow-2xl">
          {!imageLoaded && (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}
          <img
            src={content.image}
            alt={content.title}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-1000",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      </div>

      {/* Main Article Content */}
      <article className="max-w-none px-4 space-y-12">
        <section className="relative py-6 px-6 md:px-10 overflow-hidden rounded-[2.5rem] bg-card/40 border border-border/50 shadow-sm backdrop-blur-sm">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <Typography font="season-mix" className="relative z-10 leading-snug text-foreground/90 text-lg md:text-xl">
            {content.intro}
          </Typography>
        </section>

        {content.sections.map((section, idx) => (
          <section key={idx} className="space-y-6">
            <Typography font="season-mix" className="text-3xl md:text-3xl text-foreground">
              {section.heading}
            </Typography>
            <Typography className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {section.body}
            </Typography>
          </section>
        ))}

        <hr className="border-border/50 my-12" />

        <section className="bg-card/50 p-8 rounded-3xl border border-border/50 space-y-4">
          <Typography font="season-mix" className="text-xl md:text-2xl">
            Why It Matters on Our Platform
          </Typography>
          <Typography scale="sm" className="text-muted-foreground">
            Our infrastructure is built to support both {content.title.toLowerCase()} and intricate orchestration workflows.
            Whether you're looking to scale your AI workforce or build a master conductor for your enterprise, we provide the tools to make it happen.
          </Typography>
        </section>
      </article>
    </div>
  );

  if (user) {
    return <div className="min-h-screen bg-background">{BlogContent}</div>;
  }

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden bg-background">
      <div className="relative z-10 pointer-events-none">
        <div className="pointer-events-auto bg-card rounded-b-[3rem] pb-10 shadow-xl border-b border-border/10">
          {BlogContent}
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

export default AgentInfoPage;
