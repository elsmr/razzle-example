import serialize from 'serialize-javascript';
import { isProd } from '../';
import {
  preloadedStateWindowKey,
  startAppWindowKey
} from '../../common/constants';
import { getBundles } from 'react-loadable/webpack';

const stats = require('../../../build/react-loadable.json');
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

export const sendHtmlResponse = (req, res) => {
  const { appMarkup, appState, helmet, modules } = res.locals;
  const { js, css } = assets.client;
  const bundles = getBundles(stats, modules);
  const jsChunks = bundles.filter(bundle => bundle.file.endsWith('.js'));
  const cssChunks = bundles.filter(bundle => bundle.file.endsWith('.css'));

  res.status(200).send(
    html`
    <!doctype html>
    <html ${helmet.htmlAttributes.toString()}>
      <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta charSet='utf-8' />
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
        ${css ? `<link rel="stylesheet" href="${css}">` : ''}
        ${cssChunks
          .map(chunk => {
            return `<link rel="stylesheet" href="/${chunk.file}" />`;
          })
          .join()}
      </head>
      <body ${helmet.bodyAttributes.toString()}>
        <div id="root">${appMarkup}</div>
        <script>
          window.${preloadedStateWindowKey} = ${serialize(appState)}
        </script>
        <script src="${js}"${isProd ? '' : ' crossorigin'}></script>
        ${jsChunks
          .map(
            chunk =>
              isProd
                ? `<script src="/${chunk.file}"></script>`
                : `<script src="http://${process.env.HOST}:${process.env.PORT +
                    1}/${chunk.file}"></script>`
          )
          .join('\n')}
        <script>window.${startAppWindowKey}();</script>
      </body>
    </html>
  `
  );
};