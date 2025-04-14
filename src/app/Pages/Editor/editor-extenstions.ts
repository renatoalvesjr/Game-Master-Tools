import { Extension } from '@tiptap/core';
import Underline from '@tiptap/extension-underline';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Heading from '@tiptap/extension-heading';
import Placeholder from '@tiptap/extension-placeholder';
import History from '@tiptap/extension-history';
import Typography from '@tiptap/extension-typography';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Link from '@tiptap/extension-link';
import Code from '@tiptap/extension-code';
import TextAlign from '@tiptap/extension-text-align';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Highlight from '@tiptap/extension-highlight';
import TextStyle from '@tiptap/extension-text-style';
import ImageResize from 'tiptap-extension-resize-image';
import Image from '@tiptap/extension-image'
import Dropcursor from '@tiptap/extension-dropcursor';
import { Color as ColorExtension } from '@tiptap/extension-color';
import ListKeymap from '@tiptap/extension-list-keymap';
import FontFamily from '@tiptap/extension-font-family';
import FontSize from 'tiptap-extension-font-size';
import Strike from '@tiptap/extension-strike'

const LiteralTab = Extension.create({
  name: 'literalTab',

  addKeyboardShortcuts() {
    return {
      Tab: () => {
        return this.editor.commands.insertContent('\t');
      },
    };
  },
});

interface FontList {
  name: string;
  value: string;
}

export const fonts: FontList[] = [
  { name: 'Arial', value: 'Arial' },
  { name: 'Cursive', value: 'Cursive' },
  { name: 'Comic Sans', value: 'Comic Sans MS' },
  { name: 'Courier New', value: 'Courier New' },
];


export const extensions = [
  Document,
  Paragraph,
  Text,
  TextStyle,
  FontSize,
  ColorExtension.configure({ types: ['textStyle'] }),
  Bold,
  BulletList,
  OrderedList,
  Underline,
  Strike.configure({
    HTMLAttributes: {
      class: 'line-through',
    },
  }),
  ListItem,
  LiteralTab,
  TaskList,
  FontFamily,
  TaskItem.configure({ nested: true }),
  Highlight.configure({ multicolor: true }),
  Italic,
  History,
  Code,
  Image,
  ImageResize,
  Typography,
  Subscript,
  Superscript,
  ListKeymap,
  Dropcursor,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Heading.configure({
    levels: [1, 2, 3],
  }),
  Placeholder.configure({
    placeholder: 'Write something',
  }),
  Link.configure({
    HTMLAttributes: {
      class: 'underline text-blue-500 hover:cursor-pointer',
      target: '_blank',
      onclick: '{{es.openExternal(event.target.href)}}',
    },
    openOnClick: true,
    autolink: true,
    defaultProtocol: 'https',
    protocols: ['http', 'https'],
    isAllowedUri: (url, ctx) => {
      try {
        // construct URL
        const parsedUrl = url.includes(':')
          ? new URL(url)
          : new URL(`${ctx.defaultProtocol}://${url}`);

        // use default validation
        if (!ctx.defaultValidate(parsedUrl.href)) {
          return false;
        }

        // disallowed protocols
        const disallowedProtocols = ['ftp', 'file', 'mailto'];
        const protocol = parsedUrl.protocol.replace(':', '');

        if (disallowedProtocols.includes(protocol)) {
          return false;
        }

        // only allow protocols specified in ctx.protocols
        const allowedProtocols = ctx.protocols.map((p) =>
          typeof p === 'string' ? p : p.scheme
        );

        if (!allowedProtocols.includes(protocol)) {
          return false;
        }

        // disallowed domains
        const disallowedDomains = [
          'example-phishing.com',
          'malicious-site.net',
        ];
        const domain = parsedUrl.hostname;

        if (disallowedDomains.includes(domain)) {
          return false;
        }

        // all checks have passed
        return true;
      } catch (error) {
        return false;
      }
    },
    shouldAutoLink: (url) => {
      try {
        // construct URL
        const parsedUrl = url.includes(':')
          ? new URL(url)
          : new URL(`https://${url}`);

        // only auto-link if the domain is not in the disallowed list
        const disallowedDomains = [
          'example-no-autolink.com',
          'another-no-autolink.com',
        ];
        const domain = parsedUrl.hostname;

        return !disallowedDomains.includes(domain);
      } catch (error) {
        return false;
      }
    },
  }),
];
