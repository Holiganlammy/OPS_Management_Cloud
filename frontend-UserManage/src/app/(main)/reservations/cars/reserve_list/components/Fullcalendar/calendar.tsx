"use client";

import { useState, useEffect } from "react";
import { Calendar, Car, MapPin, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader,
} from "@/components/ui/dialog";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"

type EventType = {
    title: string;
    start: string;
    end?: string;
    extendedProps?: {
        carModel: string;
        carLicense: string;
        driverName: string;
        destination: string;
        passengerCount: number;
        contactNumber: string;
        notes?: string;
    };
};

export default function CalendarModalButton() {
    const [events, setEvents] = useState<EventType[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
    const [eventDialogOpen, setEventDialogOpen] = useState(false);

    useEffect(() => {
        setEvents([
            {
                title: "Nonnipat จองรถเช้าไปทำงานแถวๆโคราช",
                start: "2025-07-16T08:00:00",
                end: "2025-07-16T10:00:00",
                extendedProps: {
                    carModel: "Honda City",
                    carLicense: "กข-1234",
                    driverName: "คุณสมชาย",
                    destination: "สนามบินสุวรรณภูมิ",
                    passengerCount: 2,
                    contactNumber: "081-234-5678",
                    notes: "ลูกค้า VIP, ต้องการน้ำเย็น"
                }
            },
            {
                title: "TOYOTA จองเที่ยง",
                start: "2025-07-16T12:00:00",
                end: "2025-07-16T14:00:00",
                extendedProps: {
                    carModel: "Toyota Camry",
                    carLicense: "คง-5678",
                    driverName: "คุณสมหญิง",
                    destination: "ห้างสยามพารากอน",
                    passengerCount: 4,
                    contactNumber: "082-345-6789",
                    notes: "จอดที่ชั้น B1"
                }
            },
            {
                title: "NISSAN จองบ่าย",
                start: "2025-07-16T15:00:00",
                end: "2025-07-16T17:00:00",
                extendedProps: {
                    carModel: "Nissan Almera",
                    carLicense: "จฉ-9012",
                    driverName: "คุณสมศักดิ์",
                    destination: "โรงพยาบาลบำรุงราษฎร์",
                    passengerCount: 1,
                    contactNumber: "083-456-7890",
                    notes: "ผู้ป่วยผู้สูงอายุ, ขับช้าๆ"
                }
            },
            {
                title: "NISSAN จองเย็น",
                start: "2025-07-16T18:00:00",
                end: "2025-07-16T19:00:00",
                extendedProps: {
                    carModel: "Nissan March",
                    carLicense: "ชซ-3456",
                    driverName: "คุณสมพร",
                    destination: "ตลาดนัดรถไฟรัชดา",
                    passengerCount: 3,
                    contactNumber: "084-567-8901",
                    notes: "รอรับที่ประตูหลัก"
                }
            },
            {
                title: "SUZUKI จองเย็น",
                start: "2025-07-17T09:00:00",
                end: "2025-07-17T11:30:00",
                extendedProps: {
                    carModel: "Suzuki Swift",
                    carLicense: "ญฎ-7890",
                    driverName: "คุณสมบูรณ์",
                    destination: "มหาวิทยาลัยธรรมศาสตร์",
                    passengerCount: 2,
                    contactNumber: "085-678-9012",
                    notes: "นิสิตไปสอบ, ไม่ให้สาย"
                }
            },
            {
                title: "MITSUBISHI จองเที่ยง",
                start: "2025-08-01T12:30:00",
                end: "2025-08-01T14:30:00",
                extendedProps: {
                    carModel: "Mitsubishi Xpander",
                    carLicense: "ฐฐ-1234",
                    driverName: "คุณสมคิด",
                    destination: "ห้างเซ็นทรัลลาดพร้าว",
                    passengerCount: 5,
                    contactNumber: "086-789-0123",
                    notes: "จอดที่ชั้น 3, มีของแถม"
                }
            },
                        {
                title: "MITSUBISHI จองเที่ยง",
                start: "2025-08-01T12:30:00",
                end: "2025-08-01T14:30:00",
                extendedProps: {
                    carModel: "Mitsubishi Xpander",
                    carLicense: "ฐฐ-1234",
                    driverName: "คุณสมคิด",
                    destination: "ห้างเซ็นทรัลลาดพร้าว",
                    passengerCount: 5,
                    contactNumber: "086-789-0123",
                    notes: "จอดที่ชั้น 3, มีของแถม"
                }
            },
                        {
                title: "MITSUBISHI จองเที่ยง",
                start: "2025-08-01T12:30:00",
                end: "2025-08-01T14:30:00",
                extendedProps: {
                    carModel: "Mitsubishi Xpander",
                    carLicense: "ฐฐ-1234",
                    driverName: "คุณสมคิด",
                    destination: "ห้างเซ็นทรัลลาดพร้าว",
                    passengerCount: 5,
                    contactNumber: "086-789-0123",
                    notes: "จอดที่ชั้น 3, มีของแถม"
                }
            },
                        {
                title: "MITSUBISHI จองเที่ยง",
                start: "2025-08-01T12:30:00",
                end: "2025-08-01T14:30:00",
                extendedProps: {
                    carModel: "Mitsubishi Xpander",
                    carLicense: "ฐฐ-1234",
                    driverName: "คุณสมคิด",
                    destination: "ห้างเซ็นทรัลลาดพร้าว",
                    passengerCount: 5,
                    contactNumber: "086-789-0123",
                    notes: "จอดที่ชั้น 3, มีของแถม"
                }
            },
        ]);
    }, []);

    const handleEventClick = (info: any) => {
        const eventData = {
            title: info.event.title,
            start: info.event.startStr,
            end: info.event.endStr,
            extendedProps: info.event.extendedProps
        };
        setSelectedEvent(eventData);
        setEventDialogOpen(true);
    };

    const formatDateTime = (dateString: string | Date) => {
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
        return new Intl.DateTimeFormat('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="h-12 px-6 bg-gray-900 hover:bg-gray-800">
                        <Calendar className="w-4 h-4 mr-2" />
                        ดูปฏิทินทั้งหมด
                    </Button>
                </DialogTrigger>

                <DialogContent className="max-w-7xl!">
                    <DialogHeader>
                        <DialogTitle>ปฏิทินการจองรถ</DialogTitle>
                        <DialogDescription>
                            คลิกที่การจองเพื่อดูรายละเอียด
                        </DialogDescription>
                    </DialogHeader>

                    <div className="w-full">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            headerToolbar={{
                                left: "prev,next today",
                                center: "title",
                                right: "dayGridMonth,timeGridWeek",
                            }}
                            events={events}
                            eventDisplay="block"
                            dayMaxEvents={3}
                            eventClick={handleEventClick}
                            eventClassNames={() => " cursor-pointer p-1 shadow-md"}
                            height={600}
                            locale="th"
                            firstDay={1} // Start week on Monday
                            eventTimeFormat={{
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                            }}
                            eventContent={(arg) => {
                                const time = arg.event.start;
                                let timeText = "";
                                if (time) {
                                    const hour = time.getHours().toString().padStart(2, "0");
                                    const minute = time.getMinutes().toString().padStart(2, "0");
                                    timeText = `${hour}:${minute} น.`;
                                }
                                return {
                                    html: `<b className="text-gray-500">${timeText}</b>    <span className="font-xs">${arg.event.title}</span>`,
                                };
                            }}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Event Details Dialog */}
            <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Car className="w-5 h-5 text-blue-600" />
                            รายละเอียดการจอง
                        </DialogTitle>
                        <DialogDescription>
                            ข้อมูลการจองรถและเดินทาง
                        </DialogDescription>
                    </DialogHeader>

                    {selectedEvent && (
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold text-lg mb-2">{selectedEvent.title}</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <span>เวลา: {formatDateTime(new Date(selectedEvent.start))} - {selectedEvent.end ? formatDateTime(new Date(selectedEvent.end)) : 'ไม่ระบุ'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-start gap-3">
                                    <Car className="w-5 h-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium">รถ</p>
                                        <p className="text-sm text-gray-600">{selectedEvent.extendedProps?.carModel}</p>
                                        <p className="text-sm text-gray-600">ทะเบียน: {selectedEvent.extendedProps?.carLicense}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <User className="w-5 h-5 text-green-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium">คนขับ</p>
                                        <p className="text-sm text-gray-600">{selectedEvent.extendedProps?.driverName}</p>
                                        <p className="text-sm text-gray-600">โทร: {selectedEvent.extendedProps?.contactNumber}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-red-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium">จุดหมาย</p>
                                        <p className="text-sm text-gray-600">{selectedEvent.extendedProps?.destination}</p>
                                        <p className="text-sm text-gray-600">ผู้โดยสาร: {selectedEvent.extendedProps?.passengerCount} คน</p>
                                    </div>
                                </div>

                                {selectedEvent.extendedProps?.notes && (
                                    <div className="p-3 bg-yellow-50 rounded-lg">
                                        <p className="font-medium text-yellow-800">หมายเหตุ</p>
                                        <p className="text-sm text-yellow-700">{selectedEvent.extendedProps.notes}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button
                                    onClick={() => setEventDialogOpen(false)}
                                    className="bg-gray-900 hover:bg-gray-800"
                                >
                                    ปิด
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}