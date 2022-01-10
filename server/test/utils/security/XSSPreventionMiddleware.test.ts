import XSSPreventionMiddleware from "../../../src/utils/security/XSSPreventionMiddleware";

let mockRequest: Record<string, any>;
let xssPreventionMiddleware: XSSPreventionMiddleware;

beforeAll(() => {
    mockRequest = {
        params: {
            numberOfEntries: "<script type='text/javascript'>while (true) { console.log(\'Hacked!\'); }</script>"
        },
        body: {
            firstName: "<script src='some-malicious-site'></script>",
            lastName: "<a href='some-url' onmouseover='alert(\'Hacked\')'>click me</a>"
        },
        cookies: {
            "client-id": "<h1 onclick='fetch(\'bad-site\').then().catch()'>Click Me!</h1>"
        }
    };
    xssPreventionMiddleware = new XSSPreventionMiddleware();
})

test("XSS is prevented from request params, body, and cookies", async () => {
     await xssPreventionMiddleware.middleware(mockRequest as any, undefined as any, () => true);
     expect(mockRequest).toEqual({
        params: {
            numberOfEntries: "&lt;script type='text/javascript'&gt;while (true) { console.log('Hacked!'); }&lt;/script&gt;"
        },
        body: {
            firstName: "&lt;script src='some-malicious-site'&gt;&lt;/script&gt;",
            lastName: "&lt;a href&gt;click me&lt;/a&gt;"
        },
        cookies: {
            "client-id": "&lt;h1&gt;Click Me!&lt;/h1&gt;"
        }
     });
});