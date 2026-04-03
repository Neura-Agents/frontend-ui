import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Ghost } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const APP_NAME = import.meta.env.VITE_APP_NAME || "WormLabs";

  useEffect(() => {
    document.title = `404 Not Found | ${APP_NAME}`;
  }, [APP_NAME]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-[120px] -z-10 animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Animated Ghost Icon */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8 flex justify-center text-primary"
        >
          <Ghost size={120} strokeWidth={1.5} />
        </motion.div>

        {/* 404 Text */}
        <motion.h1
          className="text-4xl md:text-[12rem] font-season tracking-tighter leading-none mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          404
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl md:text-3xl font-matter font-medium mb-4 text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-10 font-matter">
            The space you're looking for doesn't exist or has been moved to another dimension. Let's get you back on track.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(-1)}
            className="rounded-full border-border/50 bg-background/50 backdrop-blur-sm hover:bg-accent transition-all duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
          <Button
            size="lg"
            onClick={() => navigate('/')}
            className="rounded-full"
          > Return Home
          </Button>
        </motion.div>
      </motion.div>

      {/* Subtle decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20 opacity-20">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border border-primary/30 rounded-full"
            initial={{
              width: 0,
              height: 0,
              opacity: 0
            }}
            animate={{
              width: (i + 1) * 300,
              height: (i + 1) * 300,
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "linear"
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NotFoundPage;
