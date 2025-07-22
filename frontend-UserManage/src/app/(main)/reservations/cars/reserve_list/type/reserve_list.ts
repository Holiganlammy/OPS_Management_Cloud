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