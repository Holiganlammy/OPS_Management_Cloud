import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Car, Clock, MapPin, User, Users, UserX } from "lucide-react";


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
        passengers?: {
            id: number;
            name: string;
            status: string; // "Confirmed" | "Pending"
            depname: string;
            secname: string;
            note: string;
        }[];
        notes?: string;
    };
};
interface ListDetailProps {
    eventDialogOpen: boolean;
    setEventDialogOpen: (open: boolean) => void;
    selectedEvent: EventType | null;
}

export default function ListDetail({ eventDialogOpen, setEventDialogOpen, selectedEvent }: ListDetailProps) {
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
            <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
                <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader className="flex-shrink-0">
                        <DialogTitle className="flex items-center gap-2">
                            <Car className="w-5 h-5 text-blue-600" />
                            รายละเอียดการจอง
                        </DialogTitle>
                        <DialogDescription>
                            ข้อมูลการจองรถและเดินทาง
                        </DialogDescription>
                    </DialogHeader>

                    {selectedEvent && (
                        <>
                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
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
                                            <p className="font-medium">ผู้ขับรถ</p>
                                            <p className="text-sm text-gray-600">{selectedEvent.extendedProps?.driverName}</p>
                                            <p className="text-sm text-gray-600">โทร: {selectedEvent.extendedProps?.contactNumber}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-red-600 mt-0.5" />
                                        <div>
                                            <p className="font-medium">จุดหมาย</p>
                                            <p className="text-sm text-gray-600">{selectedEvent.extendedProps?.destination}</p>
                                        </div>
                                    </div>

                                    {/* ส่วนแสดงผู้ร่วมเดินทาง */}
                                    <div className="flex items-start gap-3">
                                        <Users className="w-5 h-5 text-purple-600 mt-3 flex-shrink-0" />
                                        <div className="flex-1">
                                            <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                                                <AccordionItem value="item-1" className="border-none">
                                                    <AccordionTrigger className="hover:no-underline p-0 pb-3">
                                                        <div className="flex items-center justify-between w-full">
                                                            <p className="font-medium text-gray-900">ผู้ร่วมเดินทาง</p>
                                                            <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium ml-2">
                                                                {selectedEvent.extendedProps?.passengerCount || 0} คน
                                                            </span>
                                                        </div>
                                                    </AccordionTrigger>

                                                    <AccordionContent className="pt-0 pb-0">
                                                        {selectedEvent.extendedProps?.passengers && selectedEvent.extendedProps.passengers.length > 0 ? (
                                                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                                                {selectedEvent.extendedProps.passengers.map((passenger, index) => (
                                                                    <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-purple-25 rounded-xl border border-purple-100 hover:shadow-sm transition-all duration-200">
                                                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                                                                            <span className="text-sm font-semibold text-purple-800">
                                                                                {passenger.name ? passenger.name.charAt(0).toUpperCase() : (index + 1)}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="flex items-center justify-between">
                                                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                                                    {passenger.name || `ผู้โดยสาร ${index + 1}`}
                                                                                </p>
                                                                                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                                                                                    {passenger.status === 'confirmed' ? (
                                                                                        <div className="flex items-center gap-1">
                                                                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                                                            <span className="text-xs text-green-700 font-medium">ตอบรับ</span>
                                                                                        </div>
                                                                                    ) : passenger.status === 'declined' ? (
                                                                                        <div className="flex items-center gap-1">
                                                                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                                                            <span className="text-xs text-red-700 font-medium">ไม่รับ</span>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="flex items-center gap-1">
                                                                                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                                                                            <span className="text-xs text-yellow-700 font-medium">รอตอบ</span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center gap-4 mt-1">
                                                                                {passenger.depname && (
                                                                                    <div className="flex items-center gap-1">
                                                                                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                                                                                        <p className="text-xs text-gray-600 truncate">{passenger.depname}</p>
                                                                                    </div>
                                                                                )}
                                                                                {passenger.secname && (
                                                                                    <div className="flex items-center gap-1">
                                                                                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                                                                        <p className="text-xs text-gray-600 truncate">{passenger.secname}</p>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="p-6 bg-gray-50 rounded-xl text-center border-2 border-dashed border-gray-200">
                                                                <UserX className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                                <p className="text-sm text-gray-500 font-medium">ไม่มีข้อมูลผู้ร่วมเดินทาง</p>
                                                                <p className="text-xs text-gray-400 mt-1">รายการว่างเปล่า</p>
                                                            </div>
                                                        )}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </div>
                                    </div>

                                    {selectedEvent.extendedProps?.notes && (
                                        <div className="p-3 bg-yellow-50 rounded-lg">
                                            <p className="font-medium text-yellow-800">หมายเหตุ</p>
                                            <p className="text-sm text-yellow-700">{selectedEvent.extendedProps.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Fixed Footer */}
                            <div className="flex justify-end pt-4 border-t bg-white flex-shrink-0">
                                <Button
                                    onClick={() => setEventDialogOpen(false)}
                                    className="bg-gray-900 hover:bg-gray-800"
                                >
                                    ปิด
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
    );
}