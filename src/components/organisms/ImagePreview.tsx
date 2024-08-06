import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import CloseIcon from "../../icons/CloseIcon";
// import empty from "../../img/empty.png";
const ImagePreviewSt = styled.div`
  width: 100%;
  height: auto;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  margin-top: 1rem;
  .image_drop_container {
    width: 100%;
    height: 20rem;
    position: relative;
    button {
      width: 100%;
      height: 100%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      border: none;
      border-radius: 1rem;
      background: #1c1c1e;
    }
    .sysIcon_close {
      background: #393737;
      color: white;
      width: 2rem;
      height: 2rem;
      border-radius: 100%;
      position: absolute;
      top: -1rem;
      right: -0.5rem;
      padding: 0.3rem;
    }
  }
  // !Estilos para DESKTOP
  @media only screen and (min-width: 568px) {
  }
`;

interface props {
  file: any;
  setFile: any;
  setBase64String: (value: string) => void;
}
export default function ImagePreview(props: props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (props.file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string); //@ts-ignore
        const base64String = reader?.result?.split(",")[1];
        props.setBase64String(base64String);
      };
      reader.readAsDataURL(props.file);
    } else {
      setPreview(null);
    }
  }, [props.file]);

  return (
    <ImagePreviewSt>
      <div className="image_drop_container">
        <button
          onClick={(event) => {
            event.preventDefault();
            fileInputRef.current?.click();
          }}
          style={{
            backgroundImage: `url(${preview ? preview : "/empty.png"})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        />
        <input
          type="file"
          style={{ display: "none" }}
          ref={fileInputRef}
          value=""
          accept="image/*"
          onChange={(event) => {
            const files = event.currentTarget.files;
            const file = files !== undefined && files !== null ? files[0] : null; // Return value OR null
            if (file && file.type.slice(0, 5) === "image") {
              props.setFile(file);
            } else {
              props.setFile(null);
            }
          }}
        />
        {preview && (
          <CloseIcon
            className="sysIcon_close"
            onClick={() => {
              props.setFile(null);
              setPreview(null);
              props.setBase64String("");
            }}
          />
        )}
      </div>
    </ImagePreviewSt>
  );
}
