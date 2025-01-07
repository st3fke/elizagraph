import { IAgentRuntime, Memory, Provider, State } from "@elizaos/core";

const dkgQuery: Provider = {
    get: async (_runtime: IAgentRuntime, _message: Memory, _state?: State) => {

        return `The responses.`;
    },
};
export { dkgQuery };
