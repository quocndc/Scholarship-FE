import { Skeleton } from '@components/Skeleton';
import { TipTapCustomImage } from '@components/tailus-ui/editor/extensions/Image';
import ToggleGroup from '@components/tailus-ui/ToggleGroup';
import { Tooltip } from '@components/tailus-ui/Tooltip';
import { cn } from '@lib/utils';
import { IconBold, IconCode, IconHeading, IconHighlight, IconItalic, IconList, IconQuote, IconStrikethrough } from '@tabler/icons-react';
import { card } from '@tailus/themer';
import CharacterCount from '@tiptap/extension-character-count';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import type { Editor as EditorJs, EditorOptions } from '@tiptap/react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { Markdown } from 'tiptap-markdown';

import './editor.css';

// define your extension array
const defaultExtensions = [
  StarterKit,

  CharacterCount.configure({
    limit: 5000,
    mode: 'textSize',
  }),
  Highlight.configure({
    multicolor: true,
  }),
];

export type EditorProps = Partial<EditorOptions> & {
  placeholder?: string;
  limit?: number;
  className?: string;
  disabled?: boolean;
  leftMenu?: React.ReactNode;
  onUploadImg?: (file: File) => Promise<string>;
  onChange?: (content: string) => void;
};
export type EditorRef = {
  resetContent: () => void;
  editor: EditorJs | null;
};

export type EditorConfig = {
  label: string;
  isOn: boolean;
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
};

const Editor = React.forwardRef<EditorRef | null, EditorProps>(
  ({ extensions, leftMenu, placeholder, disabled, editorProps, limit, className, onUploadImg, onChange, ...props }, ref) => {
    const cardStyles = card({ variant: 'outlined', fancy: true });
    const handleImage = useCallback(
      async (img: File) => {
        if (!onUploadImg) {
          const path = URL.createObjectURL(img);
          return path;
        }
        const path = await onUploadImg(img);
        return path;
      },
      [onUploadImg]
    );
    const editor = useEditor({
      immediatelyRender: false,
      shouldRerenderOnTransaction: true,
      extensions: [
        ...defaultExtensions,
        Placeholder.configure({
          placeholder: placeholder ?? 'Fill somethings',
          emptyEditorClass: 'empty-editor is-editor-empty',
        }),
        TipTapCustomImage(handleImage),
        ...(extensions || []),
        Markdown.configure({
          breaks: true,
        }),
      ],
      editorProps: {
        ...editorProps,
        attributes: {
          class: cn(
            'prose prose-sm w-full max-w-none sm:prose-base dark:prose-invert focus:outline-none',
            'prose-p:my-0',
            editorProps?.attributes ? editorProps.attributes['class' as keyof typeof editorProps.attributes] : ''
          ),
        },
      },
      ...props,
      onBlur(props) {
        onChange?.(props.editor.storage.markdown.getMarkdown());
      },
    });
    const editorRef: React.MutableRefObject<EditorJs | null> = useRef(null);

    useImperativeHandle(ref, () => {
      return {
        resetContent: () => {
          editor?.commands.setContent('');
        },
        editor,
      };
    }, [editor]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const menuItems: EditorConfig[][] = [
      [
        {
          label: 'Bold',
          isOn: editor?.isActive('bold') || false,
          onClick: () => editor?.chain().focus().toggleBold().run(),
          icon: <IconBold />,
        },
        {
          label: 'Italic',
          isOn: editor?.isActive('italic') || false,
          onClick: () => editor?.chain().focus().toggleItalic().run(),
          icon: <IconItalic />,
        },
        {
          label: 'Strikethrough',
          isOn: editor?.isActive('strike') || false,
          onClick: () => editor?.chain().focus().toggleStrike().run(),
          icon: <IconStrikethrough />,
        },
        {
          label: 'Code',
          isOn: editor?.isActive('code') || false,
          onClick: () => editor?.chain().focus().toggleCode().run(),
          icon: <IconCode />,
        },
        {
          label: 'Highlight',
          isOn: editor?.isActive('highlight') || false,
          onClick: () => editor?.chain().focus().toggleHighlight().run(),
          icon: <IconHighlight />,
        },
      ],
      [
        {
          label: 'Bullet list',
          isOn: editor?.isActive('bulletList') || false,
          onClick: () => editor?.chain().focus().toggleBulletList().run(),
          icon: <IconList />,
        },
        {
          label: 'Numbered list',
          isOn: editor?.isActive('heading', { level: 1 }) || false,
          onClick: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
          icon: <IconHeading />,
        },
        {
          label: 'Quote',
          isOn: editor?.isActive('blockquote') || false,
          onClick: () => editor?.chain().focus().toggleBlockquote().run(),
          icon: <IconQuote />,
        },
      ],
    ];

    const renderMenu = useMemo(() => {
      return menuItems.map((group, i) => {
        return (
          <ToggleGroup.Root type="multiple" key={group[0].label + i}>
            {group.map((item, index) => {
              return (
                <Tooltip key={item.label} tooltip={item.label}>
                  <ToggleGroup.Item
                    key={index}
                    size="xs"
                    onClick={item.disabled ? undefined : item.onClick}
                    variant="plain"
                    disabled={item.disabled}
                    data-state={item.isOn ? 'on' : 'off'}
                    value={item.label}
                  >
                    <ToggleGroup.Icon className="" size="xs">
                      {item.icon}
                    </ToggleGroup.Icon>
                  </ToggleGroup.Item>
                </Tooltip>
              );
            })}
          </ToggleGroup.Root>
        );
      });
    }, [menuItems]);

    if (!editor) {
      return (
        <div className="space-y-2">
          <div className="flex justify-end gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-7 rounded-[--btn-radius]" />
            ))}
          </div>
          <Skeleton className="h-32 w-full rounded-[--card-radius]" />
        </div>
      );
    }
    editorRef.current = editor;
    return (
      <div className="">
        <div className={cn('flex justify-end', leftMenu && 'justify-between')}>
          {leftMenu}
          <div className="flex">{renderMenu}</div>
        </div>
        <EditorContent
          id="editor"
          disabled={disabled}
          classID="editor"
          className={cn('relative h-max w-full bg-[--ui-soft-bg]', cardStyles, className)}
          editor={editor}
        >
          {limit && (
            <p className="absolute bottom-2.5 right-4 z-10 text-xs text-muted-foreground">
              {editorRef?.current?.storage.characterCount.characters()} / {limit}
            </p>
          )}
        </EditorContent>
        {/* <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu> */}
        {/* <BubbleMenu editor={editor} className="z-10">
          <menu className="flex w-fit gap-2 rounded-md border border-border bg-background px-2 py-2.5 shadow-md">
            {renderMenu}
          </menu>
        </BubbleMenu> */}
      </div>
    );
  }
);
Editor.displayName = 'Editor';

export default Editor;
