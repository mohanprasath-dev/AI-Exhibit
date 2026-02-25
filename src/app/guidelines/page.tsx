import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, CheckCircle, XCircle, Sparkles, Heart, Flag, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Community Guidelines",
  description: "Guidelines for participating in the AI Exhibit community.",
};

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-700 flex items-center justify-center mb-6">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Community Guidelines</h1>
          <p className="text-gray-400">Creating a welcoming space for AI creativity</p>
        </div>

        <div className="glass rounded-2xl p-8 space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-violet-300/50" />
              <h2 className="text-2xl font-semibold text-white">Our Mission</h2>
            </div>
            <div className="text-gray-300">
              <p>
                AI Exhibit is a platform celebrating the creative possibilities of AI-generated content.
                We aim to showcase the best of human-AI collaboration while maintaining a respectful,
                inclusive, and inspiring community for creators and enthusiasts alike.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-semibold text-white">Content We Encourage</h2>
            </div>
            <div className="text-gray-300 space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-green-400">✓</span>
                  <span><strong>Original AI Creations:</strong> Art, music, videos, text, code, and 3D models you&apos;ve generated using AI tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400">✓</span>
                  <span><strong>Creative Prompts:</strong> Share the prompts that led to your creations to inspire others</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400">✓</span>
                  <span><strong>Tool Attribution:</strong> Credit the AI tools you used (Midjourney, DALL-E, Stable Diffusion, etc.)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400">✓</span>
                  <span><strong>Constructive Engagement:</strong> Support fellow creators with votes and positive feedback</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400">✓</span>
                  <span><strong>Diverse Styles:</strong> All genres, styles, and artistic visions are welcome</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-semibold text-white">Prohibited Content</h2>
            </div>
            <div className="text-gray-300 space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-red-400">✗</span>
                  <span><strong>NSFW/Explicit Content:</strong> No sexually explicit, pornographic, or excessively violent material</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400">✗</span>
                  <span><strong>Hate Speech:</strong> No content promoting discrimination, hatred, or violence against any group</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400">✗</span>
                  <span><strong>Copyright Infringement:</strong> Don&apos;t submit content that copies or imitates specific copyrighted works</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400">✗</span>
                  <span><strong>Deepfakes:</strong> No realistic depictions of real people without consent</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400">✗</span>
                  <span><strong>Misinformation:</strong> No content designed to deceive or spread false information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400">✗</span>
                  <span><strong>Spam:</strong> No duplicate entries, low-effort submissions, or promotional spam</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-violet-300/50" />
              <h2 className="text-2xl font-semibold text-white">Voting Etiquette</h2>
            </div>
            <div className="text-gray-300 space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-violet-300/50">♥</span>
                  <span>Vote for entries based on creativity, execution, and artistic merit</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-violet-300/50">♥</span>
                  <span>One vote per entry per device - don&apos;t try to game the system</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-violet-300/50">♥</span>
                  <span>Discover new creators - explore beyond the leaderboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-violet-300/50">♥</span>
                  <span>Be fair - vote manipulation will result in disqualification</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Flag className="w-6 h-6 text-violet-300/50" />
              <h2 className="text-2xl font-semibold text-white">Reporting Violations</h2>
            </div>
            <div className="text-gray-300 space-y-4">
              <p>
                If you encounter content that violates these guidelines, please report it to our
                moderation team. We review all reports and take appropriate action, which may include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Content removal</li>
                <li>Vote invalidation</li>
                <li>Temporary or permanent account suspension</li>
                <li>Disqualification from leaderboards and Hall of Fame</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-6 h-6 text-violet-300/50" />
              <h2 className="text-2xl font-semibold text-white">Questions?</h2>
            </div>
            <div className="text-gray-300">
              <p>
                If you&apos;re unsure whether your content is appropriate or have questions about these
                guidelines, reach out to us at{" "}
                <a href="mailto:community@aiexhibit.com" className="text-violet-300/50 hover:underline">
                  community@aiexhibit.com
                </a>
              </p>
            </div>
          </section>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/submit" className="text-violet-300/50 hover:underline">
            Ready to Submit? →
          </Link>
          <span className="text-gray-600 hidden sm:block">|</span>
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
