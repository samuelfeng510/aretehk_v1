'use client';

import { useState, useEffect, useRef } from 'react';
import { db, storage } from '../lib/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

import { doc, getDoc, collection, query, orderBy, getDocs, addDoc, serverTimestamp, updateDoc, deleteDoc } from 'firebase/firestore';

import Link from 'next/link';

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
  const [addAmount, setAddAmount] = useState('');
  const [isAddCreditUnlocked, setIsAddCreditUnlocked] = useState(false);

  const [selectedVisitId, setSelectedVisitId] = useState(null);
  const [remarks, setRemarks] = useState([]);
  const [media, setMedia] = useState(null);
  const [compareVisitAId, setCompareVisitAId] = useState(null);
  const [compareVisitBId, setCompareVisitBId] = useState(null);
  const [mediaA, setMediaA] = useState(null);
  const [mediaB, setMediaB] = useState(null);
  const [selectedImageA, setSelectedImageA] = useState('');
  const [selectedImageB, setSelectedImageB] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editablePatient, setEditablePatient] = useState({});


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
          const data = patientSnap.data();
          setPatient(data);
          setEditablePatient(data);
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
        setSelectedImageA('');
        return;
      }
      try {
        const mediaRef = collection(db, 'patients', patientId, 'visits', compareVisitAId, 'media');
        const q = query(mediaRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setMediaA(data);
          if (data.imageUrls && data.imageUrls.length > 0) {
            setSelectedImageA(data.imageUrls[0]);
          } else if (data.beforeUrl) {
            setSelectedImageA(data.beforeUrl);
          } else if (data.afterUrl) {
            setSelectedImageA(data.afterUrl);
          }
        } else {
          setMediaA(null);
          setSelectedImageA('');
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
        setSelectedImageB('');
        return;
      }
      try {
        const mediaRef = collection(db, 'patients', patientId, 'visits', compareVisitBId, 'media');
        const q = query(mediaRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setMediaB(data);
          if (data.imageUrls && data.imageUrls.length > 0) {
            setSelectedImageB(data.imageUrls[0]);
          } else if (data.afterUrl) {
            setSelectedImageB(data.afterUrl);
          } else if (data.beforeUrl) {
            setSelectedImageB(data.beforeUrl);
          }
        } else {
          setMediaB(null);
          setSelectedImageB('');
        }
      } catch (error) {
        console.error("Error fetching media B: ", error);
      }
    }
    fetchMediaB();
  }, [patientId, compareVisitBId]);




  const getCoordinatesDeduct = (e) => {
    const canvas = deductCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    
    return {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY
    };
  };

  const startDrawingDeduct = (e) => {
    const canvas = deductCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinatesDeduct(e);
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawingDeduct(true);
  };

  const drawDeduct = (e) => {
    if (!isDrawingDeduct) return;
    const canvas = deductCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinatesDeduct(e);
    
    ctx.lineTo(x, y);
    ctx.stroke();
    
    if (e.cancelable) {
      e.preventDefault();
    }
  };

  const stopDrawingDeduct = () => {
    setIsDrawingDeduct(false);
  };


  const clearSignatureDeduct = () => {
    const canvas = deductCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureConfirmed(false);
  };

  const handleSaveProfile = async () => {
    try {
      const patientRef = doc(db, 'patients', patientId);
      await updateDoc(patientRef, editablePatient);
      setPatient(editablePatient);
      setIsEditingProfile(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error("Error updating profile: ", error);
      alert('Error updating profile.');
    }
  };

  const handleDeletePatient = async () => {
    const confirmName = prompt(`To delete this patient, please type the patient's name "${patient.name}":`);
    if (confirmName === patient.name) {
      try {
        const patientRef = doc(db, 'patients', patientId);
        await deleteDoc(patientRef);
        alert('Patient profile deleted successfully.');
        window.location.href = '/'; // Redirect to directory
      } catch (error) {
        console.error("Error deleting patient: ", error);
        alert('Error deleting patient.');
      }
    } else if (confirmName !== null) {
      alert('Name mismatch. Deletion cancelled.');
    }
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
    const amount = parseFloat(addAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount of credits to add.');
      return;
    }
    try {
      await addCredits(patientId, amount);
      alert(`${amount} credits added!`);
      setAddAmount('');
      setIsAddCreditUnlocked(false); // Re-lock after success
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
    <div className="max-w-5xl mx-auto p-10 bg-[#f9f9f9] space-y-12 font-sans text-[#1a1c1c]">
      <div className="flex justify-between items-center border-b border-[#dadada] pb-6">

        <div>
          <Link href="/" className="text-xs uppercase tracking-widest text-[#3d2813] hover:text-[#5c4028] font-medium transition mb-2 block">

            ← Back to Patient List
          </Link>
          <h1 className="text-2xl sm:text-4xl font-serif font-light text-[#1a1c1c]">{patient.name}'s Dashboard</h1>

        </div>
        <div className="text-sm uppercase tracking-widest text-[#605f54]">
          Balance: <span className="text-lg font-serif text-[#1a1c1c]">{patient.currentCreditBalance || 0}</span>

        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-6 items-center">
        <button
          onClick={handleNewVisit}
          className="bg-[#1a1c1c] text-white px-6 py-3 rounded-md hover:bg-[#2f3131] transition text-sm uppercase tracking-widest"

        >
          New Visit
        </button>
        
        <div className="flex gap-2 items-center">
          {!isAddCreditUnlocked ? (
            <button
              onClick={() => setIsAddCreditUnlocked(true)}
              className="bg-[#eeeeee] text-[#1a1c1c] px-4 py-3 rounded-md hover:bg-[#e2e2e2] transition text-sm uppercase tracking-widest flex items-center gap-2"

            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Unlock Add Credit

            </button>
          ) : (
            <>
              <input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="Amount"
                className="border border-[#c9c6bd] rounded-md p-3 w-32 bg-white text-sm focus:outline-none focus:border-[#1a1c1c]"

              />
              <button
                onClick={handleAddCredits}
                className="bg-[#1a1c1c] text-white px-6 py-3 rounded-md hover:bg-[#2f3131] transition text-sm uppercase tracking-widest"

              >
                Add Credits
              </button>
              <button
                onClick={() => setIsAddCreditUnlocked(false)}
                className="text-xs uppercase tracking-widest text-[#3d2813] hover:text-[#5c4028] font-medium underline ml-2"

              >
                Lock
              </button>
            </>
          )}
        </div>
      </div>





      {/* Patient Profile */}
      <div className="border-t border-[#dadada] pt-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl sm:text-3xl font-serif font-light text-[#1a1c1c]">Patient Profile</h2>

          {!isEditingProfile ? (
            <div className="flex gap-4">
              <button
                onClick={() => setIsEditingProfile(true)}
                className="text-xs uppercase tracking-widest text-[#3d2813] hover:text-[#5c4028] font-medium underline transition"
              >
                Edit Profile
              </button>
              <button
                onClick={handleDeletePatient}
                className="text-xs uppercase tracking-widest text-red-600 hover:text-red-800 font-medium underline transition"
              >
                Delete Profile
              </button>
            </div>

          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleSaveProfile}
                className="text-xs uppercase tracking-widest text-green-600 hover:text-green-800 underline transition"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditingProfile(false);
                  setEditablePatient(patient); // Reset changes
                }}
                className="text-xs uppercase tracking-widest text-red-600 hover:text-red-800 underline transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-[#ffffff] p-6 border border-[#dadada] rounded-md">

          <div>
            <h3 className="text-xs uppercase tracking-[0.08em] font-light text-[#605f54] mb-2">Client Information</h3>

            {!isEditingProfile ? (
              <>
                <p className="text-sm font-sans"><strong>Name:</strong> {patient.name}</p>
                <p className="text-sm font-sans"><strong>DOB:</strong> {patient.dob}</p>
                <p className="text-sm font-sans"><strong>Gender:</strong> {patient.gender}</p>
                <p className="text-sm font-sans"><strong>Phone:</strong> {patient.phone}</p>
                <p className="text-sm font-sans"><strong>HKID:</strong> {patient.hkid}</p>
              </>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editablePatient.name || ''}
                  onChange={(e) => setEditablePatient({...editablePatient, name: e.target.value})}
                  className="border border-[#c9c6bd] rounded-md p-2 w-full text-sm"
                  placeholder="Name"
                />
                <input
                  type="date"
                  value={editablePatient.dob || ''}
                  onChange={(e) => setEditablePatient({...editablePatient, dob: e.target.value})}
                  className="border border-[#c9c6bd] rounded-md p-2 w-full text-sm"
                />
                <select
                  value={editablePatient.gender || ''}
                  onChange={(e) => setEditablePatient({...editablePatient, gender: e.target.value})}
                  className="border border-[#c9c6bd] rounded-md p-2 w-full text-sm"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="tel"
                  value={editablePatient.phone || ''}
                  onChange={(e) => setEditablePatient({...editablePatient, phone: e.target.value})}
                  className="border border-[#c9c6bd] rounded-md p-2 w-full text-sm"
                  placeholder="Phone"
                />
                <input
                  type="text"
                  value={editablePatient.hkid || ''}
                  onChange={(e) => setEditablePatient({...editablePatient, hkid: e.target.value})}
                  className="border border-[#c9c6bd] rounded-md p-2 w-full text-sm"
                  placeholder="HKID"
                />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-[0.08em] font-light text-[#605f54] mb-2">Health Condition</h3>

            {!isEditingProfile ? (
              <>
                <p className="text-sm font-sans"><strong>Taking Medication:</strong> {patient.takingMedication ? 'Yes' : 'No'}</p>
                {patient.takingMedication && <p className="text-sm font-sans ml-4 text-[#79776f]">{patient.medicationDetails}</p>}
                <p className="text-sm font-sans"><strong>Pregnant/Breastfeeding:</strong> {patient.pregnantOrBreastfeeding ? 'Yes' : 'No'}</p>
                <p className="text-sm font-sans"><strong>Allergies:</strong> {patient.allergies ? 'Yes' : 'No'}</p>
                {patient.allergies && <p className="text-sm font-sans ml-4 text-[#79776f]">{patient.allergyDetails}</p>}
                {patient.otherConditions && <p className="text-sm font-sans"><strong>Other:</strong> {patient.otherConditions}</p>}
              </>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editablePatient.takingMedication || false}
                    onChange={(e) => setEditablePatient({...editablePatient, takingMedication: e.target.checked})}
                  />
                  <label className="text-sm">Taking Medication</label>
                </div>
                {editablePatient.takingMedication && (
                  <textarea
                    value={editablePatient.medicationDetails || ''}
                    onChange={(e) => setEditablePatient({...editablePatient, medicationDetails: e.target.value})}
                    className="border border-[#c9c6bd] rounded-md p-2 w-full text-sm"
                    placeholder="Medication Details"
                  />
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editablePatient.pregnantOrBreastfeeding || false}
                    onChange={(e) => setEditablePatient({...editablePatient, pregnantOrBreastfeeding: e.target.checked})}
                  />
                  <label className="text-sm">Pregnant/Breastfeeding</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editablePatient.allergies || false}
                    onChange={(e) => setEditablePatient({...editablePatient, allergies: e.target.checked})}
                  />
                  <label className="text-sm">Allergies</label>
                </div>
                {editablePatient.allergies && (
                  <textarea
                    value={editablePatient.allergyDetails || ''}
                    onChange={(e) => setEditablePatient({...editablePatient, allergyDetails: e.target.value})}
                    className="border border-[#c9c6bd] rounded-md p-2 w-full text-sm"
                    placeholder="Allergy Details"
                  />
                )}
                <textarea
                  value={editablePatient.otherConditions || ''}
                  onChange={(e) => setEditablePatient({...editablePatient, otherConditions: e.target.value})}
                  className="border border-[#c9c6bd] rounded-md p-2 w-full text-sm"
                  placeholder="Other Conditions"
                />
              </div>
            )}
          </div>
          <div className="col-span-1 lg:col-span-2 border-t border-[#eeeeee] pt-4">

            <h3 className="text-xs uppercase tracking-[0.08em] font-light text-[#605f54] mb-2">Treatment Interests</h3>

            {!isEditingProfile ? (
              <p className="text-sm font-sans">
                {patient.selectedTreatments && Array.isArray(patient.selectedTreatments)
                  ? patient.selectedTreatments.join(', ')
                  : (patient.selectedTreatment || 'None selected at registration')}
              </p>

            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {[
                  { id: 'Consultation', label: 'Initial Consultation' },
                  { id: 'Botox', label: 'Botox Treatment' },
                  { id: 'Filler', label: 'Dermal Filler' },
                  { id: 'Laser', label: 'Laser Rejuvenation' },
                  { id: 'Peel', label: 'Chemical Peel' },
                ].map((treatment) => (
                  <label key={treatment.id} className="flex items-center gap-2 text-sm text-[#48473f] cursor-pointer">
                    <input
                      type="checkbox"
                      name="selectedTreatments"
                      value={treatment.id}
                      checked={editablePatient.selectedTreatments?.includes(treatment.id) || editablePatient.selectedTreatment === treatment.id}
                      onChange={(e) => {
                        const { value, checked } = e.target;
                        const currentArray = editablePatient.selectedTreatments || [];
                        const newArray = checked 
                          ? [...currentArray, value] 
                          : currentArray.filter(v => v !== value);
                        setEditablePatient({...editablePatient, selectedTreatments: newArray, selectedTreatment: ''});
                      }}
                      className="w-4 h-4 border-[#c9c6bd] rounded text-[#1a1c1c] focus:ring-[#1a1c1c]"
                    />
                    <span>{treatment.label}</span>
                  </label>
                ))}
              </div>

            )}
          </div>
          <div className="col-span-1 lg:col-span-2 border-t border-[#eeeeee] pt-4">

            <h3 className="text-xs uppercase tracking-[0.08em] font-light text-[#605f54] mb-2">Purchased Products</h3>

            <p className="text-sm font-sans text-[#79776f]">No products purchased yet.</p>
          </div>
        </div>
      </div>


      {/* Visit History */}
      <div className="border-t border-[#dadada] pt-8">
        <h2 className="text-xl sm:text-3xl font-serif font-light text-[#1a1c1c] mb-6">Visit History</h2>

        {visits.length === 0 ? (
          <p className="text-[#79776f] font-sans">No visits recorded yet.</p>
        ) : (
          <ul className="divide-y divide-[#dadada]">
            {visits.map((visit, index) => (
              <li key={visit.id} className="py-6 flex flex-col space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-serif text-[#1a1c1c]">
                    Visit #{visits.length - index} — <span className="text-sm font-sans text-[#79776f]">{visit.visitDate?.toDate ? visit.visitDate.toDate().toLocaleString() : new Date(visit.visitDate).toLocaleString()}</span>
                  </span>
                  <div className="flex gap-4 items-baseline">
                    <span className="text-xs uppercase tracking-widest text-[#79776f]">ID: {visit.id.substring(0, 6)}</span>

                    <button
                      onClick={() => setSelectedVisitId(selectedVisitId === visit.id ? null : visit.id)}
                      className={`text-xs uppercase tracking-widest font-medium transition ${selectedVisitId === visit.id ? 'text-[#1a1c1c]' : 'text-[#605f54] hover:text-[#1a1c1c]'}`}
                    >
                      {selectedVisitId === visit.id ? 'Collapse' : 'Details'}
                    </button>

                  </div>
                </div>

                <div className="text-sm text-[#79776f]">
                  <span className="uppercase tracking-widest text-xs text-[#605f54] mr-2">Treatments</span>
                  {visit.treatmentsPerformed?.length > 0 ? (
                    <span className="font-sans">{visit.treatmentsPerformed.join(', ')}</span>
                  ) : (
                    <span className="font-sans text-[#c9c6bd]">None logged</span>
                  )}
                </div>

                {/* Inline Visit Details */}
                {selectedVisitId === visit.id && (
                  <div className="mt-4 bg-[#ffffff] p-6 border border-[#dadada] rounded-md space-y-8">
                    <h3 className="text-lg font-serif text-[#1a1c1c]">Visit Details</h3>
                    
                    <ClinicalRemarksForm 
                      patientId={patientId} 
                      visitId={selectedVisitId} 
                      onSuccess={(treatment) => {
                        setVisits(prevVisits => prevVisits.map(v => v.id === visit.id ? { ...v, treatmentsPerformed: [...(v.treatmentsPerformed || []), treatment] } : v));
                        setSelectedVisitId(null);
                        setTimeout(() => setSelectedVisitId(visit.id), 100);
                      }}
                    />
                    
                    {/* Visual Documentation */}
                    <div className="border-t border-[#dadada] pt-6 space-y-4">
                      <h4 className="text-xs uppercase tracking-[0.08em] font-light text-[#605f54]">Visual Documentation</h4>
                      <div>
                        <ImageUploader 
                          patientId={patientId} 
                          visitId={selectedVisitId} 
                          onSuccess={() => {
                            setSelectedVisitId(null);
                            setTimeout(() => setSelectedVisitId(selectedVisitId), 100);
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs uppercase tracking-[0.08em] font-light text-[#605f54] mb-4">Remarks for Visit #{visits.length - visits.findIndex(v => v.id === selectedVisitId)}</h4>
                      {remarks.length === 0 ? (
                        <p className="text-[#79776f] text-sm font-sans">No remarks logged for this visit.</p>
                      ) : (
                        <ul className="space-y-4 divide-y divide-[#eeeeee]">
                          {remarks.map((remark) => (
                            <li key={remark.id} className="pt-4 first:pt-0 flex flex-col space-y-1">
                              <div className="flex justify-between items-baseline">
                                <span className="font-medium text-[#1a1c1c]">{remark.anatomicalSite} — {remark.dosage} ml</span>
                                <span className="text-xs text-[#79776f]">
                                  {remark.createdAt?.toDate ? remark.createdAt.toDate().toLocaleString() : ''}
                                </span>
                              </div>
                              <p className="text-[#48473f] text-sm leading-relaxed">{remark.narrative}</p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Visit Summary & Checkout */}
                    <div className="border-t border-[#dadada] pt-6 space-y-4">
                      <h4 className="text-xs uppercase tracking-[0.08em] font-light text-[#605f54]">Visit Summary & Checkout</h4>
                      
                      <div className="bg-[#ffffff] p-6 border border-[#dadada] space-y-6">
                        <div>
                          <h4 className="text-xs uppercase tracking-[0.08em] font-light text-[#605f54] mb-2">Treatments Performed</h4>

                          {remarks.length === 0 ? (
                            <p className="text-[#79776f] text-sm">No treatments logged.</p>
                          ) : (
                            <ul className="list-disc list-inside text-sm text-[#48473f] space-y-1">
                              {remarks.map((remark) => (
                                <li key={remark.id}>{remark.anatomicalSite} — {remark.dosage} ml</li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div>
                          <h4 className="text-xs uppercase tracking-[0.08em] font-light text-[#605f54] mb-2">Visual Proof</h4>

                          <div className="flex flex-wrap gap-4 mt-2">
                            {media?.imageUrls && Array.isArray(media.imageUrls) && media.imageUrls.length > 0 ? (
                              media.imageUrls.map((url, idx) => (
                                <div key={idx} className="relative">
                                  <img src={url} alt={`Gallery ${idx + 1}`} className="w-40 h-30 object-cover border border-[#dadada] hover:opacity-90 transition cursor-pointer" />
                                  <span className="absolute bottom-1 right-1 bg-[#1a1c1c] text-white text-[10px] px-1 rounded-sm opacity-75">{idx + 1}</span>
                                </div>
                              ))
                            ) : (
                              <>
                                {media?.beforeUrl && (
                                  <div>
                                    <p className="text-xs uppercase tracking-[0.08em] font-light text-[#79776f] mb-1">Before</p>
                                    <img src={media.beforeUrl} alt="Before" className="w-40 h-30 object-cover border border-[#dadada]" />
                                  </div>
                                )}
                                {media?.afterUrl && (
                                  <div>
                                    <p className="text-xs uppercase tracking-[0.08em] font-light text-[#79776f] mb-1">After</p>
                                    <img src={media.afterUrl} alt="After" className="w-40 h-30 object-cover border border-[#dadada]" />
                                  </div>
                                )}
                                {!media?.beforeUrl && !media?.afterUrl && (
                                  <p className="text-[#79776f] text-sm">No photos uploaded.</p>
                                )}
                              </>
                            )}
                          </div>

                        </div>

                        {/* Deduct Credits Form */}
                        <div className="border-t border-[#dadada] pt-6">
                          <h4 className="text-xs uppercase tracking-[0.08em] font-light text-[#605f54] mb-4">Authorize Deduction</h4>

                          <div className="space-y-6">
                            <div className="flex gap-4 items-center">
                              <input
                                type="number"
                                value={deductAmount}
                                onChange={(e) => setDeductAmount(e.target.value)}
                                placeholder="Amount"
                                className="border border-[#c9c6bd] rounded-md p-3 w-32 bg-white text-sm focus:outline-none focus:border-[#1a1c1c]"

                              />
                              <button
                                onClick={handleDeduct}
                                disabled={!signatureConfirmed || (visits.find(v => v.id === selectedVisitId)?.isCheckedOut && !overrideCheckoutLock)}
                                className="bg-[#1a1c1c] text-white px-6 py-3 rounded-md hover:bg-[#2f3131] transition text-sm uppercase tracking-widest disabled:bg-[#eeeeee] disabled:text-[#c9c6bd] disabled:cursor-not-allowed"

                              >
                                Confirm & Deduct
                              </button>
                            </div>
                            
                            {!(visits.find(v => v.id === selectedVisitId)?.isCheckedOut) || overrideCheckoutLock ? (
                              <div className="space-y-2">
                                <label className="text-xs uppercase tracking-[0.08em] font-light text-[#605f54] block">Patient Signature *</label>

                                <div className="border border-[#dadada] bg-white w-fit">
                                  <canvas
                                    ref={deductCanvasRef}
                                    width={400}
                                    height={150}
                                    onMouseDown={startDrawingDeduct}
                                    onMouseMove={drawDeduct}
                                    onMouseUp={stopDrawingDeduct}
                                    onMouseLeave={stopDrawingDeduct}
                                    onTouchStart={startDrawingDeduct}
                                    onTouchMove={drawDeduct}
                                    onTouchEnd={stopDrawingDeduct}
                                    className="cursor-crosshair touch-none"
                                  />

                                  <div className="flex justify-between border-t border-[#dadada] p-3 bg-[#f9f9f9]">
                                    <button
                                      type="button"
                                      onClick={clearSignatureDeduct}
                                      className="text-xs uppercase tracking-widest text-[#79776f] hover:text-[#1a1c1c] transition"
                                    >
                                      Clear Signature
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setSignatureConfirmed(true)}
                                      className={`text-xs uppercase tracking-widest font-medium transition ${signatureConfirmed ? 'text-[#605f54]' : 'text-[#1a1c1c] hover:text-[#605f54]'}`}
                                    >
                                      {signatureConfirmed ? '✓ Confirmed' : 'Confirm Signature'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="border border-[#c9c6bd] bg-[#f9f9f9] p-6 flex justify-between items-center w-full max-w-md">
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-[#605f54] mb-2">✓ Visit Signed & Confirmed</p>
                                  {visits.find(v => v.id === selectedVisitId)?.checkoutSignatureUrl && (
                                    <img 
                                      src={visits.find(v => v.id === selectedVisitId)?.checkoutSignatureUrl} 
                                      alt="Signature" 
                                      className="w-32 h-16 object-contain mt-2 border border-[#dadada] bg-white" 
                                    />
                                  )}
                                </div>
                                <div className="flex flex-col gap-3 items-end">
                                  <button
                                    type="button"
                                    onClick={() => window.open(`/patient/${patientId}/visit/${selectedVisitId}/print`, '_blank')}
                                    className="text-xs uppercase tracking-widest text-[#1a1c1c] hover:text-[#605f54] underline"
                                  >
                                    Print Summary
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (window.confirm("Are you sure you want to unlock this visit for re-signing? This will require a new deduction authorization.")) {
                                        setOverrideCheckoutLock(true);
                                        setSignatureConfirmed(false);
                                      }
                                    }}
                                    className="text-xs uppercase tracking-widest text-[#79776f] hover:text-[#1a1c1c] underline"
                                  >
                                    Unlock to Re-sign
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>




      {/* Cross-Visit Comparison Section */}
      <div className="border-t border-[#dadada] pt-8 space-y-6">
        <h2 className="text-xl sm:text-3xl font-serif font-light text-[#1a1c1c]">Cross-Visit Comparison</h2>

        <p className="text-sm text-[#79776f] font-sans">Select any two visits to compare photos.</p>
        
        <div className="flex gap-6 items-center">
          <div className="flex-1">
            <label className="text-xs uppercase tracking-[0.08em] font-light text-[#605f54] mb-2 block">Visit A (Left Image)</label>

            <select
              value={compareVisitAId || ''}
              onChange={(e) => setCompareVisitAId(e.target.value)}
              className="border border-[#c9c6bd] rounded-md p-3 w-full bg-white text-sm focus:outline-none focus:border-[#1a1c1c]"

            >
              <option value="">Select Visit...</option>
              {visits.map((visit, index) => (
                <option key={visit.id} value={visit.id}>
                  {visit.visitDate?.toDate ? visit.visitDate.toDate().toLocaleDateString() : new Date(visit.visitDate).toLocaleDateString()} (Visit #{visits.length - index})
                </option>
              ))}
            </select>
            
            {mediaA && (
              <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                {mediaA.imageUrls && Array.isArray(mediaA.imageUrls) ? (
                  mediaA.imageUrls.map((url, idx) => (
                    <div 
                      key={idx} 
                      className={`relative w-16 h-12 border-2 ${selectedImageA === url ? 'border-[#1a1c1c]' : 'border-[#dadada]'} cursor-pointer flex-shrink-0`}
                      onClick={() => setSelectedImageA(url)}
                    >
                      <img src={url} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))
                ) : (
                  <>
                    {mediaA.beforeUrl && (
                      <div className={`relative w-16 h-12 border-2 ${selectedImageA === mediaA.beforeUrl ? 'border-[#1a1c1c]' : 'border-[#dadada]'} cursor-pointer flex-shrink-0`} onClick={() => setSelectedImageA(mediaA.beforeUrl)}>
                        <img src={mediaA.beforeUrl} alt="Before" className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 right-0 bg-white text-[8px] px-0.5">B</span>
                      </div>
                    )}
                    {mediaA.afterUrl && (
                      <div className={`relative w-16 h-12 border-2 ${selectedImageA === mediaA.afterUrl ? 'border-[#1a1c1c]' : 'border-[#dadada]'} cursor-pointer flex-shrink-0`} onClick={() => setSelectedImageA(mediaA.afterUrl)}>
                        <img src={mediaA.afterUrl} alt="After" className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 right-0 bg-white text-[8px] px-0.5">A</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <label className="text-xs uppercase tracking-[0.08em] font-light text-[#605f54] mb-2 block">Visit B (Right Image)</label>

            <select
              value={compareVisitBId || ''}
              onChange={(e) => setCompareVisitBId(e.target.value)}
              className="border border-[#c9c6bd] rounded-md p-3 w-full bg-white text-sm focus:outline-none focus:border-[#1a1c1c]"

            >
              <option value="">Select Visit...</option>
              {visits.map((visit, index) => (
                <option key={visit.id} value={visit.id}>
                  {visit.visitDate?.toDate ? visit.visitDate.toDate().toLocaleDateString() : new Date(visit.visitDate).toLocaleDateString()} (Visit #{visits.length - index})
                </option>
              ))}
            </select>
            
            {mediaB && (
              <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                {mediaB.imageUrls && Array.isArray(mediaB.imageUrls) ? (
                  mediaB.imageUrls.map((url, idx) => (
                    <div 
                      key={idx} 
                      className={`relative w-16 h-12 border-2 ${selectedImageB === url ? 'border-[#1a1c1c]' : 'border-[#dadada]'} cursor-pointer flex-shrink-0`}
                      onClick={() => setSelectedImageB(url)}
                    >
                      <img src={url} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))
                ) : (
                  <>
                    {mediaB.beforeUrl && (
                      <div className={`relative w-16 h-12 border-2 ${selectedImageB === mediaB.beforeUrl ? 'border-[#1a1c1c]' : 'border-[#dadada]'} cursor-pointer flex-shrink-0`} onClick={() => setSelectedImageB(mediaB.beforeUrl)}>
                        <img src={mediaB.beforeUrl} alt="Before" className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 right-0 bg-white text-[8px] px-0.5">B</span>
                      </div>
                    )}
                    {mediaB.afterUrl && (
                      <div className={`relative w-16 h-12 border-2 ${selectedImageB === mediaB.afterUrl ? 'border-[#1a1c1c]' : 'border-[#dadada]'} cursor-pointer flex-shrink-0`} onClick={() => setSelectedImageB(mediaB.afterUrl)}>
                        <img src={mediaB.afterUrl} alt="After" className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 right-0 bg-white text-[8px] px-0.5">A</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {mediaA || mediaB ? (
          <div className="border border-[#dadada] p-4 bg-white">
            <BeforeAfterSlider 
              beforeUrl={selectedImageA || ''} 
              afterUrl={selectedImageB || ''} 
            />
          </div>
        ) : (
          <div className="text-[#79776f] text-center p-10 bg-[#ffffff] border border-[#dadada] rounded-none font-sans">
            Select visits with images to compare.
          </div>
        )}
      </div>
    </div>
  );
}
