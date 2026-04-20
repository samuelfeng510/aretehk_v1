'use client';

import { useState } from 'react';
import { storage, db } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ImageUploader({ patientId, visitId, onSuccess }) {
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'before') setBeforeFile(file);
      if (type === 'after') setAfterFile(file);
    }
  };

  const handleUpload = async () => {
    if (!beforeFile && !afterFile) {
      alert('Please select at least one image.');
      return;
    }

    setLoading(true);
    try {
      let beforeUrl = '';
      let afterUrl = '';

      // Upload Before Image
      if (beforeFile) {
        const beforeRef = ref(storage, `media/${patientId}/${visitId}/before_${Date.now()}_${beforeFile.name}`);
        await uploadBytes(beforeRef, beforeFile);
        beforeUrl = await getDownloadURL(beforeRef);
      }

      // Upload After Image
      if (afterFile) {
        const afterRef = ref(storage, `media/${patientId}/${visitId}/after_${Date.now()}_${afterFile.name}`);
        await uploadBytes(afterRef, afterFile);
        afterUrl = await getDownloadURL(afterRef);
      }

      // Save to Firestore in media subcollection
      const mediaRef = collection(db, 'patients', patientId, 'visits', visitId, 'media');
      await addDoc(mediaRef, {
        beforeUrl,
        afterUrl,
        createdAt: serverTimestamp(),
      });

      alert('Images uploaded successfully!');
      setBeforeFile(null);
      setAfterFile(null);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error uploading images: ", error);
      alert('Error uploading images.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Upload Progress Photos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Before Treatment</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'before')}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {beforeFile && <p className="mt-1 text-sm text-green-600">Selected: {beforeFile.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">After Treatment</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'after')}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {afterFile && <p className="mt-1 text-sm text-green-600">Selected: {afterFile.name}</p>}
        </div>
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded-md font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        {loading ? 'Uploading...' : 'Upload Images'}
      </button>
    </div>
  );
}
