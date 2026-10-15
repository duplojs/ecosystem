import * as DInvocation from "@duplojs/lang/invocation";
import { type EmailRepository } from "../../domains";

export interface EmailRepositoryPort extends EmailRepository {
}

export const EmailRepositoryPort = DInvocation.createPort<EmailRepositoryPort>();
