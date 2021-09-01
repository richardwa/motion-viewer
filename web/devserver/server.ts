import * as Bundler from 'parcel-bundler';
import * as express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';


const app = express();

app.use(createProxyMiddleware(
  '/streams',
  { target: 'http://localhost' })
);
app.use(createProxyMiddleware(
  ['/camera1', '/camera2', '/camera3'],
  { target: 'http://localhost/motion' })
);

const bundler = new Bundler('src/index.html', {
  outDir: "target"
});

app.use(bundler.middleware());

app.listen(8000);
console.log("port", 8000);