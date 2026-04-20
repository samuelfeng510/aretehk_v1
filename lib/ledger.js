import { db } from './firebase';
import { doc, runTransaction, collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Deducts credits from a patient's account and logs the transaction.
 * @param {string} patientId - The ID of the patient.
 * @param {number} amount - The amount to deduct (positive number).
 * @param {string} visitId - The ID of the associated visit.
 */
export async function deductCredits(patientId, amount, visitId) {
  const patientRef = doc(db, 'patients', patientId);
  const transactionsRef = collection(db, 'patients', patientId, 'transactions');

  try {
    await runTransaction(db, async (transaction) => {
      const patientDoc = await transaction.get(patientRef);
      if (!patientDoc.exists()) {
        throw new Error("Patient does not exist!");
      }

      const currentBalance = patientDoc.data().currentCreditBalance || 0;
      if (currentBalance < amount) {
        throw new Error("Insufficient credits!");
      }

      const newBalance = currentBalance - amount;

      // 1. Update patient balance
      transaction.update(patientRef, { currentCreditBalance: newBalance });

      // 2. Log the transaction in the subcollection
      // Note: addDoc cannot be used directly inside a transaction for a subcollection easily if we want to ensure atomicity of the creation too,
      // but we can create a doc with a generated ID and set it.
      const newTransactionRef = doc(transactionsRef);
      transaction.set(newTransactionRef, {
        amount: -amount, // Negative for deduction
        type: 'deduction',
        timestamp: serverTimestamp(),
        relatedVisitId: visitId,
      });
    });
    console.log("Transaction successfully committed!");
  } catch (e) {
    console.error("Transaction failed: ", e);
    throw e;
  }
}

/**
 * Adds credits to a patient's account and logs the transaction.
 * @param {string} patientId - The ID of the patient.
 * @param {number} amount - The amount to add (positive number).
 */
export async function addCredits(patientId, amount) {
  const patientRef = doc(db, 'patients', patientId);
  const transactionsRef = collection(db, 'patients', patientId, 'transactions');

  try {
    await runTransaction(db, async (transaction) => {
      const patientDoc = await transaction.get(patientRef);
      if (!patientDoc.exists()) {
        throw new Error("Patient does not exist!");
      }

      const currentBalance = patientDoc.data().currentCreditBalance || 0;
      const newBalance = currentBalance + amount;

      // 1. Update patient balance
      transaction.update(patientRef, { currentCreditBalance: newBalance });

      // 2. Log the transaction
      const newTransactionRef = doc(transactionsRef);
      transaction.set(newTransactionRef, {
        amount: amount, // Positive for addition
        type: 'purchase',
        timestamp: serverTimestamp(),
      });
    });
    console.log("Credits successfully added!");
  } catch (e) {
    console.error("Transaction failed: ", e);
    throw e;
  }
}
