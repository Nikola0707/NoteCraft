"use client";
import * as Y from "yjs";
import { useEffect, useState } from "react";
import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteEditor } from "@blocknote/core";
import { stringToColor } from "@/lib/stringToColor";
import TranslateDocument from "./TranslateDocument";

type EditorProps = {
  document: Y.Doc;
  provider: any;
  darkMode: boolean;
};

function BlockNode({ document, provider, darkMode }: EditorProps) {
  const userInfo = useSelf((me) => me.info);

  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: document.getXmlFragment("document-store"),
      user: {
        name: userInfo?.name,
        color: stringToColor(userInfo?.email),
      },
    },
  });
  return (
    <div className="w-full">
      <BlockNoteView
        className="min-h-screen"
        editor={editor}
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
}

function Editor() {
  const room = useRoom();
  const [document, setDocument] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  const [darkMode, setDarkMode] = useState(false);

  const style = `hover:text-white ${
    darkMode
      ? "text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700"
      : "text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-700"
  }`;

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    setDocument(yDoc);
    setProvider(yProvider);

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
    };
  }, [room]);

  if (!document || !provider) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex gap-2 justify-end mb-10">
        {/* Translate document using AI */}

        <TranslateDocument doc={document} />

        {/* Dark Mode Toggle*/}
        <Button className={style} onClick={() => setDarkMode((prev) => !prev)}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </Button>
        {/* BlockNote */}
        <BlockNode
          document={document}
          provider={provider}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
}
export default Editor;
