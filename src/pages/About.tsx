import Spline from '@splinetool/react-spline';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Target, Users, Award, Shield } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
      checkUser();
    }, []);
  
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
      } else {
        setUser(user);
      }
    };
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a0f2c] to-black">
      <div className="absolute inset-0 z-0 opacity-30">
        <Spline scene="https://prod.spline.design/u3UcBgbjs2EVwGYB/scene.splinecode" />
      </div>

      <div className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              About Evedentia
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Empowering digital investigations through artificial intelligence and cutting-edge forensic technology.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div className="bg-[#0a0f2c]/60 backdrop-blur-sm border border-blue-500/20 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-600/20 rounded-lg">
                  <Target className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white ml-4">Our Mission</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                To revolutionize digital forensics by providing investigating officers and law enforcement agencies with AI-powered tools that make evidence discovery faster, more accurate, and more secure. We believe technology should empower those who protect and serve.
              </p>
            </div>

            <div className="bg-[#0a0f2c]/60 backdrop-blur-sm border border-blue-500/20 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-600/20 rounded-lg">
                  <Shield className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white ml-4">Our Vision</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                To become the global standard for AI-assisted digital forensic analysis, enabling law enforcement worldwide to solve cases more efficiently while maintaining the highest standards of data security and privacy.
              </p>
            </div>
          </div>

          <div className="bg-[#0a0f2c]/60 backdrop-blur-sm border border-blue-500/20 rounded-xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Choose Evedentia?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex p-4 bg-blue-600/20 rounded-full mb-4">
                  <Users className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Expert Team</h3>
                <p className="text-gray-400">
                  Built by forensic experts and AI engineers with decades of combined experience in law enforcement and technology.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex p-4 bg-blue-600/20 rounded-full mb-4">
                  <Shield className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Military-Grade Security</h3>
                <p className="text-gray-400">
                  AES-256 encryption, zero-knowledge architecture, and compliance with international data protection standards.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex p-4 bg-blue-600/20 rounded-full mb-4">
                  <Award className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Proven Results</h3>
                <p className="text-gray-400">
                  Trusted by law enforcement agencies to accelerate investigations and uncover critical evidence.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0f2c]/60 backdrop-blur-sm border border-blue-500/20 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Our Commitment</h2>
            <div className="space-y-4 text-gray-300 max-w-4xl mx-auto">
              <p className="leading-relaxed">
                At Evedentia, we understand the critical nature of digital forensic investigations. Every case represents real people and real consequences. That's why we've built our platform with unwavering commitment to accuracy, security, and usability.
              </p>
              <p className="leading-relaxed">
                Our AI models are trained on diverse datasets while respecting privacy and ethical considerations. We continuously update our systems to stay ahead of emerging threats and evolving digital landscapes.
              </p>
              <p className="leading-relaxed">
                We partner with law enforcement agencies, forensic laboratories, and legal professionals to ensure our tools meet the rigorous standards required for modern investigations and court proceedings.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Join Us in Transforming Digital Forensics</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Whether you're an investigating officer, forensic analyst, or law enforcement administrator, Evedentia is here to support your mission.
            </p>
            <button
              onClick={() => window.location.href = '/contact'}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
            >
              Get in Touch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
