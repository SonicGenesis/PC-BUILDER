"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const AnimatedText = ({ text, className, delay = 0 }: { text: string, className?: string, delay?: number }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, isInView]);

  return (
    <motion.h3
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.6, 
            delay: delay,
            ease: "easeOut" 
          } 
        }
      }}
      className={className}
    >
      {text}
    </motion.h3>
  );
};

// Component for animated paragraphs with scroll-based glow
const AnimatedParagraph = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const textGlow = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    ["0 0 0px var(--neon-green)", "0 0 10px var(--neon-green)", "0 0 0px var(--neon-green)"]
  );

  return (
    <motion.p 
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1, delay }}
      style={{ textShadow: textGlow }}
      className="text-lg text-gray-300 mb-6"
    >
      {children}
    </motion.p>
  );
};

const AnimatedFeature = ({ icon, title, description, delay = 0 }: { icon: JSX.Element, title: string, description: string, delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const descGlow = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    ["0 0 0px var(--neon-green)", "0 0 5px var(--neon-green)", "0 0 0px var(--neon-green)"]
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
      className="bg-card-bg border border-neon-green/20 rounded-xl p-6 shadow-neon-glow hover:shadow-neon-glow-lg transition-all"
    >
      <div className="mb-4 text-neon-green">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-white neon-text">{title}</h3>
      <motion.p 
        style={{ textShadow: descGlow }}
        className="text-gray-300"
      >
        {description}
      </motion.p>
    </motion.div>
  );
};

export default function Home() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 300], [0.3, 1]);
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: false });

  return (
    <main className="min-h-screen relative overflow-hidden">
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
      <section ref={heroRef} className="relative py-24 lg:py-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-6xl font-black tracking-tight mb-8 neon-text"
            >
              AI-Powered PC Builds & <br className="hidden md:block" />
              <span className="text-neon-green neon-flicker">Smart Marketplace</span> for Components
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Link
                href="/pcBuilder"
                className="neon-button text-neon-green px-8 py-4 rounded-full text-lg font-medium hover:bg-neon-green-glow transition-all inline-block"
              >
                Start Building Smarter Today →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <AnimatedText 
                text="🚀 Build Smarter with AI" 
                className="text-2xl md:text-3xl font-bold mb-6 text-neon-green"
              />
              <AnimatedParagraph delay={0.2}>
                Let AI take the guesswork out of building your dream PC. Our AI-driven recommendation engine suggests the best component combinations based on your needs, budget, and latest market trends.
              </AnimatedParagraph>

              <AnimatedText 
                text="🔍 Real-Time Data, Smarter Choices" 
                className="text-2xl md:text-3xl font-bold mb-6 text-neon-green"
                delay={0.2}
              />
              <AnimatedParagraph delay={0.4}>
                We use advanced AI scraping (powered by Gemini) to bring you the most up-to-date specifications, reviews, and pricing from top retailers—so you always get the best deals.
              </AnimatedParagraph>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="aspect-square relative rounded-2xl overflow-hidden neon-card">
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, 0]
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="absolute inset-0"
                >
                  <Image
                    src="/images/PROCESSOR.jpg"
                    alt="AI-powered PC Building"
                    fill
                    className="object-cover"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                  <p className="text-white text-xl font-bold neon-text">Powered by advanced AI technology</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section className="py-20 lg:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="relative order-2 md:order-1"
            >
              <div className="aspect-square relative rounded-2xl overflow-hidden neon-card">
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, -2, 0]
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 1
                  }}
                  className="absolute inset-0"
                >
                  <Image
                    src="/images/RAM.jpg"
                    alt="PC Component Marketplace"
                    fill
                    className="object-cover"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                  <p className="text-white text-xl font-bold neon-text">Compare and shop with confidence</p>
                </div>
              </div>
            </motion.div>

            <div className="order-1 md:order-2">
              <AnimatedText 
                text="🛒 The Ultimate PC Component Marketplace" 
                className="text-2xl md:text-3xl font-bold mb-6 text-neon-green"
              />
              <AnimatedParagraph delay={0.2}>
                Compare, customize, and purchase PC parts with confidence. Our AI-curated marketplace ensures compatibility and offers the latest insights into product availability and performance.
              </AnimatedParagraph>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-10"
              >
                <h3 className="text-xl font-bold mb-4 neon-text">Why Choose Us?</h3>
                <ul className="space-y-3">
                  {[
                    "✅ AI-Optimized PC Builds for Performance & Value",
                    "✅ Real-Time Price & Availability Tracking",
                    "✅ Seamless Compatibility Checker",
                    "✅ One-Click Purchase Options"
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
                      className="text-white"
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 lg:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <AnimatedText 
              text="Smart Features for Your Building Journey" 
              className="text-3xl md:text-4xl font-bold mb-6 neon-text"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatedFeature 
              icon={<svg className="w-12 h-12 text-neon-green" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>}
              title="AI-Powered Recommendations"
              description="Get personalized component suggestions based on your budget, usage needs, and compatibility requirements."
              delay={0.1}
            />
            <AnimatedFeature 
              icon={<svg className="w-12 h-12 text-neon-green" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" /></svg>}
              title="Real-Time Price Tracking"
              description="Our advanced algorithms continuously monitor prices across top retailers to ensure you get the best deals on components."
              delay={0.2}
            />
            <AnimatedFeature 
              icon={<svg className="w-12 h-12 text-neon-green" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>}
              title="Compatibility Checking"
              description="Automatically verify that all components in your build work perfectly together, eliminating guesswork and potential issues."
              delay={0.3}
            />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: false, amount: 0.5 }}
            className="mt-16 text-center"
          >
            <Link
              href="/pcBuilder"
              className="neon-button text-neon-green px-8 py-4 rounded-full text-lg font-medium hover:bg-neon-green-glow transition-all inline-block"
            >
              Start Building Your PC →
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}