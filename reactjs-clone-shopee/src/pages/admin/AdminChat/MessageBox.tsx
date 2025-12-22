import {
  chatApi,
  ChatMessage,
  ConversationDTO,
  useGetConversationsQuery,
} from "@redux/api/chatApi";
import { chatSlice } from "@redux/slices/chatSlice";
import { AppDispatch, RootState } from "@redux/store";
import {
  ArrowLeft,
  ImageIcon,
  MoreVertical,
  Paperclip,
  Phone,
  Send,
  Smile,
  Video,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const MessageBox = ({
  messagesEndRef,
  scrollAreaRef,
  selectedConversation,
  scrollToBottom,
}: {
  messagesEndRef: React.RefObject<HTMLDivElement>;
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  selectedConversation: ConversationDTO;
  scrollToBottom: () => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [newMessage, setNewMessage] = useState("");
  const idMe = useSelector((state: RootState) => state.auth.user?.id);

  const receiver = selectedConversation.id;
  const { data: messages = [], isLoading } = useGetConversationsQuery({
    receiver,
  });

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const queryArg = {
    receiver: selectedConversation.id,
  };
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const optimisticMsg: ChatMessage = {
      id: Date.now(),
      content: newMessage,
      createdAt: new Date().toISOString(),
      read: true,
      senderId: Number(idMe),
      receiverId: Number(selectedConversation.id),
    };

    // 1️⃣ optimistic message list
    dispatch(
      chatApi.util.updateQueryData("getConversations", queryArg, (draft) => {
        draft.push(optimisticMsg);
      }),
    );
    dispatch(
      chatApi.util.updateQueryData(
        "getAllConversations",
        undefined,
        (draft) => {
          const conv = draft.find((c) => c.id === selectedConversation.id);
          if (conv) {
            conv.lastMessage = optimisticMsg.content;
            conv.lastMessageTime = optimisticMsg.createdAt;
          }
        },
      ),
    );
    dispatch(
      chatSlice.actions.addMessage({
        sender: "You",
        receiver: selectedConversation.id,
        content: newMessage,
        senderType: "SHOP",
      }),
    );

    setNewMessage("");
    requestAnimationFrame(scrollToBottom);
  };
  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-orange-500 to-red-500 p-4">
        <div className="flex items-center gap-3">
          <button
            title="header"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/20 md:hidden"
            // onClick={() => setShowSidebar(true)}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
            {selectedConversation?.userAvatar ? (
              <img
                src={selectedConversation.userAvatar}
                alt={selectedConversation.userName}
                className="h-full w-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ) : (
              selectedConversation?.userName?.charAt(0).toUpperCase()
            )}
          </div>

          <div>
            <h3 className="font-semibold text-white">
              {selectedConversation.userName}
            </h3>
            {/* <p className="text-xs text-white/80">
                    {selectedConversation.isOnline
                      ? "Dang hoat dong"
                      : "Offline"}
                  </p> */}
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
          {isLoading && (
            <div className="text-center text-sm text-gray-400">
              Đang tải tin nhắn...
            </div>
          )}

          {messages.map((msg) => {
            const isMe = msg.senderId === Number(idMe);

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isMe
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                      : "bg-white text-gray-900 shadow-sm"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>

                  <p
                    className={`mt-1 text-xs ${
                      isMe ? "text-white/70" : "text-gray-400"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
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
  );
};

export default MessageBox;
