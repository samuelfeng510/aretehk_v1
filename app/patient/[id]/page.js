import PatientDashboard from "@/components/PatientDashboard";

export default async function PatientPage({ params }) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <PatientDashboard patientId={id} />
    </div>
  );
}
