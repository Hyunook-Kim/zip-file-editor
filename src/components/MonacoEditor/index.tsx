import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import * as monaco from "monaco-editor";
import type { ZipItem } from "@/models/files";
import { getLanguageFromExtension } from "@/models/files/extension";

interface MonacoEditorProps {
  file: ZipItem;
  onChange?: (value: string) => void;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({ file, onChange }) => {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!editorContainerRef.current || editor) {
      return;
    }

    console.log("Creating Monaco Editor instance");

    const language = getLanguageFromExtension(file.extension);

    const initialContent = typeof file.content === "string" ? file.content : "";

    console.log(
      `Initializing editor for ${file.path} with content length: ${initialContent.length}`
    );
    console.log(
      `Content preview: ${initialContent.substring(0, 100)}${
        initialContent.length > 100 ? "..." : ""
      }`
    );

    const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
      value: initialContent,
      language,
      theme: "vs-dark",
      automaticLayout: true,
      minimap: {
        enabled: true,
      },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: "on",
      renderLineHighlight: "all",
      wordWrap: "on",
    };

    try {
      const newEditor = monaco.editor.create(
        editorContainerRef.current,
        editorOptions
      );
      setEditor(newEditor);

      const disposable = newEditor.onDidChangeModelContent(() => {
        if (onChange) {
          onChange(newEditor.getValue());
        }
      });

      return () => {
        console.log("Disposing Monaco Editor");
        disposable.dispose();
        if (newEditor) {
          newEditor.dispose();
        }
        setEditor(null);
      };
    } catch (error) {
      console.error("Error creating Monaco Editor:", error);
    }
  }, []);

  useEffect(() => {
    if (!editor) return;

    if (typeof file.content === "string") {
      console.log(
        `Updating editor content for ${file.path}, content length: ${file.content.length}`
      );

      editor.setValue(file.content);

      const model = editor.getModel();
      if (model && file.extension) {
        const language = getLanguageFromExtension(file.extension);
        monaco.editor.setModelLanguage(model, language);
      }
    }
  }, [file, editor]);

  return (
    <EditorContainer>
      <MonacoContainer ref={editorContainerRef} />
    </EditorContainer>
  );
};

const EditorContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const MonacoContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export default MonacoEditor;
