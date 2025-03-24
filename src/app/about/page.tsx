'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const stats = [
    { number: '100+', label: 'Projects Delivered' },
    { number: '99%', label: 'Client Satisfaction' },
    { number: '24/7', label: 'Support' },
    { number: '5⭐', label: 'Average Rating' }
  ];
  
  const timeline = [
    { year: 2023, title: 'Innovation', description: 'Launched cutting-edge web applications with next-gen technologies.' },
    { year: 2023, title: 'Excellence', description: 'Delivered high-performance solutions with modern frameworks.' },
    { year: 2024, title: 'Growth', description: 'Expanded our digital footprint with innovative web solutions.' },
    { year: 2024, title: 'Future', description: 'Continuing to innovate and push technological boundaries.' }
  ];

  const values = [
    { icon: '💡', title: 'Innovation First', description: 'We embrace cutting-edge technologies to create exceptional digital experiences.' },
    { icon: '✨', title: 'Quality Driven', description: 'Every project is crafted with attention to detail and performance in mind.' },
    { icon: '🚀', title: 'Future Ready', description: 'Building solutions that are scalable and prepared for tomorrow\'s challenges.' }
  ];
  
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="bg-secondary text-white py-24 relative">
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6">Our Story & Mission</h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              We're a team of experts dedicated to transforming businesses through innovative digital solutions.
            </p>
          </motion.div>
        </div>
        
        {/* Background pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl font-bold text-secondary mb-6">Our Story</h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-secondary/80 mb-4">
                Founded with a vision to revolutionize digital experiences, we specialize in creating innovative solutions that transform how businesses operate in the digital age.
              </p>
              <p className="text-lg text-secondary/80 mb-4">
                Our expertise spans across modern web technologies, focusing on delivering exceptional user experiences and powerful functionality.
              </p>
              <p className="text-lg text-secondary/80">
                Today, we continue to push boundaries and set new standards in web development and digital innovation.
              </p>
            </div>
          </motion.div>
          
          {/* Timeline */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          >
            {timeline.map((item, index) => (
              <div 
                key={index}
                className="bg-accent rounded-xl p-8 border border-foreground/5 hover:shadow-md transition-shadow"
              >
                <div className="text-primary font-semibold mb-2">{item.year}</div>
                <h3 className="text-xl font-bold text-secondary mb-3">{item.title}</h3>
                <p className="text-secondary/70">{item.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Our Values Section */}
      <section className="py-20 bg-accent">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl font-bold text-secondary mb-6">Our Values</h2>
            <p className="text-lg text-secondary/80 max-w-2xl mx-auto">
              The principles that drive our innovation
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-foreground/5"
              >
                <div className="text-5xl mb-6">{value.icon}</div>
                <h3 className="text-xl font-bold text-secondary mb-3">{value.title}</h3>
                <p className="text-secondary/70">{value.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-secondary mb-6">Ready to Work With Us?</h2>
            <p className="text-lg text-secondary/80 max-w-2xl mx-auto mb-8">
              Let's discuss how we can help you achieve your business goals with our solutions.
            </p>
            <a 
              href="mailto:contact@yourcompany.com" 
              className="inline-flex items-center rounded-md bg-primary px-8 py-3 text-base font-medium text-white hover:bg-primary-dark transition-colors"
            >
              Contact Our Team
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 