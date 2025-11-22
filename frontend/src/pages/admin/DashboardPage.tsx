import React from 'react';
import { TrendingUp, DollarSign, Home, Calendar, Eye } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendUp }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">{icon}</div>
        {trend && (
          <div
            className={`flex items-center space-x-1 text-sm font-medium ${
              trendUp ? 'text-green-600' : 'text-red-600'
            }`}
          >
            <TrendingUp className={`w-4 h-4 ${!trendUp && 'rotate-180'}`} />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
};

interface Booking {
  id: number;
  customerName: string;
  hotelName: string;
  date: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

const DashboardPage: React.FC = () => {
  // Mock data for stats
  const stats = {
    totalBookings: 248,
    revenue: '$45,678',
    roomsAvailable: 32,
  };

  // Mock data for recent bookings
  const recentBookings: Booking[] = [
    {
      id: 1,
      customerName: 'John Smith',
      hotelName: 'Grand Plaza Hotel',
      date: '2025-11-25',
      status: 'Confirmed',
    },
    {
      id: 2,
      customerName: 'Sarah Johnson',
      hotelName: 'Ocean View Resort',
      date: '2025-11-24',
      status: 'Confirmed',
    },
    {
      id: 3,
      customerName: 'Michael Brown',
      hotelName: 'Mountain Lodge',
      date: '2025-11-23',
      status: 'Pending',
    },
    {
      id: 4,
      customerName: 'Emily Davis',
      hotelName: 'City Center Hotel',
      date: '2025-11-23',
      status: 'Confirmed',
    },
    {
      id: 5,
      customerName: 'David Wilson',
      hotelName: 'Sunset Beach Resort',
      date: '2025-11-22',
      status: 'Pending',
    },
    {
      id: 6,
      customerName: 'Lisa Anderson',
      hotelName: 'Riverside Inn',
      date: '2025-11-22',
      status: 'Cancelled',
    },
    {
      id: 7,
      customerName: 'Robert Taylor',
      hotelName: 'Grand Plaza Hotel',
      date: '2025-11-21',
      status: 'Confirmed',
    },
    {
      id: 8,
      customerName: 'Jennifer Martinez',
      hotelName: 'Ocean View Resort',
      date: '2025-11-20',
      status: 'Confirmed',
    },
  ];

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={<Calendar className="w-6 h-6" />}
          trend="+12.5%"
          trendUp={true}
        />
        <StatCard
          title="Revenue"
          value={stats.revenue}
          icon={<DollarSign className="w-6 h-6" />}
          trend="+8.3%"
          trendUp={true}
        />
        <StatCard
          title="Rooms Available"
          value={stats.roomsAvailable}
          icon={<Home className="w-6 h-6" />}
          trend="-3.2%"
          trendUp={false}
        />
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Recent Bookings</h2>
          <p className="text-sm text-gray-500 mt-1">Latest hotel reservations</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hotel Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">
                          {booking.customerName.split(' ').map((n) => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.customerName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.hotelName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(booking.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-indigo-600 hover:text-indigo-900 font-medium flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
