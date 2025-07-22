"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"
import { useEffect, useState } from "react";
import ListDetail from "./components/DialogListCar/ListDetail";
import { Card, CardContent } from "@/components/ui/card";
import "./components/DialogListCar/css/calendar-style.css"
import TodayListCard from "./components/TodayListCard/today";


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
export default function reserveCalendarCarPage() {
    const [events, setEvents] = useState<EventType[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
    const [eventDialogOpen, setEventDialogOpen] = useState(false);
    const todayBookings = [
    {
      id: 1,
      title: "Nonnipat จองรถเช้าไปทำงานแถวๆโคราช",
      time: "08:00 - 10:00",
      carModel: "Honda City",
      destination: "สนามบินสุวรรณภูมิ",
      status: "กำลังดำเนินการ",
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "TOYOTA จองเที่ยง",
      time: "12:00 - 14:00",
      carModel: "Toyota Camry",
      destination: "ห้างสยามพารากอน",
      status: "รอการยืนยัน",
      color: "bg-orange-500"
    },
    {
      id: 3,
      title: "NISSAN จองบ่าย",
      time: "15:00 - 17:00",
      carModel: "Nissan Almera",
      destination: "โรงพยาบาลบำรุงราษฎร์",
      status: "ยืนยันแล้ว",
      color: "bg-green-500"
    },
    {
      id: 4,
      title: "NISSAN จองเย็น",
      time: "18:00 - 19:00",
      carModel: "Nissan March",
      destination: "ตลาดนัดรถไฟรัชดา",
      status: "ยืนยันแล้ว",
      color: "bg-green-500"
    }
  ];
    const getStatusColor = (status: string) => {
    switch (status) {
      case 'ยืนยันแล้ว':
        return 'bg-green-100 text-green-800';
      case 'กำลังดำเนินการ':
        return 'bg-blue-100 text-blue-800';
      case 'รอการยืนยัน':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
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
                end: "2025-07-19T11:30:00",
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
    return (
        <div className="pt-16">
            <Card className="bg-white shadow-md rounded-lg max-w-6xl mx-auto mb-6">
                <CardContent className="p-4">
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
                            eventClassNames={() => " cursor-pointer p-1 text-xs! shadow-md"}
                            height={600}
                            locale="th"
                            firstDay={1}
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
                                    html: `<b className="text-gray-500">${timeText}</b>    <span>${arg.event.title}</span>`,
                                };
                            }}
                        />
                    </div>
                </CardContent>
            </Card>

            <ListDetail
                eventDialogOpen={eventDialogOpen}
                setEventDialogOpen={setEventDialogOpen}
                selectedEvent={selectedEvent}
            />
            <div className="max-w-4xl mx-auto p-4">
                <TodayListCard todayBookings={todayBookings} getStatusColor={getStatusColor} />
            </div>
        </div>
    );
}