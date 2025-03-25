"use client";
import { useState, useRef, useEffect } from "react";
import {
  Title,
  Text,
  Container,
  Button,
  Group,
  Paper,
  Tooltip,
  Space,
  Anchor,
  Box,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";

const ANSI_COLORS = {
  30: { color: "#4f545c", name: "Dark Gray (33%)" },
  31: { color: "#dc322f", name: "Red" },
  32: { color: "#859900", name: "Yellowish Green" },
  33: { color: "#b58900", name: "Gold" },
  34: { color: "#268bd2", name: "Light Blue" },
  35: { color: "#d33682", name: "Pink" },
  36: { color: "#2aa198", name: "Teal" },
  37: { color: "#ffffff", name: "White" },
  40: { bg: "#002b36", name: "Blueish Black" },
  41: { bg: "#cb4b16", name: "Rust Brown" },
  42: { bg: "#586e75", name: "Gray (40%)" },
  43: { bg: "#657b83", name: "Gray (45%)" },
  44: { bg: "#839496", name: "Light Gray (55%)" },
  45: { bg: "#6c71c4", name: "Blurple" },
  46: { bg: "#93a1a1", name: "Light Gray (60%)" },
  47: { bg: "#fdf6e3", name: "Cream White" },
};

export default function ColoredTextGenerator() {
  const [content, setContent] = useState(
    `Welcome to Rebane's Discord Colored Text Generator!`
  );
  const [selection, setSelection] = useState(null);
  const contentEditableRef = useRef(null);
  const clipboard = useClipboard();
  const [copyCount, setCopyCount] = useState(0);

  const applyStyle = (ansiCode) => {
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText) return;

    const span = document.createElement("span");
    span.className = `ansi-${ansiCode}`;
    span.textContent = selectedText;

    range.deleteContents();
    range.insertNode(span);
    if (contentEditableRef.current) {
      setContent(contentEditableRef.current.innerHTML);
    }
  };

  const handleCopy = () => {
    if (!contentEditableRef.current) return;

    const html = contentEditableRef.current.innerHTML;
    const ansiText = convertHtmlToAnsi(html);
    const discordFormatted = `\`\`\`ansi\n${ansiText}\n\`\`\``;

    clipboard.copy(discordFormatted);
    setCopyCount((prev) => prev + 1);
  };

  const convertHtmlToAnsi = (html) => {
    let text = html
      .replace(/<br>/g, "\n")
      .replace(
        /<span class="ansi-(\d+)">(.*?)<\/span>/g,
        (match, code, content) => {
          return `\x1b[${code}m${content}\x1b[0m`;
        }
      )
      .replace(/<[^>]+>/g, "");
    return text;
  };

  useEffect(() => {
    const handleSelection = () => {
      setSelection(window.getSelection());
    };

    document.addEventListener("selectionchange", handleSelection);
    return () =>
      document.removeEventListener("selectionchange", handleSelection);
  }, []);

  const funnyCopyMessages = [
    "Copied!",
    "Double Copy!",
    "Triple Copy!",
    "Dominating!!",
    "Rampage!!",
    "Mega Copy!!",
    "Unstoppable!!",
    "Wicked Sick!!",
    "Monster Copy!!!",
    "GODLIKE!!!",
    "BEYOND GODLIKE!!!!",
  ];

  const containerStyle = {
    background: "linear-gradient(135deg, #2C2F33 0%, #23272A 100%)",
    minHeight: "100vh",
    padding: "2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const cardStyle = {
    background: "#36393F",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    padding: "2rem",
    width: "100%",
    maxWidth: "500px",
    border: "1px solid #4F545C",
  };

  const titleStyle = {
    color: "#FFFFFF",
    borderBottom: "2px solid #4F545C",
    paddingBottom: "0.5rem",
    marginBottom: "1rem",
    fontWeight: "bold",
  };

  const buttonBaseStyle = {
    transition: "all 0.3s ease",
    borderRadius: "6px",
    padding: "0.5rem 1rem",
    margin: "0.25rem",
    cursor: "pointer",
  };

  const resetButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: "#4F545C",
    color: "#FFFFFF",
    ":hover": {
      backgroundColor: "#5D6269",
    },
  };

  const boldButtonStyle = {
    ...buttonBaseStyle,
    fontWeight: 700,
    backgroundColor: "#7289DA",
    color: "#FFFFFF",
    ":hover": {
      backgroundColor: "#5E7AD3",
    },
  };

  const lineButtonStyle = {
    ...buttonBaseStyle,
    textDecoration: "underline",
    backgroundColor: "#43B581",
    color: "#FFFFFF",
    ":hover": {
      backgroundColor: "#3AA76D",
    },
  };

  const paperStyle = {
    minHeight: 200,
    textAlign: "left",
    fontFamily: "monospace",
    backgroundColor: "#2F3136",
    color: "#B9BBBE",
    border: "1px solid #202225",
    borderRadius: "8px",
    whiteSpace: "pre-wrap",
    padding: "1rem",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
    outline: "none",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <Title order={2} mb="md" style={titleStyle}>
          Create your text
        </Title>

        <Group mb="md">
          <Button onClick={() => applyStyle(0)} style={resetButtonStyle}>
            Reset All
          </Button>
          <Button onClick={() => applyStyle(1)} style={boldButtonStyle}>
            Bold
          </Button>
          <Button onClick={() => applyStyle(4)} style={lineButtonStyle}>
            Line
          </Button>
        </Group>

        <Text fw={500} style={{ color: "#FFFFFF", marginBottom: "0.5rem" }}>
          FG
        </Text>
        <Group mb="md">
          {[30, 31, 32, 33, 34, 35, 36, 37].map((code) => (
            <Tooltip label={ANSI_COLORS[code].name} key={`fg-${code}`}>
              <Button
                onClick={() => applyStyle(code)}
                style={{
                  ...buttonBaseStyle,
                  backgroundColor: ANSI_COLORS[code].color,
                  width: "40px",
                  height: "40px",
                  minWidth: 0,
                  padding: 0,
                }}
              >
                &nbsp;
              </Button>
            </Tooltip>
          ))}
        </Group>

        <Text fw={500} style={{ color: "#FFFFFF", marginBottom: "0.5rem" }}>
          BG
        </Text>
        <Group mb="md">
          {[40, 41, 42, 43, 44, 45, 46, 47].map((code) => (
            <Tooltip label={ANSI_COLORS[code].name} key={`bg-${code}`}>
              <Button
                onClick={() => applyStyle(code)}
                style={{
                  ...buttonBaseStyle,
                  backgroundColor: ANSI_COLORS[code].bg,
                  color: code >= 45 ? "#fff" : "#000",
                  width: "40px",
                  height: "40px",
                  minWidth: 0,
                  padding: 0,
                }}
              >
                &nbsp;
              </Button>
            </Tooltip>
          ))}
        </Group>

        <Paper
          ref={contentEditableRef}
          contentEditable
          dangerouslySetInnerHTML={{ __html: content }}
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
          p="md"
          mb="md"
          style={paperStyle}
        />

        <Button
          onClick={handleCopy}
          style={{
            ...buttonBaseStyle,
            width: "100%",
            backgroundColor:
              copyCount > 8 ? "#F04747" : copyCount > 2 ? "#43B581" : "#7289DA",
            color: "#FFFFFF",
            padding: "0.75rem",
            fontSize: "1rem",
            ":hover": {
              opacity: 0.9,
            },
          }}
        >
          {copyCount < funnyCopyMessages.length
            ? funnyCopyMessages[copyCount]
            : "Copied!"}
        </Button>
      </div>
    </div>
  );
}
