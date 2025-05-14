import { useEffect, useState, useRef } from "react";

import ReactMarkdown from "react-markdown";
import { Button as AntdButton } from "antd";

import { WindowInput, Uploader } from "../index";
import {
  ChatHeaderIcon,
  ChatBotIcon,
  ChatUserIcon,
  SampleImageIcon,
} from "../../svg";

import { useUUID } from "../../context/UUIDContext";

import "./chatWindow.scss";

const ChatWindow = (props) => {
  const { uuid, refreshUUID } = useUUID();

  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sampleImages, setSampleImages] = useState(false);
  const [chat, setChat] = useState([
    {
      author: "bot",
      type: "text",
      images: [],
      content:
        "Welcome to the Radiology Assistant. Upload a scan to get started!",
    },
  ]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const updateChat = (value, author = "bot") => {
    const textMessages = value
      ?.filter((item) => item?.type === "text") // Keep only text-type items
      .map((item) => item?.content) // Extract the content
      .join("");

    const images = value?.filter((item) => item?.type === "image") || [];

    setChat((prev) => [
      ...prev,
      {
        author: author,
        type: "text",
        images: images,
        content: textMessages,
      },
    ]);

    setMessages([]);
    scrollToBottom();
  };

  useEffect(() => {
    messages.length > 1 && updateChat(messages);
  }, [messages]);

  const imagesList = [
    {
      key: "sample-image-1",
      src: "/sample-image-1.png",
    },
    {
      key: "sample-image-2",
      src: "/sample-image-2.png",
    },
    {
      key: "sample-image-3",
      src: "/sample-image-3.png",
    },
    {
      key: "sample-image-4",
      src: "/sample-image-4.png",
    },
    {
      key: "sample-image-5",
      src: "/sample-image-5.png",
    },
    {
      key: "sample-image-6",
      src: "/sample-image-6.png",
    },
    {
      key: "sample-image-7",
      src: "/sample-image-7.png",
    },
  ];

  const SampleImage = ({ src }) => {
    const uploaderRef = useRef();

    const handleSampleClick = () => {
      if (uploaderRef.current) {
        uploaderRef.current.triggerSampleUpload(src);
      }
    };

    return (
      <>
        <figure className="sample-image-wrapper" onClick={handleSampleClick}>
          <img className="sample-image" src={src} />

          <AntdButton
            className="sample-image-button"
            icon={<SampleImageIcon />}
            style={{
              width: 24,
              height: 24,
            }}
          />
        </figure>

        <section className="uploader-sample-images">
          <Uploader
            ref={uploaderRef}
            userID={uuid}
            message=""
            setMessages={setMessages}
            setLoading={setLoading}
            setSampleImages={setSampleImages}
            setChat={setChat}
            updateChat={updateChat}
          />
        </section>
      </>
    );
  };

  const handleNewChat = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/clear?user_id=${uuid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((response) => response.json());

      if (response) {
        setChat([
          {
            author: "bot",
            type: "text",
            images: [],
            content:
              "Welcome to the Radiology Assistant. Upload a scan to get started!",
          },
        ]);
        refreshUUID();
        setLoading(false);
        setSampleImages(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="chat-window-container">
      {/* <button onClick={refreshUUID}>regresh</button> */}
      <section className="chat-window-header">
        <article className="chat-window-heading">
          <ChatHeaderIcon />

          <h3 className="chat-header-heading">Radiology Assistant</h3>
        </article>

        {chat.length > 1 && (
          <AntdButton
            className="custom-new-chat-button"
            onClick={handleNewChat}
          >
            + New Chat
          </AntdButton>
        )}
      </section>

      <section className="chat-window-messages-main-container">
        <section className="chat-container">
          {chat?.map((item, index) => {
            const { content, author } = item;

            return (
              <section
                key={`message-${index}`}
                className={`chat-message-container ${
                  author !== "bot" && "right"
                }`}
              >
                <span className="message-user-icon">
                  {author !== "bot" ? <ChatUserIcon /> : <ChatBotIcon />}
                </span>

                <article className="message-content-wrapper">
                  <section className="chat-images-wrapper">
                    {item?.images?.length > 0 && (
                      <section className="images-list-wrapper">
                        {item?.images?.map((img, index) => (
                          <img
                            key={`img-${index}`}
                            className="chat-image"
                            src={`data:image/png;base64,${img.content}`}
                            alt="Chat image"
                          />
                        ))}
                      </section>
                    )}

                    <article className="message-content">
                      <ReactMarkdown>{content}</ReactMarkdown>
                    </article>
                  </section>

                  <p className="message-time">20:32</p>
                </article>
              </section>
            );
          })}

          <div ref={messagesEndRef} />
        </section>

        {!sampleImages && (
          <section className="initial-upload-container">
            <Uploader
              userID={uuid}
              message=""
              setMessages={setMessages}
              setLoading={setLoading}
              setSampleImages={setSampleImages}
              setChat={setChat}
              updateChat={updateChat}
            />

            <p className="initial-label">Upload these images to AI analysis</p>

            <section className="sample-image-container">
              {imagesList.map((img) => (
                <SampleImage key={img.key} src={img.src} />
              ))}
            </section>
          </section>
        )}
      </section>

      {sampleImages && (
        <WindowInput
          userID={uuid}
          updateChat={updateChat}
          setMessages={setMessages}
        />
      )}
    </section>
  );
};

export default ChatWindow;
