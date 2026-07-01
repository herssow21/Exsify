import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Briefcase, Clock, ChevronDown, ChevronUp, Send, X, FileUp, User, Mail, FileText } from 'lucide-react';
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
  { title: 'Competitive Salary', description: 'We offer market-competitive compensation packages', icon: Briefcase },
  { title: 'Remote Friendly', description: 'Work from anywhere in the MENA region', icon: MapPin },
  { title: 'Health Insurance', description: 'Comprehensive health coverage for you and your family', icon: User },
  { title: 'Learning Budget', description: 'Annual budget for courses, conferences, and books', icon: FileText },
  { title: 'Flexible Hours', description: 'Work when you are most productive', icon: Clock },
  { title: 'Paid Time Off', description: 'Generous vacation and parental leave policies', icon: Send },
];

export default function Careers() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [applyJob, setApplyJob] = useState<{ id: number; title: string } | null>(null);
  const [applicant, setApplicant] = useState({ name: '', email: '', message: '' });
  const [cvFile, setCvFile] = useState<File | null>(null);

  const toggleJob = (jobId: number) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type !== 'application/pdf') {
      showToast('Please upload a PDF file', 'error');
      return;
    }
    setCvFile(file);
  };

  const submitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyJob) return;
    if (!applicant.name || !applicant.email || !cvFile) {
      showToast('Please provide your name, email, and a PDF CV', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const applications = JSON.parse(localStorage.getItem('exsify_job_applications') || '[]');
      applications.push({
        id: `app-${Date.now()}`,
        jobId: applyJob.id,
        jobTitle: applyJob.title,
        name: applicant.name,
        email: applicant.email,
        message: applicant.message,
        cvName: cvFile.name,
        cvData: reader.result,
        appliedAt: new Date().toISOString(),
      });
      localStorage.setItem('exsify_job_applications', JSON.stringify(applications));

      showToast(`Application submitted for ${applyJob.title}`, 'success');
      setApplyJob(null);
      setApplicant({ name: '', email: '', message: '' });
      setCvFile(null);
    };
    reader.readAsDataURL(cvFile);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-start"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1E293B] dark:text-white mb-6 tracking-tight">
            Join Our{' '}
            <span className="bg-gradient-to-r from-[hsl(var(--exsify-primary))] to-[hsl(var(--exsify-accent))] bg-clip-text text-transparent">
              Team
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl text-base sm:text-lg">
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
          <h2 className="text-2xl font-bold text-[#1E293B] dark:text-white mb-8">Why Work at EXSIFY?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-white/10 p-6 shadow-sm hover:shadow-md hover:border-[hsl(var(--exsify-primary))]/30 transition-all"
              >
                <div className="w-10 h-10 bg-[hsl(var(--exsify-primary))]/10 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="w-5 h-5 text-[hsl(var(--exsify-primary))]" />
                </div>
                <h3 className="text-[#1E293B] dark:text-white font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-500 dark:text-gray-300 text-sm">{benefit.description}</p>
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
          <h2 className="text-2xl font-bold text-[#1E293B] dark:text-white mb-8">Open Positions</h2>
          <div className="space-y-4">
            {jobOpenings.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleJob(job.id)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="text-[#1E293B] dark:text-white font-bold text-lg mb-2">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-500 dark:text-gray-300">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4 text-[hsl(var(--exsify-primary))]" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-[hsl(var(--exsify-primary))]" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-[hsl(var(--exsify-primary))]" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  {expandedJob === job.id ? (
                    <ChevronUp className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedJob === job.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 sm:px-6 pb-6 border-t border-gray-100 dark:border-white/10"
                    >
                      <div className="pt-4">
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{job.description}</p>
                        <h4 className="text-[#1E293B] dark:text-white font-bold mb-2">Requirements:</h4>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-1">
                          {job.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                        <button
                          onClick={() => setApplyJob({ id: job.id, title: job.title })}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-[hsl(var(--exsify-primary))] text-white rounded-lg font-semibold hover:bg-[hsl(var(--exsify-primary-dark))] transition-colors"
                        >
                          <Send className="w-4 h-4" />
                          Apply Now
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* No positions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-6 bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-white/10 text-center"
        >
          <p className="text-gray-600 dark:text-gray-300 mb-2">Don't see a position that fits your skills?</p>
          <a
            href="mailto:careers@exsify.com"
            className="text-[hsl(var(--exsify-primary))] hover:underline font-medium"
          >
            Send us your resume anyway
          </a>
        </motion.div>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {applyJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setApplyJob(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#1E293B] dark:text-white">Apply for {applyJob.title}</h3>
                  <p className="text-gray-500 dark:text-gray-300 text-sm">Upload your CV in PDF format</p>
                </div>
                <button
                  onClick={() => setApplyJob(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={submitApplication} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={applicant.name}
                      onChange={(e) => setApplicant({ ...applicant, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#0B1120] border border-gray-200 dark:border-white/10 rounded-lg text-[#1E293B] dark:text-white focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={applicant.email}
                      onChange={(e) => setApplicant({ ...applicant, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#0B1120] border border-gray-200 dark:border-white/10 rounded-lg text-[#1E293B] dark:text-white focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                      placeholder="john@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">CV / Resume (PDF) *</label>
                  <label className="flex flex-col items-center justify-center gap-2 w-full px-4 py-6 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-lg cursor-pointer hover:border-[hsl(var(--exsify-primary))] hover:bg-[hsl(var(--exsify-primary))]/5 transition-colors">
                    <FileUp className="w-8 h-8 text-[hsl(var(--exsify-primary))]" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {cvFile ? cvFile.name : 'Click to upload PDF'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Cover Message</label>
                  <textarea
                    value={applicant.message}
                    onChange={(e) => setApplicant({ ...applicant, message: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B1120] border border-gray-200 dark:border-white/10 rounded-lg text-[#1E293B] dark:text-white focus:border-[hsl(var(--exsify-primary))] focus:outline-none resize-none"
                    placeholder="Tell us why you're a great fit..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[hsl(var(--exsify-primary))] text-white rounded-lg font-semibold hover:bg-[hsl(var(--exsify-primary-dark))] transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Submit Application
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
