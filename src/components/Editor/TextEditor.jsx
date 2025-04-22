import React, { useEffect, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";

// List Commands
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';

// OnChange Plugin
function OnChangePlugin({ onChange }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const content = root.getTextContent(); // plain text
        onChange(content);
      });
    });
  }, [editor, onChange]);

  return null;
}

// Toolbar Component
function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isList, setIsList] = useState(false);

  // Apply text formatting
  const toggleBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  };

  const toggleItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  };

  const toggleUnderline = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
  };

  const toggleList = () => {
    const selection = editor.getSelection();
    if ($isRangeSelection(selection)) {
      // Check if the current selection is part of an unordered or ordered list
      if (selection.hasFormat("unordered-list")) {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND); // Switch to ordered list
      } else {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND); // Switch to unordered list
      }
    }
  };

  // Check if the selected text has specific styles
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = editorState.selection;
        if ($isRangeSelection(selection)) {
          setIsBold(selection.hasFormat("bold"));
          setIsItalic(selection.hasFormat("italic"));
          setIsUnderline(selection.hasFormat("underline"));
          setIsList(selection.hasFormat("unordered-list") || selection.hasFormat("ordered-list"));
        }
      });
    });
  }, [editor]);

  return (
    <div className="mb-2 flex gap-2 border-b pb-2">
      <button
        onClick={toggleBold}
        className={`px-3 py-1 border rounded ${isBold ? "bg-blue-500 text-white" : "bg-white"}`}
      >
        Bold
      </button>
      <button
        onClick={toggleItalic}
        className={`px-3 py-1 border rounded ${isItalic ? "bg-blue-500 text-white" : "bg-white"}`}
      >
        Italic
      </button>
      <button
        onClick={toggleUnderline}
        className={`px-3 py-1 border rounded ${isUnderline ? "bg-blue-500 text-white" : "bg-white"}`}
      >
        Underline
      </button>
      <button
        onClick={toggleList}
        className={`px-3 py-1 border rounded ${isList ? "bg-blue-500 text-white" : "bg-white"}`}
      >
        List
      </button>
    </div>
  );
}

// Main TextEditor Component
function TextEditor({ onChange }) {
  const initialConfig = {
    namespace: "TextEditor",
    theme: {},
    onError: (error) => console.error("Lexical Error:", error),
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <Toolbar /> {/* Toolbar is included here */}
      <RichTextPlugin
        contentEditable={<ContentEditable className="min-h-[150px] rounded border p-2" />}
        placeholder={<div className="text-gray-400">Enter some text...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <AutoFocusPlugin />
      <OnChangePlugin onChange={onChange} />
    </LexicalComposer>
  );
}

export default TextEditor;
