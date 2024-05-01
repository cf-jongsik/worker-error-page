import { Context, Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
// @ts-ignore
import manifest from '__STATIC_CONTENT_MANIFEST';

const app: Hono = new Hono();

app.get(
	'/static/*',
	serveStatic({
		root: './',
		manifest,
		onNotFound: (path: string, c: Context) => {
			console.log(`${path} not found`);
			c.redirect('/404.html', 301);
		},
	})
);
app.get('/favicon.ico', serveStatic({ path: './favicon.ico', manifest }));
app.get('/404.html', serveStatic({ path: './404.html', manifest }));
app.get('/500.html', serveStatic({ path: './500.html', manifest }));

app.get('/error/404', async (c: Context) => {
	return c.redirect('/404.html', 301);
});
app.get('/error/500', async (c: Context) => {
	return c.redirect('/500.html', 301);
});

app.notFound((c: Context) => {
	return c.redirect('/404.html', 301);
});

app.onError((err: Error, c: Context) => {
	console.log(err);
	return c.json(c, { status: 500 });
});

export default app;
