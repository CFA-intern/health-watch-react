
import { useData } from '../contexts/DataContext';
import { Phone, Mail, Clock, Users } from 'lucide-react';

const ContactsView = ({ showAll = false }) => {
  const { caretakers, patients } = useData();

  return (
    <div className="space-y-6">
      {/* Caretakers */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Caretaker Contacts
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caretakers.map((caretaker) => (
            <div key={caretaker.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{caretaker.name}</h3>
                  <span className="text-sm text-gray-600">{caretaker.shift} Shift</span>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {caretaker.patients.length} patients
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${caretaker.email}`} className="hover:text-blue-600">
                    {caretaker.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${caretaker.phone}`} className="hover:text-blue-600">
                    {caretaker.phone}
                  </a>
                </div>
              </div>

              {/* Assigned Patients */}
              <div className="mt-4 pt-3 border-t">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned Patients:</h4>
                <div className="space-y-1">
                  {caretaker.patients.map((patientId) => {
                    const patient = patients.find(p => p.id === patientId);
                    return patient ? (
                      <div key={patientId} className="text-sm text-gray-600">
                        • {patient.name} ({patient.condition})
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Emergency Contacts
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2">Emergency Services</h3>
            <div className="space-y-1">
              <div className="text-sm">
                <span className="font-medium">Emergency:</span> 911
              </div>
              <div className="text-sm">
                <span className="font-medium">Hospital:</span> (555) 999-1111
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Medical Staff</h3>
            <div className="space-y-1">
              <div className="text-sm">
                <span className="font-medium">Dr. Sarah Wilson:</span> (555) 123-4567
              </div>
              <div className="text-sm">
                <span className="font-medium">Nursing Station:</span> (555) 123-4568
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">Administration</h3>
            <div className="space-y-1">
              <div className="text-sm">
                <span className="font-medium">Admin Office:</span> (555) 123-4569
              </div>
              <div className="text-sm">
                <span className="font-medium">IT Support:</span> (555) 123-4570
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 24/7 Availability */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          24/7 Support Schedule
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Time</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Day Shift</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Night Shift</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm">06:00 - 18:00</td>
                <td className="px-4 py-3 text-sm">Alice Johnson</td>
                <td className="px-4 py-3 text-sm">-</td>
                <td className="px-4 py-3 text-sm">(555) 123-4567</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm">18:00 - 06:00</td>
                <td className="px-4 py-3 text-sm">-</td>
                <td className="px-4 py-3 text-sm">Bob Wilson</td>
                <td className="px-4 py-3 text-sm">(555) 987-6543</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContactsView;
