"use client";
import { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";

export default function Editor({ data, onChange }: { data?: any; onChange: (val: any) => void }) {
  const ejInstance = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!ejInstance.current) {
      const editor = new EditorJS({
        holder: "editorjs",
        data: data || {},
        onReady: () => { ejInstance.current = editor; },
        onChange: async () => {
          const content = await editor.save();
          onChange(content);
        },
        tools: {
          header: Header,
          list: List,
        },
        placeholder: "Tulis cerita anda di sini...",
      });
    }
    return () => {
      ejInstance.current?.destroy();
      ejInstance.current = null;
    };
  }, []);

  return <div id="editorjs" className="prose prose-invert max-w-none min-h-[300px] border border-border/50 rounded-xl p-6 bg-card" />;
}