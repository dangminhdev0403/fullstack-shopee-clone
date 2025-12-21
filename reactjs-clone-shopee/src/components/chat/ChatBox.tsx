import { chatSlice } from "@redux/slices/chatSlice";
import { closeChatBox } from "@redux/slices/chatUiSlice";
import { RootState } from "@redux/store";
import { MessageCircle, OctagonX, Send } from "lucide-react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ChatBox = ({
  orderId,
  shopId,
  shopName,
}: {
  orderId: string;
  shopId: string;
  shopName: string;
}) => {
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const messages = useSelector((s: RootState) => s.chat.messages);

  const sendMessage = () => {
    if (!input.trim()) return;

    dispatch(
      chatSlice.actions.addMessage({
        sender: "You",
        receiver: shopId,
        content: input,
        senderType: "USER",
      }),
    );

    setInput("");
  };

  return (
    <div className="flex h-[480px] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white/80 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl">
      {/* HEADER Shopee */}
      <div className="relative flex items-center gap-4 bg-gradient-to-r from-[#EE4D2D] via-[#FF6A3D] to-[#FF8B5F] px-5 py-4">
        <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi00LTJoLTRjLTIgMC00IDItNCAyczIgNCAyIDRoNGMyIDAgNC0yIDQtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 shadow-lg ring-2 ring-white/30 backdrop-blur-sm">
          <MessageCircle className="h-6 w-6 text-white" />
        </div>

        <div className="relative flex-1">
          <h2 className="text-lg font-bold tracking-tight text-white">
            {shopName}
          </h2>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-300 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-300"></span>
            </span>
            <p className="text-xs font-medium text-white/80">Đang hoạt động</p>
          </div>
        </div>
        <button
          onClick={() => dispatch(closeChatBox(shopId))}
          title="Canncel"
          className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/20"
        >
          <OctagonX className="h-10 w-10 text-white" />
        </button>
      </div>

      {/* CHAT BODY */}
      <div
        ref={chatRef}
        className="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-[#FFF7F3] to-white p-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-orange-300 [&::-webkit-scrollbar-track]:bg-transparent"
      >
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-pink-100">
              <MessageCircle className="h-8 w-8 text-[#EE4D2D]" />
            </div>
            <p className="text-sm font-medium text-gray-500">
              Bắt đầu cuộc trò chuyện
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Nhập tin nhắn để được hỗ trợ
            </p>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex animate-[fadeIn_0.3s_ease-out] ${
              m.sender === "You" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`group relative max-w-[75%] px-4 py-3 text-sm transition-all duration-200 ${
                m.sender === "You"
                  ? "rounded-2xl rounded-br-md bg-gradient-to-br from-[#EE4D2D] to-[#FF6A3D] text-white shadow-lg shadow-orange-200"
                  : "rounded-2xl rounded-bl-md border border-gray-100 bg-white text-gray-800 shadow-md shadow-gray-100"
              }`}
            >
              <p
                className={`mb-1 text-[10px] font-semibold tracking-wider uppercase ${
                  m.sender === "You" ? "text-white/70" : "text-[#EE4D2D]"
                }`}
              >
                {m.sender}
              </p>
              <p className="leading-relaxed">{m.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="border-t border-gray-100 bg-white/50 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? sendMessage() : null)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:border-orange-300 focus:ring-4 focus:ring-orange-100 focus:outline-none"
          />
          <button
            title="Send"
            onClick={sendMessage}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-[#EE4D2D] to-[#FF6A3D] text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-orange-300 active:scale-95 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
