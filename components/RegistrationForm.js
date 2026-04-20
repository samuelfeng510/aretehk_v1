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
    <div className="max-w-5xl mx-auto p-10 bg-[#ffffff] border border-[#dadada] rounded-none font-sans text-[#1a1c1c]">
      <h1 className="text-4xl font-serif font-light mb-8 text-[#1a1c1c]">Patient Registration</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Client Information */}
        <div>
          <h2 className="text-xl font-serif font-light text-[#1a1c1c] mb-4">Client Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs uppercase tracking-widest text-[#605f54] mb-2 block">Name (姓名) *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="border border-[#c9c6bd] rounded-none p-3 w-full bg-white text-sm focus:outline-none focus:border-[#1a1c1c]"
              />
            </div>
            
            <div>
              <label className="text-xs uppercase tracking-widest text-[#605f54] mb-2 block">Date of Birth (出生日期) *</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                required
                className="border border-[#c9c6bd] rounded-none p-3 w-full bg-white text-sm focus:outline-none focus:border-[#1a1c1c]"
              />
            </div>
            
            <div>
              <label className="text-xs uppercase tracking-widest text-[#605f54] mb-2 block">Gender (性別) *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                className="border border-[#c9c6bd] rounded-none p-3 w-full bg-white text-sm focus:outline-none focus:border-[#1a1c1c]"
              >
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs uppercase tracking-widest text-[#605f54] mb-2 block">Contact Number (聯絡電話) *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="border border-[#c9c6bd] rounded-none p-3 w-full bg-white text-sm focus:outline-none focus:border-[#1a1c1c]"
              />
            </div>
            
            <div>
              <label className="text-xs uppercase tracking-widest text-[#605f54] mb-2 block">Identity Card Number (身份證號碼) *</label>
              <input
                type="text"
                name="hkid"
                value={formData.hkid}
                onChange={handleInputChange}
                required
                className="border border-[#c9c6bd] rounded-none p-3 w-full bg-white text-sm focus:outline-none focus:border-[#1a1c1c]"
              />
            </div>
          </div>
        </div>

        {/* Health Condition */}
        <div className="space-y-6 border-t border-[#dadada] pt-6">
          <h2 className="text-xl font-serif font-light text-[#1a1c1c] mb-4">Health Condition</h2>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="takingMedication"
              checked={formData.takingMedication}
              onChange={handleInputChange}
              className="h-4 w-4 border-[#c9c6bd] rounded-none text-[#1a1c1c] focus:ring-0"
            />
            <label className="text-sm text-[#48473f]">Taking Medication (服用藥物)</label>
          </div>
          
          {formData.takingMedication && (
            <div>
              <label className="text-xs uppercase tracking-widest text-[#605f54] mb-2 block">Please describe your medication:</label>
              <textarea
                name="medicationDetails"
                value={formData.medicationDetails}
                onChange={handleInputChange}
                rows="3"
                className="border border-[#c9c6bd] rounded-none p-3 w-full bg-white text-sm focus:outline-none focus:border-[#1a1c1c] leading-relaxed"
              />
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="pregnantOrBreastfeeding"
              checked={formData.pregnantOrBreastfeeding}
              onChange={handleInputChange}
              className="h-4 w-4 border-[#c9c6bd] rounded-none text-[#1a1c1c] focus:ring-0"
            />
            <label className="text-sm text-[#48473f]">Pregnant or Breastfeeding (懷孕或哺乳)</label>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="allergies"
              checked={formData.allergies}
              onChange={handleInputChange}
              className="h-4 w-4 border-[#c9c6bd] rounded-none text-[#1a1c1c] focus:ring-0"
            />
            <label className="text-sm text-[#48473f]">Allergies (過敏史)</label>
          </div>
          
          {formData.allergies && (
            <div>
              <label className="text-xs uppercase tracking-widest text-[#605f54] mb-2 block">Please describe your allergies:</label>
              <textarea
                name="allergyDetails"
                value={formData.allergyDetails}
                onChange={handleInputChange}
                rows="3"
                className="border border-[#c9c6bd] rounded-none p-3 w-full bg-white text-sm focus:outline-none focus:border-[#1a1c1c] leading-relaxed"
              />
            </div>
          )}
          
          <div>
            <label className="text-xs uppercase tracking-widest text-[#605f54] mb-2 block">Other Conditions (其他健康狀況)</label>
            <textarea
              name="otherConditions"
              value={formData.otherConditions}
              onChange={handleInputChange}
              rows="3"
              className="border border-[#c9c6bd] rounded-none p-3 w-full bg-white text-sm focus:outline-none focus:border-[#1a1c1c] leading-relaxed"
            />
          </div>
        </div>

        {/* Authorization */}
        <div className="space-y-6 border-t border-[#dadada] pt-6">
          <h2 className="text-xl font-serif font-light text-[#1a1c1c] mb-4">Authorization</h2>
          
          <div>
            <label className="text-xs uppercase tracking-widest text-[#605f54] mb-2 block">Prior Medical Aesthetic Experience</label>
            <textarea
              name="priorExperience"
              value={formData.priorExperience}
              onChange={handleInputChange}
              rows="3"
              className="border border-[#c9c6bd] rounded-none p-3 w-full bg-white text-sm focus:outline-none focus:border-[#1a1c1c] leading-relaxed"
            />
          </div>
          
          <div>
            <label className="text-xs uppercase tracking-widest text-[#605f54] mb-2 block">Signature (簽名) *</label>
            <div className="border border-[#dadada] bg-white w-fit">
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="cursor-crosshair"
              />
              <div className="flex justify-between border-t border-[#dadada] p-3 bg-[#f9f9f9]">
                <button
                  type="button"
                  onClick={clearSignature}
                  className="text-xs uppercase tracking-widest text-[#79776f] hover:text-[#1a1c1c] transition"
                >
                  Clear Signature
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full bg-[#1a1c1c] text-white p-4 rounded-none font-medium uppercase tracking-widest hover:bg-[#2f3131] transition"
          >
            Submit Registration
          </button>
        </div>
      </form>
    </div>
  );
}
