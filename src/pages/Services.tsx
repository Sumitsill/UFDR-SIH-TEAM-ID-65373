import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { FileSearch, Clock, Shield, FileText } from 'lucide-react';
import Spline from '@splinetool/react-spline';
import ServiceCarousel from '../components/ServiceCarousel';

export default function Services() {
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

  const services = [
    {
      id: 1,
      icon: FileSearch,
      title: 'Inquisitor',
      subtitle: 'AI-powered Evidence Search',
      description: 'Search across thousands of messages, call logs, and media files using natural language queries.',
      capabilities: [
        'Keyword & semantic search',
        'Filter by sender, receiver, date, file type',
        'Detect suspicious terms'
      ],
      action: () => alert('Inquisitor Demo - AI Search Module Coming Soon!'),
      buttonText: 'Try Search'
    },
    {
      id: 2,
      icon: Clock,
      title: 'ChronoTrack',
      subtitle: 'Timeline & Multimedia Analysis',
      description: 'Reconstruct complete case timelines by analyzing chats, calls, and multimedia.',
      capabilities: [
        'Interactive chronological timeline visualization',
        'Video/audio transcription',
        'Cross-linking of events'
      ],
      action: () => alert('ChronoTrack Demo - Timeline Visualization Coming Soon!'),
      buttonText: 'View Timeline'
    },
    {
      id: 3,
      icon: Shield,
      title: 'CaseVault',
      subtitle: 'Secure Case Management',
      description: 'Manage case data securely with encryption and collaboration features.',
      capabilities: [
        'Role-based access control',
        'AES-256 encryption',
        'Multi-case dashboard'
      ],
      action: () => navigate('/dashboard'),
      buttonText: 'Open Vault'
    },
    {
      id: 4,
      icon: FileText,
      title: 'AutoDossier',
      subtitle: 'Automated Report Generation',
      description: 'Generate professional, court-ready forensic reports automatically.',
      capabilities: [
        'Auto-generated summaries',
        'Export in PDF/Word',
        'Evidence logs with metadata'
      ],
      action: () => alert('AutoDossier Demo - Report Generator Coming Soon!'),
      buttonText: 'Generate Report'
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a0f2c] to-black">
      <div className="absolute inset-0 z-0 opacity-30">
        <Spline scene="https://prod.spline.design/u3UcBgbjs2EVwGYB/scene.splinecode" />
      </div>

      <div className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              What We Offer
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
              Explore our AI-powered forensic services designed to make investigations faster, smarter, and more secure.
            </p>
          </div>

          <div className="mb-16">
            <ServiceCarousel services={services} />
          </div>

          <div className="bg-[#0a0f2c]/60 backdrop-blur-sm border border-blue-500/20 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Join law enforcement agencies worldwide in leveraging AI for digital forensics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-8 py-3 bg-transparent border-2 border-blue-400 hover:bg-blue-400/10 text-blue-400 font-semibold rounded-lg transition-all duration-300"
              >
                Contact Sales
              </button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              For forensic and investigative use only. All case data is securely encrypted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
