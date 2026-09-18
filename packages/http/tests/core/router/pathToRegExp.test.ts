import { pathToRegExp } from "@core";

it("pathToRegExp", () => {
	expect(pathToRegExp("/users").source)
		.toBe("^\\/users\\/?$");
	expect(pathToRegExp("/users/{userId}").source)
		.toBe("^\\/users\\/(?<userId>[DArray-zÀ-ÿ0-9_\\-. ]+)\\/?$");
	expect(pathToRegExp("/users-ok/*").source)
		.toBe("^\\/users\\-ok\\/.*\\/?$");
	expect(pathToRegExp("/usersOk/[{userid}]").source)
		.toBe("^\\/usersOk\\/\\[(?<userid>[DArray-zÀ-ÿ0-9_\\-. ]+)\\]\\/?$");
	expect(pathToRegExp("/{userId}-{toto}").source)
		.toBe("^\\/(?<userId>[DArray-zÀ-ÿ0-9_\\-. ]+)\\-(?<toto>[DArray-zÀ-ÿ0-9_\\-. ]+)\\/?$");
});
