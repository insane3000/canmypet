"use client";
import React, { useEffect, useRef, useState } from "react";
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
import { Camera } from "react-camera-pro";
import { IoClose } from "react-icons/io5";
const HomeSt = styled.div`
  width: 100%;
  height: auto;
  position: relative;
  display: flex;
  flex-direction: column;
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

  .subtitle {
    width: 100%;
    font-family: var(--motiva300);
    font-size: 0.75rem;
    color: #c4c4c4;
  }
  .response {
    border: 1px solid #2c2c2c;
    border-radius: 0.5rem;

    margin-top: 1rem;
    margin-bottom: 4rem;
    padding: 1rem;
    .title_prompt {
      font-family: var(--motiva500);
      font-size: 1.25rem;
      color: #dddddd;
    }
    .data {
      width: 100%;
      height: auto;
      white-space: normal;
      font-family: var(--motiva300);
      font-size: 0.9rem;
      color: #d6d6d6;
      margin-top: 1rem;
      h2 {
        font-family: var(--motiva400);
        margin-top: 1rem;
        color: #dddddd;
      }
    }
  }
  .camera_container {
    position: absolute;
    top: 4rem;
    width: 100%;
    height: 25rem;
    display: flex;
    border-radius: 1rem;
    overflow: hidden;
    background: black;

    .gradient {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      /* background: red; */
      background: rgb(0, 0, 0);
      background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.4822303921568627) 0%,
        rgba(0, 0, 0, 0) 51%,
        rgba(0, 0, 0, 0.44861694677871145) 100%
      );
      .close {
        width: 3rem;
        height: 3rem;
        position: absolute;
        top: 1rem;
        right: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.5rem;
        .icon_close {
          width: 100%;
          height: 100%;
        }
      }
      .capture {
        width: 3.5rem;
        height: 3.5rem;
        background: #ffffff66;
        position: absolute;
        bottom: 2rem;
        border-radius: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .button {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 100%;
          background: white;
        }
      }
    }
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
  const [cameraIsEnabled, setCameraIsEnabled] = useState(false);
  // Configuración de la solicitud HTTP
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const payload = {
    model: modelInput,
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
    if (search.length === 0) {
      toast("Selecciona un animal");
      return;
    }
    if (base64String.length === 0) {
      toast("Selecciona una imagen");
      return;
    }

    setSpinner(true);
    setResponse("");
    try {
      const response = await axios.post("https://api.openai.com/v1/chat/completions", payload, { headers });
      fetchStreamingText(response.data.choices[0].message.content);
      setSpinner(false);
    } catch (error: any) {
      console.error("Error analyzing image:", error.response ? error.response.data : error.message);
      toast("Error analizado la imagen");

      setSpinner(false);
    }
  }
  const openaiProvider = createOpenAI({
    apiKey: apiKey,
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
      }
    } catch (error) {
      toast("Error solicitando los datos.");
    } finally {
      setIsStreaming(false);
    }
  };

  function insertH2(texto: string) {
    // Expresión regular para encontrar texto entre ** y opcionalmente un número antes, incluyendo :
    const regex = /(\d+\.\s*)?\*\*(.*?)\*\*(:?)/g;

    // Reemplazar las coincidencias con el formato deseado, manteniendo el resto del texto
    const result = texto.replace(regex, (match: string, numero: string, contenido: string, dosPuntos: string) => {
      return `<h2>${numero ? numero : ""}${contenido}${dosPuntos}</h2>`;
    });
    return result;
  }
  // !Camera
  const camera = useRef(null);
  const base64ToFile = (base64String: any, filename: string) => {
    // Extrae el tipo de archivo y los datos base64
    const [header, data] = base64String.split(",");
    const mimeType = header.match(/:(.*?);/)[1];
    const binaryString = atob(data);
    const arrayBuffer = new ArrayBuffer(binaryString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: mimeType });
    return new File([blob], filename, { type: mimeType });
  };

  //   useEffect(() => {
  //     toast(base64String);
  //   }, [base64String]);
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
          setCameraIsEnabled={setCameraIsEnabled}
        />
        <div className="border_spacer_bottom"></div>
      </div>
      <div className="subtitle">Sube la imagen de algún alimento</div>
      <ImagePreview file={file} setFile={setFile} setBase64String={setBase64String} />

      {response.length !== 0 && (
        <div className="response">
          <h1 className="title_prompt">¿Puede mi mascota comer eso?</h1>
          <div
            className="data"
            dangerouslySetInnerHTML={{
              __html: insertH2(response),
            }}
          ></div>
        </div>
      )}
      {cameraIsEnabled && (
        <div className="camera_container">
          <Camera
            ref={camera}
            facingMode="environment"
            errorMessages={{
              noCameraAccessible: "No camera device accessible. Please connect your camera or try a different browser.",
              permissionDenied: "Permission denied. Please refresh and give camera permission.",
              switchCamera:
                "It is not possible to switch camera to different one because there is only one video device accessible.",
              canvas: "Canvas is not supported.",
            }}
          />
          <div className="gradient">
            <div className="close" onClick={() => setCameraIsEnabled(false)}>
              <IoClose className="icon_close" />
            </div>
            <div
              className="capture"
              onClick={() => {
                // @ts-ignore
                setFile(base64ToFile(camera.current?.takePhoto(), "image.png"));
                setCameraIsEnabled(false);
              }}
            >
              <div className="button"></div>
            </div>
          </div>
        </div>
      )}
      <Toaster style={{ fontFamily: "var(--motiva400)" }} />
    </HomeSt>
  );
}
