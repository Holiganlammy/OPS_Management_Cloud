"use client";
import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Users, Car, Building2, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import client from '@/lib/axios/interceptors';
import dataConfig from '@/config/config';
import ReservationSkeleton from '../components/skeleton'


export default function ReservationSummary() {
    const searchParams = useSearchParams();
    const id = searchParams.get('reservation_id');
    const [carBillData, setCarBillData] = useState<ReservationBillCarProps | null>(null);
    
    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                const res = await client.get(`/reservation/reservation_get_billing?reservation_id=${id}`, {
                    method: 'GET',
                    headers: dataConfig().header
                });
                setCarBillData(res.data[0]);
            } catch (error) {
                console.error("โหลดข้อมูลรถล้มเหลว:", error);
            }
        }
        fetchData();
    }, [id]);

    if (!id) {
        return <div className="text-center py-12 text-red-500">ไม่พบรหัสการจอง</div>;
    }

    if (!carBillData) {
        return <ReservationSkeleton />;
    }

    const attendees: ReservationBillCarAttendee[] =
    typeof carBillData?.attendees === "string"
        ? JSON.parse(carBillData.attendees)
        : carBillData?.attendees ?? [];

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    type StatusKey = 'confirmed' | 'pending' | 'declined';

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<StatusKey, { color: string; icon: React.ElementType; text: string }> = {
            confirmed: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, text: 'ยืนยัน' },
            pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: AlertCircle, text: 'รอตอบรับ' },
            declined: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle, text: 'ปฏิเสธ' }
        };

        const config = statusConfig[status as StatusKey] || statusConfig.pending;
        const IconComponent = config.icon;

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
                <IconComponent className="w-3 h-3 mr-1" />
                {config.text}
            </span>
        );
    };

    return (
        <div className='pt-[30px]'>
            <div className="min-h-screen bg-gray-100 py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Main Bill Card - Combined */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-200">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-gray-900 to-black text-white p-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">ใบจองห้องประชุมและรถยนต์</h1>
                                    <p className="text-gray-300 text-lg">รหัสการจอง: {carBillData?.reservation_id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-300 text-sm">วันที่จอง</p>
                                    <p className="text-lg font-semibold">{carBillData?.created_at ? formatDateTime(carBillData.created_at) : '-'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Reservation Details */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                            <Calendar className="w-5 h-5 mr-2 text-black" />
                                            รายละเอียดการจอง
                                        </h3>
                                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                            <div className="flex items-start">
                                                <Clock className="w-4 h-4 mr-2 mt-1 text-gray-500 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm text-gray-600">เวลาเริ่มต้น</p>
                                                    <p className="font-medium">{carBillData?.reservation_date_start ? formatDateTime(carBillData.reservation_date_start) : '-'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <Clock className="w-4 h-4 mr-2 mt-1 text-gray-500 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm text-gray-600">เวลาสิ้นสุด</p>
                                                    <p className="font-medium">{carBillData?.reservation_date_end ? formatDateTime(carBillData.reservation_date_end) : '-'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <MapPin className="w-4 h-4 mr-2 mt-1 text-gray-500 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm text-gray-600">จุดหมาย</p>
                                                    <p className="font-medium">{carBillData?.destination}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <User className="w-4 h-4 mr-2 mt-1 text-gray-500 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm text-gray-600">ผู้จอง</p>
                                                    <p className="font-medium">{carBillData?.booked_by}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">วัตถุประสงค์</h4>
                                        <p className="text-gray-600 bg-gray-50 rounded-lg p-4">{carBillData?.reservation_detail}</p>
                                    </div>
                                </div>

                                {/* Vehicle */}
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border-2 border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <Car className="w-5 h-5 mr-2 text-black" />
                                        ยานพาหนะ
                                    </h3>
                                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-xl font-bold text-gray-900">{carBillData?.car_band}</p>
                                            <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
                                                {carBillData?.car_tier}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p>รหัสรถ: <span className="font-medium">{carBillData?.car_infocode}</span></p>
                                            <p>สี: <span className="font-medium">{carBillData?.car_color}</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Attendees Section - Now inside the main card */}
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                        <Users className="w-6 h-6 mr-2 text-indigo-600" />
                                        รายชื่อผู้เข้าร่วมประชุม ({attendees.length} คน)
                                    </h2>
                                </div>

                                <div className="grid gap-4 mb-6">
                                    {attendees.map((attendee, index) => (
                                        <div key={attendee.UserID} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">{attendee.Name}</h4>
                                                    {attendee.note && (
                                                        <p className="text-sm text-gray-600">{attendee.note}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                {getStatusBadge(String(attendee.attend_status))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Attendees Summary */}
                                <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-lg p-6 border border-indigo-200">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">สรุปสถานะผู้เข้าร่วม</h4>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div className="bg-green-100 rounded-lg p-4 border border-green-200">
                                            <div className="text-2xl font-bold text-green-600">
                                                {attendees.filter(a => String(a.attend_status) === 'confirmed').length}
                                            </div>
                                            <div className="text-sm text-green-700 font-medium">ยืนยัน</div>
                                        </div>
                                        <div className="bg-yellow-100 rounded-lg p-4 border border-yellow-200">
                                            <div className="text-2xl font-bold text-yellow-600">
                                                {attendees.filter(a => String(a.attend_status) === 'pending').length}
                                            </div>
                                            <div className="text-sm text-yellow-700 font-medium">รอตอบรับ</div>
                                        </div>
                                        <div className="bg-red-100 rounded-lg p-4 border border-red-200">
                                            <div className="text-2xl font-bold text-red-600">
                                                {attendees.filter(a => String(a.attend_status) === 'declined').length}
                                            </div>
                                            <div className="text-sm text-red-700 font-medium">ปฏิเสธ</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-8 text-gray-600">
                        <p className="text-sm">ระบบจองห้องประชุมและยานพาหนะ | สร้างเมื่อ {carBillData?.created_at ? formatDateTime(carBillData.created_at) : '-'}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}