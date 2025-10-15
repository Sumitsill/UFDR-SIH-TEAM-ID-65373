// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { supabase } from '../lib/supabase';
// import { Upload as UploadIcon, File, AlertCircle, CheckCircle } from 'lucide-react';
// // import Spline from '@splinetool/react-spline';

// export default function Upload() {
//   const navigate = useNavigate();
//   const [caseName, setCaseName] = useState('');
//   const [caseNumber, setCaseNumber] = useState('');
//   const [description, setDescription] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [file, setFile] = useState<File | null>(null);

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const uploadedFile = e.target.files ? e.target.files[0] : null;

//     if (uploadedFile) {
//       // Check for file type (example: only allow .ufdr files)
//       if (uploadedFile.type !== 'application/ufdr') {
//         setError('Invalid file type. Please upload a valid UFDR file.');
//         setFile(null);
//       } else if (uploadedFile.size > 10 * 1024 * 1024) {
//         // Check for file size (example: limit to 10MB)
//         setError('File size exceeds 10MB. Please upload a smaller file.');
//         setFile(null);
//       } else {
//         setFile(uploadedFile);
//         setError('');
//       }
//     }
//   };
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setFile(e.target.files[0]);
//     }
//   };
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccess(false);

//     try {
//       const { data: { user } } = await supabase.auth.getUser();

//       if (!user) {
//         navigate('/login');
//         return;
//       }

//   const { data: _data, error: insertError } = await supabase
//         .from('cases')
//         .insert([
//           {
//             user_id: user.id,
//             case_name: caseName,
//             case_number: caseNumber,
//             description: description,
//             status: 'active'
//           }
//         ])
//         .select();

//       if (insertError) throw insertError;

//       setSuccess(true);
//       setTimeout(() => {
//         navigate('/dashboard');
//       }, 2000);
//     } catch (err: any) {
//       setError(err.message || 'An error occurred while creating the case');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen bg-gradient-to-b from-[#0a0f2c] to-black">
//       <div className="absolute inset-0 z-0 opacity-30">
//         {/* <Spline scene="https://prod.spline.design/u3UcBgbjs2EVwGYB/scene.splinecode" /> */}
//       </div>

//       <div className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-3xl mx-auto">
//           <div className="text-center mb-12">
//             <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
//               Upload New Case
//             </h1>
//             <p className="text-lg text-gray-400">
//               Create a new case to start analyzing UFDR data
//             </p>
//           </div>

//           <div className="bg-[#0a0f2c]/60 backdrop-blur-sm border border-blue-500/20 rounded-xl p-8">
//             {error && (
//               <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start space-x-3">
//                 <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
//                 <p className="text-red-400 text-sm">{error}</p>
//               </div>
//             )}

//             {success && (
//               <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-start space-x-3">
//                 <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
//                 <p className="text-green-400 text-sm">Case created successfully! Redirecting...</p>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label htmlFor="caseName" className="block text-sm font-medium text-gray-300 mb-2">
//                   Case Name *
//                 </label>
//                 <input
//                   type="text"
//                   id="caseName"
//                   value={caseName}
//                   onChange={(e) => setCaseName(e.target.value)}
//                   required
//                   className="w-full px-4 py-3 bg-[#0a0f2c]/80 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
//                   placeholder="e.g., Operation Phoenix"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="caseNumber" className="block text-sm font-medium text-gray-300 mb-2">
//                   Case Number *
//                 </label>
//                 <input
//                   type="text"
//                   id="caseNumber"
//                   value={caseNumber}
//                   onChange={(e) => setCaseNumber(e.target.value)}
//                   required
//                   className="w-full px-4 py-3 bg-[#0a0f2c]/80 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
//                   placeholder="e.g., CASE-2024-001"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
//                   Description
//                 </label>
//                 <textarea
//                   id="description"
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   rows={4}
//                   className="w-full px-4 py-3 bg-[#0a0f2c]/80 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
//                   placeholder="Brief description of the case..."
//                 />
//               </div>

//               <div className="border-2 border-dashed border-blue-500/30 rounded-lg p-8 text-center hover:border-blue-500/50 transition-colors">
//                 <File className="w-12 h-12 text-gray-500 mx-auto mb-4" />
//                 <p className="text-gray-400 mb-2">UFDR file upload coming soon</p>
//                 <p className="text-gray-600 text-sm">Drag and drop or click to browse</p>
//                 <input
//                   type="file"
//                   accept=".ufdr"
//                   onChange={handleFileUpload}
//                   className="mt-4 px-4 py-3 bg-[#0a0f2c] border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
//                 />
//               </div>

//               <div className="flex space-x-4">
//                 <button
//                   type="button"
//                   onClick={() => navigate('/dashboard')}
//                   className="flex-1 py-3 bg-transparent border-2 border-blue-400 hover:bg-blue-400/10 text-blue-400 font-semibold rounded-lg transition-all duration-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50 flex items-center justify-center space-x-2"
//                 >
//                   {loading ? (
//                     <>
//                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                       <span>Creating...</span>
//                     </>
//                   ) : (
//                     <>
//                       <UploadIcon className="w-5 h-5" />
//                       <span>Create Case</span>
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>

//           <div className="mt-8 text-center">
//             <p className="text-gray-500 text-sm">
//               All uploaded data is encrypted and stored securely in compliance with forensic standards
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { File, CheckCircle, AlertCircle, UploadIcon } from "lucide-react";
import Spline from "@splinetool/react-spline";
import jsPDF from "jspdf";

export default function CreateCase() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [caseName, setCaseName] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null); // Store the selected file
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
    } else {
      setUser(user);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      // Step 2: Insert the case into the 'cases' table
      const { data: _data, error: insertError } = await supabase
        .from("cases")
        .insert([
          {
            user_id: user.id,
            case_name: caseName,
            case_number: caseNumber,
            description: description,
            status: "active",
          },
        ])
        .select();

      if (insertError) throw insertError;

      // Step 1: Upload the file to Supabase Storage if a file is selected
      let fileUrl = "";
      if (file) {
        const filePath = `cases/${user.id}/${file.name}`; // Path to store file
        const { error: uploadError } = await supabase.storage
          .from("case-files") // Make sure you have a bucket named 'case-files'
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // If upload is successful, get the file URL
        fileUrl = `https://nbrsxqbljkioabvkhonk.supabase.co/storage/v1/object/public/case-files/${filePath}`;
      }

      // Step 3: Insert the file metadata into 'case_files' table (if a file was uploaded)
      if (fileUrl && file) {
        const { error: fileError } = await supabase.from("case_files").insert([
          {
            case_id: _data[0].id, // Insert file for the created case
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            storage_path: fileUrl,
            uploaded_at: new Date().toISOString(),
          },
        ]);

        if (fileError) throw fileError;
      }

      const pdf = new jsPDF();
      pdf.setFontSize(16);
      pdf.text("Case Submission Receipt", 20, 20);
      pdf.setFontSize(12);
      pdf.text(`Case Name: ${caseName}`, 20, 40);
      pdf.text(`Case Number: ${caseNumber}`, 20, 50);
      pdf.text(`Description: ${description || "N/A"}`, 20, 60);
      pdf.text(`Status: active`, 20, 70);
      pdf.text(`Submitted At: ${new Date().toLocaleString()}`, 20, 80);

      if (file) {
        pdf.text(`File Name: ${file.name}`, 20, 90);
        pdf.text(`File Type: ${file.type}`, 20, 100);
        pdf.text(`File Size: ${(file.size / 1024).toFixed(2)} KB`, 20, 110);
      }

      if (fileUrl) {
        pdf.setTextColor(0, 0, 255); // 🔵 RGB for blue
        pdf.textWithLink("File URL", 20, 120, { url: fileUrl });
        pdf.setTextColor(0, 0, 0); // 🖤 Reset back to black for following text
      }

      pdf.text("Thank you for submitting your case.", 20, 140);
      pdf.save(`${caseNumber}_case_receipt.pdf`); // 📄 Downloads PDF
      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An error occurred while creating the case");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a0f2c] to-black">
      <div className="absolute inset-0 z-0 opacity-30">
        <Spline scene="https://prod.spline.design/u3UcBgbjs2EVwGYB/scene.splinecode" />
      </div>

      <div className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Upload New Case
            </h1>
            <p className="text-lg text-gray-400">
              Create a new case to start analyzing UFDR data
            </p>
          </div>

          <div className="bg-[#0a0f2c]/60 backdrop-blur-sm border border-blue-500/20 rounded-xl p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-green-400 text-sm">
                  Case created successfully! Redirecting...
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="caseName"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Case Name *
                </label>
                <input
                  type="text"
                  id="caseName"
                  value={caseName}
                  onChange={(e) => setCaseName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#0a0f2c]/80 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g., Operation Phoenix"
                />
              </div>

              <div>
                <label
                  htmlFor="caseNumber"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Case Number *
                </label>
                <input
                  type="text"
                  id="caseNumber"
                  value={caseNumber}
                  onChange={(e) => setCaseNumber(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#0a0f2c]/80 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g., CASE-2024-001"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#0a0f2c]/80 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="Brief description of the case..."
                />
              </div>

              <div className="border-2 border-dashed border-blue-500/30 rounded-lg p-8 text-center hover:border-blue-500/50 transition-colors">
                <File className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept="image/*,video/*" // Example of file type filter
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-blue-400"
                >
                  Drag and drop or click to browse
                </label>
                {file && (
                  <p className="text-sm text-gray-400 mt-2">
                    Selected File: {file.name}
                  </p>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 py-3 bg-transparent border-2 border-blue-400 hover:bg-blue-400/10 text-blue-400 font-semibold rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <UploadIcon className="w-5 h-5" />
                      <span>Create Case</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              All uploaded data is encrypted and stored securely in compliance
              with forensic standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
