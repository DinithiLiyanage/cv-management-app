import { useAuth } from "../contexts/authContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { userData, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="flex justify-between items-center bg-gradient-to-r from-[#E6F7FF] to-[#B8E7FF] px-5 py-8">
      <div className="flex items-center">
        <img
          src="/logo-sign.png"
          alt="ApplyX Logo"
          width={40}
          height={40}
          className="mr-3"
          style={{ objectFit: "contain" }}
        />
        <h3 className="text-xl text-black tracking-tight">
          Welcome back, {userData?.name}
        </h3>
      </div>
      <button
        onClick={handleLogout}
        className="bg-[#0090D9] hover:bg-[#007bb5] text-white text-sm font-medium py-2 px-6 rounded transition-colors duration-200 flex-shrink-0"
      >
        Logout
      </button>
    </div>
  );
}
