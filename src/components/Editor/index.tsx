import styled from "styled-components";
import { useFileStore } from "@/models/files/store";
import { FileIcon } from "../FileIcons";

const Editor = () => {
  const { currentFile } = useFileStore();

  const renderContent = () => {
    if (!currentFile) {
      return <EmptyMessage>No file selected</EmptyMessage>;
    }

    switch (currentFile.type) {
      case "text":
        return (
          <TextContent>
            {typeof currentFile.content === "string"
              ? currentFile.content
              : "Content cannot be displayed"}
          </TextContent>
        );
      case "image":
        return <EmptyMessage>not implemented</EmptyMessage>;
      case "binary":
        return <EmptyMessage>Binary file cannot be displayed</EmptyMessage>;
      case "directory":
        return <EmptyMessage>directory</EmptyMessage>;
      default:
        return <EmptyMessage>Unknown File Type</EmptyMessage>;
    }
  };

  return (
    <EditorContainer>
      <TabsContainer>
        {currentFile ? (
          <FileTab>
            <FileIcon type={currentFile.type} size={16} />
            <FileName>{currentFile.name}</FileName>
            {currentFile.size !== undefined && (
              <FileSize>({formatSize(currentFile.size)})</FileSize>
            )}
          </FileTab>
        ) : (
          <EmptyTab>No file open</EmptyTab>
        )}
      </TabsContainer>
      <EditorContent>{renderContent()}</EditorContent>
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

const FileSize = styled.span`
  margin-left: 8px;
  font-size: 0.8em;
  color: var(--color-text-secondary);
`;

const EditorContent = styled.div`
  flex: 1;
  overflow: auto;
  padding: 16px;
  background-color: var(--color-secondary);
`;

const TextContent = styled.pre`
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: var(--color-text);
  margin: 0;
  padding: 0;
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
