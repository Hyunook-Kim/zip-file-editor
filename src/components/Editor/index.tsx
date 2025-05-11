import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { useFileStore } from "@/models/files/store";
import { FileIcon } from "../FileIcons";
import MonacoEditor from "../MonacoEditor";

const Editor = () => {
  const { currentFile, zipData, setZipData } = useFileStore();
  const [isEdited, setIsEdited] = useState<boolean>(false);

  const handleEditorChange = (newContent: string) => {
    if (!currentFile || !zipData) return;
    if (typeof currentFile.content !== "string") return;

    if (currentFile.content !== newContent) {
      setIsEdited(true);

      const updatedZipData = { ...zipData };

      const fileToUpdate = updatedZipData.flatList[currentFile.path];
      if (fileToUpdate) {
        fileToUpdate.content = newContent;
      }

      setZipData(updatedZipData);
    }
  };

  const editorComponent = useMemo(() => {
    if (!currentFile) {
      return <EmptyMessage>No file selected</EmptyMessage>;
    }

    console.log("Current file:", currentFile);
    console.log("File type:", currentFile.type);
    console.log("File content type:", typeof currentFile.content);
    if (typeof currentFile.content === "string") {
      console.log("Content length:", currentFile.content.length);
      console.log("Content preview:", currentFile.content.substring(0, 100));
    }

    switch (currentFile.type) {
      case "text":
        if (typeof currentFile.content === "string") {
          if (currentFile.content.length === 0) {
            return <EmptyMessage>This file is empty</EmptyMessage>;
          }
          return (
            <MonacoEditor
              key={currentFile.path}
              file={currentFile}
              onChange={handleEditorChange}
            />
          );
        }
        return <EmptyMessage>Unable to display content</EmptyMessage>;
      case "image":
        return <EmptyMessage>Image preview not implemented yet</EmptyMessage>;
      case "binary":
        return <EmptyMessage>Binary file cannot be displayed</EmptyMessage>;
      case "directory":
        return <EmptyMessage>This is a directory, not a file</EmptyMessage>;
      default:
        return <EmptyMessage>Unknown file type</EmptyMessage>;
    }
  }, [currentFile?.path, currentFile?.content]);

  return (
    <EditorContainer>
      <TabsContainer>
        {currentFile ? (
          <FileTab>
            <FileIcon type={currentFile.type} size={16} />
            <FileName>{currentFile.name}</FileName>
            {isEdited && <EditedIndicator>•</EditedIndicator>}
            {currentFile.size !== undefined && (
              <FileSize>({formatSize(currentFile.size)})</FileSize>
            )}
          </FileTab>
        ) : (
          <EmptyTab>No file open</EmptyTab>
        )}
      </TabsContainer>
      <EditorContent>{editorComponent}</EditorContent>
    </EditorContainer>
  );
};

const formatSize = (size: number): string => {
  const kb = size / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 1px;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-secondary);
  min-height: 40px;
`;

const FileTab = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: var(--color-primary);
  border-right: 1px solid var(--color-border);
`;

const EmptyTab = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  color: var(--color-text-secondary);
  font-style: italic;
`;

const FileName = styled.span`
  margin-left: 8px;
  font-weight: 500;
`;

const EditedIndicator = styled.span`
  margin-left: 4px;
  color: var(--color-folder-text);
  font-weight: bold;
`;

const FileSize = styled.span`
  margin-left: 8px;
  font-size: 0.8em;
  color: var(--color-text-secondary);
`;

const EditorContent = styled.div`
  flex: 1;
  overflow: hidden;
  background-color: var(--color-secondary);
`;

const EmptyMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--color-text-secondary);
  font-style: italic;
`;

export default Editor;
