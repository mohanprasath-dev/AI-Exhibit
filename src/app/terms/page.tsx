import type { Metadata } from "next";
import Link from "next/link";
import { FileText, CheckCircle, XCircle, AlertTriangle, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the terms and conditions for using AI Exhibit.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-gray-400">Last updated: January 31, 2026</p>
        </div>

        <div className="glass rounded-2xl p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                By accessing or using AI Exhibit, you agree to be bound by these Terms of Service
                and all applicable laws and regulations. If you do not agree with any of these terms,
                you are prohibited from using this site.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Use of Service</h2>
            <div className="text-gray-300 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <strong>You may:</strong>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Submit AI-generated content that you have the right to share</li>
                    <li>Vote on entries once per device</li>
                    <li>Share entries on social media</li>
                    <li>Browse and explore the gallery</li>
                  </ul>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                <div>
                  <strong>You may not:</strong>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Manipulate votes through bots, scripts, or multiple accounts</li>
                    <li>Submit content you don&apos;t have rights to</li>
                    <li>Upload harmful, offensive, or illegal content</li>
                    <li>Attempt to reverse-engineer or hack the platform</li>
                    <li>Harass other users or creators</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Content Ownership</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                You retain ownership of the AI-generated content you submit. By uploading content
                to AI Exhibit, you grant us a non-exclusive, worldwide, royalty-free license to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Display your content on our platform</li>
                <li>Feature your content in promotional materials</li>
                <li>Create thumbnails and previews</li>
                <li>Store and backup your content on our servers</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-semibold text-white">4. Content Moderation</h2>
            </div>
            <div className="text-gray-300 space-y-4">
              <p>
                We reserve the right to remove any content that violates our guidelines or these
                terms without prior notice. This includes but is not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Content that infringes on intellectual property rights</li>
                <li>Explicit, violent, or hateful content</li>
                <li>Spam or misleading submissions</li>
                <li>Content that violates applicable laws</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Voting System</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Our voting system uses device fingerprinting and IP tracking to ensure fair voting.
                Each device is allowed one vote per entry. Attempts to circumvent this system may
                result in vote invalidation and account suspension.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-semibold text-white">6. Disclaimer</h2>
            </div>
            <div className="text-gray-300 space-y-4">
              <p>
                AI Exhibit is provided &quot;as is&quot; without warranties of any kind. We do not guarantee
                that the service will be uninterrupted, error-free, or secure. We are not responsible
                for any content submitted by users.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Changes to Terms</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                We reserve the right to modify these terms at any time. Continued use of the
                platform after changes constitutes acceptance of the new terms.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Contact</h2>
            <div className="text-gray-300">
              <p>
                For questions about these Terms, contact us at{" "}
                <a href="mailto:legal@aiexhibit.com" className="text-cyan-400 hover:underline">
                  legal@aiexhibit.com
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
