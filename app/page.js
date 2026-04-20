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
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Aretehk Clinic Portal</h1>
          <div className="text-sm text-gray-500">Logged in as Staff</div>
        </header>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/register" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border border-gray-200 flex flex-col justify-between h-32">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Register New Patient</h2>
              <p className="text-gray-600 text-sm mt-1">Onboard a new patient with signature.</p>
            </div>
            <span className="text-blue-600 text-sm font-medium">Go to Registration &rarr;</span>
          </Link>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col justify-between h-32">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Clinic Stats</h2>
              <p className="text-gray-600 text-sm mt-1">Summary of today's activity.</p>
            </div>
            <span className="text-gray-500 text-sm">Total Registered Patients: {patients.length}</span>
          </div>
        </div>

        {/* Patient Directory / Queue */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Patient Directory</h2>
          
          {loading ? (
            <p className="text-gray-600">Loading patients...</p>
          ) : patients.length === 0 ? (
            <p className="text-gray-600">No patients registered yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HKID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.map((patient) => (
                    <tr key={patient.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.hkid}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.currentCreditBalance || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/patient/${patient.id}`} className="text-blue-600 hover:text-blue-900">
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
