import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Wrench, CarFront, Star, Heart, ChevronRight, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CarCard({ car }: { car: CarType }) {
  const getStatusColor = (active: number) => {
    if (active === 1) return "text-emerald-600"  // พร้อมใช้งาน
    if (active === 2) return "text-amber-600"    // ซ่อมบำรุง
    if (active === 0) return "text-red-600"      // ไม่ใช้งาน
    return "text-blue-600"
  }

  const getStatusBg = (active: number) => {
    if (active === 1) return "bg-emerald-50"     // พร้อมใช้งาน
    if (active === 2) return "bg-amber-50"       // ซ่อมบำรุง
    if (active === 0) return "bg-red-50"         // ไม่ใช้งาน
    return "bg-blue-50"
  }

  return (
    <Card className="group w-full max-w-sm bg-white shadow-lg rounded-3xl overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-0 ring-1 ring-gray-100">
      {/* Image Section with Overlay */}
      <div className="relative h-52 w-full overflow-hidden">
      <Image
        src={car.cover_image_url || "https://img5.pic.in.th/file/secure-sv1/jz32ljhapkdexs5.jpg"}
        alt={car.car_infocode}
        fill
        className="object-contain transition-transform duration-500"
      />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge 
            variant="secondary" 
            className="bg-white/90 text-gray-800 backdrop-blur-sm font-medium shadow-sm"
          >
            {car.car_typename}
          </Badge>
        </div>
        

        {/* Status Badge */}
        <div className="absolute bottom-3 left-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-sm ${getStatusBg(car.active)}`}>
            <Wrench className={`w-3.5 h-3.5 ${getStatusColor(car.active)}`} />
            <span className={`text-xs font-medium ${getStatusColor(car.active)}`}>
              {car.car_status_text || "ไม่ทราบสถานะ"}
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              {car.car_infocode}
            </h3>
            <p className="text-sm font-medium text-gray-500 mt-0.5">
              {car.car_band} • {car.car_tier}
            </p>
          </div>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium">{car.seat_count} ที่นั่ง</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center">
              <CarFront className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-sm font-medium">{car.car_band}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-4 border-t border-gray-100 space-y-3">
          {/* Calendar Button */}
          <button className="w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-2 group">
            <Calendar className="w-4 h-4" />
            <span>ดูปฏิทินการจอง</span>
          </button>
          
          {/* Book Button */}
          <Link key={car.car_infoid} className={`p-2 my-2 cursor-pointer`} href={`reserve_list/${encodeURIComponent(car.car_tier)}?id=${car.car_infoid}`}>
          <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl">
            <span>จองเลย</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}