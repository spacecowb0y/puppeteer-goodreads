import { Browser, Page } from 'puppeteer';

type SignInReturn = {
  page: Page;
  success: boolean;
};

export default async function signin(
  browser: Browser,
  username: string,
  password: string,
): Promise<SignInReturn> {
  const page = await browser.newPage();
  await page.goto('https://www.goodreads.com/user/sign_in');
  await page.waitForSelector('.authPortalSignInButton');
  await page.click('.authPortalSignInButton');

  await page.waitForSelector('#signInSubmit');
  await page.type('#ap_email', username);
  await page.type('#ap_password', password);
  await page.click('#signInSubmit');

  const loggedInPromise = page
    .waitForSelector('nav.siteHeader__primaryNavInline')
    .catch()
    .then(() => true);

  const loginErrorPromise = page
    .waitForSelector('.gr-flashMessage--error')
    .catch()
    .then(() => false);

  const success = await Promise.race([loggedInPromise, loginErrorPromise]);

  return {
    page,
    success,
  };
}
