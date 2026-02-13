import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

function Sidebar() {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  console.log(selectedUser);

  const { logout, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState(false);

  const navigate = useNavigate();

  const filturedUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase()),
      )
    : users;

  console.log(filturedUsers);

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ""}`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40" />
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="Menu"
              className="max-h-5 cursor-pointer"
            />
            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md  bg-blue-900 border border-gray-600 text-gray-100 hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p onClick={() => logout()} className="cursor-pointer text-sm">
                Logout
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-900/33 rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="Search" className="w-3" />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search User..."
          />
        </div>
      </div>

      <div className="flex flex-col">
        {filturedUsers?.map((user, index) => (
          <div
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
            }}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && "bg-blue-900/33"}`}
            key={index}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt=""
              className="w-8.75 aspect-square rounded-full"
            />
            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>
              {onlineUsers.includes(user._id) ? (
                <span className="text-green-400 text-xs">Online</span>
              ) : (
                <span className="text-neutral-400 text-xs">Offline</span>
              )}
            </div>
            {unseenMessages[user?._id] > 0 && (
              <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-blue-500 text-white">
                {unseenMessages[user?._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
