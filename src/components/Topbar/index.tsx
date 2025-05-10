import React, { useState, useRef } from "react";
import styled from "styled-components";

const TopBar = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
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

  return (
    <TopBarContainer>
      <h2>File Upload Handler (Upload/Download)</h2>
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

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
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

export default TopBar;
