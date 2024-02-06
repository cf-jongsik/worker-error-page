import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import html404 from '../assets/static/404.html';
import html500 from '../assets/static/500.html';

const app: Hono = new Hono();

app.get('/favicon.ico', serveStatic({ root: './' }));
app.get('*', async (c) => {
	const res: Response = await fetch(c.req.url);
	const acceptHeader: string | undefined = c.req.header('Accept');

	const isHTMLContentTypeAccepted: Boolean = typeof acceptHeader === 'string' && acceptHeader.indexOf('text/html') >= 0;
	if (isHTMLContentTypeAccepted) {
		switch (res.status) {
			case 404: {
				return new Response(html404, { status: 404, headers: res.headers });
				break;
			}
			case 500: {
				return new Response(html500, { status: 500, headers: res.headers });
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
