import { javascript } from '@codemirror/lang-javascript';
import { EditorView, basicSetup } from 'codemirror';
import { Options } from 'lib';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace';
import 'prismjs/themes/prism.min.css';
// import {
//   createCodeMirror,
//   createEditorControlledValue,
// } from 'solid-codemirror';
import { EditorState, TransactionSpec } from '@codemirror/state';
import babelPlugin from 'prettier/plugins/babel';
import prettierPluginEstree from 'prettier/plugins/estree';
import * as prettier from 'prettier/standalone';
import { Component, createEffect, createSignal, onMount } from 'solid-js';
import stringifyObject from 'stringify-object';

interface Props {
  options: Options;
}

Prism.plugins.NormalizeWhitespace.setDefaults({
  'remove-trailing': true,
  'remove-indent': true,
  'left-trim': true,
  'right-trim': true,
  'break-lines': 80,
  //   indent: 2,
  //   'remove-initial-line-feed': false,
  //   'tabs-to-spaces': 4,
  //   'spaces-to-tabs': 4,
});

const Code: Component<Props> = (props) => {
  const [code, setCode] = createSignal<string>('');
  const [readOnly, setReadOnly] = createSignal<boolean>(true);
  let editorRef:
    | HTMLDivElement
    | ((el: HTMLDivElement) => void)
    | null
    | undefined = null;
  let view: EditorView;
  let state = EditorState.create({
    doc: '123',
    extensions: [basicSetup, javascript({ jsx: true, typescript: true })],
  });

  // const { editorView, ref: editorRef } = createCodeMirror({
  //   value: 'ok',
  // });

  onMount(() => {
    view = new EditorView({
      state: state,
      parent: editorRef as HTMLDivElement,
    });
  });
  //   createEditorReadonly(editorView, readOnly);

  createEffect(() => {
    setCode(`<SolidCornerSmoothing class="box2" 
    options={${stringifyObject(props.options, {
      indent: '',
      singleQuotes: false,
    })}}
>
        {props.children}
</SolidCornerSmoothing>

/*
CSS 
.box {
  width: 200px;
  height: 200px;
}
*/

`);

    (async () => {
      const result = await prettier.format(code(), {
        parser: 'babel',
        plugins: [babelPlugin, prettierPluginEstree],
      });

      // console.log(result);
      let transaction: TransactionSpec = view.state.update({
        changes: {
          from: 0,
          to: view.state.doc.toString().length,
          insert: result,
        },
      });

      view.dispatch(transaction);
    })();
  });
  return (
    <div class="code">
      <div ref={editorRef as unknown as HTMLDivElement} />
    </div>
  );
};

export default Code;
