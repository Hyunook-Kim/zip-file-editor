import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { useFileStore } from "@/models/files/store";
import { FileIcon } from "../FileIcons";
import MonacoEditor, { executeUndo, executeRedo } from "../MonacoEditor";
import type { editor } from "monaco-editor";

const Editor = () => {
  const {
    currentFile,
    zipData,
    setZipData,
    openTabs,
    activeTabId,
    setActiveTab,
    closeTab,
    markTabAsEdited,
  } = useFileStore();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [editorInstance, setEditorInstance] =
    useState<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorChange = (newContent: string) => {
    if (!currentFile || !zipData || !activeTabId) return;
    if (typeof currentFile.content !== "string") return;

    try {
      if (currentFile.content !== newContent) {
        // 탭을 수정됨 상태로 표시
        markTabAsEdited(activeTabId, true);

        const updatedZipData = { ...zipData };

        const fileToUpdate = updatedZipData.flatList[currentFile.path];
        if (fileToUpdate) {
          fileToUpdate.content = newContent || "";

          if (newContent) {
            const encoder = new TextEncoder();
            const bytes = encoder.encode(newContent);
            fileToUpdate.size = bytes.length;
          } else {
            fileToUpdate.size = 0;
          }
        }

        setZipData(updatedZipData);
      }
    } catch (error) {
      console.error("Error updating file content:", error);
    }
  };

  // Monaco Editor 인스턴스 저장
  const handleEditorCreated = (editor: editor.IStandaloneCodeEditor) => {
    setEditorInstance(editor);
  };

  // Undo/Redo 핸들러
  const handleUndo = () => {
    if (editorInstance) {
      executeUndo(editorInstance);
    }
  };

  const handleRedo = () => {
    if (editorInstance) {
      executeRedo(editorInstance);
    }
  };

  // 탭 클릭 핸들러
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  // 탭 닫기 핸들러
  const handleTabClose = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    tabId: string
  ) => {
    e.stopPropagation(); // 탭 클릭 이벤트 전파 방지
    closeTab(tabId);
  };

  useMemo(() => {
    if (currentFile?.type === "image" && currentFile.content instanceof Blob) {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
      const url = URL.createObjectURL(currentFile.content);
      setImageUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
        setImageUrl(null);
      }
    }
  }, [currentFile?.path, currentFile?.content]);

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
          return (
            <MonacoEditor
              key={currentFile.path}
              file={currentFile}
              onChange={handleEditorChange}
              onEditorCreated={handleEditorCreated}
            />
          );
        }
        return <EmptyMessage>Unable to display content</EmptyMessage>;
      case "image":
        if (currentFile.content instanceof Blob && imageUrl) {
          return (
            <ImagePreviewContainer>
              <ImagePreview src={imageUrl} alt={currentFile.name} />
              <ImageDetails>
                <div>
                  <strong>File:</strong> {currentFile.name}
                </div>
                <div>
                  <strong>Size:</strong> {formatSize(currentFile.size || 0)}
                </div>
                <div>
                  <strong>Type:</strong>{" "}
                  {currentFile.content.type || `image/${currentFile.extension}`}
                </div>
              </ImageDetails>
            </ImagePreviewContainer>
          );
        }
        return <EmptyMessage>Unable to display image</EmptyMessage>;
      case "binary":
        return <EmptyMessage>Binary file cannot be displayed</EmptyMessage>;
      case "directory":
        return <EmptyMessage>This is a directory, not a file</EmptyMessage>;
      default:
        return <EmptyMessage>Unknown file type</EmptyMessage>;
    }
  }, [currentFile?.path, currentFile?.content, imageUrl]);

  return (
    <EditorContainer>
      <TabsContainer>
        <TabsScrollContainer>
          {openTabs?.length > 0 ? (
            openTabs.map((tab) => (
              <FileTab
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                $isActive={activeTabId === tab.id}
              >
                <FileIcon type={tab.file.type} size={16} />
                <FileName>{tab.file.name}</FileName>
                {tab.isEdited && <EditedIndicator>•</EditedIndicator>}
                {tab.file.size !== undefined && (
                  <FileSize>({formatSize(tab.file.size)})</FileSize>
                )}
                <CloseButton
                  onClick={(e) => handleTabClose(e, tab.id)}
                  title="Close tab"
                >
                  ✕
                </CloseButton>
              </FileTab>
            ))
          ) : (
            <EmptyTab>No file open</EmptyTab>
          )}
        </TabsScrollContainer>

        {currentFile && currentFile.type === "text" && (
          <EditorToolbar>
            <ToolbarButton onClick={handleUndo} title="Undo (Ctrl+Z)">
              <UndoIcon>↶</UndoIcon> Undo
            </ToolbarButton>
            <ToolbarButton
              onClick={handleRedo}
              title="Redo (Ctrl+Shift+Z / Ctrl+Y)"
            >
              <RedoIcon>↷</RedoIcon> Redo
            </ToolbarButton>
          </EditorToolbar>
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
  justify-content: space-between;
`;

const TabsScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: thin;

  /* Chrome, Safari 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-border);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

const FileTab = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: ${(props) =>
    props.$isActive ? "var(--color-primary)" : "var(--color-secondary)"};
  border-right: 1px solid var(--color-border);
  cursor: pointer;
  transition: background-color 0.1s ease;

  &:hover {
    background-color: ${(props) =>
      props.$isActive ? "var(--color-primary)" : "var(--color-hover)"};
  }
`;

const CloseButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 10px;
  opacity: 0.6;

  &:hover {
    background-color: var(--color-border);
    opacity: 1;
  }
`;

const EditorToolbar = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 12px;
`;

const ToolbarButton = styled.button`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  margin-left: 8px;
  background-color: var(--color-button);
  color: var(--color-text);
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background-color: var(--color-button-hover);
  }
`;

const UndoIcon = styled.span`
  font-size: 16px;
  margin-right: 4px;
`;

const RedoIcon = styled.span`
  font-size: 16px;
  margin-right: 4px;
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

const ImagePreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  overflow: auto;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 80%;
  object-fit: contain;
  border: 1px solid var(--color-border);
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ImageDetails = styled.div`
  margin-top: 20px;
  padding: 10px;
  border-radius: 4px;
  background-color: var(--color-primary);
  width: 100%;
  max-width: 400px;

  & > div {
    margin-bottom: 5px;
  }
`;

export default Editor;
