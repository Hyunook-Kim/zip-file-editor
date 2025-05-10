import React, { useState, useRef } from "react";
import type { DragEvent } from "react";
import styled from "styled-components";

const TopBar = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedFile(files[0]);
      console.log("Uploaded file:", files[0].name);
    }
  };

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // 첫 번째 파일만 처리
      const file = files[0];

      // .zip 파일 체크
      if (file.name.toLowerCase().endsWith(".zip")) {
        setUploadedFile(file);
        console.log("Uploaded file via drag & drop:", file.name);
      } else {
        alert("Please upload a zip file.");
      }
    }
  };

  return (
    <TopBarContainer>
      <h2>File Upload Handler (Upload/Download)</h2>
      <UploadArea>
        <ButtonContainer>
          <UploadButton onClick={handleFileButtonClick}>
            Upload Zip File
          </UploadButton>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".zip"
            style={{ display: "none" }}
          />
          {uploadedFile && (
            <div>
              Uploaded: {uploadedFile.name} (
              {(uploadedFile.size / 1024).toFixed(2)} KB)
            </div>
          )}
        </ButtonContainer>

        <DropZone
          $isDragging={isDragging}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p>Drag and drop zip file here</p>
          <small>or use the upload button above</small>
        </DropZone>
      </UploadArea>
    </TopBarContainer>
  );
};

const TopBarContainer = styled.div`
  padding: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
`;

const UploadArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const UploadButton = styled.button`
  padding: 8px 16px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

const DropZone = styled.div<{ $isDragging: boolean }>`
  border: ${(props) =>
    props.$isDragging
      ? "3px solid var(--color-drag-border)"
      : "2px dashed var(--color-border)"};
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  background-color: ${(props) =>
    props.$isDragging ? "var(--color-drag-background)" : "transparent"};
  color: ${(props) =>
    props.$isDragging ? "var(--color-drag-text)" : "inherit"};
  transition: all 0.2s ease;
  cursor: pointer;
  box-shadow: ${(props) =>
    props.$isDragging ? "0 0 10px var(--color-drag-shadow)" : "none"};

  p {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: ${(props) => (props.$isDragging ? "bold" : "normal")};
  }

  small {
    font-size: 12px;
    opacity: ${(props) => (props.$isDragging ? "0.9" : "0.7")};
  }

  &:hover {
    border-color: ${(props) =>
      props.$isDragging ? "var(--color-drag-border)" : "var(--color-primary)"};
    background-color: ${(props) =>
      props.$isDragging
        ? "var(--color-drag-background)"
        : "rgba(76, 175, 80, 0.05)"};
  }
`;

export default TopBar;
