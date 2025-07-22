"use client"
import client from "@/lib/axios/interceptors"
import dataConfig from "@/config/config"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, SlidersHorizontal, Users, Car, Calendar, RefreshCw } from "lucide-react"
import { useState } from "react"
import CarCard from "./components/CarCard"
import { BookCheck } from 'lucide-react';
import CalendarModalButton from "./components/Fullcalendar/calendar"

const cars = await client.get("/reservation/reservation_get_list", { method: 'GET', headers: dataConfig().header }).then((res) => res.data) // ข้อมูลรถ

export default function ShoppingCarsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("default")
  const [selectedType, setSelectedType] = useState("default")
  const [selectedSeats, setSelectedSeats] = useState("default")
  const [selectedStatus, setSelectedStatus] = useState("default")
  const statusLabelMap: Record<string, string> = {
    "1": "พร้อมใช้งาน",
    "2": "ซ่อมบำรุง",
    "0": "ไม่ใช้งาน",
    "default": "สถานะรถ",
  };

  const selectBrands = [...new Set(cars.map((car: CarType) => String(car.car_band)))].filter(Boolean)
  const selectTypes = [...new Set(cars.map((car: CarType) => String(car.car_typename)))].filter(Boolean)
  const selectSeats = (
    [...new Set(cars.map((car: CarType) => Number(car.seat_count)))]
      .filter((x): x is number => typeof x === "number" && !isNaN(x) && x > 0)
      .sort((a: number, b: number) => a - b)
  );

  const filteredCars = cars.filter((car: CarType) => {
    const matchesSearch = car.car_infocode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.car_band.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBrand = selectedBrand === "default" || car.car_band === selectedBrand
    const matchesType = selectedType === "default" || car.car_typename === selectedType
    const matchesSeats = selectedSeats === "default" || car.seat_count === Number(selectedSeats)
    const matchesStatus = selectedStatus === "default" || car.active.toString() === selectedStatus

    return matchesSearch && matchesBrand && matchesType && matchesSeats && matchesStatus
  })

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedBrand("default")
    setSelectedType("default")
    setSelectedSeats("default")
    setSelectedStatus("default")
  }

  const activeFiltersCount = [selectedBrand, selectedType, selectedSeats, selectedStatus].filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b top-0 z-10">
        <div className="max-w-7xl pt-20 mx-auto px-6 py-6">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">PureThai Reservation Systems</h1>
            <p className="text-gray-600 mt-2">เลือกรถที่ต้องการใช้งานและทำการจองได้ทันที</p>
          </div>

          {/* Search and Filter Row */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="ค้นหารถ หรือ ยี่ห้อรถ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="h-12 px-4"
                disabled={!searchTerm && activeFiltersCount === 0}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                ล้างตัวกรอง
              </Button>
              {/* <Button className="h-12 px-6 bg-gray-900 hover:bg-gray-800">
                <Calendar className="w-4 h-4 mr-2" />
                ดูปฏิทินทั้งหมด
              </Button> */}
              <CalendarModalButton />
            </div>
          </div>

          {/* Filter Section */}
          <Card className="bg-gray-50 border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <SlidersHorizontal className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">ตัวกรอง</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount} ตัวกรอง
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Brand Filter */}
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="h-10 bg-white">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-gray-500" />
                      <SelectValue>
                        {selectedBrand === "default" ? "ยี่ห้อรถ" : selectedBrand}
                      </SelectValue>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">default</SelectItem>
                    {selectBrands.map((brand) => (
                      <SelectItem key={String(brand)} value={String(brand)}>
                        {String(brand)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Type Filter */}
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="h-10 bg-white">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-gray-500" />
                      <SelectValue>
                        {selectedType === "default" ? "ประเภทรถ" : selectedType}
                      </SelectValue>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">default</SelectItem>
                    {selectTypes.map((type) => (
                      <SelectItem key={String(type)} value={String(type)}>
                        {String(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Seats Filter */}
                <Select value={selectedSeats} onValueChange={setSelectedSeats}>
                  <SelectTrigger className="h-10 bg-white">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <SelectValue>
                        {selectedSeats === "default" ? "จำนวนที่นั่ง" : selectedSeats}
                      </SelectValue>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">default</SelectItem>
                    {selectSeats.map((seats) => (
                      <SelectItem key={String(seats)} value={String(seats)}>
                        {String(seats)} ที่นั่ง
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="h-10 bg-white">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <SelectValue>
                        {statusLabelMap[selectedStatus] || "สถานะรถ"}
                      </SelectValue>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">default</SelectItem>
                    <SelectItem value="1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        พร้อมใช้งาน
                      </div>
                    </SelectItem>
                    <SelectItem value="2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        ซ่อมบำรุง
                      </div>
                    </SelectItem>
                    <SelectItem value="0">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        ไม่ใช้งาน
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              ผลการค้นหา ({filteredCars.length} คัน)
            </h2>
            {searchTerm && (
              <p className="text-gray-600 mt-1">
                ผลการค้นหาสำหรับ "<span className="font-medium">{searchTerm}</span>"
              </p>
            )}
          </div>

          {/* Sort Options */}
          <Select defaultValue="newest">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="เรียงตาม" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">รถใหม่ล่าสุด</SelectItem>
              <SelectItem value="brand">ยี่ห้อ A-Z</SelectItem>
              <SelectItem value="seats">จำนวนที่นั่ง</SelectItem>
              <SelectItem value="available">รถว่างก่อน</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* No Results */}
        {filteredCars.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบรถที่ค้นหา</h3>
            <p className="text-gray-600 mb-4">ลองเปลี่ยนคำค้นหาหรือตัวกรองใหม่</p>
            <Button variant="outline" onClick={clearFilters}>
              ล้างตัวกรองทั้งหมด
            </Button>
          </div>
        )}

        {/* Cars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCars.map((car: CarType) => (
            <CarCard key={car.car_infoid} car={car} />
          ))}
        </div>
      </div>
    </div>
  )
}