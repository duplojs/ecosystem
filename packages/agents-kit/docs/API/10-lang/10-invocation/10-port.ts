/**
 * @title DInvocation — Ports
 *
 * Déclarer un contrat injectable et créer son implémentation.
 */
import * as DInvocation from "@duplojs/lang/invocation";
import type * as DCommon from "@duplojs/lang/common";

interface UserRepository {
	findName(id: string): string;
}

// Le port représente le contrat au runtime pour les readers.
const UserRepositoryPort = DInvocation.createPort<UserRepository>();
type _CheckPort = DCommon.ExpectType<
	typeof UserRepositoryPort,
	DInvocation.PortHandler<UserRepository>,
	"strict"
>;

// L'implémentation respecte le contrat ; la valeur est restituée sans modification.
const userRepository = UserRepositoryPort.createImplementation({
	findName: (id) => `user-${id}`,
});
type _CheckImplementation = DCommon.ExpectType<
	typeof userRepository,
	UserRepository & DInvocation.Evidence<"implemented-from-port">,
	"strict"
>;
