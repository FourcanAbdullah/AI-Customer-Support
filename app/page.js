"use client";

import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ]);
  const sendMessage = async () => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    });
    const data = await response.json();
    setMessages([...messages, { role: "assistant", content: data.message }]);
  };

  const [message, setMessage] = useState("");
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction={"column"}
        width="500px"
        height="700px"
        border="1px solid black"
        p={2}
      >
        <Stack direction={"column"} spacing={2} flexGrow={1}>
          {messages.map((message, index) => (
            <Stack direction={"row"} key={index}>
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === "assistant" ? "flex-end" : "flex-start"
                }
              >
                <Box
                  bgcolor={
                    message.role === "assistant"
                      ? "primary.main"
                      : "secondary.main"
                  }
                  color="white"
                  borderRadius={16}
                  p={2}
                >
                  {message.content}
                </Box>
              </Box>
            </Stack>
          ))}
        </Stack>
        <Stack direction={"row"} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained">Send</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
