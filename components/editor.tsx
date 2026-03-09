"use client";
import { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Code from "@editorjs/code";
import InlineCode from "@editorjs/inline-code";
import Marker from "@editorjs/marker";
import ImageTool from "@editorjs/image";
import { createClient } from "@/lib/supabase";

export default function Editor({ data, onChange }: { data?: any; onChange: (val: any) => void }) {
  const ejInstance = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!ejInstance.current) {
      const editor = new EditorJS({
        holder: "editorjs",
        data: data || {},
        onReady: () => {
          ejInstance.current = editor;
        },
        onChange: async () => {
          const content = await editor.save();
          onChange(content);
        },
        placeholder: "Tulis cerita anda di sini...",
        tools: {
          header: {
            class: Header as any,
            inlineToolbar: true,
            config: {
              placeholder: 'Enter a header',
              levels: [2, 3, 4],
              defaultLevel: 2
            }
          },
          list: {
            class: List as any,
            inlineToolbar: true,
            config: { defaultStyle: 'unordered' }
          },
          quote: {
            class: Quote as any,
            inlineToolbar: true,
            config: {
              quotePlaceholder: 'Enter a quote',
              captionPlaceholder: 'Quote\'s author',
            },
          },
          code: Code,
          inlineCode: InlineCode,
          marker: Marker,
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const supabase = createClient();
                  const fileExt = file.name.split('.').pop();
                  const fileName = `${Math.random()}.${fileExt}`;
                  const filePath = `blog-content/${fileName}`;

                  // Pastikan kau dah create bucket 'blog-content-images' kat Supabase
                  const { error: uploadError } = await supabase.storage
                    .from('blog-content-images')
                    .upload(filePath, file);

                  if (uploadError) throw uploadError;

                  const { data: urlData } = supabase.storage
                    .from('blog-content-images')
                    .getPublicUrl(filePath);

                  return {
                    success: 1,
                    file: {
                      url: urlData.publicUrl,
                    }
                  };
                }
              }
            }
          }
        },
      });
    }
    return () => {
      if (ejInstance.current) {
        ejInstance.current.destroy();
        ejInstance.current = null;
      }
    };
  }, []);

  return (
    <div 
      id="editorjs" 
      className="prose prose-invert max-w-none min-h-[400px] border border-border/50 rounded-xl p-8 bg-card shadow-sm" 
    />
  );
}