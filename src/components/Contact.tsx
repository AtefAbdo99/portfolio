"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { portfolioData } from "@/lib/data";
import { 
  Mail, 
  MapPin, 
  Send, 
  MessageSquare, 
  Briefcase, 
  Users,
  CheckCircle,
  Loader2,
  Heart,
  Handshake
} from "lucide-react";

export default function Contact() {
  const { personal, socialLinks } = portfolioData;
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    type: "collaboration",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormState({ name: "", email: "", type: "collaboration", message: "" });
    
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const contactTypes = [
    { value: "collaboration", label: "Research Collaboration", icon: Users },
    { value: "hiring", label: "Hiring Inquiry", icon: Briefcase },
    { value: "contribute", label: "Contribute Together", icon: Handshake },
    { value: "other", label: "Other", icon: MessageSquare },
  ];

  return (
    <section id="contact" className="bg-[#0a0a0a]">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Interested in collaboration, hiring, or contributing together? Let&apos;s connect!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 gradient-text">Let&apos;s Work Together</h3>
            <p className="text-gray-300 mb-8 leading-relaxed">
              I&apos;m always open to discussing new research collaborations, consulting opportunities, 
              or ways to contribute to advancing healthcare through AI. Whether you&apos;re looking to 
              hire for a project or want to collaborate on groundbreaking research, I&apos;d love to hear from you.
            </p>

            {/* Contact Details */}
            <div className="space-y-4 mb-8">
              <a
                href={`mailto:${personal.email}`}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-blue-500/20 rounded-xl group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-medium">{personal.email}</p>
                </div>
              </a>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                <div className="w-12 h-12 flex items-center justify-center bg-cyan-500/20 rounded-xl">
                  <MapPin className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="font-medium">{personal.location}</p>
                </div>
              </div>
            </div>

            {/* Hire Me CTA */}
            <div id="hire" className="p-6 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-500/30">
              <div className="flex items-center gap-3 mb-3">
                <Briefcase className="w-6 h-6 text-blue-400" />
                <h4 className="text-lg font-bold">Available for Hire</h4>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                Looking for an AI/ML specialist for your healthcare project? 
                I&apos;m available for consulting, research collaboration, and technical leadership roles.
              </p>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 font-medium hover:text-blue-300 transition-colors"
              >
                View LinkedIn Profile
                <Send className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="p-8 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/10">
              <h3 className="text-xl font-bold mb-6">Send a Message</h3>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 flex items-center justify-center bg-green-500/20 rounded-full mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">Message Sent!</h4>
                  <p className="text-gray-400">I&apos;ll get back to you as soon as possible.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Type Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-3">I&apos;m reaching out for:</label>
                    <div className="grid grid-cols-2 gap-3">
                      {contactTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormState({ ...formState, type: type.value })}
                          className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-sm ${
                            formState.type === type.value
                              ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                              : "bg-white/5 border-white/10 hover:border-white/30"
                          }`}
                        >
                          <type.icon className="w-4 h-4" />
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500/50 focus:outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500/50 focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      required
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500/50 focus:outline-none transition-colors resize-none"
                      placeholder="Tell me about your project or collaboration idea..."
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
