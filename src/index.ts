import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';

const app: Hono = new Hono();

app.get('/static/*', serveStatic({ root: './' }));

app.get('*', async (c) => {
	const res: Response = await fetch(c.req.url);
	const acceptHeader: string | undefined = c.req.header('Accept');
	const isHTMLContentTypeAccepted: Boolean = typeof acceptHeader === 'string' && acceptHeader.indexOf('text/html') >= 0;

	if (isHTMLContentTypeAccepted) {
		switch (res.status) {
			case 404: {
				return c.redirect('/static/404.html', 404);
				break;
			}
			case 500: {
				return c.redirect('/static/500.html', 500);
				break;
			}
			default: {
				return res;
				break;
			}
		}
	}
	return res;
});

export default app;
