import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { FolderOpen, Upload, FileSearch, BarChart3, LogOut } from 'lucide-react';
import Spline from '@splinetool/react-spline';

interface Case {
  id: string;
  case_name: string;
  case_number: string;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    loadCases();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
    } else {
      setUser(user);
    }
  };

  const loadCases = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      console.error('Error loading cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a0f2c] to-black">
      <div className="absolute inset-0 z-0 opacity-20">
        <Spline scene="https://prod.spline.design/u3UcBgbjs2EVwGYB/scene.splinecode" />
      </div>

      <div className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-gray-400">Welcome back, {user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 rounded-lg transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-[#0a0f2c]/60 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <FolderOpen className="w-8 h-8 text-blue-400" />
                <span className="text-3xl font-bold text-white">{cases.length}</span>
              </div>
              <p className="text-gray-400">Total Cases</p>
            </div>

            <div className="bg-[#0a0f2c]/60 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <FileSearch className="w-8 h-8 text-green-400" />
                <span className="text-3xl font-bold text-white">
                  {cases.filter(c => c.status === 'active').length}
                </span>
              </div>
              <p className="text-gray-400">Active Cases</p>
            </div>

            <div className="bg-[#0a0f2c]/60 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="w-8 h-8 text-purple-400" />
                <span className="text-3xl font-bold text-white">
                  {cases.filter(c => c.status === 'closed').length}
                </span>
              </div>
              <p className="text-gray-400">Closed Cases</p>
            </div>

            <div className="bg-[#0a0f2c]/60 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <Upload className="w-8 h-8 text-yellow-400" />
                <span className="text-3xl font-bold text-white">0</span>
              </div>
              <p className="text-gray-400">Files Analyzed</p>
            </div>
          </div>

          <div className="bg-[#0a0f2c]/60 backdrop-blur-sm border border-blue-500/20 rounded-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Cases</h2>
              <button
                onClick={() => navigate('/upload')}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50 flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>New Case</span>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              </div>
            ) : cases.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No cases yet</p>
                <button
                  onClick={() => navigate('/upload')}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  Upload Your First Case
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className="bg-[#0a0f2c]/80 border border-blue-500/20 rounded-lg p-6 hover:border-blue-500/50 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {caseItem.case_name}
                        </h3>
                        <p className="text-gray-400 text-sm mb-2">Case #{caseItem.case_number}</p>
                        <p className="text-gray-500 text-xs">
                          Created: {new Date(caseItem.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          caseItem.status === 'active'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : caseItem.status === 'closed'
                            ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}
                      >
                        {caseItem.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
