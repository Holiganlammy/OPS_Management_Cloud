interface CarType {
    car_infoid: string;
    car_band: string;
    car_tier: string;
    car_infocode: string;
    car_typename: string;
    car_color: string;
    seat_count: number | null;
    cover_image_url: string | null;
    active: number;
    rateoil: string | null;
    car_status_text: string;
    car_remarks: string;
}

interface CarList {
    car_infoid: string;
    car_band: string;
    car_tier: string;
    car_infocode: string;
    car_color: string;
    car_typename: string;
    seat_count: number | null;
    images: string | null;
    active: number;
    rateoil: string | null;
    car_remarks: string;
    car_status_text: string;
}

interface BookingBill {
    reservation_id: number;
    requester_id: number;
    requester_name: string;
    email: string;
    car_infoid: string;
    car_infocode: string;
    car_band: string;
    car_tier: string;
    destination: string;
    reason_id: string;
    reason_name: string;
    reservation_date_start: string;
    reservation_date_end: string;
    created_at: string;
    Tel: string;
    attendees: attendees[];
}

interface attendees {
    attendee_id: number;
    reservation_id: number;
    UserID: number;
    attendee_name: string;
    DepName: string;
    SecName: string;
    attend_status: number;
    note: string;
}