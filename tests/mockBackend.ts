import type { Page } from '@playwright/test';

type User = { id: string; name: string; email: string; roles: { role: string }[] };

export async function installMockBackend(page: Page) {
  // simple in-memory “DB”
  let token = 'fake.token';
  let currentUser: User | null = null;
  let users: User[] = [
    { id: '1', name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] },
    { id: '2', name: '常用名字', email: 'a@jwt.com', roles: [{ role: 'admin' }] },
  ];

  await page.route('**/api/auth', async (route) => {
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
      // login in some versions (if your API uses PUT /api/auth)
      const body = JSON.parse(req.postData() ?? '{}');
      const found = users.find((u) => u.email === body.email);
      if (!found) return route.fulfill({ status: 404, json: { message: 'unknown user' } });
      currentUser = found;
      return route.fulfill({ json: { user: found, token } });
    }

    return route.fallback();
  });

  await page.route('**/api/user/**', async (route) => {
    const req = route.request();
    const method = req.method();

    if (method === 'PUT') {
      const body = JSON.parse(req.postData() ?? '{}');
      // update current user
      if (currentUser) {
        currentUser = { ...currentUser, name: body.name ?? currentUser.name, email: body.email ?? currentUser.email };
        users = users.map((u) => (u.id === currentUser!.id ? currentUser! : u));
      }
      return route.fulfill({ json: { user: currentUser, token } });
    }

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

    if (method === 'DELETE') {
      const id = req.url().split('/').pop()!;
      users = users.filter((u) => u.id !== id);
      if (currentUser?.id === id) currentUser = null;
      return route.fulfill({ status: 204, body: '' });
    }

    return route.fallback();
  });
}