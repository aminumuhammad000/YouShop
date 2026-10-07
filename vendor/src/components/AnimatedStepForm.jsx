import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { checkAccountAvailability } from '../services/api';
import { NIGERIAN_STATES, getLgasForState } from '../data/nigeriaStatesLgas';
import '../styles/animated-form.css';

// SVG Icons
const ArrowRightIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
  </svg>
);

const EyeOpenIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeClosedIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
  </svg>
);

const LocationPinIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UploadCloudIcon = () => (
  <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const BuildingStoreIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const TruckDeliveryIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
);

const AnimatedStepForm = ({
  role = 'vendor',
  mode = 'register',
  steps = [],
  formData = {},
  setFormData = () => {},
  onSubmit = async () => {},
  submitButtonText = 'Submit & Complete',
  footerLink = null,
  demoAction = null,
  successMsg = '',
}) => {
  const location = useLocation();
  const isLoginPage = mode === 'login' || location.pathname.includes('login');

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [animStage, setAnimStage] = useState('slide-in-right');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [gpsDetecting, setGpsDetecting] = useState(false);

  const activeInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentStep = steps[currentStepIndex] || {};
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const isSkippable = Boolean(currentStep.skippable || currentStep.required === false) && !isLastStep;

  // Auto-focus active input when step changes
  useEffect(() => {
    setErrorMsg('');
    const timer = setTimeout(() => {
      if (activeInputRef.current && typeof activeInputRef.current.focus === 'function') {
        activeInputRef.current.focus();
      }
    }, 120);
    return () => clearTimeout(timer);
  }, [currentStepIndex]);

  // Compute Password Strength
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'None' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', class: 'weak' };
    if (score <= 3) return { score: 2, label: 'Medium', class: 'medium' };
    return { score: 3, label: 'Strong', class: 'strong' };
  };

  // Field validation with real-time uniqueness check
  const validateCurrentStep = async () => {
    if (!currentStep) return true;

    const val = formData[currentStep.id];

    if (typeof currentStep.validate === 'function') {
      const err = await currentStep.validate(val, formData);
      if (err) {
        setErrorMsg(err);
        return false;
      }
    }

    if (currentStep.required !== false && currentStep.type !== 'review') {
      if (currentStep.type === 'location') {
        if (!formData.address && !formData.state && !val) {
          setErrorMsg('Please confirm your location.');
          return false;
        }
      } else if (currentStep.type === 'password-combo') {
        if (!formData.password) {
          setErrorMsg('Please enter a password.');
          return false;
        }
        if (formData.password.length < 6) {
          setErrorMsg('Password must be at least 6 characters.');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setErrorMsg('Passwords do not match.');
          return false;
        }
      } else if (currentStep.type === 'login-combo') {
        if (!formData.emailOrPhone?.trim()) {
          setErrorMsg('Please enter your registered email or phone number.');
          return false;
        }
        if (!formData.password) {
          setErrorMsg('Please enter your password.');
          return false;
        }
      } else if (currentStep.type === 'multi-text') {
        for (const field of currentStep.fields || []) {
          if (field.required !== false && !formData[field.id]?.trim()) {
            setErrorMsg(`Please fill in ${field.label || 'this field'}.`);
            return false;
          }
        }
      } else if (!val || (typeof val === 'string' && !val.trim())) {
        setErrorMsg(currentStep.errorMessage || `Please enter ${currentStep.question || currentStep.id}.`);
        return false;
      }
    }

    if (currentStep.type === 'email' && val) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        setErrorMsg('Please enter a valid email address.');
        return false;
      }
    }

    if ((currentStep.type === 'tel' || currentStep.id === 'phoneNumber') && val) {
      const digits = String(val).replace(/\D/g, '');
      if (digits.length !== 11) {
        setErrorMsg('Phone number must contain exactly 11 digits (e.g. 08012345678).');
        return false;
      }
    }

    // Uniqueness validation on registration
    if (mode === 'register') {
      if (currentStep.id === 'phoneNumber' || currentStep.type === 'tel') {
        try {
          const check = await checkAccountAvailability({ phoneNumber: val });
          if (check && check.available === false) {
            setErrorMsg(check.message || 'This phone number is already registered. Please use a different phone number.');
            return false;
          }
        } catch {}
      }

      if (currentStep.id === 'email' || currentStep.type === 'email') {
        try {
          const check = await checkAccountAvailability({ email: val });
          if (check && check.available === false) {
            setErrorMsg(check.message || 'This email address is already registered. Please use a different email.');
            return false;
          }
        } catch {}
      }
    }

    setErrorMsg('');
    return true;
  };

  const handleNext = async () => {
    if (isTransitioning) return;
    setLoading(true);
    const isValid = await validateCurrentStep();
    setLoading(false);
    if (!isValid) return;

    if (isLastStep) {
      setLoading(true);
      try {
        await onSubmit(formData);
      } catch (err) {
        setErrorMsg(err?.message || 'Submission failed. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setIsTransitioning(true);
      setAnimStage('slide-out-left');
      setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
        setAnimStage('slide-in-right');
        setIsTransitioning(false);
      }, 190);
    }
  };

  // Skip handler — smoothly bypass current step
  const handleSkip = () => {
    if (isTransitioning || isLastStep) return;
    setErrorMsg('');
    setIsTransitioning(true);
    setAnimStage('slide-out-left');
    setTimeout(() => {
      setCurrentStepIndex((prev) => prev + 1);
      setAnimStage('slide-in-right');
      setIsTransitioning(false);
    }, 190);
  };

  const handleBack = () => {
    if (isFirstStep || isTransitioning) return;
    setErrorMsg('');
    setIsTransitioning(true);
    setAnimStage('slide-out-right');
    setTimeout(() => {
      setCurrentStepIndex((prev) => prev - 1);
      setAnimStage('slide-in-left');
      setIsTransitioning(false);
    }, 190);
  };

  const handleJumpToStep = (index) => {
    if (isTransitioning || index === currentStepIndex) return;
    setErrorMsg('');
    setIsTransitioning(true);
    const direction = index < currentStepIndex ? 'backward' : 'forward';
    setAnimStage(direction === 'backward' ? 'slide-out-right' : 'slide-out-left');
    setTimeout(() => {
      setCurrentStepIndex(index);
      setAnimStage(direction === 'backward' ? 'slide-in-left' : 'slide-in-right');
      setIsTransitioning(false);
    }, 190);
  };

  const handleFieldChange = (fieldId, value) => {
    if (currentStep.type === 'tel' || fieldId === 'phoneNumber' || fieldId === 'phone') {
      value = String(value).replace(/\D/g, '').slice(0, 11);
    }
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleMultiFieldChange = (fieldId, value, fieldType) => {
    if (fieldType === 'tel' || fieldId.toLowerCase().includes('phone')) {
      value = String(value).replace(/\D/g, '').slice(0, 11);
    }
    if (fieldId === 'state') {
      const lgas = getLgasForState(value);
      setFormData((prev) => ({
        ...prev,
        state: value,
        city: lgas.length > 0 ? lgas[0] : '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, [fieldId]: value }));
    }
    if (errorMsg) setErrorMsg('');
  };

  const handleKeyDown = (e) => {
    if ((currentStep.type === 'tel' || currentStep.id === 'phoneNumber') && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (!/^[0-9]$/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key)) {
        e.preventDefault();
        return;
      }
    }

    if (e.key === 'Enter' && currentStep.type !== 'textarea' && currentStep.type !== 'review') {
      e.preventDefault();
      handleNext();
    }
  };

  // Simulated GPS Detect
  const handleDetectGPS = () => {
    setGpsDetecting(true);
    setTimeout(() => {
      setGpsDetecting(false);
      if (role === 'driver') {
        setFormData((prev) => ({
          ...prev,
          city: prev.city || 'Lagos',
          gpsCoords: '6.5244° N, 3.3792° E (Lagos Island)',
          currentLocationConfirmed: true,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          state: prev.state || 'Lagos',
          city: prev.city || 'Lagos (Victoria Island)',
          gpsCoords: '6.4281° N, 3.4219° E (Lekki / VI)',
          locationConfirmed: true,
        }));
      }
      if (errorMsg) setErrorMsg('');
    }, 800);
  };

  // File Upload Handlers
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    handleFieldChange(currentStep.id, {
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type,
      preview: previewUrl,
    });
  };

  const handleRemoveFile = () => {
    handleFieldChange(currentStep.id, null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const progressPercent = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="step-form-wrapper">
      {/* Background Ambient Glows & Grid */}
      <div className="step-ambient-canvas" aria-hidden="true">
        <div className="step-ambient-orb step-ambient-orb-teal" />
        <div className="step-ambient-orb step-ambient-orb-purple" />
        <div className="step-ambient-grid" />
      </div>

      {/* ── Fixed Top Bar ── */}
      <div className="step-top-bar">
        {/* Left: Brand Logo */}
        <Link to="/" className="step-top-bar-left">
          <img
            src="/youshop-logo.png"
            alt="YouShop"
            className="step-brand-logo-img"
          />
        </Link>

        {/* Center: Small step counter at top */}
        {steps.length > 1 ? (
          <div className="step-top-bar-center">
            <span>Step {currentStepIndex + 1}</span> of {steps.length}
          </div>
        ) : (
          <div className="step-top-bar-center">
            <span style={{ fontWeight: 600, letterSpacing: '0.02em', color: '#e2e8f0' }}>
              {isLoginPage ? 'Account Login' : 'YouShop Portal'}
            </span>
          </div>
        )}

        {/* Right: Role Switcher */}
        <div className="step-role-tabs">
          <Link
            to={isLoginPage ? '/vendor/login' : '/vendor/register'}
            className={`step-role-tab ${role === 'vendor' ? 'active' : ''}`}
          >
            <BuildingStoreIcon />
            <span>Vendor</span>
          </Link>
          <Link
            to={isLoginPage ? '/driver/login' : '/driver/register'}
            className={`step-role-tab ${role === 'driver' ? 'active' : ''}`}
          >
            <TruckDeliveryIcon />
            <span>Driver</span>
          </Link>
        </div>
      </div>

      {/* Top progress indicator bar */}
      {steps.length > 1 && (
        <div className="step-progress-line-bg">
          <div className="step-progress-line-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      )}

      {/* ── Main Form Content ── */}
      <div className="step-form-content">
        {demoAction && (
          <div style={{ marginBottom: 16 }}>{demoAction}</div>
        )}

        {/* Modern Glass Card Container */}
        <div className="step-modern-card">
          {/* Card Top Stepper Pill Header */}
          <div className="step-card-stepper-header">
            <div className="step-section-pill">
              <span className="step-section-pulse" />
              <span className="step-section-name">
                {currentStep.section || (isLoginPage ? 'Secure Sign-In' : 'Account Setup')}
              </span>
            </div>

            {steps.length > 1 ? (
              <>
                <div className="step-stepper-track">
                  {steps.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`step-stepper-node ${
                        idx === currentStepIndex
                          ? 'active'
                          : idx < currentStepIndex
                          ? 'completed'
                          : ''
                      }`}
                      onClick={() => idx < currentStepIndex && handleJumpToStep(idx)}
                      title={s.question || `Step ${idx + 1}`}
                      disabled={idx > currentStepIndex}
                    >
                      <span className="step-stepper-node-dot" />
                    </button>
                  ))}
                </div>

                <div className="step-counter-badge">
                  <span>{currentStepIndex + 1}</span>
                  <span className="step-counter-sep">/</span>
                  <span>{steps.length}</span>
                </div>
              </>
            ) : (
              <div className="step-counter-badge" style={{ padding: '3px 12px', fontSize: '0.78rem' }}>
                <span>Secure</span>
              </div>
            )}
          </div>

          {/* Dynamic Question Stage Viewport */}
          <div className="step-stage-viewport">
            <div
              key={currentStepIndex}
              className={`step-card ${animStage}`}
            >
              {/* Direct Question / Field Name */}
              <div className="step-question-meta">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <h2 className="step-question-title">{currentStep.question}</h2>
                  {isSkippable && (
                    <span className="step-optional-badge">
                      Optional
                    </span>
                  )}
                </div>
              </div>

            {/* Input Field Types */}
            {/* 1. TEXT / EMAIL / TEL / NUMBER */}
            {['text', 'email', 'tel', 'number'].includes(currentStep.type) && (
              <div className="step-input-wrap">
                <input
                  ref={activeInputRef}
                  type={currentStep.type === 'tel' ? 'tel' : currentStep.type}
                  inputMode={currentStep.type === 'tel' || currentStep.id === 'phoneNumber' ? 'numeric' : undefined}
                  maxLength={currentStep.type === 'tel' || currentStep.id === 'phoneNumber' ? 11 : undefined}
                  className={`step-input ${errorMsg ? 'error' : ''}`}
                  placeholder={currentStep.placeholder || 'Type here...'}
                  value={formData[currentStep.id] || ''}
                  onChange={(e) => handleFieldChange(currentStep.id, e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                />
              </div>
            )}

            {/* 2. TEXTAREA */}
            {currentStep.type === 'textarea' && (
              <div className="step-input-wrap">
                <textarea
                  ref={activeInputRef}
                  className={`step-input step-textarea ${errorMsg ? 'error' : ''}`}
                  placeholder={currentStep.placeholder || 'Write here...'}
                  value={formData[currentStep.id] || ''}
                  onChange={(e) => handleFieldChange(currentStep.id, e.target.value)}
                  rows={3}
                />
              </div>
            )}

            {/* 3. PASSWORD (Single) */}
            {currentStep.type === 'password' && (
              <div className="step-input-wrap">
                <div style={{ position: 'relative' }}>
                  <input
                    ref={activeInputRef}
                    type={showPassword ? 'text' : 'password'}
                    className={`step-input ${errorMsg ? 'error' : ''}`}
                    placeholder={currentStep.placeholder || 'Enter password'}
                    value={formData[currentStep.id] || ''}
                    onChange={(e) => handleFieldChange(currentStep.id, e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    type="button"
                    className="step-input-icon-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </button>
                </div>
                {isLoginPage && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                    <Link
                      to={role === 'driver' ? '/driver/forgot-password' : '/vendor/forgot-password'}
                      style={{
                        fontSize: '0.82rem',
                        color: role === 'driver' ? '#a78bfa' : '#14b8a6',
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'opacity 0.2s ease',
                      }}
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}
                {formData[currentStep.id] && (
                  <div className="password-strength-wrap">
                    <div className="password-strength-bars">
                      {[1, 2, 3].map((num) => {
                        const strength = getPasswordStrength(formData[currentStep.id]);
                        return (
                          <div
                            key={num}
                            className={`password-strength-segment ${
                              strength.score >= num ? strength.class : ''
                            }`}
                          />
                        );
                      })}
                    </div>
                    <span className="password-strength-text">
                      {getPasswordStrength(formData[currentStep.id]).label}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 3.5. LOGIN COMBO (EMAIL/PHONE & PASSWORD TOGETHER) */}
            {currentStep.type === 'login-combo' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="step-input-wrap" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: 6, fontWeight: 700 }}>
                    Email or Phone Number
                  </label>
                  <input
                    ref={activeInputRef}
                    type="text"
                    className={`step-input ${errorMsg && !formData.emailOrPhone ? 'error' : ''}`}
                    placeholder={currentStep.emailPlaceholder || 'e.g. vendor@youshop.ng or 08012345678'}
                    value={formData.emailOrPhone || ''}
                    onChange={(e) => handleFieldChange('emailOrPhone', e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoComplete="username"
                  />
                </div>

                <div className="step-input-wrap" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: 6, fontWeight: 700 }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`step-input ${errorMsg && !formData.password ? 'error' : ''}`}
                      placeholder={currentStep.passwordPlaceholder || 'Enter your password'}
                      value={formData.password || ''}
                      onChange={(e) => handleFieldChange('password', e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="step-input-icon-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                    <Link
                      to={role === 'driver' ? '/driver/forgot-password' : '/vendor/forgot-password'}
                      style={{
                        fontSize: '0.82rem',
                        color: role === 'driver' ? '#a78bfa' : '#14b8a6',
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'opacity 0.2s ease',
                      }}
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* 4. PASSWORD COMBO */}
            {currentStep.type === 'password-combo' && (
              <div>
                <div className="step-input-wrap">
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 5, fontWeight: 700 }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      ref={activeInputRef}
                      type={showPassword ? 'text' : 'password'}
                      className={`step-input ${errorMsg ? 'error' : ''}`}
                      placeholder="Min 6 characters"
                      value={formData.password || ''}
                      onChange={(e) => handleFieldChange('password', e.target.value)}
                    />
                    <button
                      type="button"
                      className="step-input-icon-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="password-strength-wrap">
                      <div className="password-strength-bars">
                        {[1, 2, 3].map((num) => {
                          const strength = getPasswordStrength(formData.password);
                          return (
                            <div
                              key={num}
                              className={`password-strength-segment ${
                                strength.score >= num ? strength.class : ''
                              }`}
                            />
                          );
                        })}
                      </div>
                      <span className="password-strength-text">
                        {getPasswordStrength(formData.password).label}
                      </span>
                    </div>
                  )}
                </div>

                <div className="step-input-wrap">
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 5, fontWeight: 700 }}>
                    Confirm Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className={`step-input ${errorMsg ? 'error' : ''}`}
                      placeholder="Re-type password"
                      value={formData.confirmPassword || ''}
                      onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <button
                      type="button"
                      className="step-input-icon-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 5. MULTI-FIELD GROUP */}
            {currentStep.type === 'multi-text' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {currentStep.fields?.map((field, idx) => {
                  const isSelect = field.type === 'select' || field.id === 'state' || field.id === 'city' || field.id === 'lga';
                  const isLgaField = field.id === 'city' || field.id === 'lga';
                  const currentState = formData.state || 'Kano';
                  const availableLgas = isLgaField ? getLgasForState(currentState) : [];

                  return (
                    <div key={field.id} className="step-input-wrap" style={{ margin: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                        <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700 }}>
                          {field.label}
                        </label>
                        {isLgaField && currentState && (
                          <span style={{ fontSize: '0.72rem', color: '#14B8A6', fontWeight: 700, background: 'rgba(20,184,166,0.12)', padding: '2px 8px', borderRadius: 999 }}>
                            {availableLgas.length} LGAs in {currentState}
                          </span>
                        )}
                      </div>

                      {isSelect ? (
                        <div style={{ position: 'relative' }}>
                          <select
                            ref={idx === 0 ? activeInputRef : null}
                            className="step-input"
                            value={formData[field.id] || ''}
                            onChange={(e) => handleMultiFieldChange(field.id, e.target.value, 'select')}
                            style={{
                              background: '#1E293B',
                              color: '#FFFFFF',
                              appearance: 'none',
                              WebkitAppearance: 'none',
                              paddingRight: 40,
                              cursor: 'pointer',
                              border: '1px solid rgba(255,255,255,0.12)',
                            }}
                          >
                            <option value="" disabled style={{ color: '#94A3B8', background: '#0F172A' }}>
                              {field.placeholder || `Select ${field.label}`}
                            </option>
                            {(field.id === 'state'
                              ? NIGERIAN_STATES
                              : isLgaField
                              ? availableLgas
                              : field.options || []
                            ).map((opt) => {
                              const val = typeof opt === 'string' ? opt : opt.value;
                              const lbl = typeof opt === 'string' ? opt : opt.label;
                              return (
                                <option key={val} value={val} style={{ background: '#0F172A', color: '#FFFFFF' }}>
                                  {lbl}
                                </option>
                              );
                            })}
                          </select>
                          <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94A3B8' }}>
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <input
                          ref={idx === 0 ? activeInputRef : null}
                          type={field.type || 'text'}
                          className="step-input"
                          placeholder={field.placeholder || ''}
                          value={formData[field.id] || ''}
                          onChange={(e) => handleMultiFieldChange(field.id, e.target.value, field.type)}
                          onKeyDown={handleKeyDown}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 6. OPTIONS GRID */}
            {currentStep.type === 'options-grid' && (
              <div className="step-options-grid">
                {currentStep.options?.map((opt) => {
                  const isSelected = formData[currentStep.id] === opt.value;
                  return (
                    <div
                      key={opt.value}
                      className={`step-option-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleFieldChange(currentStep.id, opt.value)}
                    >
                      <span className="step-option-card-label">{opt.label}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 7. LOCATION & MAP PIN */}
            {currentStep.type === 'location' && (
              <div className="step-location-card">
                <div className="step-location-map-mock">
                  <div className="step-location-map-grid" />
                  <div className="step-location-pin">
                    <LocationPinIcon />
                  </div>
                </div>
                <div className="step-location-body">
                  <button
                    type="button"
                    className="step-gps-btn"
                    onClick={handleDetectGPS}
                    disabled={gpsDetecting}
                  >
                    {gpsDetecting ? (
                      'Detecting GPS...'
                    ) : (
                      <>
                        <LocationPinIcon /> Use GPS Location
                      </>
                    )}
                  </button>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', background: 'rgba(255,255,255,0.04)', padding: 10, borderRadius: 10 }}>
                    <strong>Coordinates: </strong>
                    <span style={{ color: '#2DD4BF' }}>
                      {formData.gpsCoords || 'Not detected yet'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 8. FILE UPLOAD */}
            {currentStep.type === 'file' && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={currentStep.accept || 'image/*,.pdf'}
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
                {!formData[currentStep.id] ? (
                  <div
                    className="step-upload-box"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="step-upload-icon">
                      <UploadCloudIcon />
                    </div>
                    <h4 className="step-upload-title">
                      Upload {currentStep.fileLabel || 'document'}
                    </h4>
                    <p className="step-upload-sub">
                      JPG, PNG, WEBP, PDF (Max 10MB)
                    </p>
                  </div>
                ) : (
                  <div className="step-file-preview">
                    <div className="step-file-preview-info">
                      {formData[currentStep.id].preview ? (
                        <img
                          src={formData[currentStep.id].preview}
                          alt="Preview"
                          className="step-file-preview-thumb"
                        />
                      ) : (
                        <div className="step-option-card-icon" style={{ background: '#14B8A6', color: '#ffffff' }}>
                          <CheckIcon />
                        </div>
                      )}
                      <div>
                        <div className="step-file-preview-name">{formData[currentStep.id].name}</div>
                        <div className="step-file-preview-size">{formData[currentStep.id].size}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="step-file-remove-btn"
                      onClick={handleRemoveFile}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 9. REVIEW STEP */}
            {currentStep.type === 'review' && (
              <div className="step-review-container">
                {currentStep.reviewSections?.map((section) => (
                  <div key={section.title} className="step-review-section">
                    <div className="step-review-header">
                      <h4>{section.title}</h4>
                      {section.stepIndex !== undefined && (
                        <button
                          type="button"
                          className="step-review-edit-btn"
                          onClick={() => handleJumpToStep(section.stepIndex)}
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    <div className="step-review-grid">
                      {section.items?.map((item) => (
                        <div key={item.label} className="step-review-item">
                          <span className="step-review-label">{item.label}</span>
                          <span className="step-review-value">
                            {item.value || <em style={{ color: '#64748b' }}>Not specified</em>}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Validation Error Banner */}
            {errorMsg && (
              <div className="step-validation-msg">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Notification Banner */}
            {successMsg && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: 'rgba(16, 185, 129, 0.16)',
                  border: '1.5px solid #10B981',
                  color: '#34D399',
                  padding: '14px 18px',
                  borderRadius: 14,
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  marginTop: 14,
                  marginBottom: 10,
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.25)',
                  animation: 'fadeIn 0.2s ease-in-out',
                }}
              >
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: '#10B981',
                  color: '#0F172A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  flexShrink: 0,
                }}>
                  ✓
                </div>
                <span>{successMsg}</span>
              </div>
            )}

            {/* Actions Bar */}
            <div className="step-actions-bar">
              {!isFirstStep && (
                <button
                  type="button"
                  className="step-btn-back"
                  onClick={handleBack}
                  disabled={loading}
                >
                  <ArrowLeftIcon /> Back
                </button>
              )}

              {isSkippable && (
                <button
                  type="button"
                  className="step-btn-skip"
                  onClick={handleSkip}
                  disabled={loading}
                >
                  Skip for now →
                </button>
              )}

              <button
                type="button"
                className="step-btn-next"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 15, height: 15, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                    Processing...
                  </span>
                ) : isLastStep ? (
                  submitButtonText
                ) : (
                  <>
                    Continue <ArrowRightIcon />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
        {footerLink && (
          <div className="step-card-footer">
            {footerLink}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimatedStepForm;
