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
    <div className="bg-white p-6 rounded-md border border-[#dadada] space-y-4">
      <h2 className="text-xl font-serif font-light text-[#1a1c1c]">Upload Progress Photos</h2>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-widest text-[#605f54] mb-2 block">Before Treatment</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'before')}
            className="mt-1 block w-full text-sm text-[#79776f] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-[#dadada] file:text-xs file:uppercase file:tracking-widest file:bg-[#eeeeee] file:text-[#1a1c1c] hover:file:bg-[#e2e2e2] file:transition"
          />
          {beforeFile && <p className="mt-1 text-sm text-green-600">Selected: {beforeFile.name}</p>}
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-[#605f54] mb-2 block">After Treatment</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'after')}
            className="mt-1 block w-full text-sm text-[#79776f] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-[#dadada] file:text-xs file:uppercase file:tracking-widest file:bg-[#eeeeee] file:text-[#1a1c1c] hover:file:bg-[#e2e2e2] file:transition"
          />
          {afterFile && <p className="mt-1 text-sm text-green-600">Selected: {afterFile.name}</p>}
        </div>

      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full bg-[#1a1c1c] text-white p-3 rounded-md text-sm uppercase tracking-widest hover:bg-[#2f3131] transition disabled:bg-[#eeeeee] disabled:text-[#c9c6bd] disabled:cursor-not-allowed"
      >
        {loading ? 'Uploading...' : 'Upload Images'}
      </button>

    </div>
  );
}
