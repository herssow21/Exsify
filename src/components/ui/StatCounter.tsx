import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  label: string;
  icon: React.ElementType;
  color?: string;
  index?: number;
}

export default function StatCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2,
  label,
  icon: Icon
}: StatCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isInView, value, duration]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="text-center group"
    >
      <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[hsl(var(--exsify-primary))]/20 rounded-2xl mb-4 group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300">
        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-[hsl(var(--exsify-accent))] group-hover:rotate-6 transition-transform duration-300" />
      </div>
      <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1E293B] dark:text-white mb-2">
        {prefix}
        {formatNumber(count)}
        {suffix}
      </div>
      <p className="text-gray-400 dark:text-gray-300 text-sm">{label}</p>
    </motion.div>
  );
}
