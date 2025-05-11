import React from "react";
import styled from "styled-components";
import type { FileType } from "@/models/files";

interface IconProps {
  type: FileType;
  isOpen?: boolean;
  size?: number;
}

export const FileIcon: React.FC<IconProps> = ({
  type,
  isOpen = false,
  size = 16,
}) => {
  const getIconByType = () => {
    switch (type) {
      case "directory":
        return isOpen ? (
          <FolderOpenIcon size={size} />
        ) : (
          <FolderIcon size={size} />
        );
      case "text":
        return <TextFileIcon size={size} />;
      case "image":
        return <ImageFileIcon size={size} />;
      case "binary":
      default:
        return <BinaryFileIcon size={size} />;
    }
  };

  return getIconByType();
};

interface SvgIconProps {
  size?: number;
}

const SvgIconContainer = styled.div<SvgIconProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.size || 16}px;
  height: ${(props) => props.size || 16}px;
  margin-right: 5px;
`;

const FolderIcon: React.FC<SvgIconProps> = ({ size = 16 }) => (
  <SvgIconContainer size={size}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
  </SvgIconContainer>
);

const FolderOpenIcon: React.FC<SvgIconProps> = ({ size = 16 }) => (
  <SvgIconContainer size={size}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v1"></path>
      <path d="M2 10v9a2 2 0 0 0 2 2h16"></path>
      <path d="M12 14l4 -4"></path>
      <path d="M16 14v-4h-4"></path>
    </svg>
  </SvgIconContainer>
);

const TextFileIcon: React.FC<SvgIconProps> = ({ size = 16 }) => (
  <SvgIconContainer size={size}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  </SvgIconContainer>
);

const ImageFileIcon: React.FC<SvgIconProps> = ({ size = 16 }) => (
  <SvgIconContainer size={size}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  </SvgIconContainer>
);

const BinaryFileIcon: React.FC<SvgIconProps> = ({ size = 16 }) => (
  <SvgIconContainer size={size}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <path d="M10 12v-2a2 2 0 0 1 2 -2v0a2 2 0 0 1 2 2v2"></path>
      <rect x="8" y="14" width="8" height="4" rx="1"></rect>
    </svg>
  </SvgIconContainer>
);

export default FileIcon;
