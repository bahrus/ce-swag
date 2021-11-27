import {html} from './html';
import {substrBetween} from './substrBetween';
import {getTagNameToDeclaration} from './getTagNameToDeclaration';
import { getFields } from './getFields';
import { Declaration, CustomElementDeclaration, CustomElement, Package, ClassDeclaration, ClassField, ClassMethod } from '../node_modules/custom-elements-manifest/schema.d.js';

const headers =  {
  "content-type": "text/html;charset=UTF-8",
  'Access-Control-Allow-Origin': '*',
};

export async function handleRequest(request: Request): Promise<Response> {
  const url = request.url;
  const href = unescape(substrBetween(url, 'href=', '&'));
  const tagName = unescape(substrBetween(url, 'tagName=', '&'));
  if(href === '' || tagName === '') return new Response(html`
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Custom Element Demo Usage</title>
      <!-- Compiled and minified CSS -->
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">

      <!-- Compiled and minified JavaScript -->
      <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
    </head>
    <body>
      <h1>Custom Element Demo Usage</h1>
      <form style="display:flex;flex-direction:column">
        <label for="href">href</label>
        <input type="text" id="href" size=100 name="href" value="https://cdn.skypack.dev/xtal-editor/custom-elements.json">
        <label for="tagName">tagName</label>
        <input type="text" id="tagName" size=100 name="tagName" value="xtal-editor">
        <label for="stylesheet">stylesheet</label>
        <input type="text" id="stylesheet" size=100 name="stylesheet" value="https://cdn.skypack.dev/wc-info/simple-ce-style.css">
        <button type="submit" class="btn waves-effect waves-light">Submit</button>
      </form>      
    </body>
  </html>
  `, {headers});
    const resp = await fetch(href);
    const json = await resp.json();
    const processed = getTagNameToDeclaration(json)!;
    const ce = processed.tagNameToDeclaration[tagName];
    const ceInfo =  getFields(processed.tagNameToDeclaration, tagName)!;
    return new Response(html`
       <form>
        ${ceInfo.fields.map(field => html`
          <label>
            <details>
              <summary>${field.name}</summary>
              <dfn>${field.description!}</dfn>
              ${field.inheritedFrom ? html`
                <code data-inherited-from="${field.inheritedFrom.name}">${JSON.stringify(field.inheritedFrom)}</code>
              `: html``}
            </details>
            ${renderField(field)}
          </label>
        `).join('')}
       </form>
       <xtal-editor read-only key=package>
        <textarea slot=initVal>
        ${JSON.stringify(ceInfo)}
        </textarea>
        </xtal-editor>
        <script type=module>
          import 'https://cdn.skypack.dev/xtal-editor';
        </script>
    `, {headers});
}

function renderField(field: ClassField){
  const typ = field.type === undefined ? 'string' : field.type.text;
  switch(typ){
    case 'string':
      return html`
        <textarea name="${field.name}">
          ${field.default!}
      </textarea>
      `;
      break;
    case 'boolean':
      {
      const checked = field.default === 'true' ? 'checked' : '';
      return html`
      <input type="checkbox" name="${field.name}" ${checked}>
        ${field.default!}
      </textarea>
      `;
      }
      break;
    default:
      return html``;
  }
  
}
