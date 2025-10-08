'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/NavBar'
import Footer from '@/components/Footer'
import Testimonials from '@/components/Testimonials'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import Link from 'next/link'

interface TeamMember {
  name: string;
  role: string;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    name: 'Prabhat Krishna',
    role: 'Team Leader',
    socials: {
      github: 'https://github.com/prabhat',
      linkedin: 'https://linkedin.com/in/prabhat-krishna',
    },
  },
  {
    name: 'Sarthak Singh',
    role: 'Team Member',
    socials: {
      github: 'https://github.com/sarthak',
      linkedin: 'https://linkedin.com/in/sarthak-singh',
    },
  },
  {
    name: 'Monu',
    role: 'Team Member',
    socials: {
      github: 'https://github.com/monu',
      linkedin: 'https://linkedin.com/in/monu',
    },
  },
  {
    name: 'Chrishna',
    role: 'Team Member',
    socials: {
      github: 'https://github.com/chrishna',
      linkedin: 'https://linkedin.com/in/chrishna',
    },
  },
];


export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null)

  const MemberGrid = ({ members, title }: { members: TeamMember[]; title: string }) => (
    <div className="mb-16">
      <h2 className="text-2xl font-semibold text-gray-900 mb-12 text-center relative">
        <span className="relative">
          {title}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-pink-500 rounded-full"></div>
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
        {members.map((member, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl border border-gray-100 w-full max-w-xs"
          >
            <div className="mb-6">
              <div className="w-28 h-28 bg-gradient-to-br from-pink-500 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
                <span className="text-3xl font-bold text-white">{member.name.charAt(0)}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">{member.name}</h3>
              <p className="text-pink-600 font-medium mb-4 text-center text-sm">{member.role}</p>
              <p className="text-gray-600 text-sm mb-6 text-center leading-relaxed">
                Passionate about creating impactful educational solutions
              </p>
            </div>

            <div className="flex justify-center space-x-4 pt-4 border-t border-gray-100">
              {member.socials.github && (
                <Link
                  href={member.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transform hover:scale-110 transition-transform hover:-translate-y-1"
                >
                  <FaGithub className="w-6 h-6 text-gray-700 hover:text-gray-900" />
                </Link>
              )}
              {member.socials.linkedin && (
                <Link
                  href={member.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transform hover:scale-110 transition-transform hover:-translate-y-1"
                >
                  <FaLinkedin className="w-6 h-6 text-blue-600 hover:text-blue-700" />
                </Link>
              )}
              {member.socials.twitter && (
                <Link
                  href={member.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transform hover:scale-110 transition-transform hover:-translate-y-1"
                >
                  <FaTwitter className="w-6 h-6 text-blue-400 hover:text-blue-500" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const features = [
    {
      id: 'dashboard',
      title: 'Smart Dashboard',
      description: 'Personalized study tracking and analytics',
      icon: '🏠',
      path: '#',
      color: 'bg-blue-500'
    },
    {
      id: 'study',
      title: 'Study Material',
      description: 'AI-curated learning resources',
      icon: '📚',
      path: '#',
      color: 'bg-green-500'
    },
    {
      id: 'practice',
      title: 'Practice Tests',
      description: 'Exam-specific mock tests',
      icon: '✍️',
      path: '#',
      color: 'bg-purple-500'
    },
    {
      id: 'community',
      title: 'Community',
      description: 'Connect with fellow aspirants',
      icon: '👥',
      path: '#',
      color: 'bg-orange-500'
    }
  ]

  const handleGetStarted = () => {
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Master Your Competitive Exams
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              AI-powered preparation platform designed specifically for Indian competitive exams
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button 
                onClick={handleGetStarted}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.id}>
              <motion.div
                className={`relative rounded-xl p-6 cursor-pointer ${
                  hoveredFeature === feature.id ? 'shadow-lg' : 'shadow-sm'
                } bg-white transition-all duration-300`}
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
                whileHover={{ y: -5 }}
              >
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center text-2xl mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
                <motion.div
                  className="absolute bottom-4 right-4"
                  animate={{
                    x: hoveredFeature === feature.id ? 0 : 10,
                    opacity: hoveredFeature === feature.id ? 1 : 0
                  }}
                >
                  →
                </motion.div>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold text-blue-600 mb-2">50,000+</div>
              <div className="text-gray-600">Active Students</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Practice Questions</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </motion.div>
          </div>
        </div>
      </section>

      <Testimonials/>
      
      {/* Pricing Section */}
      <main className="flex-grow">
        <div className="pt-20 min-h-screen bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Choose the plan that best fits your needs
              </p>
            </div>

            <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-x-8">
              {/* Free Plan */}
              <div className="rounded-lg shadow-lg bg-white p-8">
                <h3 className="text-2xl font-semibold text-gray-900">Free</h3>
                <p className="mt-4 text-gray-600">Perfect to get started</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">$0</span>
                  <span className="text-base font-medium text-gray-500">/month</span>
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-600">Basic features</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-600">Limited access</span>
                  </li>
                </ul>
                <button 
                  onClick={() => router.push('/auth/signup')}
                  className="mt-8 w-full bg-purple-600 text-white rounded-md py-2 px-4 hover:bg-purple-700"
                >
                  Get Started
                </button>
              </div>

              {/* Pro Plan */}
              <div className="rounded-lg shadow-lg bg-white p-8 border-2 border-purple-500">
                <h3 className="text-2xl font-semibold text-gray-900">Pro</h3>
                <p className="mt-4 text-gray-600">For serious learners</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">$29</span>
                  <span className="text-base font-medium text-gray-500">/month</span>
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-600">All Free features</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-600">Premium content</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-600">Priority support</span>
                  </li>
                </ul>
                <button 
                  onClick={() => router.push('/auth/signup')}
                  className="mt-8 w-full bg-purple-600 text-white rounded-md py-2 px-4 hover:bg-purple-700"
                >
                  Subscribe Now
                </button>
              </div>

              {/* Enterprise Plan */}
              <div className="rounded-lg shadow-lg bg-white p-8">
                <h3 className="text-2xl font-semibold text-gray-900">Enterprise</h3>
                <p className="mt-4 text-gray-600">For teams and organizations</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">$99</span>
                  <span className="text-base font-medium text-gray-500">/month</span>
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-600">All Pro features</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-600">Team management</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-600">Custom solutions</span>
                  </li>
                </ul>
                <button 
                  onClick={() => router.push('/auth/signup')}
                  className="mt-8 w-full bg-purple-600 text-white rounded-md py-2 px-4 hover:bg-purple-700"
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>


      <div className="flex flex-1 pt-20">
        <div className="flex-1 p-8 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h1 className="text-5xl font-bold text-gray-900 mb-4 relative inline-block">
                About Us
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-pink-500 rounded-full"></div>
              </h1>
              <h2 className="text-3xl font-semibold text-gray-800 mt-12 mb-6">Logic Lassan</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                We are a team of passionate developers working together to create innovative solutions that help students
                achieve their academic goals and prepare for competitive exams.
              </p>
            </div>

            <div className="mt-16 bg-white rounded-xl shadow-lg p-12 mb-24 transform hover:shadow-xl transition-shadow duration-300 border border-gray-100 max-w-3xl mx-auto">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 relative inline-block">
                Our Mission
                <div className="absolute -bottom-2 left-0 w-12 h-1 bg-pink-500 rounded-full"></div>
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                At PrepMitra, we&apos;re dedicated to revolutionizing exam preparation through technology. Our platform
                combines cutting-edge tools with comprehensive study materials to help students achieve their academic
                goals efficiently and effectively.
              </p>
            </div>

            <MemberGrid members={teamMembers} title="Development Team" />
          </div>
        </div>
      </div>


      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-blue-600 rounded-2xl p-8 md:p-12 text-center text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of successful students who have cracked their dream exams with PrepMaster
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors">
                Sign Up Now
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  )
}