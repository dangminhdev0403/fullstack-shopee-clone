import ChatBox from "@components/chat/ChatBox";
import { useChatSocket } from "@hooks/useChatSocket";
import { RootState } from "@redux/store";
import { useSelector } from "react-redux";

const ChatBoxContainer = () => {
  const { connected } = useChatSocket();

  const openBoxes = useSelector((s: RootState) => s.chatUi.openBoxes);

  return (
    <div className="fixed right-4 bottom-4 z-50 flex gap-3">
      {openBoxes.map((box) => (
        <ChatBox
          key={box.orderId}
          orderId={box.orderId}
          shopId={box.shopId}
          shopName={box.shopName}
        />
      ))}
    </div>
  );
};

export default ChatBoxContainer;
