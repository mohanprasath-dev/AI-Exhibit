import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, Eye, Database, Mail, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how AI Exhibit collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: January 31, 2026</p>
        </div>

        <div className="glass rounded-2xl p-8 space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-semibold text-white">Information We Collect</h2>
            </div>
            <div className="text-gray-300 space-y-4">
              <p>When you use AI Exhibit, we collect information to provide and improve our services:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Account Information:</strong> Name, email address when you submit entries</li>
                <li><strong>Content:</strong> AI-generated creations you upload, including prompts and tool information</li>
                <li><strong>Device Information:</strong> Browser type, device fingerprint (anonymized) for vote verification</li>
                <li><strong>Usage Data:</strong> Pages visited, features used, and interaction patterns</li>
                <li><strong>IP Address:</strong> Used temporarily for vote verification and fraud prevention</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-semibold text-white">How We Use Your Information</h2>
            </div>
            <div className="text-gray-300 space-y-4">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Display your submitted entries in the gallery</li>
                <li>Process and count votes on entries</li>
                <li>Prevent duplicate voting and fraud</li>
                <li>Communicate about your submissions and account</li>
                <li>Improve our platform and user experience</li>
                <li>Ensure compliance with our terms and guidelines</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-semibold text-white">Data Security</h2>
            </div>
            <div className="text-gray-300 space-y-4">
              <p>We implement industry-standard security measures to protect your data:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All data is encrypted in transit using TLS/SSL</li>
                <li>Database access is restricted and monitored</li>
                <li>Device fingerprints are hashed and cannot be reversed</li>
                <li>Regular security audits and updates</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-semibold text-white">Your Rights</h2>
            </div>
            <div className="text-gray-300 space-y-4">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Withdraw consent at any time</li>
                <li>Export your data in a portable format</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-semibold text-white">Contact Us</h2>
            </div>
            <div className="text-gray-300">
              <p>
                If you have questions about this Privacy Policy or want to exercise your rights,
                contact us at{" "}
                <a href="mailto:privacy@aiexhibit.com" className="text-cyan-400 hover:underline">
                  privacy@aiexhibit.com
                </a>
              </p>
            </div>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
