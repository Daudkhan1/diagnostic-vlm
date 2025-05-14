import { useState } from "react";

import { Button, Input } from "antd";

import { ArrowUpIcon } from "../../svg";

import "./windowInput.scss";

const WindowInput = (props) => {
  const { userID, updateChat, setMessages } = props;

  const [input, setInput] = useState("");

  const handleChange = (e) => {
    setInput(() => e?.target?.value);
  };

  const handleClick = async () => {
    const payload = {
      user_id: userID,
      message: input,
      image: [],
    };

    updateChat(
      [
        {
          type: "text",
          content: input,
        },
      ],
      "api"
    );

    setInput("");

    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok || !response.body) {
      throw new Error("Failed to connect to stream");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = "";
    const finalMessages = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        if (line.trim()) {
          try {
            const parsed = JSON.parse(line);
            finalMessages.push({
              type: parsed.type,
              content: parsed.content,
            });
          } catch (err) {
            console.error("Failed to parse JSON line:", line, err);
          }
        }
      }
    }

    setMessages((prev) => [...prev, ...finalMessages]);
  };

  return (
    <article className="chat-window-input">
      <section className="chat-input-field-container">
        <Input
          placeholder="Ask specific questions about this scan"
          className="chat-input-field"
          style={{
            height: 49,
          }}
          onChange={handleChange}
          value={input}
        />

        {input.length > 0 && (
          <Button
            icon={ArrowUpIcon}
            className="input-field-button"
            onClick={handleClick}
          />
        )}
      </section>
    </article>
  );
};

export default WindowInput;
