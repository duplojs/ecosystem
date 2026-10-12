import * as DInvocation from "@duplojs/lang/invocation";
import { type Client, type ClientRepository } from "../../domains";

export interface ClientRepositoryPort extends ClientRepository {
	save<
		GenericEntity extends Client.Entity & Client.Facts,
	>(entity: GenericEntity): Promise<GenericEntity>;
}

export const ClientRepositoryPort = DInvocation.createPort<ClientRepositoryPort>();
