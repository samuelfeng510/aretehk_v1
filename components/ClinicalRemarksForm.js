'use client';

import { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, updateDoc, doc, arrayUnion } from 'firebase/firestore';

export default function ClinicalRemarksForm({ patientId, visitId, onSuccess }) {
  const [formData, setFormData] = useState({
    anatomicalSite: '',
    dosage: '',
    narrative: '',
  });
  const [loading, setLoading] = useState(false);

  const anatomicalSites = [
    'Forehead',
    'Glabella',
    'Crow\'s Feet',
    'Cheeks',
    'Nasolabial Folds',
    'Lips',
    'Jawline',
    'Neck',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId || !visitId) {
      alert('Missing patient or visit ID.');
      return;
    }

    setLoading(true);
    try {
      const remarksRef = collection(db, 'patients', patientId, 'visits', visitId, 'remarks');
      const docRef = await addDoc(remarksRef, {
        ...formData,
        dosage: parseFloat(formData.dosage), // Ensure numeric
        createdAt: serverTimestamp(),
      });
      console.log("Remark added with ID: ", docRef.id);
      
      // Update visit document to add to treatmentsPerformed array
      const visitRef = doc(db, 'patients', patientId, 'visits', visitId);
      await updateDoc(visitRef, {
        treatmentsPerformed: arrayUnion(formData.anatomicalSite)
      });

      alert('Clinical remark added!');
      setFormData({ anatomicalSite: '', dosage: '', narrative: '' });
      if (onSuccess) onSuccess(formData.anatomicalSite);
    } catch (error) {
      console.error("Error adding remark: ", error);
      alert('Error adding remark.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#ffffff] p-8 border border-[#dadada] rounded-none font-sans text-[#1a1c1c]">
      <h2 className="text-2xl font-serif font-light text-[#1a1c1c] mb-6">Add Clinical Remark</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-xs uppercase tracking-widest text-[#605f54] mb-2 block">Anatomical Site *</label>
          <select
            name="anatomicalSite"
            value={formData.anatomicalSite}
            onChange={handleInputChange}
            required
            className="border border-[#c9c6bd] rounded-none p-3 w-full bg-white text-sm focus:outline-none focus:border-[#1a1c1c]"
          >
            <option value="">Select Site...</option>
            {anatomicalSites.map((site) => (
              <option key={site} value={site}>{site}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-[#605f54] mb-2 block">Volumetric Dosage (ml / Units) *</label>
          <input
            type="number"
            name="dosage"
            value={formData.dosage}
            onChange={handleInputChange}
            step="0.1"
            required
            className="border border-[#c9c6bd] rounded-none p-3 w-full bg-white text-sm focus:outline-none focus:border-[#1a1c1c]"
            placeholder="e.g., 1.0"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-[#605f54] mb-2 block">Clinical Narrative</label>
          <textarea
            name="narrative"
            value={formData.narrative}
            onChange={handleInputChange}
            rows="4"
            className="border border-[#c9c6bd] rounded-none p-3 w-full bg-white text-sm focus:outline-none focus:border-[#1a1c1c] leading-relaxed"
            placeholder="Enter clinical notes here..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1a1c1c] text-white p-4 rounded-none text-sm font-medium uppercase tracking-widest hover:bg-[#2f3131] transition disabled:bg-[#eeeeee] disabled:text-[#c9c6bd] disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Remark'}
        </button>
      </form>
    </div>
  );
}
