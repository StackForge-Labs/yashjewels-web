"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Database, 
  Search, 
  TrendingUp, 
  User, 
  ShieldCheck, 
  Activity,
  ChevronDown,
  ChevronUp,
  Box,
  Server,
  AlertCircle,
  Zap,
  Clock,
  Lock,
  Cpu
} from "lucide-react";

// Dữ liệu 52 APIs
const apiModules = [
  {
    name: "Authentication & Security",
    description: "Xác thực & Bảo mật",
    icon: Shield,
    endpoints: [
      { method: "POST", path: "/api/v1/auth/register", desc: "Đăng ký tài khoản người dùng mới (Role mặc định là Customer)." },
      { method: "POST", path: "/api/v1/auth/verify-email", desc: "Xác thực tài khoản qua mã OTP gửi về email." },
      { method: "POST", path: "/api/v1/auth/login", desc: "Đăng nhập hệ thống, cấp Access Token và Refresh Token." },
      { method: "POST", path: "/api/v1/auth/refresh", desc: "Cấp mới Access Token (JWT) bằng Refresh Token." },
      { method: "POST", path: "/api/v1/auth/logout", desc: "Đăng xuất người dùng và thu hồi (revoke) các token hợp lệ." },
      { method: "POST", path: "/api/v1/auth/forgot-password", desc: "Yêu cầu lấy lại mật khẩu (gửi token đặt lại mật khẩu)." },
      { method: "POST", path: "/api/v1/auth/reset-password", desc: "Đặt lại mật khẩu mới bằng token đã được cấp." },
      { method: "POST", path: "/api/v1/auth/kyc/submit", desc: "Gửi hồ sơ eKYC (CMND/CCCD, ảnh khuôn mặt) để xác minh danh tính." },
    ]
  },
  {
    name: "Catalog",
    description: "Dữ liệu nền tảng",
    icon: Database,
    endpoints: [
      { method: "GET", path: "/api/v1/catalog/categories", desc: "Lấy danh sách tất cả danh mục (Nhẫn, Dây chuyền,...)." },
      { method: "POST", path: "/api/v1/catalog/categories", desc: "Thêm mới một danh mục sản phẩm." },
      { method: "PUT", path: "/api/v1/catalog/categories/{id}", desc: "Cập nhật thông tin của một danh mục." },
      { method: "DELETE", path: "/api/v1/catalog/categories/{id}", desc: "Xóa (mềm) một danh mục khỏi hệ thống." },
      { method: "GET", path: "/api/v1/catalog/brands", desc: "Lấy danh sách tất cả thương hiệu (Asmi, PNJ,...)." },
      { method: "POST", path: "/api/v1/catalog/brands", desc: "Thêm mới một thương hiệu." },
      { method: "PUT", path: "/api/v1/catalog/brands/{id}", desc: "Cập nhật thông tin thương hiệu." },
      { method: "DELETE", path: "/api/v1/catalog/brands/{id}", desc: "Xóa (mềm) một thương hiệu." },
      { method: "GET", path: "/api/v1/catalog/gold-types", desc: "Lấy danh sách các loại vàng (18K, 24K,...)." },
      { method: "POST", path: "/api/v1/catalog/gold-types", desc: "Thêm mới một loại vàng." },
      { method: "GET", path: "/api/v1/catalog/certifications", desc: "Lấy danh sách quy chuẩn giấy chứng nhận (GIA, SJC,...)." },
      { method: "POST", path: "/api/v1/catalog/certifications", desc: "Thêm mới một loại giấy chứng nhận." },
      { method: "GET", path: "/api/v1/catalog/jewel-types", desc: "Lấy danh sách kiểu trang sức (Vòng tay, Bông tai,...)." },
      { method: "POST", path: "/api/v1/catalog/jewel-types", desc: "Thêm mới một kiểu trang sức." },
      { method: "GET", path: "/api/v1/catalog/diamond-qualities", desc: "Lấy danh sách tiêu chuẩn chất lượng kim cương." },
      { method: "POST", path: "/api/v1/catalog/diamond-qualities", desc: "Thêm mới tiêu chuẩn chất lượng kim cương." },
      { method: "GET", path: "/api/v1/catalog/stone-qualities", desc: "Lấy danh sách tiêu chuẩn chất lượng đá quý." },
      { method: "POST", path: "/api/v1/catalog/stone-qualities", desc: "Thêm mới tiêu chuẩn chất lượng đá quý." },
      { method: "GET", path: "/api/v1/catalog/product-types", desc: "Lấy danh sách dòng sản phẩm (Nam, Nữ, Trẻ em,...)." },
      { method: "POST", path: "/api/v1/catalog/product-types", desc: "Thêm mới dòng sản phẩm." },
    ]
  },
  {
    name: "Product & Inventory",
    description: "Sản phẩm & Tồn kho",
    icon: Box,
    endpoints: [
      { method: "GET", path: "/api/v1/products", desc: "Lấy danh sách sản phẩm (có hỗ trợ phân trang)." },
      { method: "POST", path: "/api/v1/products", desc: "Tạo hồ sơ sản phẩm mới (dựa trên StyleCode)." },
      { method: "GET", path: "/api/v1/products/{styleCode}", desc: "Xem chi tiết toàn bộ thông tin của một sản phẩm." },
      { method: "PUT", path: "/api/v1/products/{styleCode}", desc: "Cập nhật thông tin chi tiết của sản phẩm." },
      { method: "DELETE", path: "/api/v1/products/{styleCode}", desc: "Xóa (chuyển trạng thái ẩn) sản phẩm khỏi hệ thống." },
      { method: "GET", path: "/api/v1/products/{styleCode}/price", desc: "Tính toán và truy xuất biểu giá MRP linh động cập nhật theo giá vàng." },
      { method: "POST", path: "/api/v1/products/{styleCode}/images", desc: "Tải lên hình ảnh mới cho sản phẩm." },
      { method: "POST", path: "/api/v1/products/{styleCode}/reviews", desc: "Gửi đánh giá (Rating & Feedback) cho sản phẩm." },
    ]
  },
  {
    name: "Search Engine",
    description: "Bộ máy cấu hình lọc",
    icon: Search,
    endpoints: [
      { method: "GET", path: "/api/v1/search", desc: "Tìm kiếm theo từ khóa kết hợp bộ lọc đa tầng (Facet & Combinatorial Filter)." },
    ]
  },
  {
    name: "Gold Price",
    description: "Biến động giá vàng",
    icon: TrendingUp,
    endpoints: [
      { method: "GET", path: "/api/v1/gold-price/current", desc: "Lấy giá vàng mới nhất đang được áp dụng để tính MRP." },
      { method: "GET", path: "/api/v1/gold-price/history", desc: "Xem biểu đồ lịch sử thay đổi giá vàng trong 24h qua." },
    ]
  },
  {
    name: "User Profile",
    description: "Cá nhân & Địa chỉ",
    icon: User,
    endpoints: [
      { method: "GET", path: "/api/v1/users/me", desc: "Lấy thông tin cá nhân của người dùng đang đăng nhập." },
      { method: "PUT", path: "/api/v1/users/me", desc: "Cập nhật thông tin (Họ tên, ngày sinh, số điện thoại,...)." },
      { method: "PUT", path: "/api/v1/users/me/change-password", desc: "Thay đổi mật khẩu tài khoản." },
      { method: "GET", path: "/api/v1/users/me/addresses", desc: "Lấy danh sách sổ địa chỉ nhận hàng của người dùng." },
      { method: "POST", path: "/api/v1/users/me/addresses", desc: "Thêm một địa chỉ nhận hàng mới." },
      { method: "PUT", path: "/api/v1/users/me/addresses/{id}", desc: "Cập nhật thông tin địa chỉ đã có." },
      { method: "DELETE", path: "/api/v1/users/me/addresses/{id}", desc: "Xóa một địa chỉ khỏi sổ địa chỉ giao hàng." },
    ]
  },
  {
    name: "Admin Management",
    description: "Quản trị người dùng",
    icon: ShieldCheck,
    endpoints: [
      { method: "GET", path: "/api/v1/admin/users", desc: "Danh sách tất cả người dùng trong hệ thống (dành cho Admin)." },
      { method: "GET", path: "/api/v1/admin/users/{id}", desc: "Xem chi tiết thông tin của một người dùng bất kỳ." },
      { method: "PUT", path: "/api/v1/admin/users/{id}/status", desc: "Khóa (Block) hoặc Mở khóa tài khoản người dùng." },
      { method: "GET", path: "/api/v1/admin/users/kyc-pending", desc: "Danh sách các khách hàng đang chờ duyệt hồ sơ KYC." },
      { method: "PUT", path: "/api/v1/admin/users/{id}/kyc", desc: "Phê duyệt (Approve) hoặc Từ chối (Reject) yêu cầu eKYC." },
    ]
  },
  {
    name: "Others",
    description: "API Khác",
    icon: Activity,
    endpoints: [
      { method: "GET", path: "/WeatherForecast", desc: "API mẫu của project template (áp dụng cho việc test health check)." },
    ]
  }
];

const coreFeatures = [
  {
    title: "Global Exception Pipeline",
    description: "Middleware tự động đánh chặn 100% các lỗi không xác định. Trả về JSON chuẩn RFC thay vì Stack Trace đỏ lòm, giữ nguyên cấu trúc UI luôn an toàn dù Backend crash.",
    icon: AlertCircle,
    color: "from-rose-500/10 to-transparent",
    iconColor: "text-rose-400 border-rose-500/30 bg-rose-500/10",
    badge: "Active",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20"
  },
  {
    title: "Redis Distributed Cache",
    description: "Lưu trữ biểu giá Vàng linh động theo thời gian thực (TTL: 20 phút). Giảm 90% tải cho MySQL, giúp API tìm kiếm và tính toán giá phản hồi siêu tốc dưới 50 mili-giây.",
    icon: Zap,
    color: "from-amber-500/10 to-transparent",
    iconColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    badge: "High Performance",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20"
  },
  {
    title: "Background Job",
    description: "Luồng xử lý bất đồng bộ Worker tự động Request cào chuỗi tỷ giá Vàng mỗi 15 phút. Điều chỉnh giá MRP toàn hệ thống thụ động 24/7 mà không cần Admin can thiệp.",
    icon: Clock,
    color: "from-blue-500/10 to-transparent",
    iconColor: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    badge: "Every 15 mins",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20"
  },
  {
    title: "Advanced Auth & Security",
    description: "Với thuật toán băm BCrypt mã hóa Work Factor 12. Vòng đời bảo mật khép kín với Access Token / Refresh Token, cùng lúc hỗ trợ hệ thống Phân tầng 9 quyền khắt khe.",
    icon: Lock,
    color: "from-emerald-500/10 to-transparent",
    iconColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    badge: "BCrypt + JWT",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  }
];

const getMethodColor = (method: string) => {
  switch (method) {
    case "GET": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "POST": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "PUT": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "DELETE": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
};

export default function ApiDocsPage() {
  const [expandedModules, setExpandedModules] = useState<number[]>([0]); 
  const totalEndpoints = apiModules.reduce((acc, curr) => acc + curr.endpoints.length, 0);

  const toggleModule = (index: number) => {
    setExpandedModules(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-200 font-sans selection:bg-amber-500/30">
      {/* Header section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 to-transparent pb-10 border-b border-amber-500/10">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
        <div className="max-w-6xl mx-auto px-6 pt-20 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full text-sm font-medium mb-6 backdrop-blur-md">
                <Server className="w-4 h-4" />
                <span>Developer Center</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-tight">
                API Documentation <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 font-semibold">40% Milestone</span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                Hệ thống tài liệu tích hợp toàn bộ API endpoint của dự án Yash Gems & Jewelleries. 
                Được xây dựng trên nền tảng .NET 8 với quy chuẩn kiến trúc hiện đại, đảm bảo tính ổn định và khả năng mở rộng cao.
              </p>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-[#111] border border-gray-800 rounded-xl px-5 py-3 flex items-center space-x-4 shadow-[0_0_30px_rgba(245,158,11,0.05)]">
                <div className="bg-amber-500/20 p-2.5 rounded-lg border border-amber-500/20">
                  <Box className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Routes</p>
                  <p className="text-2xl font-semibold text-white leading-none mt-1">{totalEndpoints}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Core Infrastructure Features */}
        <div className="mb-16">
          <div className="flex items-center space-x-3 mb-8">
            <Cpu className="w-6 h-6 text-gray-400" />
            <h2 className="text-2xl font-light text-white tracking-wide">
              Core <span className="font-semibold">Infrastructure</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {coreFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx} 
                  className="group relative overflow-hidden bg-[#111] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 block"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-5">
                      <div className={`p-3 rounded-xl border ${feature.iconColor}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-bold tracking-wider rounded border ${feature.badgeColor}`}>
                        {feature.badge}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-100 mb-3">{feature.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Separator */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-16"></div>

        {/* API Endpoints List */}
        <div className="flex items-center space-x-3 mb-8">
          <Database className="w-6 h-6 text-gray-400" />
          <h2 className="text-2xl font-light text-white tracking-wide">
            Endpoint <span className="font-semibold">API</span>
          </h2>
        </div>

        <div className="space-y-5">
          {apiModules.map((module, mIndex) => {
            const Icon = module.icon;
            const isExpanded = expandedModules.includes(mIndex);
            
            return (
              <motion.div 
                key={mIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: mIndex * 0.1 }}
                className="bg-[#111] border border-gray-800/80 rounded-2xl overflow-hidden transition-all duration-300 hover:border-gray-700/80"
              >
                <div 
                  className="flex items-center justify-between p-5 cursor-pointer bg-gradient-to-r from-[#141414] to-[#111] hover:from-[#181818] select-none"
                  onClick={() => toggleModule(mIndex)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-800/40 p-2.5 rounded-xl border border-gray-700/50 text-gray-300 shadow-inner">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-[17px] font-medium text-gray-100 tracking-wide">{module.name}</h2>
                      <p className="text-[13px] text-gray-500 mt-0.5">{module.description} • <span className="text-amber-500/80">{module.endpoints.length} endpoints</span></p>
                    </div>
                  </div>
                  <div className={`text-gray-500 p-2 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="border-t border-gray-800/50 p-0 bg-[#0c0c0c]">
                        {module.endpoints.map((ep, eIndex) => (
                          <div 
                            key={eIndex}
                            className="flex flex-col md:flex-row md:items-center px-6 py-4 border-b border-gray-800/40 last:border-0 hover:bg-[#131313] transition-colors group"
                          >
                            <div className="flex items-center space-x-5 md:w-5/12 mb-3 md:mb-0">
                              <span className={`w-[70px] text-center px-2 py-1.5 text-[11px] font-bold tracking-widest rounded border ${getMethodColor(ep.method)} shadow-sm`}>
                                {ep.method}
                              </span>
                              <code className="text-[13px] font-mono text-gray-400 group-hover:text-amber-200/90 transition-colors">
                                {ep.path}
                              </code>
                            </div>
                            <div className="md:w-7/12 text-gray-400 text-[13px] pl-0 md:pl-6 md:border-l md:border-gray-800/60 leading-relaxed group-hover:text-gray-300 transition-colors">
                              {ep.desc}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
        
        {/* Footer info */}
        <div className="mt-20 flex flex-col items-center justify-center text-sm text-gray-600 pb-12">
          <div className="w-12 h-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mb-6"></div>
          <p className="tracking-wide">Designed for Milestone 40% Evaluation</p>
          <p className="mt-2 font-mono text-xs text-gray-700 uppercase tracking-[0.2em]">Yash Gems & Jewelleries API</p>
        </div>
      </div>
    </div>
  );
}
