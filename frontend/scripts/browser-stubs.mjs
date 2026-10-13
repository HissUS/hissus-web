/** Test-only browser interception. Production never imports this module. */
export async function installVerificationStub(page) {
  await page.route('https://challenges.cloudflare.com/**', (route) => {
    if (!route.request().url().includes('/api.js'))
      return route.fulfill({ contentType: 'text/html', body: '<p>Stub verification frame</p>' })
    return route.fulfill({
      contentType: 'application/javascript',
      body: `
        let count = 0;
        window.turnstile = {
          render(container, options) {
            const id = String(++count);
            const frame = document.createElement('iframe');
            frame.src = 'https://challenges.cloudflare.com/test-frame';
            frame.title = 'Test-only verification';
            frame.style.cssText = 'width:150px;height:140px;border:0';
            container.append(frame);
            window.__hissusVerification = {
              expire: () => options['expired-callback'](),
              fail: () => options['error-callback'](),
              complete: () => options.callback('test-human-token-' + id)
            };
            queueMicrotask(window.__hissusVerification.complete);
            return id;
          },
          remove() { document.querySelector('[data-inquiry-verification]')?.replaceChildren(); }
        };
      `,
    })
  })
}
