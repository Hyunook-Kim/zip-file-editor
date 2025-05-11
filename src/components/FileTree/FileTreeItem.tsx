import React from "react";
import styled from "styled-components";
import { FileIcon } from "../FileIcons";
import { useFileStore } from "@/models/files/store";
import type { ZipItem } from "@/models/files";

interface FileTreeItemProps {
  item: ZipItem;
  level: number;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({ item, level }) => {
  const { setCurrentFile, toggleFolder, isExpanded } = useFileStore();
  const isDirectory = item.type === "directory";
  const expanded = isDirectory && isExpanded(item.path);

  const handleItemClick = () => {
    if (isDirectory) {
      toggleFolder(item.path);
    } else {
      setCurrentFile(item);
    }
  };

  return (
    <div>
      <TreeItemContainer
        $level={level}
        onClick={handleItemClick}
        $isDirectory={isDirectory}
      >
        <FileIcon type={item.type} isOpen={expanded} />
        <ItemName>{item.name}</ItemName>
        {item.size !== undefined && (
          <ItemSize>{formatSize(item.size)}</ItemSize>
        )}
      </TreeItemContainer>

      {expanded && item.children && item.children.length > 0 && (
        <SubItemsContainer>
          {item.children.map((child) => (
            <FileTreeItem key={child.path} item={child} level={level + 1} />
          ))}
        </SubItemsContainer>
      )}
    </div>
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

interface TreeItemContainerProps {
  $level: number;
  $isDirectory: boolean;
}

const TreeItemContainer = styled.div<TreeItemContainerProps>`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  padding-left: ${(props) => 8 + props.$level * 16}px;
  cursor: pointer;
  user-select: none;
  border-radius: 4px;

  &:hover {
    background-color: var(--color-hover);
  }

  color: ${(props) =>
    props.$isDirectory ? "var(--color-folder-text)" : "var(--color-file-text)"};
`;

const ItemName = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemSize = styled.span`
  font-size: 0.8em;
  color: var(--color-text-secondary);
  margin-left: 8px;
`;

const SubItemsContainer = styled.div`
  overflow: hidden;
`;

export default FileTreeItem;
