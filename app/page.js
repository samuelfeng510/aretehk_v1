'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import Link from 'next/link';

export default function Home() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('en');

  const translations = {
    en: {
      title: 'Clinical Workspace',

      loggedInAs: 'Logged in as Staff',
      registerNewPatient: 'Register New Patient',
      onboardNewPatient: 'Onboard a new patient with signature.',
      goToRegistration: 'Go to Registration',
      clinicStats: 'Clinic Stats',
      summaryToday: "Summary of today's activity.",
      totalPatients: 'Total Registered Patients',
      patientDirectory: 'Patient Directory',
      loadingPatients: 'Loading patients...',
      noPatients: 'No patients registered yet.',
      name: 'Name',
      hkid: 'HKID',
      phone: 'Phone',
      balance: 'Balance',
      action: 'Action',
      viewDashboard: 'View Dashboard'
    },
    zh: {
      title: '臨床工作區',

      loggedInAs: '職員已登入',
      registerNewPatient: '登記新病人',
      onboardNewPatient: '登記新病人並簽署。',
      goToRegistration: '前往登記',
      clinicStats: '診所統計',
      summaryToday: '今日活動摘要。',
      totalPatients: '總登記人數',
      patientDirectory: '病人名錄',
      loadingPatients: '正在載入病人資料...',
      noPatients: '暫無登記病人。',
      name: '姓名',
      hkid: '身份證',
      phone: '電話',
      balance: '餘額',
      action: '操作',
      viewDashboard: '查看檔案'
    }
  };

  const t = translations[lang];

  useEffect(() => {
    // Load language from settings
    const savedSettings = localStorage.getItem('systemSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      if (parsed.language) {
        setLang(parsed.language);
      }
    }

    async function fetchPatients() {
      try {
        const q = query(collection(db, 'patients'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const patientsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPatients(patientsData);
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
          <h1 className="text-4xl font-serif text-[#1a1c1c]">{t.title}</h1>


          <div className="flex items-center gap-4">
            <div className="text-xs uppercase tracking-widest text-[#605f54]">{t.loggedInAs}</div>

          </div>
        </header>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-[#ffffff] p-8 border border-[#dadada] flex flex-col justify-between min-h-40 rounded-md">


            <div>
              <h2 className="text-2xl font-serif text-[#1a1c1c]">{t.clinicStats}</h2>
            </div>
            
            {/* Mobile View */}
            <div className="grid grid-cols-1 sm:hidden gap-4 mt-2">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-[0.08em] font-light text-[#79776f]">{t.totalPatients}</span>
                <span className="font-serif text-[#1a1c1c] text-3xl mt-1">{patients.length}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-[0.08em] font-light text-[#c9c6bd]">Visits Today (WIP)</span>
                <span className="font-serif text-[#c9c6bd] text-3xl mt-1">0</span>
              </div>
            </div>

            {/* iPad and Desktop View (Ensures numbers align even if text wraps) */}
            <div className="hidden sm:grid sm:grid-cols-2 gap-x-6 gap-y-1 mt-2 items-baseline">
              <span className="text-xs uppercase tracking-[0.08em] font-light text-[#79776f]">{t.totalPatients}</span>
              <span className="text-xs uppercase tracking-[0.08em] font-light text-[#c9c6bd]">Visits Today (WIP)</span>
              
              <span className="font-serif text-[#1a1c1c] text-3xl">{patients.length}</span>
              <span className="font-serif text-[#c9c6bd] text-3xl">0</span>
            </div>



          </div>
        </div>

        {/* Patient Directory / Queue */}
        <div className="bg-[#ffffff] p-8 border border-[#dadada] rounded-md">
          <h2 className="text-2xl font-serif text-[#1a1c1c] mb-6">{t.patientDirectory}</h2>



          
          {loading ? (
            <p className="text-[#79776f] font-sans">{t.loadingPatients}</p>
          ) : patients.length === 0 ? (
            <p className="text-[#79776f] font-sans">{t.noPatients}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#dadada]">
                <thead>
                  <tr className="bg-[#f9f9f9]">
                    <th className="px-6 py-4 text-left text-xs font-light text-[#605f54] uppercase tracking-[0.08em]">{t.name}</th>
                    <th className="px-6 py-4 text-left text-xs font-light text-[#605f54] uppercase tracking-[0.08em]">{t.hkid}</th>
                    <th className="px-6 py-4 text-left text-xs font-light text-[#605f54] uppercase tracking-[0.08em]">{t.phone}</th>
                    <th className="px-6 py-4 text-left text-xs font-light text-[#605f54] uppercase tracking-[0.08em]">{t.balance}</th>
                    <th className="px-6 py-4 text-left text-xs font-light text-[#605f54] uppercase tracking-[0.08em]">{t.action}</th>


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
                        <Link href={`/patient/${patient.id}`} className="text-xs uppercase tracking-widest text-[#3d2813] hover:text-[#5c4028] font-medium underline">

                          {t.viewDashboard}
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
