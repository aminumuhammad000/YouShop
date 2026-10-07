import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedStepForm from '../components/AnimatedStepForm';
import WelcomeScreen from '../components/WelcomeScreen';
import { registerDriver } from '../services/api';

const DriverRegister = ({ onRegister }) => {
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    driverType: 'Motorcycle Rider',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleColor: '',
    plateNumber: '',
    driverLicenseDoc: null,
    identityDoc: null,
    ninNumber: '',
    state: 'Kano',
    city: 'Kano Municipal',
    homeAddress: '',
    gpsCoords: '',
    vehicleDocument: null,
    password: '',
    confirmPassword: '',
  });

  const handleDriverRegisterSubmit = async (data) => {
    const payload = {
      name: data.fullName,
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      phone: data.phoneNumber,
      vehicleType: data.driverType ? data.driverType.split(' ')[0] : 'Motorcycle',
      driverType: data.driverType || 'Motorcycle Rider',
      vehicleBrand: data.vehicleBrand || '',
      vehicleModel: data.vehicleModel || '',
      plateNumber: data.plateNumber || '',
      city: data.city || 'Lagos',
      state: data.state || 'Lagos',
      address: data.homeAddress || '',
      password: data.password,
    };

    const response = await registerDriver(payload);
    const sessionData = {
      id: response._id || response.id,
      _id: response._id || response.id,
      name: response.name || data.fullName,
      email: response.email || data.email,
      phoneNumber: data.phoneNumber,
      vehicleType: payload.vehicleType,
      city: data.city || 'Lagos',
      status: 'approved',
      driverStatus: 'approved',
      role: 'driver',
      token: response.token || 'jwt-token-driver-' + Date.now(),
    };

    localStorage.setItem('youshop_driver_session', JSON.stringify(sessionData));
    sessionStorage.setItem('youshop_auth_notification', JSON.stringify({
      type: 'register',
      title: 'Driver Registration Successful! 🚗',
      message: `Your driver account was registered successfully! Welcome to YouShop Fleet, ${sessionData.name}.`,
    }));

    setSuccessMsg(`Your driver account was registered successfully! Welcome to YouShop Fleet, ${sessionData.name}.`);

    setTimeout(() => {
      if (onRegister) onRegister(sessionData);
      navigate('/driver/dashboard');
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

    // Step 3: Email Address (Mandatory)
    {
      id: 'email',
      section: 'Contact',
      question: 'Email Address',
      type: 'email',
      placeholder: 'courier@example.com',
      required: true,
      skippable: false,
      validate: (val) => {
        if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          return 'Please provide a valid email address.';
        }
        return null;
      },
    },

    // Step 4: Driver Type (Skippable)
    {
      id: 'driverType',
      section: 'Vehicle',
      question: 'Vehicle Type',
      type: 'options-grid',
      required: false,
      skippable: true,
      options: [
        { value: 'Motorcycle Rider', label: 'Dispatch Motorcycle' },
        { value: 'Car Driver', label: 'Sedan / Saloon Car' },
        { value: 'Van Driver', label: 'Cargo / Delivery Van' },
        { value: 'Bicycle Courier', label: 'Bicycle / E-Bike' },
      ],
    },

    // Step 5: Vehicle Information (Skippable)
    {
      id: 'vehicleInfo',
      section: 'Vehicle',
      question: 'Vehicle Details',
      type: 'multi-text',
      required: false,
      skippable: true,
      fields: [
        { id: 'vehicleBrand', label: 'Brand / Make', placeholder: 'e.g. Bajaj, Honda, Toyota', required: false },
        { id: 'vehicleModel', label: 'Model', placeholder: 'e.g. Pulsar 150, Corolla', required: false },
        { id: 'vehicleYear', label: 'Year', placeholder: 'e.g. 2022', required: false },
        { id: 'vehicleColor', label: 'Color', placeholder: 'e.g. Black / Red', required: false },
      ],
    },

    // Step 6: Vehicle Registration (Skippable)
    {
      id: 'plateNumber',
      section: 'Vehicle',
      question: 'Plate Number',
      type: 'text',
      placeholder: 'e.g. EKY-782-AA (Optional)',
      required: false,
      skippable: true,
    },

    // Step 7: Driver License (Skippable)
    {
      id: 'driverLicenseDoc',
      section: 'Documents',
      question: "Driver's License",
      type: 'file',
      accept: 'image/*,.pdf',
      fileLabel: "Driver's License Photo",
      required: false,
      skippable: true,
    },

    // Step 8: Identity Verification (Skippable)
    {
      id: 'ninNumber',
      section: 'Documents',
      question: 'NIN Number',
      type: 'text',
      placeholder: '11-digit NIN (Optional)',
      required: false,
      skippable: true,
    },

    // Step 9: Residential Address (Skippable)
    {
      id: 'addressGroup',
      section: 'Address',
      question: 'Home Address & Operating Area',
      type: 'multi-text',
      required: false,
      skippable: true,
      fields: [
        { id: 'state', label: 'State', type: 'select', placeholder: 'Select State (e.g. Kano, Lagos)' },
        { id: 'city', label: 'Local Government Area (LGA)', type: 'select', placeholder: 'Select Local Government' },
        { id: 'homeAddress', label: 'Street Address', placeholder: 'e.g. 14 Unity Road', required: false },
      ],
    },

    // Step 10: Current Operating Location (Skippable)
    {
      id: 'location',
      section: 'Location',
      question: 'Operating Zone',
      type: 'location',
      required: false,
      skippable: true,
    },

    // Step 11: Vehicle Documents (Skippable)
    {
      id: 'vehicleDocument',
      section: 'Documents',
      question: 'Vehicle Insurance',
      type: 'file',
      accept: 'image/*,.pdf',
      fileLabel: 'Vehicle Document',
      required: false,
      skippable: true,
    },

    // Step 12: Account Password (Mandatory)
    {
      id: 'passwordCombo',
      section: 'Security',
      question: 'Create Password',
      type: 'password-combo',
      required: true,
      skippable: false,
    },

    // Step 13: Review
    {
      id: 'review',
      section: 'Review',
      question: 'Review Details',
      type: 'review',
      reviewSections: [
        {
          title: 'Personal & Contact',
          stepIndex: 0,
          items: [
            { label: 'Full Name', value: formData.fullName },
            { label: 'Phone', value: formData.phoneNumber },
            { label: 'Email', value: formData.email },
          ],
        },
        {
          title: 'Vehicle & Service Class',
          stepIndex: 3,
          items: [
            { label: 'Service Type', value: formData.driverType || 'Motorcycle' },
            { label: 'Vehicle Details', value: formData.vehicleBrand ? `${formData.vehicleBrand} ${formData.vehicleModel || ''}` : 'Skipped' },
            { label: 'Plate Number', value: formData.plateNumber || 'Skipped' },
          ],
        },
        {
          title: 'Address & Operating Zone',
          stepIndex: 8,
          items: [
            { label: 'City & State', value: formData.city || 'Lagos' },
            { label: 'Home Address', value: formData.homeAddress || 'Not set' },
            { label: 'GPS Zone', value: formData.gpsCoords || 'Not set' },
          ],
        },
        {
          title: 'Verification & Security',
          stepIndex: 6,
          items: [
            { label: 'NIN Number', value: formData.ninNumber || 'Skipped' },
            { label: 'Driver License', value: formData.driverLicenseDoc ? formData.driverLicenseDoc.name : 'Skipped' },
            { label: 'Vehicle Insurance', value: formData.vehicleDocument ? formData.vehicleDocument.name : 'Skipped' },
          ],
        },
      ],
    },
  ];

  return (
    <AnimatedStepForm
      role="driver"
      mode="register"
      steps={steps}
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleDriverRegisterSubmit}
      submitButtonText="Create Driver Account →"
      successMsg={successMsg}
      footerLink={
        <div>
          Already registered as a driver?{' '}
          <Link to="/driver/login" style={{ color: 'var(--auth-link)', fontWeight: 800 }}>
            Sign In Here →
          </Link>
        </div>
      }
    />
  );
};

export default DriverRegister;
