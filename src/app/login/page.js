"use client"
import React, { useEffect, useState } from 'react';
import { AlertCircle, Copy, Check, Music2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
const FloatingElement = ({ children, className }) => (
  <div className={`absolute pointer-events-none animate-float ${className}`}>
    <div className="backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10 shadow-xl">
      {children}
    </div>
  </div>
);

const TimeoutPage = () => {
    const router = useRouter();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [token, setToken] = useState("");

  const Client_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = "https://playlisty-theta.vercel.app/login"; 
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const credentials = {
    email: "PlaylistyFake@gmail.com",
    password: "one2345678"
  };


  useEffect(()=>{
    
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");
    
    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }
    window.location.hash = "";
    if (token) {
        setToken(token);
        router.push('/home');
        return;
    }
    setToken(token);
  },[]);
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
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute top-40 -left-40 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 right-20 w-72 h-72 bg-pink-500 rounded-full opacity-10 blur-3xl"></div>

        {/* Floating elements for visual interest */}
        <FloatingElement className="top-1/4 right-1/4">
          <div className="w-8 h-8 bg-red-400/20 rounded-full"></div>
        </FloatingElement>
        <FloatingElement className="bottom-1/4 left-1/4">
          <div className="w-8 h-8 bg-purple-400/20 rounded-full"></div>
        </FloatingElement>
      </div>

      {/* Main content */}
      <div className="relative w-full max-w-md">
        {/* Glass card */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Music2 className="w-12 h-12 text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Session Expired</h1>
            <p className="text-gray-400">Please log in again to continue</p>
          </div>

          <div className="space-y-6">
            {/* Alert message */}
            <div className="bg-black/30 rounded-lg p-4 border border-red-600/50">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-medium mb-1">Authorization Timeout</h3>
                  <p className="text-gray-400 text-sm">
                    Your session has expired. Please use the credentials below to log in again.
                  </p>
                </div>
              </div>
            </div>

            {/* Credentials section */}
            <div className="bg-black/30 rounded-lg p-4 border border-gray-600">
              <h3 className="text-white font-medium mb-4">Login Credentials</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                  <div className="flex items-center justify-between bg-black/30 p-3 rounded-lg">
                    <code className="text-red-400">{credentials.email}</code>
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
                    <code className="text-red-400">{credentials.password}</code>
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

            {/* Login button */}
            <a
              href={`${AUTH_ENDPOINT}?client_id=${Client_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
              // target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-red-400 hover:bg-red-500 text-black font-semibold py-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
            >
              Log In Again
            </a>
     

            <p className="text-center text-gray-400 text-sm">
              Click the copy icons to copy credentials to your clipboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeoutPage;