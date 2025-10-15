import { useEffect, useState } from 'react';
import Spline from '@splinetool/react-spline';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import emailjs from 'emailjs-com';
export default function Contact() {

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);

  //   setTimeout(() => {
  //     setIsSubmitting(false);
  //     setSubmitStatus('success');
  //     setFormData({
  //       name: '',
  //       email: '',
  //       organization: '',
  //       subject: '',
  //       message: ''
  //     });

  //     setTimeout(() => {
  //       setSubmitStatus('idle');
  //     }, 3000);
  //   }, 1500);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // EmailJS parameters
    const serviceId = 'your_service_id'; // Replace with your Service ID
    const templateId = 'your_template_id'; // Replace with your Template ID
    const userId = 'your_user_id'; // Replace with your User ID

    // Prepare the template variables (data you want to send)
    const templateParams = {
      name: formData.name,
      email: formData.email,
      organization: formData.organization,
      subject: formData.subject,
      message: formData.message,
    };

    try {
      // Send the email via EmailJS
      await emailjs.send(serviceId, templateId, templateParams, userId);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        organization: '',
        subject: '',
        message: ''
      });

      // Reset status after 3 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Failed to send email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a0f2c] to-black overflow-hidden">
      {/* 🔹 Fullscreen Spline Background */}
      <div className="absolute inset-0 z-0">
        <Spline
          scene="https://prod.spline.design/u3UcBgbjs2EVwGYB/scene.splinecode"
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-black/60" /> {/* optional dark overlay */}
      </div>

      {/* 🔹 Contact Section */}
      <div className="relative z-10 pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Contact Us
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
              Have questions about Evedentia? Get in touch with our team.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Email Card */}
            <div className="bg-[#0a0f2c]/60 border border-blue-500/20 rounded-xl p-6 text-center hover:border-blue-500/50 transition-all duration-300">
              <div className="inline-flex p-4 bg-blue-600/20 rounded-full mb-4">
                <Mail className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
              <p className="text-gray-400">contact@evedentia.com</p>
              <p className="text-gray-400">support@evedentia.com</p>
            </div>

            {/* Phone Card */}
            <div className="bg-[#0a0f2c]/60 border border-blue-500/20 rounded-xl p-6 text-center hover:border-blue-500/50 transition-all duration-300">
              <div className="inline-flex p-4 bg-blue-600/20 rounded-full mb-4">
                <Phone className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Phone</h3>
              <p className="text-gray-400">+1 (555) 123-4567</p>
              <p className="text-gray-400 text-sm">Mon-Fri, 9AM-6PM EST</p>
            </div>

            {/* Office Card */}
            <div className="bg-[#0a0f2c]/60 border border-blue-500/20 rounded-xl p-6 text-center hover:border-blue-500/50 transition-all duration-300">
              <div className="inline-flex p-4 bg-blue-600/20 rounded-full mb-4">
                <MapPin className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Office</h3>
              <p className="text-gray-400">123 Forensics Avenue</p>
              <p className="text-gray-400">Tech City, TC 12345</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#0a0f2c]/70 border border-blue-500/20 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">
                  Thank you for contacting us! We'll get back to you shortly.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#0a0f2c]/80 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#0a0f2c]/80 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-300 mb-2">
                    Organization
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0a0f2c]/80 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Your Organization"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#0a0f2c]/80 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-[#0a0f2c]/80 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm">
              For urgent support requests, please call our 24/7 hotline at +1 (555) 999-9999
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
