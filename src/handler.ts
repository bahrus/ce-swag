import {html} from './html';
import {substrBetween} from './substrBetween';

const headers =  {
  "content-type": "text/html;charset=UTF-8",
  'Access-Control-Allow-Origin': '*',
};

export async function handleRequest(request: Request): Promise<Response> {
  const url = request.url;
  const href = unescape(substrBetween(url, 'href=', '&'));
  if(href === '') return new Response(html`
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Custom Element Demo Usage</title>
    </head>
    <body>
      <h1>Custom Element Demo Usage</h1>
      <form style="display:flex;flex-direction:column">
        <label for="href">href</label>
        <input type="text" id="href" size=100 name="href" value="https://cdn.skypack.dev/xtal-editor/custom-elements.json">
        <label for="stylesheet">stylesheet</label>
        <input type="text" id="stylesheet" size=100 name="stylesheet" value="https://cdn.skypack.dev/wc-info/simple-ce-style.css">
        <button type="submit">Submit</button>
      </form>      
    </body>
  </html>
  `, {headers});
  return new Response(`request method: ${request.method}`)
}
