// @ts-check
import { test, expect } from "@playwright/test";
import { loginAsUser, deleteCartContext } from "../src/utils/testingHelper";

test("TC01: Successful Place order", async ({ page }) => {
    await loginAsUser(page);

    await deleteCartContext(page);

    await page
        .getByRole("link", { name: /Quán Ăn Gia Đình Việt/ })
        .first()
        .click();

    await page
        .getByRole("link", { name: /Bánh Mì Thịt Nướng/ })
        .getByRole("button")
        .click();

    await page.getByRole("link", { name: "Giỏ hàng 1 món" }).first().click();

    await page
        .locator("div")
        .filter({ hasText: /^Đặt đơn$/ })
        .click();
});

test("TC02: Verify Add to Cart Toast", async ({ page }) => {
    await loginAsUser(page);

    await page
        .getByRole("link", { name: /Quán Ăn Gia Đình Việt/ })
        .first()
        .click();
    await page
        .getByRole("link", { name: /Bánh Mì Thịt Nướng/ })
        .getByRole("button")
        .first()
        .click();

    // REMOVED 'await'
    const confirm_modal = page.getByText("Cập nhật giỏ hàng thành công");
    await expect(confirm_modal).toBeVisible();

    await deleteCartContext(page);
});

test("TC03: Verify Out of Stock Item (No Redirect)", async ({ page }) => {
    await loginAsUser(page);

    await page
        .getByRole("link", { name: /Quán Ăn Gia Đình Việt/ })
        .first()
        .click();

    const outOfStockCard = page
        .locator("div.group")
        .filter({ hasText: /Món ăn hiện không còn phục vụ/ })
        .first();

    await expect(outOfStockCard).toBeVisible();

    const storePageUrl = page.url();

    await outOfStockCard.click({ force: true });

    await expect(page).toHaveURL(storePageUrl);

    const linkElement = outOfStockCard.locator("a");
    await expect(linkElement).toHaveClass(/pointer-events-none/);

    await deleteCartContext(page);
});

test("TC04: Selecting dish quantity of -1", async ({ page }) => {
    await loginAsUser(page);

    await deleteCartContext(page);

    await page
        .getByRole("link", { name: /Quán Ăn Gia Đình Việt/ })
        .first()
        .click();

    await page
        .getByRole("link", { name: "Chả Cá Lã Vọng add Chả Cá Lã" })
        .click();

    await page.getByRole("spinbutton").fill("-1");

    await expect(page.getByText("Số lượng tối thiểu là 1. Đã t")).toBeVisible();
});

test("TC05: Selecting dish quantity of 0", async ({ page }) => {
    await loginAsUser(page);

    await deleteCartContext(page);

    await page
        .getByRole("link", { name: /Quán Ăn Gia Đình Việt/ })
        .first()
        .click();

    await page
        .getByRole("link", { name: "Chả Cá Lã Vọng add Chả Cá Lã" })
        .click();

    await page.getByRole("spinbutton").fill("0");

    await expect(page.getByText("Số lượng tối thiểu là 1. Đã t")).toBeVisible();
});

test("TC06: Selecting dish quantity of 1", async ({ page }) => {
    await loginAsUser(page);

    await deleteCartContext(page);

    await page
        .getByRole("link", { name: /Quán Ăn Gia Đình Việt/ })
        .first()
        .click();

    await page
        .getByRole("link", { name: "Chả Cá Lã Vọng add Chả Cá Lã" })
        .click();

    await page.getByRole("spinbutton").fill("0");

    await expect(page.getByText("Số lượng tối thiểu là 1. Đã t")).toBeVisible();
});

test("TC07: Selecting dish quantity of 50", async ({ page }) => {
    await loginAsUser(page);

    await deleteCartContext(page);

    await page
        .getByRole("link", { name: /Quán Ăn Gia Đình Việt/ })
        .first()
        .click();

    await page
        .getByRole("link", { name: "Chả Cá Lã Vọng add Chả Cá Lã" })
        .click();

    await page.getByRole("spinbutton").fill("50");
});

test("TC08: Selecting dish quantity of 51", async ({ page }) => {
    await loginAsUser(page);

    await deleteCartContext(page);

    await page
        .getByRole("link", { name: /Quán Ăn Gia Đình Việt/ })
        .first()
        .click();

    await page
        .getByRole("link", { name: "Chả Cá Lã Vọng add Chả Cá Lã" })
        .click();

    await page.getByRole("spinbutton").fill("51");

    await expect(page.getByText("Số lượng tối đa là 50. Đã t")).toBeVisible();
});

test("TC09: Successful Place order", async ({ page }) => {
    await loginAsUser(page);

    await deleteCartContext(page);

    await page
        .getByRole("link", { name: /Quán Ăn Gia Đình Việt/ })
        .first()
        .click();

    await page
        .getByRole("link", { name: /Bánh Mì Thịt Nướng/ })
        .getByRole("button")
        .click();

    await page.getByRole("link", { name: "Giỏ hàng 1 món" }).first().click();

    await page
        .locator("div")
        .filter({ hasText: /^Đặt đơn$/ })
        .click();
});

test.describe("Context: Location Services Disabled", () => {
    test.use({
        geolocation: undefined,
        permissions: [],
    });

    test("TC10: No address, No Name, No phonenumber of reciever", async ({
        page,
    }) => {
        await loginAsUser(page);
        await deleteCartContext(page);

        await page
            .getByRole("link", { name: /Quán Ăn Gia Đình Việt/ })
            .first()
            .click();

        await page
            .getByRole("link", { name: /Bánh Mì Thịt Nướng/ })
            .getByRole("button")
            .first()
            .click();

        const viewCartBtn = page.locator('a[name="cartDetailBtn"]');
        await expect(viewCartBtn).toBeVisible();
        await viewCartBtn.click();

        await page.getByRole("link", { name: /Thêm chi tiết địa chỉ/ }).click();

        const nameInput = page.locator('input[name="contactName"]');
        await nameInput.click();
        await nameInput.press("ControlOrMeta+a");
        await nameInput.fill("");

        const phoneInput = page.locator('input[name="contactPhonenumber"]');
        await phoneInput.click();
        await phoneInput.press("ControlOrMeta+a");
        await phoneInput.fill("");

        const saveButton = page.getByRole("button", { name: /Lưu/ });
        await saveButton.click();

        await page
            .locator("div")
            .filter({ hasText: /^Đặt đơn$/ })
            .click();

        await expect(
            page.getByText("Vui lòng chọn địa chỉ giao hàng")
        ).toBeVisible();
    });
    test("TC11: No address, No Name, Have phonenumber of reciever", async ({
        page,
    }) => {
        await loginAsUser(page);
        await deleteCartContext(page);

        await page
            .getByRole("link", { name: /Quán Ăn Gia Đình Việt/ })
            .first()
            .click();

        await page
            .getByRole("link", { name: /Bánh Mì Thịt Nướng/ })
            .getByRole("button")
            .first()
            .click();

        const viewCartBtn = page.locator('a[name="cartDetailBtn"]');
        await expect(viewCartBtn).toBeVisible();
        await viewCartBtn.click();

        await page.getByRole("link", { name: /Thêm chi tiết địa chỉ/ }).click();

        const nameInput = page.locator('input[name="contactName"]');
        await nameInput.click();
        await nameInput.press("ControlOrMeta+a");
        await nameInput.fill("");

        const phoneInput = page.locator('input[name="contactPhonenumber"]');
        await phoneInput.click();
        await phoneInput.press("ControlOrMeta+a");
        await phoneInput.fill("");

        const saveButton = page.getByRole("button", { name: /Lưu/ });
        await saveButton.click();

        await page
            .locator("div")
            .filter({ hasText: /^Đặt đơn$/ })
            .click();

        await expect(
            page.getByText("Vui lòng chọn địa chỉ giao hàng")
        ).toBeVisible();
    });
    test("TC12: No address, Have Name, No phonenumber of reciever", async ({
        page,
    }) => {
        await loginAsUser(page);
        await deleteCartContext(page);

        await page
            .getByRole("link", { name: /Quán Ăn Gia Đình Việt/ })
            .first()
            .click();

        await page
            .getByRole("link", { name: /Bánh Mì Thịt Nướng/ })
            .getByRole("button")
            .first()
            .click();

        const viewCartBtn = page.locator('a[name="cartDetailBtn"]');
        await expect(viewCartBtn).toBeVisible();
        await viewCartBtn.click();

        await page.getByRole("link", { name: /Thêm chi tiết địa chỉ/ }).click();

        const phoneInput = page.locator('input[name="contactPhonenumber"]');
        await phoneInput.click();
        await phoneInput.press("ControlOrMeta+a");
        await phoneInput.fill("");

        const saveButton = page.getByRole("button", { name: /Lưu/ });
        await saveButton.click();

        await page
            .locator("div")
            .filter({ hasText: /^Đặt đơn$/ })
            .click();

        await expect(
            page.getByText("Vui lòng chọn địa chỉ giao hàng")
        ).toBeVisible();
    });
    test("TC14: Have address, Have Name, No phonenumber of reciever", async ({
        page,
    }) => {
        await loginAsUser(page);
        await deleteCartContext(page);

        await page
            .getByRole("link", { name: /Quán Ăn Gia Đình Việt/ })
            .first()
            .click();

        await page
            .getByRole("link", { name: /Bánh Mì Thịt Nướng/ })
            .getByRole("button")
            .first()
            .click();

        const viewCartBtn = page.locator('a[name="cartDetailBtn"]');
        await expect(viewCartBtn).toBeVisible();
        await viewCartBtn.click();

        await page
            .locator("div")
            .filter({ hasText: /^Đặt đơn$/ })
            .click();

        await expect(
            page.getByText("Vui lòng chọn địa chỉ giao hàng")
        ).toBeVisible();
    });
});

test("TC13: Have address, No Name, No phonenumber of reciever", async ({
    page,
}) => {
    await loginAsUser(page);
    await deleteCartContext(page);

    await page
        .getByRole("link", { name: /Quán Ăn Gia Đình Việt/ })
        .first()
        .click();

    await page
        .getByRole("link", { name: /Bánh Mì Thịt Nướng/ })
        .getByRole("button")
        .first()
        .click();

    const viewCartBtn = page.locator('a[name="cartDetailBtn"]');
    await expect(viewCartBtn).toBeVisible();
    await viewCartBtn.click();

    await page.getByRole("link", { name: /Thêm chi tiết địa chỉ/ }).click();

    const nameInput = page.locator('input[name="contactName"]');
    await nameInput.click();
    await nameInput.press("ControlOrMeta+a");
    await nameInput.fill("");

    const phoneInput = page.locator('input[name="contactPhonenumber"]');
    await phoneInput.click();
    await phoneInput.press("ControlOrMeta+a");
    await phoneInput.fill("");

    const saveButton = page.getByRole("button", { name: /Lưu/ });
    await saveButton.click();

    await page
        .locator("div")
        .filter({ hasText: /^Đặt đơn$/ })
        .click();

    await expect(page.getByText("Vui lòng nhập tên người nhận")).toBeVisible();
});

test("TC15: Have address, Have Name, No phonenumber of reciever", async ({
    page,
}) => {
    await loginAsUser(page);
    await deleteCartContext(page);

    await page
        .getByRole("link", { name: /Quán Ăn Gia Đình Việt/ })
        .first()
        .click();

    await page
        .getByRole("link", { name: /Bánh Mì Thịt Nướng/ })
        .getByRole("button")
        .first()
        .click();

    const viewCartBtn = page.locator('a[name="cartDetailBtn"]');
    await expect(viewCartBtn).toBeVisible();
    await viewCartBtn.click();

    await page.getByRole("link", { name: /Thêm chi tiết địa chỉ/ }).click();

    const phoneInput = page.locator('input[name="contactPhonenumber"]');
    await phoneInput.click();
    await phoneInput.press("ControlOrMeta+a");
    await phoneInput.fill("");

    const saveButton = page.getByRole("button", { name: /Lưu/ });
    await saveButton.click();

    await page
        .locator("div")
        .filter({ hasText: /^Đặt đơn$/ })
        .click();

    await expect(
        page.getByText("Vui lòng nhập số điện thoại người nhận")
    ).toBeVisible();
});

test("TC16: Have address, No Name, Have phonenumber of reciever", async ({
    page,
}) => {
    await loginAsUser(page);
    await deleteCartContext(page);

    await page
        .getByRole("link", { name: /Quán Ăn Gia Đình Việt/ })
        .first()
        .click();

    await page
        .getByRole("link", { name: /Bánh Mì Thịt Nướng/ })
        .getByRole("button")
        .first()
        .click();

    const viewCartBtn = page.locator('a[name="cartDetailBtn"]');
    await expect(viewCartBtn).toBeVisible();
    await viewCartBtn.click();

    await page.getByRole("link", { name: /Thêm chi tiết địa chỉ/ }).click();

    const nameInput = page.locator('input[name="contactName"]');
    await nameInput.click();
    await nameInput.press("ControlOrMeta+a");
    await nameInput.fill("");

    const saveButton = page.getByRole("button", { name: /Lưu/ });
    await saveButton.click();

    await page
        .locator("div")
        .filter({ hasText: /^Đặt đơn$/ })
        .click();

    await expect(page.getByText("Vui lòng nhập tên người nhận")).toBeVisible();
});

test("TC17: Successful Place order", async ({ page }) => {
    await loginAsUser(page);

    await deleteCartContext(page);

    await page
        .getByRole("link", { name: /Quán Ăn Gia Đình Việt/ })
        .first()
        .click();

    await page
        .getByRole("link", { name: /Bánh Mì Thịt Nướng/ })
        .getByRole("button")
        .click();

    await page.getByRole("link", { name: "Giỏ hàng 1 món" }).first().click();

    await page
        .locator("div")
        .filter({ hasText: /^Đặt đơn$/ })
        .click();
});

test("TC18: Fail to Place order because they closed", async ({ page }) => {
    await loginAsUser(page);

    await deleteCartContext(page);

    await page
        .getByRole("link", { name: /Quán Ăn Gia Đình Việt/ })
        .first()
        .click();

    await page
        .getByRole("link", { name: /Bánh Mì Thịt Nướng/ })
        .getByRole("button")
        .click();

    await page.getByRole("link", { name: "Giỏ hàng 1 món" }).first().click();

    const toggleResponse = await page.request.post('http://localhost:5000/api/v1/store/test/toggle', {});
    expect(toggleResponse.ok()).toBeTruthy();

    await page
        .locator("div")
        .filter({ hasText: /^Đặt đơn$/ })
        .click();
    await expect(page.getByText("Cửa hàng đã đóng cửa, không thể đặt hàng.")).toBeVisible();

    const toggleResponseBack = await page.request.post('http://localhost:5000/api/v1/store/test/toggle', {});
    expect(toggleResponseBack.ok()).toBeTruthy();
});
