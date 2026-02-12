import { useAuth } from '../../context/AuthContext';

export default function StudentProfile() {
  const { user } = useAuth();

  return (
    <section className="py-12 container mx-auto px-4">
      <h1 className="text-2xl font-heading font-bold text-gray-900 mb-6">Profile</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl space-y-4">
        <p><span className="text-gray-500">Name:</span> {user?.name}</p>
        <p><span className="text-gray-500">Email:</span> {user?.email}</p>
        {user?.contact && <p><span className="text-gray-500">Contact:</span> {user.contact}</p>}
        <p><span className="text-gray-500">Status:</span> {user?.isVerified ? 'Verified' : 'Pending verification'}</p>
        {user?.academicDetails && (
          <div className="pt-4 border-t">
            <h3 className="font-semibold text-gray-900 mb-2">Academic</h3>
            <p><span className="text-gray-500">Institution:</span> {user.academicDetails.institution || '-'}</p>
            <p><span className="text-gray-500">Year:</span> {user.academicDetails.year || '-'}</p>
            <p><span className="text-gray-500">Roll #:</span> {user.academicDetails.rollNumber || '-'}</p>
          </div>
        )}
        {user?.packages?.length > 0 && (
          <div className="pt-4 border-t">
            <h3 className="font-semibold text-gray-900 mb-2">Packages</h3>
            <ul className="list-disc pl-5">
              {user.packages.map((up) => (
                <li key={up._id}>{up.package?.name} – Active</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
