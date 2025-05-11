import React from "react";
import styled from "styled-components";
import TopBar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";

function App() {
  return (
    <>
      <AppContainer>
        <HeaderContainer>
          <TopBar />
        </HeaderContainer>
        <BodyContainer>
          <SidebarContainer>
            <Sidebar />
          </SidebarContainer>
          <ContentContainer>
            <Editor />
          </ContentContainer>
        </BodyContainer>
      </AppContainer>
    </>
  );
}

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--color-primary);
  height: 100%;
  width: 100%;
`;

const HeaderContainer = styled.div`
  min-height: 60px;
  height: auto;
  width: 100%;
  border-bottom: 1px solid var(--color-border);
`;

const BodyContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  overflow: hidden;
`;

const SidebarContainer = styled.div`
  width: 250px;
  border-right: 1px solid var(--color-border);
  overflow: auto;
`;

const ContentContainer = styled.div`
  flex: 1;
  overflow: auto;
`;

export default App;
