'use client';

import { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
      alert('Clinical remark added!');
      setFormData({ anatomicalSite: '', dosage: '', narrative: '' });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error adding remark: ", error);
      alert('Error adding remark.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Clinical Remark</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Anatomical Site *</label>
          <select
            name="anatomicalSite"
            value={formData.anatomicalSite}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="">Select Site...</option>
            {anatomicalSites.map((site) => (
              <option key={site} value={site}>{site}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Volumetric Dosage (ml / Units) *</label>
          <input
            type="number"
            name="dosage"
            value={formData.dosage}
            onChange={handleInputChange}
            step="0.1"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="e.g., 1.0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Clinical Narrative</label>
          <textarea
            name="narrative"
            value={formData.narrative}
            onChange={handleInputChange}
            rows="3"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Enter clinical notes here..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-md font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? 'Saving...' : 'Save Remark'}
        </button>
      </form>
    </div>
  );
}
