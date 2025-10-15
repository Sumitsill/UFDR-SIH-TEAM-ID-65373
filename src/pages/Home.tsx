import { useNavigate } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import TextType from '../components/TextType';
import { FileSearch, Clock, Shield, FileText } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const subheadlines = [
    'AI-powered UFDR Analysis',
    'Evidence Discovery Made Simple',
    'Secure Digital Forensics Platform',
    'Revolutionizing Investigations'
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a0f2c] to-black overflow-hidden">
      {/* Fullscreen Spline animation background */}
      <div className="absolute inset-0 z-0">
        {
          <Spline scene="https://prod.spline.design/u3UcBgbjs2EVwGYB/scene.splinecode" />
        }

      </div>

      {/* Content shifted down to avoid navbar overlap */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-32 md:pt-40">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            Evedentia
          </h1>

          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-300 mb-4">
            Revolutionizing Digital Forensics with AI
          </p>

          <div className="h-16 sm:h-20 flex items-center justify-center mb-12">
            <TextType
              text={subheadlines}
              className="text-lg sm:text-xl lg:text-2xl text-blue-400 font-medium"
              typingSpeed={80}
              deletingSpeed={40}
              pauseDuration={2000}
              loop={true}
              showCursor={true}
              cursorCharacter="|"
              cursorClassName="text-blue-400"
            />
          </div>

          <p className="text-base sm:text-lg text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            An AI-powered UFDR Analysis Tool to help Investigating Officers uncover evidence faster, smarter, and securely.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => navigate('/services')}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50 hover:scale-105"
            >
              Try Demo
            </button>
            <button
              onClick={() => navigate('/upload')}
              className="px-8 py-4 bg-transparent border-2 border-blue-400 hover:bg-blue-400/10 text-blue-400 font-semibold rounded-lg transition-all duration-300"
            >
              Upload Case
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-[#0a0f2c]/60 backdrop-blur-sm border border-blue-500/20 rounded-lg p-6 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
              <FileSearch className="w-10 h-10 text-blue-400 mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-2">AI Search</h3>
              <p className="text-gray-400 text-sm">Natural language evidence discovery</p>
            </div>

            <div className="bg-[#0a0f2c]/60 backdrop-blur-sm border border-blue-500/20 rounded-lg p-6 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
              <Clock className="w-10 h-10 text-blue-400 mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Timeline Analysis</h3>
              <p className="text-gray-400 text-sm">Reconstruct event sequences</p>
            </div>

            <div className="bg-[#0a0f2c]/60 backdrop-blur-sm border border-blue-500/20 rounded-lg p-6 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
              <Shield className="w-10 h-10 text-blue-400 mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Secure Vault</h3>
              <p className="text-gray-400 text-sm">Encrypted case management</p>
            </div>

            <div className="bg-[#0a0f2c]/60 backdrop-blur-sm border border-blue-500/20 rounded-lg p-6 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
              <FileText className="w-10 h-10 text-blue-400 mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Auto Reports</h3>
              <p className="text-gray-400 text-sm">Generate court-ready documents</p>
            </div>
          </div>
        </div>
      </div>

      {/* bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-5"></div>
    </div>
  );
}
