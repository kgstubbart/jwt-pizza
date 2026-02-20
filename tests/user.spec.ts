import { test, expect } from "playwright-test-coverage";
import { installMockBackend } from "./mockBackend";

test.beforeEach(async ({ page }) => {
  if (process.env.CI) await installMockBackend(page);
});

test("updateUser", async ({ page }) => {
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

	await page.getByRole("button", { name: "Edit" }).click();
	await expect(page.locator("h3")).toContainText("Edit user");
	await page.getByRole("textbox").first().fill("pizza dinerx");

	email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
	await page.locator('input[type="email"]').fill(email);
	await page.locator("#password").fill("dinerx");
	await page.getByRole("button", { name: "Update" }).click();

	await page.waitForSelector('[role="dialog"].hidden', { state: "attached" });

	await expect(page.getByRole("main")).toContainText("pizza dinerx");

	await page.getByRole("link", { name: "Logout" }).click();
	await page.getByRole("link", { name: "Login" }).click();

	await page.getByRole("textbox", { name: "Email address" }).fill(email);
	await page.getByRole("textbox", { name: "Password" }).fill("dinerx");
	await page.getByRole("button", { name: "Login" }).click();

	await page.getByRole("link", { name: "pd" }).click();

	await expect(page.getByRole("main")).toContainText("pizza dinerx");
	await expect(page.getByRole("main")).toContainText(email);
});

test("listUsers", async ({ page }) => {
	const suffix = Math.floor(Math.random() * 100000);
	const name = `kai-${suffix}`;
	const email = `user${suffix}@jwt.com`;

	await page.goto("/");
	await page.getByRole("link", { name: "Register" }).click();
	await page.getByRole("textbox", { name: "Full name" }).fill(name);
	await page.getByRole("textbox", { name: "Email address" }).fill(email);
	await page.getByRole("textbox", { name: "Password" }).fill("diner");
	await page.getByRole("button", { name: "Register" }).click();
	await page.getByRole("link", { name: "Logout" }).click();

	await page.getByRole("link", { name: "Login" }).click();
	await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
	await page.getByRole("textbox", { name: "Password" }).fill("admin");
	await page.getByRole("button", { name: "Login" }).click();

	await page.getByRole("link", { name: "Admin" }).click();
	await expect(page.getByRole("main")).toContainText("Users");

	await page.getByPlaceholder("Name").fill("kai-"); // or fill(name) if you prefer exact
	await page.getByRole("button", { name: "Search" }).click();

	await expect(page.getByRole("main")).toContainText(name);
	await expect(page.getByRole("main")).toContainText(email);
});

test("deleteUser", async ({ page }) => {
  const suffix = Math.floor(Math.random() * 100000);
  const user = `user${suffix}`;
  const email = `${user}@jwt.com`;

  await page.goto("/");
  await page.getByRole("link", { name: "Register" }).click();
  await page.getByRole("textbox", { name: "Full name" }).fill(user);
  await page.getByRole("textbox", { name: "Email address" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill("diner");
  await page.getByRole("button", { name: "Register" }).click();
  await page.getByRole("link", { name: "Logout" }).click();

  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "Admin" }).click();

  await page.getByPlaceholder("Name").fill(user);
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByRole("main")).toContainText(user);

  await page.getByRole("button", { name: `Delete ${user}` }).click();

  await expect(page.getByRole("main")).not.toContainText(user);
});
