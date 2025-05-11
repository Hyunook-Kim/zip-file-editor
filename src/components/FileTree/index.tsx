import React from "react";
import styled from "styled-components";
import FileTreeItem from "./FileTreeItem";
import { useFileStore } from "@/models/files/store";

const FileTree: React.FC = () => {
  const { zipData } = useFileStore();

  if (!zipData) {
    return <EmptyTreeMessage>Please upload a ZIP file</EmptyTreeMessage>;
  }

  return (
    <TreeContainer>
      <TreeHeader>File Tree</TreeHeader>
      <TreeContent>
        {zipData.root.children && zipData.root.children.length > 0 ? (
          zipData.root.children.map((item) => (
            <FileTreeItem key={item.path} item={item} level={0} />
          ))
        ) : (
          <EmptyTreeMessage>No files found</EmptyTreeMessage>
        )}
      </TreeContent>
    </TreeContainer>
  );
};

const TreeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const TreeHeader = styled.div`
  padding: 10px;
  font-weight: bold;
  border-bottom: 1px solid var(--color-border);
`;

const TreeContent = styled.div`
  flex: 1;
  overflow: auto;
  padding: 8px 0;
`;

const EmptyTreeMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--color-text-secondary);
  font-style: italic;
  padding: 20px;
  text-align: center;
`;

export default FileTree;
