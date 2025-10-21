"use client"
import { useState, useEffect } from 'react';
import { ChevronDown, Package } from 'lucide-react';

// จำลอง API ที่ทำ Pagination ฝั่ง Backend (วิธีที่ดีที่สุด)
const mockAPI = (() => {
  // จำลองฐานข้อมูลที่มี 50 รายการ
  const database = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `สินค้า ${i + 1}`,
    price: Math.floor(Math.random() * 9000) + 1000,
    image: `https://picsum.photos/seed/${i}/300/300`,
  }));

  return {
    // API Endpoint แบบมืออาชีพ - Backend ทำ pagination
    getProducts: async (page = 1, limit = 12) => {
      // จำลอง network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Backend คำนวณ offset
      const offset = (page - 1) * limit;
      
      // Database ทำ LIMIT, OFFSET (เร็วมาก)
      const products = database.slice(offset, offset + limit);
      
      return {
        success: true,
        data: products,
        pagination: {
          page,
          limit,
          total: database.length,
          totalPages: Math.ceil(database.length / limit),
          hasNext: offset + limit < database.length,
          hasPrev: page > 1,
        }
      };
    },

    // ตัวอย่าง Cursor-based (สำหรับ feed/timeline)
    getProductsCursor: async (afterId = 0, limit = 12) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // หาตำแหน่งของ cursor
      const startIndex = afterId;
      const products = database.slice(startIndex, startIndex + limit);
      
      return {
        success: true,
        data: products,
        cursor: products.length > 0 ? products[products.length - 1].id : null,
        hasMore: startIndex + limit < database.length,
      };
    }
  };
})();

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    hasNext: false,
  });
  
  const pageSize = 12;

  // โหลดหน้าแรก
  useEffect(() => {
    loadProducts(1);
  }, []);

  // Function สำหรับโหลดข้อมูล (ใช้งานง่าย)
  const loadProducts = async (page) => {
    setLoading(true);
    try {
      // เรียก API - Backend ส่งแค่ข้อมูลที่ต้องการ
      const response = await mockAPI.getProducts(page, pageSize);
      
      if (page === 1) {
        // หน้าแรก - replace
        setProducts(response.data);
      } else {
        // หน้าถัดไป - append
        setProducts(prev => [...prev, ...response.data]);
      }
      
      setPagination({
        page: response.pagination.page,
        total: response.pagination.total,
        hasNext: response.pagination.hasNext,
      });
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    loadProducts(pagination.page + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            รายการสินค้า
          </h1>
          <p className="text-gray-600">
            แสดง {products.length} จาก {pagination.total} รายการ
          </p>
          <p className="text-sm text-gray-500 mt-1">
            ใช้ API Pagination (ไม่ต้องโหลดทั้งหมด เร็วกว่า slice เยอะ)
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group cursor-pointer"
            >
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-blue-600">
                  ฿{product.price.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="flex items-center gap-3 text-gray-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>กำลังโหลด...</span>
            </div>
          </div>
        )}

        {/* Load More Button */}
        {!loading && pagination.hasNext && (
          <div className="flex justify-center">
            <button
              onClick={handleLoadMore}
              className="group flex items-center gap-2 px-8 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all font-medium shadow-sm hover:shadow-md"
            >
              <span>แสดงเพิ่มเติม</span>
              <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        )}

        {/* End Message */}
        {!loading && !pagination.hasNext && products.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="font-medium">แสดงครบทุกรายการแล้ว</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">ไม่พบสินค้า</p>
          </div>
        )}
      </div>
    </div>
  );
}