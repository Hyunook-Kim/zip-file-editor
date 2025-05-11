import React from "react";
import styled from "styled-components";
import FileTree from "../FileTree";

const Sidebar = () => {
  return (
    <SidebarContainer>
      <FileTree />
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export default Sidebar;
