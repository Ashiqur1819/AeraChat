import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";

function HomePage() {
  const [selectedUser, setSelectedUser] = useState(false);

  return (
    <div className="backdrop-blur-lg border w-full h-screen sm:px-[15%] sm:py-[5%] bg-blue-900/10">
      <div
        className={`backdrop-blur-lg border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid grid-cols-1 relative ${selectedUser ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1.2fr_2fr_.8fr]" : "md:grid-cols-2"}`}
      >
        <Sidebar/>
        <ChatContainer/>
        <RightSidebar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </div>
    </div>
  );
}

export default HomePage;
