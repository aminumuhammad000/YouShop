import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedStepForm from '../components/AnimatedStepForm';
import WelcomeScreen from '../components/WelcomeScreen';
import { registerVendor } from '../services/api';

const VendorRegister = ({ onRegister }) => {
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    storeName: '',
    businessCategory: 'Electronics & Gadgets',
    state: 'Kano',
    city: 'Kano Municipal',
    businessAddress: '',
    gpsCoords: '',
    locationConfirmed: false,
    businessDescription: '',
    businessLogo: null,
    businessDocument: null,
    password: '',
    confirmPassword: '',
  });

  const handleRegisterSubmit = async (data) => {
    const payload = {
      name: data.fullName,
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      phone: data.phoneNumber,
      storeName: data.storeName || `${data.fullName}'s Store`,
      store_name: data.storeName || `${data.fullName}'s Store`,
      businessCategory: data.businessCategory || 'General',
      state: data.state || 'Lagos',
      city: data.city || 'Lagos',
      businessAddress: data.businessAddress || '',
      businessDescription: data.businessDescription || '',
      businessLogoUrl: data.businessLogo?.preview || '',
      password: data.password,
    };

    const response = await registerVendor(payload);
    const sessionData = {
      id: response._id || response.id,
      _id: response._id || response.id,
      name: response.name || data.fullName,
      email: response.email || data.email,
      status: response.vendorStatus || response.status || 'approved',
      vendorStatus: response.vendorStatus || response.status || 'approved',
      store_name: response.storeName || payload.storeName,
      storeName: response.storeName || payload.storeName,
      role: 'vendor',
      token: response.token || 'jwt-token-vendor-' + Date.now(),
    };

    localStorage.setItem('youshop_vendor_session', JSON.stringify(sessionData));
    sessionStorage.setItem('youshop_auth_notification', JSON.stringify({
      type: 'register',
      title: 'Store Registration Successful! 🎉',
      message: `Your store was registered successfully! Welcome to YouShop, ${sessionData.name}.`,
    }));

    setSuccessMsg(`Your store was registered successfully! Welcome to YouShop, ${sessionData.name}.`);

    setTimeout(() => {
      if (onRegister) onRegister(sessionData);
      navigate('/vendor/dashboard');
    }, 1300);
  };

  const steps = [
    // Step 1: Full Name (Mandatory)
    {
      id: 'fullName',
      section: 'Personal',
      question: 'Full Name',
      type: 'text',
      placeholder: 'Enter your full name',
      required: true,
      skippable: false,
      validate: (val) => {
        if (!val || val.trim().length < 3) return 'Please enter your full name.';
        return null;
      },
    },

    // Step 2: Phone Number (Mandatory)
    {
      id: 'phoneNumber',
      section: 'Contact',
      question: 'Phone Number',
      type: 'tel',
      placeholder: 'e.g. 08012345678 (11 digits)',
      required: true,
      skippable: false,
      validate: (val) => {
        const digits = (val || '').replace(/\D/g, '');
        if (digits.length !== 11) {
          return 'Phone number must contain exactly 11 digits (e.g. 08012345678).';
        }
        return null;
      },
    },

    // Step 3: Email (Mandatory)
    {
      id: 'email',
      section: 'Contact',
      question: 'Email Address',
      type: 'email',
      placeholder: 'name@example.com',
      required: true,
      skippable: false,
      validate: (val) => {
        if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          return 'Please provide a valid email address.';
        }
        return null;
      },
    },

    // Step 4: Business Name (Skippable)
    {
      id: 'storeName',
      section: 'Business',
      question: 'Business Name',
      type: 'text',
      placeholder: 'e.g. Apex Electronics & Tech (Optional)',
      required: false,
      skippable: true,
    },

    // Step 5: Business Category (Skippable)
    {
      id: 'businessCategory',
      section: 'Business',
      question: 'Business Category',
      type: 'options-grid',
      required: false,
      skippable: true,
      options: [
        { value: 'Electronics & Gadgets', label: 'Electronics & Tech' },
        { value: 'Fashion & Apparel', label: 'Fashion & Apparel' },
        { value: 'Groceries & Supermarket', label: 'Groceries & Foods' },
        { value: 'Home & Furniture', label: 'Home & Living' },
        { value: 'Beauty & Personal Care', label: 'Beauty & Skincare' },
        { value: 'Pharmacy & Health', label: 'Health & Pharmacy' },
      ],
    },

    // Step 6: Business Address (Skippable)
    {
      id: 'addressGroup',
      section: 'Location',
      question: 'Business Address & Location',
      type: 'multi-text',
      required: false,
      skippable: true,
      fields: [
        { id: 'state', label: 'State', type: 'select', placeholder: 'Select State (e.g. Kano, Lagos)' },
        { id: 'city', label: 'Local Government Area (LGA)', type: 'select', placeholder: 'Select Local Government' },
        { id: 'businessAddress', label: 'Street Address', placeholder: 'e.g. 15 Commercial Avenue', required: false },
      ],
    },

    // Step 7: Business Location (Skippable)
    {
      id: 'location',
      section: 'Location',
      question: 'Business Location',
      type: 'location',
      required: false,
      skippable: true,
    },

    // Step 8: Business Description (Skippable)
    {
      id: 'businessDescription',
      section: 'Details',
      question: 'Business Description',
      type: 'textarea',
      placeholder: 'Briefly describe what you sell (Optional)...',
      required: false,
      skippable: true,
    },

    // Step 9: Business Logo (Skippable)
    {
      id: 'businessLogo',
      section: 'Documents',
      question: 'Business Logo',
      type: 'file',
      accept: 'image/*',
      fileLabel: 'Storefront Logo / Photo',
      required: false,
      skippable: true,
    },

    // Step 10: Required Documents (Skippable)
    {
      id: 'businessDocument',
      section: 'Documents',
      question: 'Verification Document',
      type: 'file',
      accept: 'image/*,.pdf',
      fileLabel: 'CAC / ID Document',
      required: false,
      skippable: true,
    },

    // Step 11: Password (Mandatory)
    {
      id: 'passwordCombo',
      section: 'Security',
      question: 'Create Password',
      type: 'password-combo',
      required: true,
      skippable: false,
    },

    // Step 12: Review
    {
      id: 'review',
      section: 'Review',
      question: 'Review Details',
      type: 'review',
      reviewSections: [
        {
          title: 'Personal & Contact Information',
          stepIndex: 0,
          items: [
            { label: 'Full Name', value: formData.fullName },
            { label: 'Phone Number', value: formData.phoneNumber },
            { label: 'Email Address', value: formData.email },
          ],
        },
        {
          title: 'Business Information',
          stepIndex: 3,
          items: [
            { label: 'Store Name', value: formData.storeName || `${formData.fullName}'s Store` },
            { label: 'Category', value: formData.businessCategory || 'General' },
            { label: 'Description', value: formData.businessDescription || 'Not specified' },
          ],
        },
        {
          title: 'Store Location',
          stepIndex: 5,
          items: [
            { label: 'State & LGA', value: formData.state ? `${formData.state}, ${formData.city || ''}` : 'Not set' },
            { label: 'Street Address', value: formData.businessAddress || 'Not set' },
            { label: 'GPS Pin', value: formData.gpsCoords || 'Not set' },
          ],
        },
        {
          title: 'Uploaded Media & Security',
          stepIndex: 8,
          items: [
            { label: 'Store Logo', value: formData.businessLogo ? formData.businessLogo.name : 'Skipped' },
            { label: 'Verification Doc', value: formData.businessDocument ? formData.businessDocument.name : 'Skipped' },
            { label: 'Account Password', value: '••••••••••••' },
          ],
        },
      ],
    },
  ];

  return (
    <AnimatedStepForm
      role="vendor"
      mode="register"
      steps={steps}
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleRegisterSubmit}
      submitButtonText="Create Vendor Account →"
      successMsg={successMsg}
      footerLink={
        <div>
          Already registered as a vendor?{' '}
          <Link to="/vendor/login" style={{ color: 'var(--auth-link)', fontWeight: 800 }}>
            Sign In Here →
          </Link>
        </div>
      }
    />
  );
};

export default VendorRegister;
