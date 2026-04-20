'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '../../../../../../lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

export default function PrintVisitPage() {
  const params = useParams();
  const { id: patientId, visitId } = params;
  const [patient, setPatient] = useState(null);
  const [visit, setVisit] = useState(null);
  const [remarks, setRemarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!patientId || !visitId) return;
      try {
        // Fetch Patient
        const patientDoc = await getDoc(doc(db, 'patients', patientId));
        if (patientDoc.exists()) setPatient(patientDoc.data());

        // Fetch Visit
        const visitDoc = await getDoc(doc(db, 'patients', patientId, 'visits', visitId));
        if (visitDoc.exists()) setVisit(visitDoc.data());

        // Fetch Remarks
        const remarksSnapshot = await getDocs(collection(db, 'patients', patientId, 'visits', visitId, 'remarks'));
        const remarksData = remarksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRemarks(remarksData);
      } catch (error) {
        console.error("Error fetching print data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [patientId, visitId]);

  useEffect(() => {
    if (!loading && patient && visit) {
      // Trigger print after data is loaded and rendered
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [loading, patient, visit]);

  if (loading) return <div className="p-10 text-center text-[#79776f]">Loading print summary...</div>;
  if (!patient || !visit) return <div className="p-10 text-center text-red-600">Error: Data not found.</div>;

  const renderCopy = (title) => (
    <div className="bg-white p-8 border border-[#dadada] font-sans text-[#1a1c1c] space-y-6">
      <div className="flex justify-between items-baseline border-b border-[#dadada] pb-4">
        <div>
          <h1 className="text-2xl font-serif italic">Aretehk Clinical Management</h1>
          <p className="text-xs uppercase tracking-widest text-[#605f54]">Visit Summary & Receipt</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-[#605f54] font-bold">{title}</p>
          <p className="text-sm text-[#79776f]">Date: {visit.visitDate?.toDate ? visit.visitDate.toDate().toLocaleDateString() : new Date(visit.visitDate).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Patient Info */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#605f54]">Patient Name</p>
          <p className="font-medium">{patient.name}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-[#605f54]">Patient ID</p>
          <p className="font-medium">{patientId.slice(0, 6)}...</p>
        </div>
      </div>

      {/* Treatment Details */}
      <div>
        <h2 className="text-xs uppercase tracking-widest text-[#605f54] mb-2">Treatments Performed</h2>
        {remarks.length === 0 ? (
          <p className="text-sm text-[#79776f]">No treatments logged.</p>
        ) : (
          <table className="w-full text-sm border-t border-[#dadada]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-[#605f54]">
                <th className="py-2">Site</th>
                <th className="py-2 text-right">Dosage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeeeee]">
              {remarks.map((remark) => (
                <tr key={remark.id}>
                  <td className="py-2">{remark.anatomicalSite}</td>
                  <td className="py-2 text-right">{remark.dosage} ml</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Financials */}
      <div className="border-t border-[#dadada] pt-4 flex justify-between items-baseline">
        <span className="text-xs uppercase tracking-widest text-[#605f54]">Credits Deducted</span>
        <span className="font-serif text-lg font-bold">${visit.deductedAmount || 0}</span>
      </div>

      {/* Signature */}
      <div className="border-t border-[#dadada] pt-4 flex justify-between items-end">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#605f54] mb-2">Customer Signature</p>
          {visit.checkoutSignatureUrl ? (
            <img src={visit.checkoutSignatureUrl} alt="Signature" className="w-32 h-16 object-contain border border-[#dadada] bg-white" />
          ) : (
            <div className="w-32 h-16 border border-[#dadada] flex items-center justify-center text-xs text-[#79776f]">No Signature</div>
          )}
        </div>
        <div className="text-right text-xs text-[#79776f]">
          Thank you for choosing Aretehk.
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f9f9f9] p-10 space-y-10 max-w-4xl mx-auto print:bg-white print:p-0 print:max-w-none">
      {/* Customer Copy */}
      {renderCopy("Customer Copy")}

      {/* Cut Line */}
      <div className="border-t-2 border-dashed border-[#dadada] my-10 relative">
        <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#f9f9f9] px-3 text-xs uppercase tracking-widest text-[#79776f]">✂ Cut Here</span>
      </div>

      {/* Clinic Copy */}
      {renderCopy("Clinic Copy")}
    </div>
  );
}
