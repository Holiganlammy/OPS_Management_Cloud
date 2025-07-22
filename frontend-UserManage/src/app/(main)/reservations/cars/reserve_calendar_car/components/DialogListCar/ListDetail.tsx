import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Car, Clock, MapPin, User } from "lucide-react";

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
    );
}