import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Target, Eye, Heart, Users, Award, Globe } from 'lucide-react';
import { partnerCountries } from '../utils/countryFlags';

const values = [
  {
    icon: Heart,
    title: 'Customer First',
    description: 'We put our customers at the center of everything we do, ensuring their success is our priority.'
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We strive for excellence in every product we build and every interaction we have.'
  },
  {
    icon: Users,
    title: 'Inclusivity',
    description: 'We design solutions that work for everyone, regardless of technical expertise or location.'
  },
  {
    icon: Globe,
    title: 'Local Focus',
    description: 'We understand the unique challenges of African and Middle Eastern markets.'
  }
];

const team = [
  {
    name: 'Ahmed Al-Rashid',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
  },
  {
    name: 'Fatima Hassan',
    role: 'Chief Technology Officer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'
  },
  {
    name: 'John Kamau',
    role: 'Head of Product',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200'
  },
  {
    name: 'Amina Ibrahim',
    role: 'Head of Customer Success',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200'
  }
];

export default function WhoWeAre() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-start"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1E293B] mb-6 tracking-tight">
            Who We{' '}
            <span className="bg-gradient-to-r from-[hsl(var(--exsify-primary))] to-[hsl(var(--exsify-accent))] bg-clip-text text-transparent">
              Are
            </span>
          </h1>
          <p className="text-gray-600 max-w-3xl text-base sm:text-lg leading-relaxed">
            EXSIFY is a technology company dedicated to empowering businesses across Africa and the Middle East
            with innovative software solutions. We understand the unique challenges of operating in these markets
            and build tools that help businesses thrive.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md hover:border-[hsl(var(--exsify-primary))]/30 transition-all"
          >
            <div className="w-14 h-14 bg-[hsl(var(--exsify-primary))]/10 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-[hsl(var(--exsify-primary))]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1E293B] mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To democratize access to powerful business software for companies across Africa and the Middle East,
              enabling them to compete on a global scale while respecting local requirements and constraints.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md hover:border-[hsl(var(--exsify-primary))]/30 transition-all"
          >
            <div className="w-14 h-14 bg-[hsl(var(--exsify-accent))]/10 rounded-xl flex items-center justify-center mb-6">
              <Eye className="w-7 h-7 text-[hsl(var(--exsify-accent))]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1E293B] mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To become the leading provider of business software solutions in Africa and the Middle East,
              recognized for our innovation, customer-centricity, and deep understanding of regional markets.
            </p>
          </motion.div>
        </div>

        {/* Our Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B] mb-4">Our Values</h2>
          <p className="text-gray-600 max-w-2xl">
            The principles that guide everything we do
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-[hsl(var(--exsify-primary))]/30 transition-all"
            >
              <div className="w-12 h-12 bg-[hsl(var(--exsify-primary))]/10 rounded-xl flex items-center justify-center mb-4">
                <value.icon className="w-6 h-6 text-[hsl(var(--exsify-primary))]" />
              </div>
              <h3 className="text-lg font-bold text-[#1E293B] mb-2">{value.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Our Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B] mb-4">Meet Our Team</h2>
          <p className="text-gray-600 max-w-2xl">
            The passionate people behind EXSIFY
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div className="relative overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--exsify-dark))] via-transparent to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="text-[#1E293B] font-bold">{member.name}</h3>
                <p className="text-[hsl(var(--exsify-primary))] text-sm">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {[
            { value: '2019', label: 'Founded' },
            { value: '50+', label: 'Team Members' },
            { value: '8', label: 'Products' },
            { value: `${partnerCountries.length}+`, label: 'Countries' }
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 text-center shadow-sm"
            >
              <p className="text-2xl sm:text-3xl font-black text-[hsl(var(--exsify-accent))] mb-1">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
