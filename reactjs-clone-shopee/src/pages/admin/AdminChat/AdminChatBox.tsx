import { useChatSocket } from "@hooks/useChatSocket";
import MessageBox from "@pages/admin/AdminChat/MessageBox";
import {
  ConversationDTO,
  useGetAllConversationsQuery,
} from "@redux/api/chatApi";
import { Search, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function AdminChatBox() {
  const { connected } = useChatSocket();

  const { data: conversations, isLoading } = useGetAllConversationsQuery();

  const [selectedConversation, setSelectedConversation] =
    useState<ConversationDTO | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  //   const updatedConversations = conversations.map((conv) =>
  //     conv.id === selectedConversation.id
  //       ? {
  //           ...conv,
  //           messages: [...conv.messages, newMsg],
  //           lastMessage: newMessage,
  //           lastMessageTime: new Date(),
  //         }
  //       : conv,
  //   );

  //   setConversations(updatedConversations);
  //   setSelectedConversation({
  //     ...selectedConversation,
  //     messages: [...selectedConversation.messages, newMsg],
  //   });
  //   setNewMessage("");
  // };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredConversations = (conversations ?? []).filter((conv) =>
    conv.userName.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="flex h-[600px] w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
      {/* Sidebar - Danh sach cuoc tro chuyen */}
      <div
        className={`${
          showSidebar ? "flex" : "hidden"
        } w-full flex-col border-r border-gray-200 bg-gray-50 md:flex md:w-80`}
      >
        {/* Header sidebar */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-orange-500 to-red-500 p-4">
          <h2 className="mb-3 text-lg font-bold text-white">Tin Nhắn CSKH</h2>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/70" />
            <input
              type="text"
              placeholder="Tim kiem..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-white/30 bg-white/20 py-2 pr-3 pl-9 text-white outline-none placeholder:text-white/70 focus:bg-white/30"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => {
                setSelectedConversation(conv);

                setShowSidebar(false);
              }}
              className={`flex cursor-pointer items-center gap-3 border-b border-gray-100 p-4 transition-colors hover:bg-gray-100 ${
                selectedConversation?.id === conv.id ? "bg-orange-50" : ""
              }`}
            >
              <div className="relative">
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <img
                    src={conv?.userAvatar || "/placeholder.svg"}
                    alt={conv?.userName || "User avatar"}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const img = e.currentTarget;
                      img.style.display = "none";
                      img.nextElementSibling?.classList.remove("hidden");
                    }}
                  />

                  <div className="absolute inset-0 flex hidden items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 text-lg font-semibold text-white">
                    {(conv?.userName || "?").charAt(0).toUpperCase()}
                  </div>
                </div>

                <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">
                    {conv.userName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTime(new Date(conv.lastMessageTime))}
                  </span>
                </div>
                <p className="truncate text-sm text-gray-500">
                  {conv.lastMessage}
                </p>
              </div>
              {/* {conv.unreadCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-xs font-bold text-white">
                  {conv.unreadCount}
                </span>
              )} */}
            </div>
          ))}
        </div>
      </div>

      {/* Khu vuc chat */}
      <div
        className={`${!showSidebar ? "flex" : "hidden"} flex-1 flex-col md:flex`}
      >
        {selectedConversation ? (
          <>
            <MessageBox
              scrollToBottom={scrollToBottom}
              messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
              scrollAreaRef={scrollAreaRef as React.RefObject<HTMLDivElement>}
              selectedConversation={selectedConversation}
            />
          </>
        ) : (
          /* Trang thai chua chon conversation */
          <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 p-8">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500">
              <Send className="h-10 w-10 text-white" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Chào mừng đến với Shopee Chat Admin
            </h3>
            <p className="text-center text-gray-500">
              Vui lòng chọn một cuộc trò chuyện từ danh sách hoặc chờ tin nhắn
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
