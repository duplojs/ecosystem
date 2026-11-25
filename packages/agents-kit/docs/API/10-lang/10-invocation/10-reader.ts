/**
 * @title DInvocation — Readers
 *
 * Déclarer et résoudre des dépendances à des ports et à d'autres readers.
 */
import * as DInvocation from "@duplojs/lang/invocation";
import type * as DCommon from "@duplojs/lang/common";

interface UserRepository {
	findName(id: string): string;
}
const UserRepositoryPort = DInvocation.createPort<UserRepository>();
const userRepository = UserRepositoryPort.createImplementation({
	findName: (id) => `user-${id}`,
});

// La clé UserRepositoryPort devient userRepository dans le contexte.
const GetUserName = DInvocation.createReader(
	{ UserRepositoryPort },
	({ userRepository }) => (id: string) => userRepository.findName(id),
);

// Un reader peut dépendre d'un autre reader, résolu à partir des mêmes ports.
const WelcomeUser = DInvocation.createReader(
	{ GetUserName },
	({ getUserName }) => (id: string) => `Hello ${getUserName(id)}`,
);
const welcomeUser = WelcomeUser.run({ userRepository });
// « Hello user-42 »
const greeting = welcomeUser("42");
type _CheckGreeting = DCommon.ExpectType<
	typeof greeting,
	string,
	"strict"
>;

// Un reader imbriqué peut aussi être fourni directement ; ses ports restent requis.
const customWelcome = WelcomeUser.run({
	userRepository,
	getUserName: (id) => `guest-${id}`,
});
// « Hello guest-42 »
const customGreeting = customWelcome("42");
type _CheckCustomGreeting = DCommon.ExpectType<
	typeof customGreeting,
	string,
	"strict"
>;

// Résoudre plusieurs readers ensemble réunit les ports nécessaires à chacun.
const readers = DInvocation.resolveReaders(
	{
		GetUserName,
		WelcomeUser,
	},
	{ userRepository },
);
type _CheckReaders = DCommon.ExpectType<
	typeof readers,
	{
		getUserName(id: string): string;
		welcomeUser(id: string): string;
	},
	"strict"
>;
// « user-42 »
const name = readers.getUserName("42");
type _CheckName = DCommon.ExpectType<
	typeof name,
	string,
	"strict"
>;
