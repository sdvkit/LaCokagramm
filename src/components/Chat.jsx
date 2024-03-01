import React, { useContext } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const { data } = useContext(ChatContext);
  const navigate = useNavigate();

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        
        { 
          data === null || data === undefined || Object.keys(data.user).length === 0 ? (
            <div />
          ) : (
            <div className="chatIcons" onClick={() => {
              navigate(`profile/${data.user.uid}`)
            }}>
              <button className="button">
                Go to {data.user?.displayName}'s profile
              </button>
            </div>
          )
        }

      </div>
      <Messages />
      <Input/>
    </div>
  );
};

export default Chat;
