import React, { useState, useEffect } from 'react';
import { getDriverFaqs, submitDriverSupportTicket, getDriverSupportContact } from '../services/api';

const DriverSupportPage = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [supportTicket, setSupportTicket] = useState({
    subject: '',
    category: '',
    message: '',
    priority: 'normal'
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [contactInfo, setContactInfo] = useState({
    phone: '+1 (800) DRIVER',
    phoneHours: 'Available 24/7 for emergencies',
    email: 'drivers@youshop.com',
    emailResponse: 'Response within 24 hours',
    roadsidePlan: 'Included with Pro Plan',
    roadsideDetails: 'Free towing & repairs'
  });

  useEffect(() => {
    loadFaqs();
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    try {
      const data = await getDriverSupportContact();
      if (data && Object.keys(data).length > 0) {
        setContactInfo(data);
      }
    } catch (err) {
      console.error('Error loading contact info:', err);
    }
  };

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const data = await getDriverFaqs();
      setFaqs(data);
    } catch (err) {
      setError('Failed to load FAQs. Please try again later.');
      console.error('Error loading FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await submitDriverSupportTicket(supportTicket);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSupportTicket({ subject: '', category: '', message: '', priority: 'normal' });
      }, 3000);
    } catch (err) {
      setError('Failed to submit support ticket. Please try again.');
      console.error('Error submitting ticket:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setError(null);
    setSupportTicket(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="vendor-content">
      <div className="card-panel">
        <div className="section-header">
          <div className="section-title-group">
            <h3>Driver Support Center</h3>
            <p>Get help with deliveries, earnings, vehicle management, and account issues</p>
          </div>
        </div>

        {/* Quick Help Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 32 }}>
          <div style={{ padding: 24, background: 'linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)', borderRadius: 20, border: '1px solid #14B8A6' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#14B8A6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>Hotline Support</h4>
            <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: 12 }}>24/7 driver emergency line</p>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#14B8A6' }}>{contactInfo.phone}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: 4 }}>{contactInfo.phoneHours}</div>
          </div>

          <div style={{ padding: 24, background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)', borderRadius: 20, border: '1px solid #8B5CF6' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#8B5CF6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>Email Support</h4>
            <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: 12 }}>Non-urgent inquiries</p>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#8B5CF6' }}>{contactInfo.email}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: 4 }}>{contactInfo.emailResponse}</div>
          </div>

          <div style={{ padding: 24, background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', borderRadius: 20, border: '1px solid #F59E0B' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#F59E0B', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>Roadside Assistance</h4>
            <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: 12 }}>Vehicle breakdown support</p>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#F59E0B' }}>{contactInfo.roadsidePlan}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: 4 }}>{contactInfo.roadsideDetails}</div>
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ marginBottom: 32 }}>
          <h4 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0F172A', marginBottom: 20 }}>Frequently Asked Questions</h4>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#64748B' }}>
              Loading FAQs...
            </div>
          ) : error ? (
            <div style={{ 
              padding: 20, 
              background: '#FEF2F2', 
              border: '1px solid #FECACA', 
              borderRadius: 12,
              color: '#991B1B',
              marginBottom: 16
            }}>
              {error}
              <button
                type="button"
                onClick={loadFaqs}
                style={{
                  marginTop: 12,
                  padding: '8px 16px',
                  background: '#DC2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Retry
              </button>
            </div>
          ) : faqs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#64748B' }}>
              No FAQs available at this time.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {faqs.map((faq) => (
                <div
                  key={faq._id || faq.id}
                  style={{
                    border: '1px solid var(--vendor-border)',
                    borderRadius: 16,
                    overflow: 'hidden',
                    background: '#FFFFFF'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(expandedFaq === (faq._id || faq.id) ? null : (faq._id || faq.id))}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      background: 'transparent',
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A' }}>{faq.question}</span>
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{
                        transition: 'transform 0.2s ease',
                        transform: expandedFaq === (faq._id || faq.id) ? 'rotate(180deg)' : 'rotate(0deg)',
                        color: '#64748B',
                        flexShrink: 0
                      }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedFaq === (faq._id || faq.id) && (
                    <div style={{ padding: '0 24px 20px 24px', borderTop: '1px solid #F1F5F9' }}>
                      <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: 1.6, marginTop: 16 }}>
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Support Ticket Form */}
        <div>
          <h4 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0F172A', marginBottom: 20 }}>Submit a Support Ticket</h4>
          
          {error && !submitted && (
            <div style={{ 
              padding: 16, 
              background: '#FEF2F2', 
              border: '1px solid #FECACA', 
              borderRadius: 12,
              color: '#991B1B',
              marginBottom: 20
            }}>
              {error}
            </div>
          )}
          
          {submitted ? (
            <div style={{
              padding: 32,
              background: 'linear-gradient(135deg, #DDD6FE 0%, #C4B5FD 100%)',
              borderRadius: 20,
              border: '2px solid #8B5CF6',
              textAlign: 'center'
            }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 50,
                background: '#8B5CF6',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '2rem',
                fontWeight: 700
              }}>
                ✓
              </div>
              <h4 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#5B21B6', marginBottom: 8 }}>Ticket Submitted Successfully!</h4>
              <p style={{ fontSize: '1rem', color: '#6D28D9' }}>Our driver support team will review your request and respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>
                    Category *
                  </label>
                  <select
                    required
                    value={supportTicket.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 12,
                      border: '1px solid var(--vendor-border)',
                      background: '#FFFFFF',
                      fontSize: '0.95rem',
                      color: '#0F172A'
                    }}
                  >
                    <option value="">Select a category</option>
                    <option value="delivery">Delivery Issues</option>
                    <option value="payments">Payments & Earnings</option>
                    <option value="vehicle">Vehicle & Documents</option>
                    <option value="account">Account & Profile</option>
                    <option value="app">App Technical Issues</option>
                    <option value="safety">Safety Incident</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>
                    Priority Level
                  </label>
                  <select
                    value={supportTicket.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 12,
                      border: '1px solid var(--vendor-border)',
                      background: '#FFFFFF',
                      fontSize: '0.95rem',
                      color: '#0F172A'
                    }}
                  >
                    <option value="low">Low - General inquiry</option>
                    <option value="normal">Normal - Standard support</option>
                    <option value="high">High - Affects current delivery</option>
                    <option value="critical">Critical - Emergency/Safety issue</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={supportTicket.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Brief description of your issue"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '1px solid var(--vendor-border)',
                    background: '#FFFFFF',
                    fontSize: '0.95rem',
                    color: '#0F172A'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>
                  Detailed Description *
                </label>
                <textarea
                  required
                  value={supportTicket.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Please provide details about your issue, including delivery ID, time, location, and any relevant information."
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '1px solid var(--vendor-border)',
                    background: '#FFFFFF',
                    fontSize: '0.95rem',
                    color: '#0F172A',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: '14px 28px',
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  alignSelf: 'flex-start'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(139,92,246,0.3)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                Submit Support Ticket
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverSupportPage;