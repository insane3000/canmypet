"use client";
import React, { useState } from "react";
import Search from "@/components/organisms/Search";
import APIKey from "@/components/organisms/APIKey";
import styled from "styled-components";
import { useSearchStore } from "@/store/searchStore";
import { useApiKeyStore } from "@/store/apiKeyStore";
import { toast, Toaster } from "sonner";
import ImagePreview from "@/components/organisms/ImagePreview";
import axios from "axios";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText, streamText } from "ai";
import { prompt } from "@/libs/prompt";

const HomeSt = styled.div`
  width: 100%;
  height: auto;
  .header {
    width: 100%;
    height: auto;
    background: #09090b;

    .border_spacer_top {
      width: 100%;
      height: 2rem;
    }
    .border_spacer_bottom {
      width: 100%;
      height: 1rem;
    }
  }
  .loader {
    width: 100%;
    height: 100%;
    background: #09090b;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .subtitle {
    width: 100%;
    font-family: var(--motiva300);
    font-size: 0.75rem;
    color: #c4c4c4;
  }
  .response {
    width: 100%;
    height: auto;
    margin-bottom: 2rem;
    font-family: var(--motiva300);
    font-size: 0.9rem;
    color: #c4c4c4;
  }
`;

export default function Page() {
  const { apiKey, setApiKey, modelInput, setModelInput } = useApiKeyStore((state) => state);
  const { search, setSearch } = useSearchStore((state) => state);
  const [file, setFile] = useState(null);
  const [base64String, setBase64String] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [response, setResponse] = useState("");
  // Configuración de la solicitud HTTP
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const payload = {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "¿Que alimentos hay?",
          },
          {
            type: "image_url",

            image_url: {
              url: `data:image/jpeg;base64,${base64String}`,
            },
          },
        ],
      },
    ],
    max_tokens: 300,
  };

  // Función para enviar la solicitud a la API de OpenAI
  async function analyzeImage() {
    if (apiKey.length === 0) {
      toast("Debes introducir tu OpenAi API Key");
      if (typeof window !== "undefined") window.scrollTo(0, 0);
      return;
    }
    if (base64String.length === 0) {
      toast("Selecciona una imagen");
      return;
    }

    if (search.length === 0) {
      toast("Selecciona un animal");
      return;
    }
    setSpinner(true);
    try {
      const response = await axios.post("https://api.openai.com/v1/chat/completions", payload, { headers });
      console.log(response.data.choices[0].message.content);
      fetchStreamingText(response.data.choices[0].message.content);
      setSpinner(false);
    } catch (error: any) {
      console.error("Error analyzing image:", error.response ? error.response.data : error.message);
      setSpinner(false);
    }
  }
  const openaiProvider = createOpenAI({
    apiKey: apiKey,
    //     baseURL: "https://api.perplexity.ai",
    //     compatibility: "compatible", // Modo estricto para usar la API de OpenAI
  });

  const fetchStreamingText = async (imageAnalyzed: string) => {
    setIsStreaming(true);
    try {
      const model = openaiProvider.chat(modelInput);
      const { textStream } = await streamText({
        model: model,
        prompt: prompt(imageAnalyzed, search),
      });
      let accumulatedText = "";
      for await (const textPart of textStream) {
        accumulatedText += textPart;
        setResponse(accumulatedText);
        // Scroll to the bottom to show the latest text
        //     if (textAreaRef.current) {
        //       textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
        //     }
      }
    } catch (error) {
      toast("Error solicitando los datos.");
    } finally {
      setIsStreaming(false);
    }
  };
  //   analyzeImage(imageUrl);

  return (
    <HomeSt>
      <div className="header">
        <div className="border_spacer_top"></div>
        <APIKey apiKey={apiKey} setApiKey={setApiKey} modelInput={modelInput} setModelInput={setModelInput} />
        <Search
          search={search}
          setSearch={setSearch}
          analyzeImage={analyzeImage}
          spinner={spinner}
          setSpinner={setSpinner}
        />
        <div className="border_spacer_bottom"></div>
      </div>
      <div className="subtitle">Sube la imagen de algún alimento</div>
      <ImagePreview file={file} setFile={setFile} setBase64String={setBase64String} />
      <p className="response">{response}</p>
      <Toaster style={{ fontFamily: "var(--motiva400)" }} />
    </HomeSt>
  );
}
