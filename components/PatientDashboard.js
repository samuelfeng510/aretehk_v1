'use client';

import { useState, useEffect, useRef } from 'react';
import { db, storage } from '../lib/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

import { doc, getDoc, collection, query, orderBy, getDocs, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

import { deductCredits, addCredits } from '../lib/ledger';
import ClinicalRemarksForm from './ClinicalRemarksForm';
import ImageUploader from './ImageUploader';
import BeforeAfterSlider from './BeforeAfterSlider';



export default function PatientDashboard({ patientId }) {
  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);
  const deductCanvasRef = useRef(null);
  const [isDrawingDeduct, setIsDrawingDeduct] = useState(false);
  const [signatureConfirmed, setSignatureConfirmed] = useState(false);
  const [overrideCheckoutLock, setOverrideCheckoutLock] = useState(false);



  const [loading, setLoading] = useState(true);
  const [deductAmount, setDeductAmount] = useState('');
  const [selectedVisitId, setSelectedVisitId] = useState(null);
  const [remarks, setRemarks] = useState([]);
  const [media, setMedia] = useState(null);
  const [compareVisitAId, setCompareVisitAId] = useState(null);
  const [compareVisitBId, setCompareVisitBId] = useState(null);
  const [mediaA, setMediaA] = useState(null);
  const [mediaB, setMediaB] = useState(null);

  // Reset state when patient changes to prevent cross-patient data leakage
  useEffect(() => {
    setSelectedVisitId(null);
    setCompareVisitAId(null);
    setCompareVisitBId(null);
    setMediaA(null);
    setMediaB(null);
    setMedia(null);
    setRemarks([]);
  }, [patientId]);





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

  useEffect(() => {
    async function fetchMediaA() {
      if (!patientId || !compareVisitAId) {
        setMediaA(null);
        return;
      }
      try {
        const mediaRef = collection(db, 'patients', patientId, 'visits', compareVisitAId, 'media');
        const q = query(mediaRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setMediaA(querySnapshot.docs[0].data());
        } else {
          setMediaA(null);
        }
      } catch (error) {
        console.error("Error fetching media A: ", error);
      }
    }
    fetchMediaA();
  }, [patientId, compareVisitAId]);

  useEffect(() => {
    async function fetchMediaB() {
      if (!patientId || !compareVisitBId) {
        setMediaB(null);
        return;
      }
      try {
        const mediaRef = collection(db, 'patients', patientId, 'visits', compareVisitBId, 'media');
        const q = query(mediaRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setMediaB(querySnapshot.docs[0].data());
        } else {
          setMediaB(null);
        }
      } catch (error) {
        console.error("Error fetching media B: ", error);
      }
    }
    fetchMediaB();
  }, [patientId, compareVisitBId]);




  const startDrawingDeduct = (e) => {
    const canvas = deductCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawingDeduct(true);
  };

  const drawDeduct = (e) => {
    if (!isDrawingDeduct) return;
    const canvas = deductCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawingDeduct = () => {
    setIsDrawingDeduct(false);
  };

  const clearSignatureDeduct = () => {
    const canvas = deductCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureConfirmed(false);
  };


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

    const canvas = deductCanvasRef.current;
    const signatureDataUrl = canvas.toDataURL('image/png');

    try {
      // 1. Upload signature to Storage
      const signatureRef = ref(storage, `signatures/deductions/${Date.now()}_${patientId}.png`);
      await uploadString(signatureRef, signatureDataUrl, 'data_url');
      const downloadURL = await getDownloadURL(signatureRef);

      // 2. Deduct credits with signature URL
      const visitIdToUse = selectedVisitId || visits[0]?.id || 'dummy_visit_id';
      await deductCredits(patientId, amount, visitIdToUse, downloadURL);

      // Update visit document to mark as checked out
      const visitRef = doc(db, 'patients', patientId, 'visits', visitIdToUse);
      await updateDoc(visitRef, {
        isCheckedOut: true,
        checkoutSignatureUrl: downloadURL
      });

      // Update local state
      setVisits(prevVisits => prevVisits.map(v => v.id === visitIdToUse ? { ...v, isCheckedOut: true, checkoutSignatureUrl: downloadURL } : v));
      
      alert('Credits deducted successfully!');
      // Refresh patient data to see new balance
      const patientRef = doc(db, 'patients', patientId);
      const patientSnap = await getDoc(patientRef);
      setPatient(patientSnap.data());
      setDeductAmount('');
      clearSignatureDeduct();
      setOverrideCheckoutLock(false);
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





      {/* Visit History */}
      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Visit History</h2>
        {visits.length === 0 ? (
          <p className="text-gray-600">No visits recorded yet.</p>
        ) : (
          <ul className="space-y-4">
            {visits.map((visit, index) => (
              <li key={visit.id} className="border border-gray-200 rounded-md p-4 bg-gray-50">
                <div className="flex justify-between">
                  <span className="font-medium">
                    Visit #{visits.length - index} — {visit.visitDate?.toDate ? visit.visitDate.toDate().toLocaleString() : new Date(visit.visitDate).toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">ID: {visit.id.substring(0, 6)}...</span>

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
            <div>
              <ImageUploader 
                patientId={patientId} 
                visitId={selectedVisitId} 
                onSuccess={() => {
                  // Trigger refetch of media
                  setSelectedVisitId(null);
                  setTimeout(() => setSelectedVisitId(selectedVisitId), 100);
                }}
              />
            </div>
          </div>

          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Remarks for Visit #{visits.length - visits.findIndex(v => v.id === selectedVisitId)}</h3>
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

          {/* Visit Summary & Checkout */}
          <div className="border-t pt-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Visit Summary & Checkout</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Treatments Performed</h4>
                {remarks.length === 0 ? (
                  <p className="text-gray-600 text-sm">No treatments logged.</p>
                ) : (
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {remarks.map((remark) => (
                      <li key={remark.id}>{remark.anatomicalSite} - {remark.dosage} ml</li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Visual Proof</h4>
                <div className="flex gap-4 mt-1">
                  {media?.beforeUrl && (
                    <div>
                      <p className="text-xs text-gray-500">Before</p>
                      <img src={media.beforeUrl} alt="Before" className="w-32 h-24 object-cover rounded-md border" />
                    </div>
                  )}
                  {media?.afterUrl && (
                    <div>
                      <p className="text-xs text-gray-500">After</p>
                      <img src={media.afterUrl} alt="After" className="w-32 h-24 object-cover rounded-md border" />
                    </div>
                  )}
                  {!media?.beforeUrl && !media?.afterUrl && (
                    <p className="text-gray-600 text-sm">No photos uploaded.</p>
                  )}
                </div>
              </div>

              {/* Deduct Credits Form */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Authorize Deduction</h4>
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <input
                      type="number"
                      value={deductAmount}
                      onChange={(e) => setDeductAmount(e.target.value)}
                      placeholder="Amount"
                      className="border border-gray-300 rounded-md p-2 w-32 bg-white"
                    />
                    <button
                      onClick={handleDeduct}
                      disabled={!signatureConfirmed || (visits.find(v => v.id === selectedVisitId)?.isCheckedOut && !overrideCheckoutLock)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Confirm & Deduct
                    </button>
                  </div>
                  
                  {!(visits.find(v => v.id === selectedVisitId)?.isCheckedOut) || overrideCheckoutLock ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Patient Signature *</label>
                      <div className="border border-gray-300 rounded-md p-2 bg-white w-fit">
                        <canvas
                          ref={deductCanvasRef}
                          width={400}
                          height={150}
                          onMouseDown={startDrawingDeduct}
                          onMouseMove={drawDeduct}
                          onMouseUp={stopDrawingDeduct}
                          onMouseLeave={stopDrawingDeduct}
                          className="border border-gray-200 bg-white cursor-crosshair"
                        />
                        <div className="flex justify-between mt-1">
                          <button
                            type="button"
                            onClick={clearSignatureDeduct}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Clear Signature
                          </button>
                          <button
                            type="button"
                            onClick={() => setSignatureConfirmed(true)}
                            className={`text-sm font-medium ${signatureConfirmed ? 'text-green-600' : 'text-blue-600 hover:text-blue-800'}`}
                          >
                            {signatureConfirmed ? '✓ Confirmed' : 'Confirm Signature'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-green-200 bg-green-50 p-4 rounded-md flex justify-between items-center w-full max-w-md">
                      <div>
                        <p className="text-green-700 font-medium">✓ Visit Signed & Confirmed</p>
                        {visits.find(v => v.id === selectedVisitId)?.checkoutSignatureUrl && (
                          <img 
                            src={visits.find(v => v.id === selectedVisitId)?.checkoutSignatureUrl} 
                            alt="Signature" 
                            className="w-32 h-16 object-contain mt-2 border bg-white rounded" 
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to unlock this visit for re-signing? This will require a new deduction authorization.")) {
                            setOverrideCheckoutLock(true);
                            setSignatureConfirmed(false);
                          }
                        }}
                        className="text-sm text-gray-600 hover:text-gray-800 underline"
                      >
                        Unlock to Re-sign
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Cross-Visit Comparison Section */}
      <div className="border-t pt-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Cross-Visit Comparison</h2>
        <p className="text-sm text-gray-600">Select any two visits to compare photos.</p>
        
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Visit A (Left Image)</label>
            <select
              value={compareVisitAId || ''}
              onChange={(e) => setCompareVisitAId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
            >
              <option value="">Select Visit...</option>
              {visits.map((visit) => (
                <option key={visit.id} value={visit.id}>
                  {visit.visitDate?.toDate ? visit.visitDate.toDate().toLocaleDateString() : new Date(visit.visitDate).toLocaleDateString()} (ID: {visit.id.substring(0, 5)})
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Visit B (Right Image)</label>
            <select
              value={compareVisitBId || ''}
              onChange={(e) => setCompareVisitBId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
            >
              <option value="">Select Visit...</option>
              {visits.map((visit) => (
                <option key={visit.id} value={visit.id}>
                  {visit.visitDate?.toDate ? visit.visitDate.toDate().toLocaleDateString() : new Date(visit.visitDate).toLocaleDateString()} (ID: {visit.id.substring(0, 5)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {mediaA || mediaB ? (
          <BeforeAfterSlider 
            beforeUrl={mediaA?.beforeUrl || mediaA?.afterUrl || ''} 
            afterUrl={mediaB?.afterUrl || mediaB?.beforeUrl || ''} 
          />
        ) : (
          <div className="text-gray-500 text-center p-6 bg-gray-50 rounded-lg">
            Select visits with images to compare.
          </div>
        )}
      </div>
    </div>
  );
}
