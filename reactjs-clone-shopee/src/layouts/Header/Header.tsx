import { BorderRight } from "@components/Icon";
import Logo from "@components/Icon/Logo";
import { FiSearch } from "react-icons/fi";

import { DropdownMenu, ItemDropProfile } from "@components/Dropdown";
import ItemDropCard from "@components/Dropdown/ItemDropCard";
import {
  faFacebook,
  faSquareInstagram,
} from "@fortawesome/free-brands-svg-icons";
import {
  faBell,
  faCartShopping,
  faChevronDown,
  faCircleQuestion,
  faEarthAsia,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLogOutMutation } from "@redux/api/authApi";
import { useGetCartQuery } from "@redux/api/cartApi";
import { authSlice } from "@redux/slices/authSlice";
import { RootState } from "@redux/store";
import { ROUTES } from "@utils/constants/route";
import ErrorResponse from "@utils/constants/types/errors.response";
import { language } from "@utils/items.dropdown";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router";
import { toast } from "react-toastify";

const Header = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [logOut] = useLogOutMutation();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAmdmin = (user?.roles?.map((r) => r.name) || []).every(
    (role) => role === "ROLE_ADMIN",
  );
  console.log(user);

  console.log(isAmdmin);

  const { data: cart } = useGetCartQuery();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tìm kiếm:", query);
    // Thực hiện tìm kiếm tại đây
  };

  const handleProfileClick = async (value: string) => {
    switch (value) {
      case "profile":
        break;
      case "order":
        break;
      case "logout": {
        try {
          await logOut({}).unwrap();

          dispatch(authSlice.actions.setLogOut());
          toast.success("Đăng xuất thành công");
          navigate(ROUTES.LOGIN);
        } catch (error) {
          const err = error as ErrorResponse;
          toast.error(err?.data?.message ?? "Có lỗi xảy ra");
        }

        break;
      }
      default:
        break;
    }
  };

  const handleCartClick = (idCard: string) => {
    console.log("Item clicked:", idCard);
  };
  return (
    <header className="max-w-6xl bg-[#fb5831] lg:max-w-full">
      <nav className="hidden justify-around pt-1.5 text-sm font-medium text-white lg:flex">
        <div className="flex gap-1">
          {isAmdmin ? (
            <NavLink to={ROUTES.ADMIN.BASE} className="relative mr-2 pr-2">
              Kênh Người Bán <BorderRight />{" "}
            </NavLink>
          ) : (
            <NavLink to={"/sellers"} className="relative mr-2 pr-2">
              Trở thành Người bán Shopee <BorderRight />{" "}
            </NavLink>
          )}

          <NavLink to={"/download"} className="relative mr-2 pr-2">
            Tải ứng dụng <BorderRight />{" "}
          </NavLink>
          <NavLink to={"/connect"}>Kết nối</NavLink>
          <NavLink to={"/face1"} className={"ml-2"}>
            <FontAwesomeIcon icon={faFacebook} />{" "}
          </NavLink>
          <NavLink to={"/fa1ce"} className={"ml-2"}>
            <FontAwesomeIcon icon={faSquareInstagram} />{" "}
          </NavLink>
        </div>
        <div className="flex gap-1">
          <NavLink to={"/noti"} className="relative mr-2 pr-2">
            <FontAwesomeIcon icon={faBell} className="mr-1" />
            Thông báo
          </NavLink>
          <NavLink to={"/question"} className="relative mr-2 pr-2">
            <FontAwesomeIcon icon={faCircleQuestion} className="mr-1" />
            Hỗ Trợ
          </NavLink>
          <div className="mr-2 pr-2">
            <DropdownMenu
              label="Tiếng Việt"
              items={language}
              icon={<FontAwesomeIcon icon={faEarthAsia} />}
              renderItem={(item) => (
                <ItemDropProfile
                  name={item.name}
                  value={item.value}
                  onItemClick={(value) => {
                    console.log("Ngôn ngữ được chọn:", value);
                  }}
                />
              )}
            />
          </div>
          {auth.isAuthenticated ? (
            <DropdownMenu
              label={auth.user?.name}
              icon={<FontAwesomeIcon icon={faChevronDown} />}
              items={[
                { id: 2, name: "Trang cá nhân", value: "profile" },
                { id: 1, name: "Đăng xuất", value: "logout" },
              ]}
              renderItem={(item) => (
                <ItemDropProfile
                  key={item.id}
                  name={item.name}
                  value={item.value}
                  onItemClick={handleProfileClick}
                />
              )}
            />
          ) : (
            <div>
              <NavLink to={ROUTES.REGISTER} className="relative mr-2 pr-2">
                Đăng Ký <BorderRight />{" "}
              </NavLink>
              <NavLink to={ROUTES.LOGIN}>Đăng Nhập </NavLink>
            </div>
          )}
        </div>
      </nav>
      <div className="flex w-full items-center px-2 py-2.5 pb-7 lg:justify-between lg:px-40">
        <div className="flex w-full items-end justify-center gap-3">
          <Link to={ROUTES.HOME}>
            <Logo />
          </Link>
          <div className="mx-auto mt-4 w-full max-w-3xl">
            <form
              onSubmit={handleSubmit}
              className="flex overflow-hidden rounded-md bg-white shadow-sm"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Shopee bao ship 0Đ - Đăng ký ngay!"
                className="flex-grow px-4 py-2 text-gray-700 outline-none"
              />
              <button
                type="submit"
                title="Search"
                className="flex cursor-pointer items-center justify-center border-4 border-white bg-[#f53d2d] px-4 text-white transition hover:opacity-90"
              >
                <FiSearch size={15} />
              </button>
            </form>
          </div>

          <div className="group mr-auto min-w-10 cursor-pointer">
            {auth.isAuthenticated && (
              <DropdownMenu
                label={`${cart?.cartDetails?.length ?? 0}`}
                icon={
                  <FontAwesomeIcon
                    icon={faCartShopping}
                    size="lg"
                    className="relative z-20 my-auto rounded-full border border-white p-2 text-white"
                  />
                }
                isCard={true}
                items={cart?.cartDetails || []}
                popsition="ml-[51px] w-[300px] left-[-19rem]"
                renderItem={(item) => (
                  <ItemDropCard
                    id={item.id.toString()}
                    name={item.product.name}
                    price={item.product.price}
                    imageUrl={item.product.imageUrl}
                    onItemClick={(id) => handleCartClick(id)}
                  />
                )}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
