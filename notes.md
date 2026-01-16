# Learning notes

## JWT Pizza code study and debugging

As part of `Deliverable ⓵ Development deployment: JWT Pizza`, start up the application and debug through the code until you understand how it works. During the learning process fill out the following required pieces of information in order to demonstrate that you have successfully completed the deliverable.

| User activity                                       | Frontend component | Backend endpoints | Database SQL |
| --------------------------------------------------- | ------------------ | ----------------- | ------------ |
| View home page                                      | home.jsx	       | none              | none         |
| Register new user<br/>(t@jwt.com, pw: test)         | register.jsx       | [POST] /api/auth  | `INSERT INTO user (name, email, password) VALUES (?, ?, ?)` <br/>`INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?)` |
| Login new user<br/>(t@jwt.com, pw: test)            | login.tsx          | [PUT] /api/auth   | `SELECT * FROM user WHERE email=?`             <br/>`SELECT * FROM userRole WHERE userId=?`|
| Order pizza                                         | menu.tsx           | [POST] /api/order | `INSERT INTO dinerOrder (dinerId, franchiseId, storeId, date) VALUES (?, ?, ?, now())` <br/>`INSERT INTO orderItem (orderId, menuId, description, price) VALUES (?, ?, ?, ?)`             |
| Verify pizza                                        | payment.tsx        |                   |              |
| View profile page                                   | view.tsx           | [GET] /api/user/me| `SELECT userId FROM auth WHERE token=?`             |
| View franchise<br/>(as diner)                       | view.tsx           | [GET] /api/franchise                  | `SELECT id, name FROM franchise WHERE name LIKE ? LIMIT ${limit + 1} OFFSET ${offset}` <br/>`SELECT id, name FROM store WHERE franchiseId=?`             |
| Logout                                              | logout.tsx         | [DELETE] /api/auth| `DELETE FROM auth WHERE token=?`             |
| View About page                                     | about.tsx          | none              | none         |
| View History page                                   | history.tsx        | [GET] /api/order  | `SELECT id, franchiseId, storeId, date FROM dinerOrder WHERE dinerId=? LIMIT ${offset},${config.db.listPerPage}` <br/>`SELECT id, menuId, description, price FROM orderItem WHERE orderId=?`             |
| Login as franchisee<br/>(f@jwt.com, pw: franchisee) | login.tsx          | [PUT] /api/auth   | `SELECT * FROM user WHERE email=?`             <br/>`SELECT * FROM userRole WHERE userId=?`             |
| View franchise<br/>(as franchisee)                  | franchiseDashboard.tsx | [GET] /api/franchise/:userId | `SELECT objectId FROM userRole WHERE role='franchisee' AND userId=?` <br/>`SELECT id, name FROM franchise WHERE id in (${franchiseIds.join(',')})`             |
| Create a store                                      | createStore.tsx    | [POST] /api/franchise/:franchiseId/store | `INSERT INTO store (franchiseId, name) VALUES (?, ?)`             |
| Close a store                                       | closeStore.tsx                   |                   |              |
| Login as admin<br/>(a@jwt.com, pw: admin)           |                    |                   |              |
| View Admin page                                     |                    |                   |              |
| Create a franchise for t@jwt.com                    |                    |                   |              |
| Close the franchise for t@jwt.com                   |                    |                   |              |
