"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Sparkles, Shield, Zap, Heart, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubmitForm, FloatingOrb } from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth";

const features = [
  {
    icon: Sparkles,
    title: "Showcase Your Work",
    description: "Display your AI-generated creations to a global audience",
  },
  {
    icon: Heart,
    title: "Get Votes",
    description: "Receive feedback and votes from the community",
  },
  {
    icon: Zap,
    title: "Compete",
    description: "Climb the leaderboard and win recognition",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Your submissions are protected and credited to you",
  },
];

export default function SubmitPageClient() {
  const { user, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Show auth prompt if not logged in
  if (!isLoading && !user) {
    return (
      <div className="min-h-screen py-8 relative overflow-hidden">
        <FloatingOrb size={400} color="neon-purple" className="top-40 -left-60 opacity-30" />
        <FloatingOrb size={350} color="neon-cyan" delay={3} className="bottom-20 -right-40 opacity-30" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link href="/">
              <Button variant="ghost" className="gap-2 text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </motion.div>

          <div className="max-w-lg mx-auto text-center py-20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-8 shadow-cyan-500/30 shadow-lg"
            >
              <LogIn className="w-10 h-10 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Sign In Required
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 mb-8"
            >
              You need to sign in to submit your AI creations. 
              Join our creative community today!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                size="lg"
                className="gap-2"
                onClick={() => setShowAuthModal(true)}
              >
                <LogIn className="w-5 h-5" />
                Sign In to Submit
              </Button>
            </motion.div>
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          redirectTo="/submit"
          title="Sign in to Submit"
          description="Create an account or sign in to submit your AI-generated creations."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 relative overflow-hidden">
      {/* Background Effects */}
      <FloatingOrb size={400} color="neon-purple" className="top-40 -left-60 opacity-30" />
      <FloatingOrb size={350} color="neon-cyan" delay={3} className="bottom-20 -right-40 opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            {/* Header */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-6"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Submit Your Creation
              </h1>
              <p className="text-gray-400 max-w-lg mx-auto">
                Share your AI-generated masterpiece with the world. Fill out the form
                below to submit your entry.
              </p>
            </div>

            {/* Form */}
            <SubmitForm />
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Guidelines */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Submission Guidelines
              </h2>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                  <span>Content must be AI-generated or AI-assisted</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                  <span>Maximum file size: 50MB</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                  <span>Supported formats: Images, Video, Audio</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                  <span>Include the prompt you used</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                  <span>No NSFW or offensive content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                  <span>You must own rights to submit</span>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Why Submit?
              </h2>
              <div className="space-y-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">
                          {feature.title}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Need Help */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">
                Need Help?
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Have questions about submitting? Check out our FAQ or reach out
                to us.
              </p>
              <div className="flex gap-3">
                <Link href="/guidelines" className="flex-1">
                  <Button variant="glass" className="w-full" size="sm">
                    Guidelines
                  </Button>
                </Link>
                <Link href="mailto:support@aiexhibit.com" className="flex-1">
                  <Button variant="glass" className="w-full" size="sm">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
