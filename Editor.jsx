import "./Editor.css";

import { useEffect, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import axios from "axios";
import { io } from "socket.io-client";
import "./Editor.css";

const socket = io("http://localhost:5000");

export default function Editor() {
  const [code, setCode] = useState("");
  const [aiResponse, setAIResponse] = useState("");

  useEffect(() => {
    socket.emit("join-room", { roomId: "college-room" });

    socket.on("sync-code", (savedCode) => {
      setCode(savedCode);
    });

    return () => socket.off("sync-code");
  }, []);

  const handleChange = (value) => {
    setCode(value);
    socket.emit("code-change", {
      roomId: "college-room",
      code: value,
    });
  };

  const getAIHelp = async () => {
    const res = await axios.post("http://localhost:5000/ai-suggest", {
      code,
    });
    setAIResponse(res.data.suggestion);
  };

  return (
  <div className="editor-container">
    <div className="code-section">
      <MonacoEditor
        height="100%"
        language="javascript"
        theme="vs-dark"
        value={code}
        onChange={handleChange}
      />
    </div>

    <div className="ai-section">
      <button className="ai-button" onClick={getAIHelp}>
        Get AI Suggestion
      </button>

      <div className="ai-output">
        {aiResponse || "AI suggestions will appear here..."}
      </div>
    </div>
  </div>
);

}
