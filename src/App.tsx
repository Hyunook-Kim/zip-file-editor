import styled from "styled-components";

const TopBar = () => {
  return (
    <div style={{ padding: "10px", height: "100%" }}>
      <h2>File Upload Handler</h2>
    </div>
  );
};

const Sidebar = () => {
  return (
    <div style={{ padding: "10px" }}>
      <h3>File Tree</h3>
    </div>
  );
};

const Editor = () => {
  return (
    <div style={{ padding: "10px" }}>
      <div style={{ marginBottom: "10px", borderBottom: "1px solid #e0e0e0" }}>
        <h3>File Tab</h3>
      </div>
      <div>
        <h3>Monaco Editor</h3>
      </div>
    </div>
  );
};

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
  background-color: green;
  height: 100%;
  width: 100%;
`;

const HeaderContainer = styled.div`
  height: 60px;
  width: 100%;
  border-bottom: 1px solid #e0e0e0;
`;

const BodyContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  overflow: hidden;
`;

const SidebarContainer = styled.div`
  width: 250px;
  border-right: 1px solid #e0e0e0;
  overflow: auto;
`;

const ContentContainer = styled.div`
  flex: 1;
  overflow: auto;
`;

export default App;
