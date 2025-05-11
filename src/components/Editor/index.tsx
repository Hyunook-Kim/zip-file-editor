import styled from "styled-components";

const Editor = () => {
  return (
    <EditorContainer>
      <TabsContainer>
        <h3>File Tabs</h3>
      </TabsContainer>
      <EditorContent>
        <h3>Monaco Editor</h3>
      </EditorContent>
    </EditorContainer>
  );
};

const EditorContainer = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const TabsContainer = styled.div`
  margin-bottom: 10px;
  border-bottom: 1px solid var(--color-border);
`;

const EditorContent = styled.div`
  flex: 1;
`;

export default Editor;
