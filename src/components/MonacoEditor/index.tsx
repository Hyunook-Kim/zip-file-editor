import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import * as monaco from "monaco-editor";
import type { ZipItem } from "@/models/files";
import { getLanguageFromExtension } from "@/models/files/extension";

interface MonacoEditorProps {
  file: ZipItem;
  onChange?: (value: string) => void;
  onEditorCreated?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  file,
  onChange,
  onEditorCreated,
}) => {
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

    // 에디터 단축키 설정
    monaco.editor.addKeybindingRule({
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyZ,
      command: "undo",
    });

    monaco.editor.addKeybindingRule({
      keybinding:
        monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyZ,
      command: "redo",
    });

    monaco.editor.addKeybindingRule({
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY,
      command: "redo",
    });

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

      // 에디터 생성 콜백 호출 (부모 컴포넌트에서 에디터 참조 가능)
      if (onEditorCreated) {
        onEditorCreated(newEditor);
      }

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

    try {
      if (typeof file.content === "string") {
        console.log(
          `Updating editor content for ${file.path}, content length: ${file.content.length}`
        );

        const currentValue = editor.getValue();
        if (currentValue !== file.content) {
          editor.setValue(file.content);
        }

        const model = editor.getModel();
        if (model && file.extension) {
          const language = getLanguageFromExtension(file.extension);
          monaco.editor.setModelLanguage(model, language);
        }
      }
    } catch (error) {
      console.error("Error updating editor content:", error);
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

// Monaco Editor에서 undo/redo 명령 실행 유틸리티 함수 (외부에서 사용 가능)
export const executeUndo = (editor: monaco.editor.IStandaloneCodeEditor) => {
  editor.trigger("keyboard", "undo", null);
};

export const executeRedo = (editor: monaco.editor.IStandaloneCodeEditor) => {
  editor.trigger("keyboard", "redo", null);
};
