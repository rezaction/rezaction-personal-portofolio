// Gerbang dashboard (Cloudflare Workers + static assets).
// Atur di Cloudflare → Worker → Settings → Variables and secrets (Runtime), tipe Secret:
//   ADMIN_PATH      alamat rahasia dashboard, mis. "x7k2-rahasia"  (tanpa garis miring)
//   ADMIN_ID        ID 40 karakter  → dipakai sebagai USERNAME saat login
//   ADMIN_PASSWORD  password        → dipakai sebagai PASSWORD saat login
// File dashboard ada di _admin/, tapi diblokir untuk publik; hanya terbuka lewat ADMIN_PATH + login.
const enc = new TextEncoder();

async function eq(a, b) {
  const [x, y] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(a)), crypto.subtle.digest('SHA-256', enc.encode(b))]);
  const u = new Uint8Array(x), v = new Uint8Array(y);
  let d = 0;
  for (let i = 0; i < u.length; i++) d |= u[i] ^ v[i];
  return d === 0;
}

const SEC = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const p = url.pathname;
    const base = env.ADMIN_PATH ? '/' + String(env.ADMIN_PATH).trim().replace(/^\/+|\/+$/g, '') : null;
    const isAdmin = !!base && base !== '/' && (p === base || p.startsWith(base + '/'));

    if (!isAdmin) {
      if (p === '/_admin' || p.startsWith('/_admin/')) return new Response('Not found', { status: 404, headers: SEC });
      return env.ASSETS.fetch(request);
    }

    if (!env.ADMIN_ID || !env.ADMIN_PASSWORD) return new Response('ADMIN_ID / ADMIN_PASSWORD belum diatur di Cloudflare.', { status: 500, headers: SEC });

    const deny = (msg) => new Response(msg, { status: 401, headers: { ...SEC, 'WWW-Authenticate': 'Basic realm="Dashboard", charset="UTF-8"' } });
    const h = request.headers.get('Authorization') || '';
    if (!h.startsWith('Basic ')) return deny('Login diperlukan.');
    let user = '', pass = '';
    try {
      const dec = atob(h.slice(6));
      const i = dec.indexOf(':');
      user = dec.slice(0, i);
      pass = dec.slice(i + 1);
    } catch (e) {
      return deny('Login diperlukan.');
    }
    const okU = await eq(user, String(env.ADMIN_ID));
    const okP = await eq(pass, String(env.ADMIN_PASSWORD));
    if (!(okU && okP)) return deny('ID atau password salah.');

    if (p === base) return new Response(null, { status: 308, headers: { ...SEC, Location: base + '/' } });

    const res = await env.ASSETS.fetch(new Request(new URL('/_admin/', url).toString()));
    const out = new Response(res.body, res);
    for (const k in SEC) out.headers.set(k, SEC[k]);
    return out;
  },
};
