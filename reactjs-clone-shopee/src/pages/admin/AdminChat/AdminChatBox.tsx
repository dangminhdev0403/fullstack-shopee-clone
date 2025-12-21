"use client";

import { useChatSocket } from "@hooks/useChatSocket";
import {
  ArrowLeft,
  ImageIcon,
  MoreVertical,
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
  Video,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  isAdmin: boolean;
}

interface Conversation {
  id: string;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    userName: "Nguyen Van A",
    userAvatar: "/young-man-avatar.png",
    lastMessage: "San pham nay con hang khong shop?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 2,
    isOnline: true,
    messages: [
      {
        id: "1",
        content: "Chao shop!",
        senderId: "user1",
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        isAdmin: false,
      },
      {
        id: "2",
        content: "Chao ban, shop co the giup gi cho ban?",
        senderId: "admin",
        timestamp: new Date(Date.now() - 1000 * 60 * 8),
        isAdmin: true,
      },
      {
        id: "3",
        content: "San pham nay con hang khong shop?",
        senderId: "user1",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        isAdmin: false,
      },
    ],
  },
  {
    id: "2",
    userName: "Tran Thi B",
    userAvatar: "/young-woman-avatar.png",
    lastMessage: "Cam on shop nhieu!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 0,
    isOnline: false,
    messages: [
      {
        id: "1",
        content: "Shop oi, don hang cua minh den chua?",
        senderId: "user2",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        isAdmin: false,
      },
      {
        id: "2",
        content: "Don hang cua ban dang duoc giao, du kien chieu nay se den.",
        senderId: "admin",
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        isAdmin: true,
      },
      {
        id: "3",
        content: "Cam on shop nhieu!",
        senderId: "user2",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        isAdmin: false,
      },
    ],
  },
  {
    id: "3",
    userName: "Le Van C",
    userAvatar: "/avatar-businessman.png",
    lastMessage: "Minh muon doi size duoc khong?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 1,
    isOnline: true,
    messages: [
      {
        id: "1",
        content: "Minh muon doi size duoc khong?",
        senderId: "user3",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        isAdmin: false,
      },
    ],
  },
];

export default function AdminChatBox() {
  const { connected } = useChatSocket();

  const [conversations, setConversations] =
    useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: "admin",
      timestamp: new Date(),
      isAdmin: true,
    };

    const updatedConversations = conversations.map((conv) =>
      conv.id === selectedConversation.id
        ? {
            ...conv,
            messages: [...conv.messages, newMsg],
            lastMessage: newMessage,
            lastMessageTime: new Date(),
          }
        : conv,
    );

    setConversations(updatedConversations);
    setSelectedConversation({
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMsg],
    });
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.userName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
          <h2 className="mb-3 text-lg font-bold text-white">Tin nhan</h2>
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
                <div className="h-12 w-12 overflow-hidden rounded-full">
                  <img
                    src={
                      conv.userAvatar || "/placeholder.svg?height=48&width=48"
                    }
                    alt={conv.userName}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                  <div className="hidden h-full w-full items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 font-semibold text-white">
                    {conv.userName.charAt(0)}
                  </div>
                </div>
                {conv.isOnline && (
                  <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">
                    {conv.userName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTime(conv.lastMessageTime)}
                  </span>
                </div>
                <p className="truncate text-sm text-gray-500">
                  {conv.lastMessage}
                </p>
              </div>
              {conv.unreadCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-xs font-bold text-white">
                  {conv.unreadCount}
                </span>
              )}
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
            {/* Header chat */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-orange-500 to-red-500 p-4">
              <div className="flex items-center gap-3">
                <button
                  title="header"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/20 md:hidden"
                  onClick={() => setShowSidebar(true)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="h-10 w-10 overflow-hidden rounded-full">
                  <img
                    src={
                      selectedConversation.userAvatar ||
                      "/placeholder.svg?height=40&width=40"
                    }
                    alt={selectedConversation.userName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {selectedConversation.userName}
                  </h3>
                  <p className="text-xs text-white/80">
                    {selectedConversation.isOnline
                      ? "Dang hoat dong"
                      : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  title="header"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/20"
                >
                  <Phone className="h-5 w-5" />
                </button>
                <button
                  title="header"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/20"
                >
                  <Video className="h-5 w-5" />
                </button>
                <button
                  title="header"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/20"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Khu vuc tin nhan */}
            <div
              ref={scrollAreaRef}
              className="flex-1 overflow-y-auto bg-gray-50 p-4"
            >
              <div className="space-y-4">
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isAdmin ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        message.isAdmin
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                          : "bg-white text-gray-900 shadow-sm"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`mt-1 text-xs ${message.isAdmin ? "text-white/70" : "text-gray-400"}`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input gui tin nhan */}
            <div className="border-t border-gray-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <button
                  title="header"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-orange-500"
                >
                  <ImageIcon className="h-5 w-5" />
                </button>
                <button
                  title="header"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-orange-500"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                <button
                  title="header"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-orange-500"
                >
                  <Smile className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  placeholder="Nhap tin nhan..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
                <button
                  title="header"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
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
