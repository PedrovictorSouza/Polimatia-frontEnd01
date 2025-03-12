import React, { useState, useEffect, useRef } from "react";
import {
  ChatContainer,
  ChatHeader,
  MascotContainer,
  MessagesContainer,
  Message,
  UserMessage,
  BotMessage,
  InputContainer,
  InputField,
  SendButton
} from "./styles/ChatBot.styles";

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([
    { text: "Olá! me chamo galileu, como posso te ajudar?", sender: "bot" } // 🔹 O mascote já começa falando
  ]);
  const [input, setInput] = useState("");
  const [hasTyped, setHasTyped] = useState(false);
  const [mascotTalking, setMascotTalking] = useState(true);
  const [mascotFrame, setMascotFrame] = useState(0);
  const [messageWidths, setMessageWidths] = useState<{ [key: number]: number }>({});

  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!measureRef.current) return; // 🔹 Sai da função se measureRef.current for null
  
    const index = messages.length - 1;
    setMessageWidths((prev) => ({
      ...prev,
      [index]: measureRef.current!.offsetWidth, // 🔹 Use "!" para garantir que não seja null
    }));
  }, [messages]);
  
  useEffect(() => {
    if (mascotTalking) {
      const interval = setInterval(() => {
        setMascotFrame((prev) => (prev + 1) % 4);
      }, 300);

      // 🔹 O mascote para de falar depois de 1.5s
      const stopTalkingTimeout = setTimeout(() => {
        setMascotTalking(false);
        setMascotFrame(0);
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(stopTalkingTimeout);
      };
    }
  }, [mascotTalking]);

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    if (!hasTyped) setHasTyped(true);

    const userMessage = { text: input, sender: "user" as "user" | "bot" }; // 🔹 Garantindo que sender seja um dos tipos permitidos

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      setMascotTalking(true); // 🔹 O mascote começa a falar novamente

      const botText = "Boy, sei não visse. pergunte outra coisa na moral.";
      setMessages((prev) => [...prev, { text: "", sender: "bot" }]);

      let i = 0;

      const interval = setInterval(() => {
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;

          if (newMessages[lastIndex].sender === "bot") {
            newMessages[lastIndex] = {
              ...newMessages[lastIndex],
              text: botText.slice(0, i + 1),
            };
          }

          return newMessages;
        });

        i++;
        if (i >= botText.length) {
          clearInterval(interval);
          setTimeout(() => {
            setMascotTalking(false);
            setMascotFrame(0);
          }, 500);
        }
      }, 30);
    }, 1000);
  };

  const getMascotImage = () => {
    if (mascotFrame === 1) return "/assets/mascot-t1.svg";
    if (mascotFrame === 2) return "/assets/mascot-t2.svg";
    if (mascotFrame === 3) return "/assets/mascot-t1.svg";
    return "/assets/mascot.svg";
  };

  return (
    <ChatContainer>
      <ChatHeader hasTyped={hasTyped}>
        {hasTyped ? "Quem é a polimat" : ""}
      </ChatHeader>

      <MascotContainer firstAppearance={false}>
        <img src={getMascotImage()} alt="Mascote" width="100" height="100" />
      </MascotContainer>


      <MessagesContainer>
        {messages.map((msg, index) => (
          <Message key={index} isUser={msg.sender === "user"}>
            {msg.sender === "user" ? (
              <UserMessage>{msg.text}</UserMessage>
            ) : (
              <BotMessage
  style={{
    minWidth: messageWidths[index] ? `${messageWidths[index]}px` : "auto",
    opacity: msg.text.length > 0 ? 1 : 0, // 🔹 Esconde até a animação começar
  }}
  ref={index === messages.length - 1 ? measureRef : null}
>
  {msg.text}
</BotMessage>
            )}
          </Message>
        ))}
      </MessagesContainer>

      <InputContainer>
        <InputField
          type="text"
          value={input}
          placeholder="Digite sua mensagem..."
          onChange={(e) => {
            setInput(e.target.value);
            if (e.target.value.length > 0) setHasTyped(true);
          }}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <SendButton onClick={handleSendMessage}>Enviar</SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatBot;
