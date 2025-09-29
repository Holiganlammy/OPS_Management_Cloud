import { Car, Clock, MapPin } from "lucide-react";

interface Booking {
    todayBookings: {
      id: number;
      title: string;
      time: string;
      carModel: string;
      destination: string;
      status: string;
      color: string;
    }[];
    getStatusColor: (status: string) => string;
}

export default function TodayListCard( { todayBookings, getStatusColor }: Booking) {
    // Get current date in Thai locale
    const today = new Date();
    const thaiDate = today.toLocaleDateString('th-TH', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return (
   <div className="mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          รายการจองวันนี้
        </h2>
        <p className="text-gray-600">
          {thaiDate} ({todayBookings.length} รายการ)
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {todayBookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${booking.color}`}></div>
                    <h3 className="font-semibold text-gray-800">{booking.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Car className="w-4 h-4" />
                      <span>{booking.carModel}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{booking.destination}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">สรุปรายการจองวันนี้:</span>
          <div className="flex space-x-4">
            <span className="text-green-600">✓ ยืนยัน {todayBookings.filter(b => b.status === 'ยืนยันแล้ว').length}</span>
            <span className="text-orange-600">⏳ รอยืนยัน {todayBookings.filter(b => b.status === 'รอการยืนยัน').length}</span>
            <span className="text-blue-600">🚗 กำลังดำเนินการ {todayBookings.filter(b => b.status === 'กำลังดำเนินการ').length}</span>
          </div>
        </div>
      </div>
    </div>
    );
}