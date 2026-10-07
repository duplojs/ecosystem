import * as DInvocation from "@duplojs/lang/invocation";
import type * as DEither from "@duplojs/lang/either";
import { type Client, type ClientRepository } from "../../domains";

export interface ClientRepositoryPort extends ClientRepository {
	findById(id: Client.Id): Promise<DEither.Maybe<Client.Entity>>;

	save<
		GenericEntity extends Client.Entity & Client.Facts,
	>(entity: GenericEntity): Promise<GenericEntity>;
}

export const ClientRepositoryPort = DInvocation.createPort<ClientRepositoryPort>();
