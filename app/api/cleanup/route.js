import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export async function GET() {
  try {
    const patientsSnapshot = await getDocs(collection(db, 'patients'));
    let deletedCount = 0;

    for (const patientDoc of patientsSnapshot.docs) {
      const patientId = patientDoc.id;

      // Delete remarks in visits
      const visitsSnapshot = await getDocs(collection(db, 'patients', patientId, 'visits'));
      for (const visitDoc of visitsSnapshot.docs) {
        const visitId = visitDoc.id;

        // Delete remarks
        const remarksSnapshot = await getDocs(collection(db, 'patients', patientId, 'visits', visitId, 'remarks'));
        for (const remarkDoc of remarksSnapshot.docs) {
          await deleteDoc(doc(db, 'patients', patientId, 'visits', visitId, 'remarks', remarkDoc.id));
        }

        // Delete visit
        await deleteDoc(doc(db, 'patients', patientId, 'visits', visitId));
      }

      // Delete patient
      await deleteDoc(doc(db, 'patients', patientId));
      deletedCount++;
    }

    return NextResponse.json({ success: true, message: `Deleted ${deletedCount} patients and their subcollections.` });
  } catch (error) {
    console.error("Error during cleanup:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
