'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import Link from 'next/link';

export default function Home() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const q = query(collection(db, 'patients'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patients: ", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f9f9] p-10 font-sans text-[#1a1c1c]">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="flex justify-between items-baseline border-b border-[#dadada] pb-6">
          <h1 className="text-4xl font-serif italic text-[#1a1c1c]">Aretehk Clinic Portal</h1>

          <div className="text-xs uppercase tracking-widest text-[#605f54]">Logged in as Staff</div>
        </header>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/register" className="bg-[#ffffff] p-8 border border-[#dadada] hover:border-[#1a1c1c] transition flex flex-col justify-between h-40">
            <div>
              <h2 className="text-2xl font-serif italic text-[#1a1c1c]">Register New Patient</h2>

              <p className="text-[#79776f] text-sm mt-2 leading-relaxed">Onboard a new patient with signature.</p>
            </div>
            <span className="text-xs uppercase tracking-widest text-[#605f54] hover:text-[#1a1c1c] underline">Go to Registration &rarr;</span>
          </Link>

          <div className="bg-[#ffffff] p-8 border border-[#dadada] flex flex-col justify-between h-40">
            <div>
              <h2 className="text-2xl font-serif italic text-[#1a1c1c]">Clinic Stats</h2>

              <p className="text-[#79776f] text-sm mt-2 leading-relaxed">Summary of today's activity.</p>
            </div>
            <span className="text-xs uppercase tracking-widest text-[#79776f]">Total Registered Patients: <span className="font-serif text-[#1a1c1c] text-lg">{patients.length}</span></span>
          </div>
        </div>

        {/* Patient Directory / Queue */}
        <div className="bg-[#ffffff] p-8 border border-[#dadada]">
          <h2 className="text-3xl font-serif italic text-[#1a1c1c] mb-6">Patient Directory</h2>

          
          {loading ? (
            <p className="text-[#79776f] font-sans">Loading patients...</p>
          ) : patients.length === 0 ? (
            <p className="text-[#79776f] font-sans">No patients registered yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#dadada]">
                <thead>
                  <tr className="bg-[#f9f9f9]">
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#605f54] uppercase tracking-widest">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#605f54] uppercase tracking-widest">HKID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#605f54] uppercase tracking-widest">Phone</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#605f54] uppercase tracking-widest">Balance</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#605f54] uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eeeeee]">
                  {patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-[#f9f9f9] transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1a1c1c] font-serif">{patient.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#48473f] font-sans">{patient.hkid}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#48473f] font-sans">{patient.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#48473f] font-serif">{patient.currentCreditBalance || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/patient/${patient.id}`} className="text-xs uppercase tracking-widest text-[#605f54] hover:text-[#1a1c1c] underline">
                          View Dashboard
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
