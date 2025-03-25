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

  return (
    <Container size="sm" py="xl">
      <Title order={2} mb="md">
        Create your text
      </Title>

      <Group mb="md">
        <Button onClick={() => applyStyle(0)}>Reset All</Button>
        <Button onClick={() => applyStyle(1)} style={{ fontWeight: 700 }}>
          Bold
        </Button>
        <Button
          onClick={() => applyStyle(4)}
          style={{ textDecoration: "underline" }}
        >
          Line
        </Button>
      </Group>

      <Text fw={500}>FG</Text>
      <Group mb="md">
        {[30, 31, 32, 33, 34, 35, 36, 37].map((code) => (
          <Tooltip label={ANSI_COLORS[code].name} key={`fg-${code}`}>
            <Button
              onClick={() => applyStyle(code)}
              style={{ backgroundColor: ANSI_COLORS[code].color }}
              px="sm"
            >
              &nbsp;
            </Button>
          </Tooltip>
        ))}
      </Group>

      <Text fw={500}>BG</Text>
      <Group mb="md">
        {[40, 41, 42, 43, 44, 45, 46, 47].map((code) => (
          <Tooltip label={ANSI_COLORS[code].name} key={`bg-${code}`}>
            <Button
              onClick={() => applyStyle(code)}
              style={{
                backgroundColor: ANSI_COLORS[code].bg,
                color: code >= 45 ? "#fff" : "#000",
              }}
              px="sm"
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
        style={{
          minHeight: 200,
          textAlign: "left",
          fontFamily: "monospace",
          backgroundColor: "#2F3136",
          color: "#B9BBBE",
          border: "1px solid #202225",
          borderRadius: "5px",
          whiteSpace: "pre-wrap",
        }}
      />

      <Button
        onClick={handleCopy}
        color={copyCount > 8 ? "red" : copyCount > 2 ? "teal" : "blue"}
        mb="md"
      >
        {copyCount < funnyCopyMessages.length
          ? funnyCopyMessages[copyCount]
          : "Copied!"}
      </Button>
    </Container>
  );
}
