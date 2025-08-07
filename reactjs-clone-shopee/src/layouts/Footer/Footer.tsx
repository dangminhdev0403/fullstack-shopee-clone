const countries = [
  { name: "Singapore", href: "#" },
  { name: "Indonesia", href: "#" },
  { name: "Thái Lan", href: "#" },
  { name: "Malaysia", href: "#" },
  { name: "Việt Nam", href: "#" },
  { name: "Philippines", href: "#" },
  { name: "Brazil", href: "#" },
  { name: "México", href: "#" },
  { name: "Colombia", href: "#" },
  { name: "Chile", href: "#" },
  { name: "Đài Loan", href: "#" },
];

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-gray-200 to-gray-100 text-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Logo and copyright */}
          <div className="flex flex-col items-center lg:items-start">
            <p className="mt-4 text-sm">
              © 2025 Shopee. Tất cả các quyền được bảo lưu.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-col items-center lg:items-start">
            <h3 className="text-lg font-semibold">Liên kết nhanh</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-orange-200">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-200">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-200">
                  Điều khoản dịch vụ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-200">
                  Trung tâm trợ giúp
                </a>
              </li>
            </ul>
          </div>

          {/* Countries */}
          <div className="flex flex-col items-center lg:items-start">
            <h3 className="text-lg font-semibold">Quốc gia & Khu vực</h3>
            <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm lg:justify-start">
              {countries.map((country) => (
                <a
                  key={country.name}
                  href={country.href}
                  className="hover:text-orange-200"
                >
                  {country.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-400 pt-6 text-center text-xs">
          <p>
            Shopee - Nền tảng thương mại điện tử hàng đầu Đông Nam Á & Đài Loan
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
