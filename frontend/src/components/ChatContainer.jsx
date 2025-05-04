import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser?._id, getMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const Message = ({ message }) => {
    const { authUser } = useAuthStore();
    
    // Compare string IDs to ensure consistent comparison
    const isSentByMe = message.senderId?._id === authUser?._id || 
                      message.senderId === authUser?._id;
  
    return (
      <div className={`flex items-end gap-3 ${
        isSentByMe ? "flex-row-reverse" : "flex-row"
      } w-full`}>
        <div className="flex-shrink-0">
          <img
            src={isSentByMe 
              ? authUser?.profilePicture || "/avatar.png" 
              : selectedUser?.profilePicture || "/avatar.png"}
            alt="profile pic"
            className="size-8 rounded-full border"
          />
        </div>
  
        <div className={`flex flex-col ${
          isSentByMe ? "items-end" : "items-start"
        } max-w-[60%]`}>
          <div className={`px-4 py-2 ${
            isSentByMe
              ? "bg-[#7C3AED] text-white rounded-l-2xl rounded-tr-2xl"
              : "bg-[#2D3748] text-white rounded-r-2xl rounded-tl-2xl"
          }`}>
            {message.image && (
              <img
                src={message.image}
                alt="Attachment"
                className="max-w-full rounded-md mb-2"
                loading="lazy"
              />
            )}
            {message.text && <p className="break-words">{message.text}</p>}
          </div>
          <span className="text-xs text-gray-500 mt-1">
            {formatMessageTime(message.createdAt)}
          </span>
        </div>
      </div>
    );
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#1E2028]">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isMessagesLoading ? (
          <MessageSkeleton />
        ) : (
          <>
            {messages.map((message) => (
              <Message key={message._id} message={message} />
            ))}
            <div ref={messageEndRef} />
          </>
        )}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;