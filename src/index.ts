import { Context, Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
// @ts-ignore
import manifest from '__STATIC_CONTENT_MANIFEST';

const app: Hono = new Hono();

app.get('/static/*', serveStatic({ root: './', manifest }));
app.get('/favicon.ico', serveStatic({ path: './favicon.ico', manifest }));
app.get('/404.html', serveStatic({ path: './404.html', manifest }));
app.get('/500.html', serveStatic({ path: './500.html', manifest }));

app.get('/route', async (c: Context) => {
	const res: Response = await fetch(c.req.url);
	const acceptHeader: string | undefined = c.req.header('Accept');

	const isHTMLContentTypeAccepted: Boolean = typeof acceptHeader === 'string' && acceptHeader.indexOf('text/html') >= 0;
	if (isHTMLContentTypeAccepted) {
		switch (res.status) {
			case 404: {
				return c.redirect('/404.html', 301);
			}
			case 500: {
				return c.redirect('/500.html', 301);
			}
			default: {
				return res;
			}
		}
	}
	return c.text('works?', 200);
});

app.get('/error/404', async (c: Context) => {
	return c.redirect('/404.html', 301);
});
app.get('/error/500', async (c: Context) => {
	return c.redirect('/500.html', 301);
});

export default app;
