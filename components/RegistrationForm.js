'use client';

import { useState, useRef } from 'react';
import { db, storage } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';


export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    phone: '',
    hkid: '',
    takingMedication: false,
    medicationDetails: '',
    pregnantOrBreastfeeding: false,
    allergies: false,
    allergyDetails: '',
    otherConditions: '',
    priorExperience: '',
  });

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const canvas = canvasRef.current;
    const signatureDataUrl = canvas.toDataURL('image/png');
    
    try {
      // 1. Upload signature to Storage
      const signatureRef = ref(storage, `signatures/${Date.now()}_${formData.name.replace(/\s+/g, '_')}.png`);
      await uploadString(signatureRef, signatureDataUrl, 'data_url');
      const downloadURL = await getDownloadURL(signatureRef);
      
      // 2. Save data to Firestore
      const docRef = await addDoc(collection(db, 'patients'), {
        ...formData,
        registrationSignatureUrl: downloadURL,
        createdAt: serverTimestamp(),
        currentCreditBalance: 0, // Initialize credit balance
      });
      
      console.log('Document written with ID: ', docRef.id);
      alert('Registration successful!');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error during registration. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Patient Registration</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name (姓名) *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth (出生日期) *</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender (性別) *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Number (聯絡電話) *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Identity Card Number (身份證號碼) *</label>
            <input
              type="text"
              name="hkid"
              value={formData.hkid}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>

        {/* Health Condition */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Health Condition</h2>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="takingMedication"
              checked={formData.takingMedication}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Taking Medication (服用藥物)</label>
          </div>
          
          {formData.takingMedication && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Please describe your medication:</label>
              <textarea
                name="medicationDetails"
                value={formData.medicationDetails}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          )}
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="pregnantOrBreastfeeding"
              checked={formData.pregnantOrBreastfeeding}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Pregnant or Breastfeeding (懷孕或哺乳)</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="allergies"
              checked={formData.allergies}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Allergies (過敏史)</label>
          </div>
          
          {formData.allergies && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Please describe your allergies:</label>
              <textarea
                name="allergyDetails"
                value={formData.allergyDetails}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Other Conditions (其他健康狀況)</label>
            <textarea
              name="otherConditions"
              value={formData.otherConditions}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>

        {/* Authorization */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Authorization</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Prior Medical Aesthetic Experience</label>
            <textarea
              name="priorExperience"
              value={formData.priorExperience}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Signature (簽名) *</label>
            <div className="border border-gray-300 rounded-md p-2 bg-gray-50">
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="border border-gray-200 bg-white cursor-crosshair"
              />
              <button
                type="button"
                onClick={clearSignature}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Clear Signature
              </button>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition duration-150"
          >
            Submit Registration
          </button>
        </div>
      </form>
    </div>
  );
}
