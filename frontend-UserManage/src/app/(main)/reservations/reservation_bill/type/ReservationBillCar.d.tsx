interface ReservationBillCarProps {
    reservation_id: number;
    reservation_detail: string;
    reservation_date_start: string;
    reservation_date_end: string;
    destination: string;
    created_at: string;
    booked_by: string;
    car_band: string;
    car_tier: string;
    car_color: string;
    car_infocode: string;
    attendees: ReservationBillCarAttendee[];
}

interface ReservationBillCarAttendee {
    UserID: number;
    Name: string;
    attend_status: number;
    note: string;
}
