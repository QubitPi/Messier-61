/*
 * Copyright 2023 Paion Data. All rights reserved.
 */
import React from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

import ToolbarPlugin from "./plugins/NexusgraphToolbarPlugin";
import OnChangePlugin from "./plugins/NexusgraphOnChangePlugin";

import styles from "./LexicalEditor.module.css";
import "./editor.css"

export default function LexicalEditor({ lexicalEditorConfig }: { lexicalEditorConfig: any }): JSX.Element {
  return (
    <LexicalComposer initialConfig={lexicalEditorConfig}>
      <div className={styles["editor-container"]}>
        <ToolbarPlugin />
        <PlainTextPlugin
          contentEditable={<ContentEditable className={styles["editor-input"]} />}
          placeholder={<Placeholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <OnChangePlugin />
      </div>
    </LexicalComposer>
  );
}

function Placeholder(): JSX.Element {
  return <div className={styles["editor-placeholder"]}>Enter some plain text...</div>;
}
