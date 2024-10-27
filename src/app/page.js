"use client"
import React, { useState } from 'react';
import { Music2, Info, ArrowRight, ListMusic, UserPlus, ChevronLeft, Copy, Check, Disc, Radio, Music4, Hash } from 'lucide-react';
import Image from 'next/image';
import logo from "@/assests/logo/playlisty.png"
const FloatingElement = ({ children, className }) => (
  <div className={`absolute pointer-events-none animate-float ${className}`}>
    <div className="backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10 shadow-xl">
      {children}
    </div>
  </div>
);

const PlaylistCard = ({ className }) => (
  <div className={`w-48 backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 shadow-xl overflow-hidden ${className}`}>
    <div className="p-3 space-y-2">
      <div className="h-2 w-24 bg-white/20 rounded"></div>
      <div className="h-2 w-16 bg-white/20 rounded"></div>
      <div className="flex items-center space-x-2">
        <Disc className="w-4 h-4 text-green-400/60" />
        <div className="h-2 w-12 bg-white/20 rounded"></div>
      </div>
    </div>
  </div>
);

const CodeSnippet = ({ className }) => (
  <div className={`w-40 backdrop-blur-xl bg-black/30 rounded-xl border border-white/10 shadow-xl overflow-hidden ${className}`}>
    <div className="p-3">
      <div className="space-y-2">
        <div className="h-2 w-full bg-green-400/20 rounded"></div>
        <div className="h-2 w-3/4 bg-green-400/20 rounded"></div>
        <div className="h-2 w-1/2 bg-green-400/20 rounded"></div>
      </div>
    </div>
  </div>
);

const HashBlock = ({ className }) => (
  <div className={`backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 shadow-xl p-3 ${className}`}>
    <Hash className="w-6 h-6 text-green-400/40" />
  </div>
);

const SpotifyLanding = () => {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);


  const credentials = {
    email: "PlaylistyFake@gmail.com",
    password: "one2345678"
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'email') {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else {
        setCopiedPassword(true);
        setTimeout(() => setCopiedPassword(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute top-40 -left-40 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 right-20 w-72 h-72 bg-pink-500 rounded-full opacity-10 blur-3xl"></div>

        {/* Floating playlist cards */}
        <PlaylistCard className="animate-float-slow absolute -top-10 left-1/4 rotate-12 opacity-50" />
        <PlaylistCard className="animate-float-slower absolute top-1/3 -right-20 -rotate-12 opacity-50" />
        <PlaylistCard className="animate-float absolute bottom-20 left-10 rotate-6 opacity-50" />

        {/* Floating code snippets */}
        <CodeSnippet className="animate-float-slow absolute top-20 right-1/4 -rotate-6 opacity-50" />
        <CodeSnippet className="animate-float-slower absolute bottom-40 right-20 rotate-12 opacity-50" />
        <CodeSnippet className="animate-float absolute top-1/2 left-20 -rotate-12 opacity-50" />

        {/* Floating hash blocks and musical elements */}
        <HashBlock className="animate-float absolute top-1/4 left-1/3 rotate-45 opacity-30" />
        <HashBlock className="animate-float-slow absolute bottom-1/4 right-1/3 -rotate-45 opacity-30" />
        <FloatingElement className="top-1/3 right-1/4">
          <Music4 className="w-6 h-6 text-green-400/40" />
        </FloatingElement>
        <FloatingElement className="bottom-1/3 left-1/4">
          <Radio className="w-6 h-6 text-purple-400/40" />
        </FloatingElement>
      </div>

      {/* Main content */}
      <div className="relative w-full max-w-md">
        {/* Glass card */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              {/* <Music2 className="w-12 h-12 text-green-400" /> */}
              <Image src={logo} alt='logo of playlisty'></Image>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome</h1>
            <p className="text-gray-400">Share and discover music together</p>
          </div>

          {currentStep === 'welcome' && (
            <div className="space-y-6">
              <div className="bg-black/30 rounded-lg p-4 border border-gray-600">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-medium mb-1">How It Works</h3>
                    <p className="text-gray-400 text-sm">
                      Get started by logging into spotify with the provided account credentials.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep('features')}
                className="w-full bg-green-400 hover:bg-green-500 text-black font-semibold py-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group"
              >
                <span>See Features</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {currentStep === 'features' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="bg-black/30 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-start space-x-3">
                    <ListMusic className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-medium mb-1">Discover Playlists</h3>
                      <p className="text-gray-400 text-sm">
                        Browse and enjoy playlists created by other community members. Find new music and explore different tastes!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-start space-x-3">
                    <UserPlus className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-medium mb-1">Join Our Community</h3>
                      <p className="text-gray-400 text-sm">
                        After logging in, you can add your name to our community list and start sharing your musical journey with others.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setCurrentStep('login')}
                  className="w-full bg-green-400 hover:bg-green-500 text-black font-semibold py-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group"
                >
                  <span>Continue to Login</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setCurrentStep('welcome')}
                  className="w-full bg-transparent hover:bg-white/5 text-white border border-gray-600 font-semibold py-3 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Go Back</span>
                </button>
              </div>
            </div>
          )}

          {currentStep === 'login' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="bg-black/30 rounded-lg p-4 border border-gray-600">
                  <h3 className="text-white font-medium mb-4">Account Credentials</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                      <div className="flex items-center justify-between bg-black/30 p-3 rounded-lg">
                        <code className="text-green-400">{credentials.email}</code>
                        <button
                          onClick={() => copyToClipboard(credentials.email, 'email')}
                          className="text-gray-400 hover:text-white transition-colors"
                          title="Copy email"
                        >
                          {copiedEmail ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                      <div className="flex items-center justify-between bg-black/30 p-3 rounded-lg">
                        <code className="text-green-400">{credentials.password}</code>
                        <button
                          onClick={() => copyToClipboard(credentials.password, 'password')}
                          className="text-gray-400 hover:text-white transition-colors"
                          title="Copy password"
                        >
                          {copiedPassword ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href="/login"
                  // target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-400 hover:bg-green-500 text-black font-semibold py-3 rounded-lg transition-colors duration-300 flex items-center justify-center"
                >
                  Go to Spotify Login
                </a>

                <button
                  onClick={() => setCurrentStep('features')}
                  className="w-full bg-transparent hover:bg-white/5 text-white border border-gray-600 font-semibold py-3 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Back to Features</span>
                </button>
              </div>

              <p className="text-center text-gray-400 text-sm">
                Click the copy icons to copy credentials to your clipboard
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpotifyLanding;