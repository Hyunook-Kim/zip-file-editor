import React, { useState, useRef } from "react";
import type { DragEvent } from "react";
import styled from "styled-components";
import JSZip from "jszip";
import { TEXT_EXTENSIONS, IMAGE_EXTENSIONS } from "@/models/files";
import type { FileType, ZipItem, ZipData } from "@/models/files";
import { useFileStore } from "@/models/files/store";

const TopBar = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setZipData, setIsLoading, isLoading, zipData } = useFileStore();

  const detectFileType = (filename: string): FileType => {
    if (filename.endsWith("/")) return "directory";

    const ext = filename.split(".").pop()?.toLowerCase() || "";

    if (TEXT_EXTENSIONS.includes(ext)) return "text";
    if (IMAGE_EXTENSIONS.includes(ext)) return "image";

    return "binary";
  };

  const parseZipFile = async (file: File) => {
    try {
      setIsLoading(true);
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(file);

      const root: ZipItem = {
        name: "root",
        path: "",
        type: "directory",
        children: [],
      };

      const flatList: { [key: string]: ZipItem } = {
        "": root,
      };

      const promises: Promise<void>[] = [];

      zipContent.forEach((relativePath, zipEntry) => {
        if (
          relativePath.startsWith("__MACOSX/") ||
          relativePath.includes("/.")
        ) {
          return;
        }

        const pathParts = relativePath.split("/");
        const fileName = pathParts.pop() || "";
        const parentPath = pathParts.join("/");
        const isDirectory = zipEntry.dir;

        const item: ZipItem = {
          name: fileName || parentPath.split("/").pop() || "",
          path: relativePath,
          type: isDirectory ? "directory" : detectFileType(relativePath),
          size: 0,
          children: isDirectory ? [] : undefined,
          extension: isDirectory
            ? undefined
            : relativePath.split(".").pop() || "",
        };

        if (parentPath) {
          let parent = flatList[parentPath];

          if (!parent) {
            let currentPath = "";
            for (const part of pathParts) {
              const prevPath = currentPath;
              currentPath = currentPath ? `${currentPath}/${part}` : part;

              if (!flatList[currentPath]) {
                const newFolder: ZipItem = {
                  name: part,
                  path: `${currentPath}/`,
                  type: "directory",
                  children: [],
                };

                flatList[currentPath] = newFolder;

                if (prevPath) {
                  flatList[prevPath].children?.push(newFolder);
                } else {
                  root.children?.push(newFolder);
                }
              }
            }

            parent = flatList[parentPath];
          }

          parent.children?.push(item);
          item.parent = parent;
        } else if (!isDirectory) {
          root.children?.push(item);
        }

        flatList[relativePath] = item;

        if (!isDirectory) {
          const promise = zipEntry.async("uint8array").then((data) => {
            item.size = data.byteLength;

            if (item.type === "text") {
              try {
                const textDecoder = new TextDecoder("utf-8");
                item.content = textDecoder.decode(data);
                console.log(
                  `File content decoded for ${item.path}, content length: ${
                    (item.content as string).length
                  }`
                );
              } catch (e) {
                console.error(
                  `Error decoding file content for ${item.path}:`,
                  e
                );
                item.content = "Error decoding file content.";
              }
            } else if (item.type === "image") {
              item.content = new Blob([data], {
                type: `image/${item.extension}`,
              });
            }
          });
          promises.push(promise);
        }
      });

      await Promise.all(promises);

      const result: ZipData = {
        originalFile: file,
        root,
        flatList,
      };

      setZipData(result);
      console.log("Parsed Zip Structure:", result);
      console.log("Root Level Items:", root.children);
    } catch (error) {
      console.error("Error parsing zip file:", error);
      alert("Error parsing zip file. Please try again with a valid zip file.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedFile(file);
      console.log("Uploaded file:", file.name);
      parseZipFile(file);
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
      const file = files[0];

      if (file.name.toLowerCase().endsWith(".zip")) {
        setUploadedFile(file);
        console.log("Uploaded file via drag & drop:", file.name);
        parseZipFile(file);
      } else {
        alert("Please upload a zip file.");
      }
    }
  };

  const handleSaveZipFile = async () => {
    if (!zipData) {
      alert("No ZIP file to save. Please upload a ZIP file first.");
      return;
    }

    try {
      setIsSaving(true);
      const newZip = new JSZip();
      const flatList = zipData.flatList;

      // 텍스트와 이미지 파일 저장
      for (const path in flatList) {
        const item = flatList[path];
        if (item.type === "directory" || path === "") continue;

        if (item.type === "text" && typeof item.content === "string") {
          newZip.file(item.path, item.content);
        } else if (item.type === "image" && item.content instanceof Blob) {
          newZip.file(item.path, item.content);
        } else if (item.type === "binary") {
          // 바이너리 파일은 원본에서 가져와 저장
          const originalZip = await JSZip.loadAsync(zipData.originalFile);
          const content = await originalZip
            .file(item.path)
            ?.async("uint8array");
          if (content) {
            newZip.file(item.path, content);
          }
        }
      }

      const zipBlob = await newZip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 9 },
      });

      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(zipBlob);

      const originalName = zipData.originalFile.name;
      const extension = originalName.split(".").pop() || "zip";
      const baseName = originalName.replace(`.${extension}`, "");
      downloadLink.download = `${baseName}_edited.${extension}`;

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      console.log("ZIP file saved successfully");
    } catch (error) {
      console.error("Error saving ZIP file:", error);
      alert("Error saving ZIP file. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TopBarContainer>
      <h2>File Upload Handler (Upload/Download)</h2>
      <UploadArea>
        <ButtonContainer>
          <UploadButton onClick={handleFileButtonClick} disabled={isLoading}>
            {isLoading ? "Parsing..." : "Upload Zip File"}
          </UploadButton>

          {zipData && (
            <SaveButton onClick={handleSaveZipFile} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save ZIP File"}
            </SaveButton>
          )}

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
              {isLoading && <span> - Parsing file contents...</span>}
            </div>
          )}
        </ButtonContainer>

        <DropZone
          $isDragging={isDragging}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          disabled={isLoading}
        >
          {isLoading ? (
            <p>Processing zip file...</p>
          ) : (
            <>
              <p>Drag and drop zip file here</p>
              <small>or use the upload button above</small>
            </>
          )}
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

const UploadButton = styled.button<{ disabled?: boolean }>`
  padding: 8px 16px;
  background-color: ${(props) =>
    props.disabled ? "#cccccc" : "var(--color-primary)"};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  &:hover {
    background-color: ${(props) =>
      props.disabled ? "#cccccc" : "var(--color-primary-dark)"};
  }
`;

const SaveButton = styled.button`
  padding: 8px 16px;
  background-color: var(--color-accent);
  color: var(--color-text);
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    background-color: var(--color-accent-hover);
  }

  &:disabled {
    background-color: var(--color-border);
    cursor: not-allowed;
  }
`;

const DropZone = styled.div<{ $isDragging: boolean; disabled?: boolean }>`
  border: ${(props) =>
    props.$isDragging
      ? "3px solid var(--color-drag-border)"
      : "2px dashed var(--color-border)"};
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  background-color: ${(props) => {
    if (props.disabled) return "#f5f5f5";
    return props.$isDragging ? "var(--color-drag-background)" : "transparent";
  }};
  color: ${(props) => {
    if (props.disabled) return "#999999";
    return props.$isDragging ? "var(--color-drag-text)" : "inherit";
  }};
  transition: all 0.2s ease;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  box-shadow: ${(props) =>
    props.$isDragging ? "0 0 10px var(--color-drag-shadow)" : "none"};
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};

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
    border-color: ${(props) => {
      if (props.disabled) return "var(--color-border)";
      return props.$isDragging
        ? "var(--color-drag-border)"
        : "var(--color-primary)";
    }};
    background-color: ${(props) => {
      if (props.disabled) return "#f5f5f5";
      return props.$isDragging
        ? "var(--color-drag-background)"
        : "rgba(76, 175, 80, 0.05)";
    }};
  }
`;

export default TopBar;
