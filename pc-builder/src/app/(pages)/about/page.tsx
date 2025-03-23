'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

const AnimatedFeature = ({ icon, title, description, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="bg-card-bg border border-neon-green/20 rounded-xl p-8 shadow-neon-glow hover:shadow-neon-glow-lg transition-all"
    >
      <div className="w-12 h-12 mb-6 relative">
        <Image
          src={icon}
          alt={title}
          fill
          className="object-contain [filter:brightness(0)_invert(1)_sepia(1)_saturate(5)_hue-rotate(70deg)]" // Neon green filter
        />
      </div>
      <h3 className="text-xl font-bold mb-4 neon-text">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
};

const AnimatedValueProp = ({ icon, title, description, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, delay }}
      className="flex gap-4"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-black border border-neon-green shadow-neon-glow flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold mb-2 text-neon-green">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </motion.div>
  );
};

export default function About() {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: false });

  return (
    <main className="min-h-screen pt-24 pb-16 relative">
      {/* Main Background */}
      <div className="fixed inset-0 z-0">
        <Image 
          src="/images/bgBG.png" 
          alt="Neon Background" 
          fill 
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/85" />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-5xl font-black mb-6 neon-text"
          >
            Building the perfect PC
            <br />
            <span className="text-neon-green neon-flicker">
              for you
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Your journey to the perfect custom PC build starts here
          </motion.p>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <AnimatedFeature
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={0.1 * index}
            />
          ))}
        </div>
      </section>

      {/* Value Proposition */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
            className="relative aspect-square"
          >
            <div className="absolute inset-0 neon-border-pulse rounded-xl overflow-hidden">
              <Image
                src="/images/pc-build-preview.jpg"
                alt="PC Builder Interface"
                fill
                className="object-cover rounded-xl"
              />
            </div>
          </motion.div>
          
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: false, amount: 0.3 }}
              className="text-3xl font-bold mb-6 neon-text"
            >
              Why Choose Our Platform?
            </motion.h2>
            
            <div className="space-y-6">
              {valueProps.map((prop, index) => (
                <AnimatedValueProp
                  key={prop.title}
                  icon={prop.icon}
                  title={prop.title}
                  description={prop.description}
                  delay={0.2 + (index * 0.1)}
                />
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <Link
                href="/pcBuilder"
                className="neon-button inline-block mt-8 px-8 py-4 rounded-full text-lg font-medium hover:bg-neon-green-glow transition-all"
              >
                Start Building Now
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}

const features = [
  {
    title: 'Comprehensive Marketplace',
    description: 'Access a vast selection of PC components with real-time price comparisons across major retailers.',
    icon: '/icons/marketplace.svg'
  },
  {
    title: 'Compatibility Checker',
    description: 'Our smart system ensures all your chosen components work perfectly together.',
    icon: '/icons/compatibility.svg'
  },
  {
    title: 'Dynamic PC Builder',
    description: 'Intuitive interface to design and customize your dream PC build with real-time updates.',
    icon: '/icons/builder.svg'
  }
];

const valueProps = [
  {
    title: 'Real-time Price Tracking',
    description: 'Get the best deals with our automated price comparison system.',
    icon: <span className="text-neon-green text-xl">💰</span>
  },
  {
    title: 'Expert Recommendations',
    description: 'Receive personalized component suggestions based on your needs and budget.',
    icon: <span className="text-neon-green text-xl">🎯</span>
  },
  {
    title: 'Community Driven',
    description: 'Join thousands of PC enthusiasts and share your builds with the community.',
    icon: <span className="text-neon-green text-xl">👥</span>
  }
];
