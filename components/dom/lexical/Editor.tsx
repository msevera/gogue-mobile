import "./styles.css";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListItemNode, ListNode } from '@lexical/list'
import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin"
import { $createOffsetView } from '@lexical/offset';
import { NodeEventPlugin } from "@lexical/react/LexicalNodeEventPlugin";

import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from '@lexical/markdown';

import ExampleTheme from "./ExampleTheme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import { $getRoot, EditorState, LexicalEditor, $setSelection, $createRangeSelection, $createNodeSelection, TextNode, $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND, COMMAND_PRIORITY_LOW } from "lexical";
import { $wrapSelectionInMarkNode, MarkNode } from '@lexical/mark';
import { useEffect, useRef } from 'react';

const placeholder = "Enter some rich text...";

const editorConfig = {
  editable: false,
  namespace: "React.js Demo",
  nodes: [],
  // Handling of errors during update
  onError(error: Error) {
    throw error;
  },
  nodes: [ListNode, ListItemNode, MarkNode, TextNode],
  // The editor theme
  theme: ExampleTheme,
  editorState: () => $convertFromMarkdownString(`Let's delve into **Layered Architecture**, a fundamental design pattern in software development. Imagine constructing a building where each floor serves a distinct purpose—this mirrors how layered architecture organizes software into separate layers, each with specific responsibilities.

**Typical Layers:**

1. **Presentation Layer:** This is the user interface, handling everything the user interacts with—think of it as the building's lobby, welcoming and guiding visitors.

2. **Business Logic Layer:** Here lies the core functionality, processing data and enforcing rules—akin to the building's operational floors where the main activities occur.

3. **Data Access Layer:** This layer manages data storage and retrieval, similar to the building's archives or storage rooms.

**Benefits:**

- **Separation of Concerns:** Each layer focuses on a specific aspect, making the system more modular and easier to manage.

- **Maintainability:** Changes in one layer, like updating the user interface, don't ripple through to others, simplifying updates.

- **Scalability:** You can scale individual layers based on demand, such as adding more servers to handle increased user traffic.

**Challenges:**

- **Performance Overhead:** Data passing through multiple layers can introduce latency.

- **Rigidity:** Strict layer boundaries might slow down development if business logic needs to change.

Understanding layered architecture equips you to build robust, scalable, and maintainable software systems. `, TRANSFORMERS)
};
export const Editor = ({
  setPlainText,
  setEditorState,
}: {
  setPlainText: React.Dispatch<React.SetStateAction<string>>;
  setEditorState: React.Dispatch<React.SetStateAction<string | null>>;
}) => {


  const editor = useRef<LexicalEditor>(null);
  console.log('editor', editor.current)

  useEffect(() => {
    if (editor.current) {
      editor.current.update(() => {
        // Set a range selection
        // const rangeSelection = $createRangeSelection();
        // rangeSelection.setStart(0, 0);
        // console.log('rangeSelection', rangeSelection)
        // $setSelection(rangeSelection);

        const view = $createOffsetView(editor.current! /*blockOffsetSize=*/);
        // Determine which TextNode and offset corresponds to char‑100 and char‑110
        // const { node: anchorNode, offset: anchorOffset } = view.getPointFromOffset(100);
        // const { node: focusNode, offset: focusOffset } = view.getPointFromOffset(110);
        // const selection = anchorNode.select(anchorOffset, focusOffset);
        const selection = view.createSelectionFromOffsets(10, 50);
        selection!.setStyle('background-color: red;');
        console.log('selectio2', selection)
        $wrapSelectionInMarkNode(selection);
      });


      editor.current.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          editor.current.update(() => {
            const selection = $getSelection();
            const offsetView = $createOffsetView(editor.current!, 100 /*blockOffsetSize=*/);
            const [globalStart, globalEnd] = offsetView.getOffsetsFromSelection(selection!);
            console.log('globalStart', globalStart, 'globalEnd', globalEnd);
            // handle the new selection
          });
        },
        COMMAND_PRIORITY_LOW
      );
    }

  }, [editor.current]);

  // useEffect(() => {
  //   let removeRootListener: () => void;
  //   const myListener = (event: Event, ...rest: any[]) => {
  //     // console.log('clicked', event.target, rest, JSON.stringify(event));
  //     // editor.current.update(() => {
  //     //   const selection = $getSelection();
  //     //   const offsetView = $createOffsetView(editor.current!, 100 /*blockOffsetSize=*/);
  //     //   const [globalStart, globalEnd] = offsetView.getOffsetsFromSelection(selection!);
  //     //   console.log('globalStart', globalStart, 'globalEnd', globalEnd);
  //     // });

  //     editor.current.read(() => {
  //       const selection = $getSelection();
  //       // if ($isRangeSelection(selection)) {
  //       //   const { key, offset } = selection.focus;
  //       //   console.log("Caret is at node:", key, "offset:", offset);
  //       // }
  //       console.log('selection', selection)
  //     });
  //   }
  //   if (editor.current) {
  //     removeRootListener = editor.current.registerRootListener((rootElement, prevRootElement) => {
  //       // add the listener to the current root element
  //       rootElement?.addEventListener('click', myListener);
  //       // remove the listener from the old root element - make sure the ref to myListener
  //       // is stable so the removal works and you avoid a memory leak.
  //       prevRootElement?.removeEventListener('click', myListener);
  //     });
  //   }

  //   return () => {
  //     if (removeRootListener) {
  //       removeRootListener();
  //     }
  //   }
  // }, [editor.current]);

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <EditorRefPlugin editorRef={editor} />
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input"
                aria-placeholder={placeholder}
                placeholder={
                  <div className="editor-placeholder">{placeholder}</div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin
            onChange={(editorState, editor, tags) => {
              editorState.read(() => {
                const root = $getRoot();
                const textContent = root.getTextContent();
                setPlainText(textContent);
              });
              setEditorState(JSON.stringify(editorState.toJSON()));
            }}
            ignoreHistoryMergeTagChange
            ignoreSelectionChange
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          {/* <TreeViewPlugin /> */}
        </div>
      </div>
    </LexicalComposer>
  );
}
