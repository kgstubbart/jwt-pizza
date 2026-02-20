// tests/mockBackend.ts
import type { Page } from '@playwright/test';

type User = { id: string; name: string; email: string; roles: { role: string }[] };

export async function installMockBackend(page: Page) {
  // simple in-memory “DB”
  const token = 'fake.token';
  let currentUser: User | null = null;

  let users: User[] = [
    { id: '1', name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] },
    { id: '2', name: '常用名字', email: 'a@jwt.com', roles: [{ role: 'admin' }] },
  ];

  // IMPORTANT: match both "/api/auth" and "/api/auth?..." and "/api/auth/..."
  await page.route('**/api/auth**', async (route) => {
    const req = route.request();
    const method = req.method();

    if (method === 'POST') {
      // register
      const body = JSON.parse(req.postData() ?? '{}');
      const newUser: User = {
        id: String(users.length + 1),
        name: body.name,
        email: body.email,
        roles: [{ role: 'diner' }],
      };
      users.unshift(newUser);
      currentUser = newUser;
      return route.fulfill({ json: { user: newUser, token } });
    }

    if (method === 'PUT') {
      // login in some versions (PUT /api/auth)
      const body = JSON.parse(req.postData() ?? '{}');
      const found = users.find((u) => u.email === body.email);
      if (!found) return route.fulfill({ status: 404, json: { message: 'unknown user' } });
      currentUser = found;
      return route.fulfill({ json: { user: found, token } });
    }

    if (method === 'DELETE') {
      // logout (some implementations)
      currentUser = null;
      return route.fulfill({ status: 200, json: { message: 'ok' } });
    }

    return route.fallback();
  });

  // IMPORTANT: match "/api/user" (with query params) AND "/api/user/..." routes
  await page.route('**/api/user**', async (route) => {
    const req = route.request();
    const method = req.method();

    // GET /api/user?page=1&limit=10&name=*
    if (method === 'GET') {
      const url = new URL(req.url());
      const pageNum = Number(url.searchParams.get('page') ?? '1');
      const limit = Number(url.searchParams.get('limit') ?? '10');
      const name = url.searchParams.get('name') ?? '*';

      const pattern = name.replace(/\*/g, '').toLowerCase();
      const filtered = pattern ? users.filter((u) => u.name.toLowerCase().includes(pattern)) : users;

      const start = (pageNum - 1) * limit;
      const slice = filtered.slice(start, start + limit);
      const more = start + limit < filtered.length;

      return route.fulfill({ json: { users: slice, more } });
    }

    // PUT /api/user/<id>  (update user)
    if (method === 'PUT') {
      const body = JSON.parse(req.postData() ?? '{}');

      // try to extract id from /api/user/<id>
      const url = new URL(req.url());
      const parts = url.pathname.split('/').filter(Boolean);
      const idFromPath = parts[parts.length - 1];
      const isId = idFromPath !== 'user'; // if path ends with "user", there's no id

      const targetId = isId ? idFromPath : currentUser?.id;

      if (targetId) {
        users = users.map((u) => {
          if (u.id !== targetId) return u;
          const updated = {
            ...u,
            name: body.name ?? u.name,
            email: body.email ?? u.email,
          };
          if (currentUser?.id === u.id) currentUser = updated;
          return updated;
        });
      }

      return route.fulfill({ json: { user: currentUser, token } });
    }

    // DELETE /api/user/<id>
    if (method === 'DELETE') {
      const url = new URL(req.url());
      const parts = url.pathname.split('/').filter(Boolean);
      const id = parts[parts.length - 1]; // last segment

      users = users.filter((u) => u.id !== id);
      if (currentUser?.id === id) currentUser = null;

      return route.fulfill({ status: 204, body: '' });
    }

    return route.fallback();
  });
}