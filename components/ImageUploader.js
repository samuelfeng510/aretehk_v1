'use client';

import { useState } from 'react';
import { storage, db } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ImageUploader({ patientId, visitId, onSuccess }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Please select at least one image.');
      return;
    }

    setLoading(true);
    try {
      const urls = [];
      for (const file of files) {
        const storageRef = ref(storage, `media/${patientId}/${visitId}/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        urls.push(url);
      }

      // Save to Firestore in media subcollection
      const mediaRef = collection(db, 'patients', patientId, 'visits', visitId, 'media');
      await addDoc(mediaRef, {
        imageUrls: urls,
        createdAt: serverTimestamp(),
      });

      alert('Images uploaded successfully!');
      setFiles([]);
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

      <div>
        <label className="text-xs uppercase tracking-widest text-[#605f54] mb-2 block">Select Photos (Multiple)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-[#79776f] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-[#dadada] file:text-xs file:uppercase file:tracking-widest file:bg-[#eeeeee] file:text-[#1a1c1c] hover:file:bg-[#e2e2e2] file:transition"
        />
        {files.length > 0 && (
          <div className="mt-2 space-y-1">
            <p className="text-sm font-medium text-[#1a1c1c]">Selected Files ({files.length}):</p>
            <ul className="text-xs text-[#79776f] list-disc list-inside">
              {files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
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
