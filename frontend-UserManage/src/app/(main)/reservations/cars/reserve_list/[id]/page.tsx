"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Car,
  Users,
  Palette,
  Fuel,
  Settings,
  ArrowLeft,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Circle
} from 'lucide-react';
import client from '@/lib/axios/interceptors';
import dataConfig from '@/config/config';
import Image from 'next/image';
import LoadingSkeleton from '../components/LoadingSkeleton/Loading';
import { useSearchParams } from 'next/dist/client/components/navigation';
import { DialogSubmitReservation } from './components/SubmitReservation/DialogFormSubmit';
import { useSession } from 'next-auth/react';


export default function CarDetailPage() {
  const { data: session, status } = useSession({
  required: false,
});
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const [carData, setCarData] = useState<CarList | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await client.get(`/reservation/reservation_car_detail?id=${id}`, {
          method: 'GET',
          headers: dataConfig().header
        });
        setCarData(res.data[0]);
      } catch (error) {
        console.error("โหลดข้อมูลรถล้มเหลว:", error);
      }
    }
    fetchData();
  }, [id]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === ImageWithJson.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? ImageWithJson.length - 1 : prev - 1
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'พร้อมใช้งาน':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'ซ่อมบำรุง':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-red-100 text-red-800 border-red-300';
    }
  };
  if (!carData) {
    return <LoadingSkeleton />;
  }
  const fallbackImage = [
    { image_url: "https://img5.pic.in.th/file/secure-sv1/jz32ljhapkdexs5.jpg" }
  ];

  const ImageWithJson = (() => {
    try {
      if (!carData?.images) return fallbackImage;

      const parsed = JSON.parse(carData.images);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallbackImage;
    } catch (e) {
      console.error("Error parsing images JSON:", e);
      return fallbackImage;
    }
  })();
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" className="mb-4 hover:bg-gray-100">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับไปยังรายการรถ
          </Button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {carData.car_band} {carData.car_tier}
              </h1>
              <p className="text-gray-600">เลขทะเบียน: {carData.car_infocode}</p>
            </div>

            {(session?.user?.role_id === 6 || session?.user?.role_id === 1) &&
            <div className="flex gap-2">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <Edit className="w-4 h-4 mr-2" />
                แก้ไข
              </Button>
              <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2" />
                ลบ
              </Button>
            </div>
            }
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Gallery */}
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="relative">
                <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={
                      ImageWithJson?.[currentImageIndex]?.image_url ||
                      "https://img5.pic.in.th/file/secure-sv1/jz32ljhapkdexs5.jpg"
                    }
                    alt={`${carData?.car_band ?? 'Unknown'} ${carData?.car_tier ?? ''}`}
                    className="w-full h-full object-contain"
                    width={400}
                    height={300}
                  />

                  {/* Navigation buttons */}
                  {ImageWithJson.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={nextImage}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>

                {/* Image indicators */}
                {ImageWithJson.length > 1 && (
                  <div className="flex justify-center gap-2">
                    {ImageWithJson.map((img: any, index: number) => (
                      <Button
                        key={img.car_image_id}
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <Circle
                          className={`w-2 h-2 ${index === currentImageIndex
                              ? 'fill-gray-900 text-gray-900'
                              : 'fill-gray-300 text-gray-300'
                            }`}
                        />
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Car Details */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">รายละเอียดรถ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">สถานะ:</span>
                <Badge className={getStatusColor(carData.car_status_text)}>
                  {carData.car_status_text}
                </Badge>
              </div>

              <Separator />

              {/* Specifications */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3">
                  <Car className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">ประเภทรถ</p>
                    <p className="text-gray-900">{carData.car_typename}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">สี</p>
                    <p className="text-gray-900">{carData.car_color}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">จำนวนที่นั่ง</p>
                    <p className="text-gray-900">{carData.seat_count ? `${carData.seat_count} ที่นั่ง` : 'ไม่ระบุ'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Fuel className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">อัตราการใช้น้ำมัน</p>
                    <p className="text-gray-900">{carData.rateoil ? `${carData.rateoil} กม./ลิตร` : 'ไม่ระบุ'}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Remarks */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">หมายเหตุ</h3>
                <p className="text-gray-900 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                  {carData.car_remarks || 'ไม่มีหมายเหตุ'}
                </p>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex gap-2">
                <DialogSubmitReservation
                  car={carData}
                  open={open}
                  setOpen={setOpen}
                  status={carData.active}
                />
                {session?.user.role_id === 6 || session?.user.role_id === 1 &&
                <Button variant="outline" className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Settings className="w-4 h-4 mr-2" />
                  ตั้งค่า
                </Button>
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <Card className="mt-6 border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">ข้อมูลเพิ่มเติม</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">ข้อมูลพื้นฐาน</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">เลขทะเบียน:</span>
                    <span className="text-gray-900">{carData.car_infocode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ยี่ห้อ:</span>
                    <span className="text-gray-900">{carData.car_band}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">รุ่น:</span>
                    <span className="text-gray-900">{carData.car_tier}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">สถานะการใช้งาน</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID:</span>
                    <span className="text-gray-900">{carData.car_infoid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Status:</span>
                    <span className="text-gray-900">{carData.active}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">จำนวนรูปภาพ:</span>
                    <span className="text-gray-900">{ImageWithJson.length} รูป</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
