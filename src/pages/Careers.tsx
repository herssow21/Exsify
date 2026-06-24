import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Clock, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const jobOpenings = [
  {
    id: 1,
    title: 'Senior Full-Stack Developer',
    department: 'Engineering',
    location: 'Remote (MENA Region)',
    type: 'Full-time',
    description: 'We are looking for an experienced Full-Stack Developer to join our engineering team. You will be responsible for building and maintaining our SaaS products.',
    requirements: [
      '5+ years of experience in full-stack development',
      'Strong proficiency in React, Node.js, and TypeScript',
      'Experience with cloud services (AWS/Azure)',
      'Knowledge of database design and optimization'
    ]
  },
  {
    id: 2,
    title: 'Product Manager',
    department: 'Product',
    location: 'Riyadh, Saudi Arabia',
    type: 'Full-time',
    description: 'Join our product team to help shape the future of EXSIFY solutions. You will work closely with engineering, design, and customers.',
    requirements: [
      '3+ years of product management experience',
      'Experience in B2B SaaS products',
      'Strong analytical and communication skills',
      'Understanding of African and Middle Eastern markets is a plus'
    ]
  },
  {
    id: 3,
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'Dubai, UAE',
    type: 'Full-time',
    description: 'Help our customers succeed by providing exceptional support and guidance throughout their journey with EXSIFY.',
    requirements: [
      '3+ years in customer success or account management',
      'Experience with SaaS products',
      'Excellent communication skills in English and Arabic',
      'Problem-solving mindset'
    ]
  },
  {
    id: 4,
    title: 'Sales Representative',
    department: 'Sales',
    location: 'Cairo, Egypt',
    type: 'Full-time',
    description: 'Drive growth by acquiring new customers and building relationships with businesses across the region.',
    requirements: [
      '2+ years of B2B sales experience',
      'Proven track record of meeting targets',
      'Strong negotiation and presentation skills',
      'Fluency in Arabic and English'
    ]
  },
  {
    id: 5,
    title: 'UX/UI Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    description: 'Create beautiful and intuitive user experiences for our suite of business applications.',
    requirements: [
      '3+ years of UX/UI design experience',
      'Proficiency in Figma and design tools',
      'Portfolio demonstrating strong design skills',
      'Experience with design systems'
    ]
  }
];

const benefits = [
  {
    title: 'Competitive Salary',
    description: 'We offer market-competitive compensation packages'
  },
  {
    title: 'Remote Friendly',
    description: 'Work from anywhere in the MENA region'
  },
  {
    title: 'Health Insurance',
    description: 'Comprehensive health coverage for you and your family'
  },
  {
    title: 'Learning Budget',
    description: 'Annual budget for courses, conferences, and books'
  },
  {
    title: 'Flexible Hours',
    description: 'Work when you are most productive'
  },
  {
    title: 'Paid Time Off',
    description: 'Generous vacation and parental leave policies'
  }
];

export default function Careers() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [expandedJob, setExpandedJob] = useState<number | null>(null);

  const toggleJob = (jobId: number) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  const handleApply = (jobTitle: string) => {
    showToast(`Application submitted for ${jobTitle}`, 'success');
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#1E293B] mb-6">
            Join Our{' '}
            <span className="bg-gradient-to-r from-[hsl(var(--exsify-primary))] to-[hsl(var(--exsify-accent))] bg-clip-text text-transparent">
              Team
            </span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Help us build the future of business software in Africa and the Middle East. 
            We are always looking for talented individuals who share our passion.
          </p>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-[#1E293B] text-center mb-8">Why Work at EXSIFY?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <h3 className="text-[#1E293B] font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Job Openings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-[#1E293B] text-center mb-8">Open Positions</h2>
          <div className="space-y-4">
            {jobOpenings.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleJob(job.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="text-[#1E293B] font-bold text-lg mb-2">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  {expandedJob === job.id ? (
                    <ChevronUp className="w-6 h-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </button>

                {expandedJob === job.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-6 border-t border-gray-200"
                  >
                    <div className="pt-4">
                      <p className="text-gray-500 mb-4">{job.description}</p>
                      <h4 className="text-white font-medium mb-2">Requirements:</h4>
                      <ul className="list-disc list-inside text-gray-500 mb-6 space-y-1">
                        {job.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handleApply(job.title)}
                        className="flex items-center gap-2 px-6 py-3 bg-[hsl(var(--exsify-primary))] text-white rounded-lg hover:bg-[hsl(var(--exsify-primary))]/80 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        Apply Now
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* No positions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 mb-4">Don't see a position that fits your skills?</p>
          <button
            onClick={() => showToast('Thank you for your interest! Please send your CV to careers@exsify.com', 'info')}
            className="text-[hsl(var(--exsify-primary))] hover:underline"
          >
            Send us your resume anyway
          </button>
        </motion.div>
      </div>
    </div>
  );
}
