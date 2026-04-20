'use client';

import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { deductCredits, addCredits } from '../lib/ledger';
import ClinicalRemarksForm from './ClinicalRemarksForm';
import ImageUploader from './ImageUploader';
import BeforeAfterSlider from './BeforeAfterSlider';



export default function PatientDashboard({ patientId }) {
  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deductAmount, setDeductAmount] = useState('');
  const [selectedVisitId, setSelectedVisitId] = useState(null);
  const [remarks, setRemarks] = useState([]);
  const [media, setMedia] = useState(null);



  useEffect(() => {
    async function fetchData() {
      if (!patientId) return;
      
      setLoading(true);
      try {
        // 1. Fetch Patient Data
        const patientRef = doc(db, 'patients', patientId);
        const patientSnap = await getDoc(patientRef);
        
        if (patientSnap.exists()) {
          setPatient(patientSnap.data());
        } else {
          console.log("No such patient!");
        }

        // 2. Fetch Visits
        const visitsRef = collection(db, 'patients', patientId, 'visits');
        const q = query(visitsRef, orderBy('visitDate', 'desc'));
        const querySnapshot = await getDocs(q);
        const visitsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setVisits(visitsData);

      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [patientId]);

  useEffect(() => {
    async function fetchRemarks() {
      if (!patientId || !selectedVisitId) {
        setRemarks([]);
        return;
      }
      try {
        const remarksRef = collection(db, 'patients', patientId, 'visits', selectedVisitId, 'remarks');
        const q = query(remarksRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const remarksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRemarks(remarksData);
      } catch (error) {
        console.error("Error fetching remarks: ", error);
      }
    }
    fetchRemarks();
  }, [patientId, selectedVisitId]);

  useEffect(() => {
    async function fetchMedia() {
      if (!patientId || !selectedVisitId) {
        setMedia(null);
        return;
      }
      try {
        const mediaRef = collection(db, 'patients', patientId, 'visits', selectedVisitId, 'media');
        const q = query(mediaRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setMedia(querySnapshot.docs[0].data());
        } else {
          setMedia(null);
        }
      } catch (error) {
        console.error("Error fetching media: ", error);
      }
    }
    fetchMedia();
  }, [patientId, selectedVisitId]);



  const handleNewVisit = async () => {
    try {
      const visitsRef = collection(db, 'patients', patientId, 'visits');
      const docRef = await addDoc(visitsRef, {
        visitDate: serverTimestamp(),
        treatmentsPerformed: [], // Initially empty
      });
      console.log("New visit created with ID: ", docRef.id);
      // Refresh visits
      setVisits([{ id: docRef.id, visitDate: new Date(), treatmentsPerformed: [] }, ...visits]);
      alert('New visit initiated!');
    } catch (error) {
      console.error("Error creating visit: ", error);
      alert('Error initiating visit.');
    }
  };

  const handleDeduct = async () => {
    const amount = parseFloat(deductAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    try {
      // For testing, we use a dummy visit ID or none if the function allows it.
      // The function requires a visitId. Let's use the first visit or a dummy one.
      const dummyVisitId = visits[0]?.id || 'dummy_visit_id';
      await deductCredits(patientId, amount, dummyVisitId);
      alert('Credits deducted successfully!');
      // Refresh patient data to see new balance
      const patientRef = doc(db, 'patients', patientId);
      const patientSnap = await getDoc(patientRef);
      setPatient(patientSnap.data());
      setDeductAmount('');
    } catch (error) {
      alert(`Deduction failed: ${error.message}`);
    }
  };

  const handleAddCredits = async () => {
    try {
      await addCredits(patientId, 1000); // Add 1000 credits for testing
      alert('1000 credits added!');
      // Refresh patient data
      const patientRef = doc(db, 'patients', patientId);
      const patientSnap = await getDoc(patientRef);
      setPatient(patientSnap.data());
    } catch (error) {
      alert(`Failed to add credits: ${error.message}`);
    }
  };

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (!patient) return <div className="p-6">Patient not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{patient.name}'s Dashboard</h1>
        <div className="text-lg font-semibold text-blue-600">
          Balance: {patient.currentCreditBalance || 0} Credits
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleNewVisit}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          New Visit
        </button>
        <button
          onClick={handleAddCredits}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add 1000 Credits (Test)
        </button>
      </div>

      {/* Deduct Credits Form */}
      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Deduct Credits</h2>
        <div className="flex gap-4 items-center">
          <input
            type="number"
            value={deductAmount}
            onChange={(e) => setDeductAmount(e.target.value)}
            placeholder="Amount"
            className="border border-gray-300 rounded-md p-2 w-32"
          />
          <button
            onClick={handleDeduct}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Deduct
          </button>
        </div>
      </div>

      {/* Visit History */}
      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Visit History</h2>
        {visits.length === 0 ? (
          <p className="text-gray-600">No visits recorded yet.</p>
        ) : (
          <ul className="space-y-4">
            {visits.map((visit) => (
              <li key={visit.id} className="border border-gray-200 rounded-md p-4 bg-gray-50">
                <div className="flex justify-between">
                  <span className="font-medium">
                    {visit.visitDate?.toDate ? visit.visitDate.toDate().toLocaleString() : new Date(visit.visitDate).toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">ID: {visit.id}</span>
                  <button
                    onClick={() => setSelectedVisitId(visit.id)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {selectedVisitId === visit.id ? 'Selected' : 'Add Remark'}
                  </button>
                </div>

                <div className="mt-2">
                  <span className="text-sm font-medium text-gray-700">Treatments: </span>
                  {visit.treatmentsPerformed?.length > 0 ? (
                    <span>{visit.treatmentsPerformed.join(', ')}</span>
                  ) : (
                    <span className="text-gray-500">None logged</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Clinical Remarks Section */}
      {selectedVisitId && (
        <div className="border-t pt-4 space-y-4">
          <ClinicalRemarksForm 
            patientId={patientId} 
            visitId={selectedVisitId} 
            onSuccess={() => {
              // Trigger refetch of remarks
              setSelectedVisitId(null);
              setTimeout(() => setSelectedVisitId(selectedVisitId), 100);
            }}
          />
          
          {/* Visual Documentation */}
          <div className="border-t pt-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Visual Documentation</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ImageUploader 
                patientId={patientId} 
                visitId={selectedVisitId} 
                onSuccess={() => {
                  // Trigger refetch of media
                  setSelectedVisitId(null);
                  setTimeout(() => setSelectedVisitId(selectedVisitId), 100);
                }}
              />
              
              {media && (media.beforeUrl || media.afterUrl) ? (
                <BeforeAfterSlider beforeUrl={media.beforeUrl} afterUrl={media.afterUrl} />
              ) : (
                <div className="text-gray-500 text-center p-6 bg-gray-50 rounded-lg">
                  Upload images to see comparison.
                </div>
              )}
            </div>
          </div>

          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Remarks for Visit {selectedVisitId}</h3>
            {remarks.length === 0 ? (
              <p className="text-gray-600">No remarks logged for this visit.</p>
            ) : (
              <ul className="space-y-2">
                {remarks.map((remark) => (
                  <li key={remark.id} className="border-b pb-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{remark.anatomicalSite} - {remark.dosage} ml</span>
                      <span className="text-sm text-gray-500">
                        {remark.createdAt?.toDate ? remark.createdAt.toDate().toLocaleString() : ''}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mt-1">{remark.narrative}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
