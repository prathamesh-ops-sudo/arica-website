'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Testimonial = {
  image: string;
  text: string;
  name: string;
  jobtitle: string;
};

type TypewriterTestimonialProps = {
  testimonials: Testimonial[];
};

type TestimonialPopupProps = {
  testimonial: Testimonial;
};

const TestimonialPopup: React.FC<TestimonialPopupProps> = ({ testimonial }) => {
  const [typedText, setTypedText] = useState('');
  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let i = 0;
    const type = () => {
      if (i <= testimonial.text.length) {
        setTypedText(testimonial.text.slice(0, i));
        i++;
        typewriterTimeoutRef.current = setTimeout(type, 50);
      }
    };
    type();

    return () => {
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
      }
    };
  }, [testimonial.text]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: -20 }}
      exit={{ opacity: 0, scale: 0.8, y: -10 }}
      transition={{ duration: 0.4 }}
      className="absolute bottom-20 bg-[#1C2C5A] text-white text-sm px-4 py-3 rounded-lg shadow-2xl max-w-xs w-56 border border-[#3D70B7]/30"
    >
      <div className="min-h-24 max-h-40 overflow-y-auto whitespace-pre-wrap">
        {typedText}
        <span className="animate-pulse">|</span>
      </div>
      <p className="mt-2 text-right font-semibold text-[#3D70B7]">{testimonial.name}</p>
      <p className="text-right text-gray-400 text-sm">{testimonial.jobtitle}</p>
      <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-4">
        <div className="w-3 h-3 bg-[#1C2C5A] rounded-full shadow-lg border border-[#3D70B7]/30"></div>
        <div className="w-2 h-2 bg-[#1C2C5A] rounded-full shadow-lg mt-1 border border-[#3D70B7]/20"></div>
        <div className="w-1 h-1 bg-[#1C2C5A] rounded-full shadow-lg mt-1"></div>
      </div>
    </motion.div>
  );
};

export const TypewriterTestimonial: React.FC<TypewriterTestimonialProps> = ({ testimonials }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hasBeenHovered, setHasBeenHovered] = useState<boolean[]>(new Array(testimonials.length).fill(false));

  const handleMouseEnter = useCallback((index: number) => {
    setHoveredIndex(index);
    setHasBeenHovered(prev => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  return (
    <div className="flex justify-center items-center gap-4 flex-wrap">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={index}
          className="relative flex flex-col items-center"
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-16 h-16 rounded-full border-4 hover:animate-pulse object-cover"
            animate={{
              borderColor: (hoveredIndex === index || hasBeenHovered[index]) ? '#3D70B7' : 'rgba(255,255,255,0.2)'
            }}
            transition={{ duration: 0.3 }}
          />
          <AnimatePresence>
            {hoveredIndex === index && (
              <TestimonialPopup testimonial={testimonial} />
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};
