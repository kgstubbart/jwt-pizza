import { test, expect } from "playwright-test-coverage";
import { installMockBackend } from './mockBackend';

test("updateUser", async ({ page }) => {
    if (process.env.CI) await installMockBackend(page);
	let email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
	await page.goto("/");
	await page.getByRole("link", { name: "Register" }).click();
	await page.getByRole("textbox", { name: "Full name" }).fill("pizza diner");
	await page.getByRole("textbox", { name: "Email address" }).fill(email);
	await page.getByRole("textbox", { name: "Password" }).fill("diner");
	await page.getByRole("button", { name: "Register" }).click();

	await page.getByRole("link", { name: "pd" }).click();

	await expect(page.getByRole("main")).toContainText("pizza diner");

	await page.getByRole("button", { name: "Edit" }).click();
	await expect(page.locator("h3")).toContainText("Edit user");
	await page.getByRole("button", { name: "Update" }).click();

	await page.waitForSelector('[role="dialog"].hidden', { state: "attached" });

	await expect(page.getByRole("main")).toContainText("pizza diner");

    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page.locator('h3')).toContainText('Edit user');
    await page.getByRole('textbox').first().fill('pizza dinerx');

    email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
    await page.locator('input[type="email"]').fill(email);
    await page.locator('#password').fill('dinerx');
    await page.getByRole('button', { name: 'Update' }).click();

    await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });

    await expect(page.getByRole('main')).toContainText('pizza dinerx');

    await page.getByRole('link', { name: 'Logout' }).click();
    await page.getByRole('link', { name: 'Login' }).click();

    await page.getByRole('textbox', { name: 'Email address' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill('dinerx');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByRole('link', { name: 'pd' }).click();

    await expect(page.getByRole('main')).toContainText('pizza dinerx');
    await expect(page.getByRole('main')).toContainText(email);
});

test("listUsers", async ({ page }) => {
    if (process.env.CI) await installMockBackend(page);
    await page.goto("/");
    await page.getByRole("link", { name: "Login" }).click();
    await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
    await page.getByRole("textbox", { name: "Password" }).fill("admin");
    await page.getByRole("button", { name: "Login" }).click();
    await page.getByRole("link", { name: "Admin" }).click();
    
    await expect(page.getByRole('main')).toContainText('Users');
    await expect(page.getByRole('main')).toContainText('Name');
    await expect(page.getByRole('main')).toContainText('Email');
    await expect(page.getByRole('main')).toContainText('Role');
    await page.getByRole('textbox', { name: 'Name' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('kai');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByRole('main')).toContainText('Kai Chen');
});

test("deleteUser", async ({ page }) => {
    if (process.env.CI) await installMockBackend(page);
    let user = `user${Math.floor(Math.random() * 10000)}`;
    let email = `${user}@jwt.com`;
	await page.goto("/");
	await page.getByRole("link", { name: "Register" }).click();
	await page.getByRole("textbox", { name: "Full name" }).fill(user);
	await page.getByRole("textbox", { name: "Email address" }).fill(email);
	await page.getByRole("textbox", { name: "Password" }).fill("diner");
	await page.getByRole("button", { name: "Register" }).click();
    await page.getByRole('link', { name: 'Logout' }).click();

    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
    await page.getByRole("textbox", { name: "Password" }).fill("admin");
    await page.getByRole("button", { name: "Login" }).click();
    await page.getByRole("link", { name: "Admin" }).click();

    await page.getByRole('button', { name: `Delete ${user}` }).click();
});