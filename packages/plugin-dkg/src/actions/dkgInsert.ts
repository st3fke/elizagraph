import dotenv from "dotenv";
dotenv.config();
import {
    IAgentRuntime,
    Memory,
    State,
    elizaLogger,
    generateText,
    ModelClass,
    HandlerCallback,
    ActionExample,
    type Action,
} from "@elizaos/core";
import {
    dkgMemoryTemplate,
    generalSparqlQuery,
    sparqlExamples,
    DKG_EXPLORER_LINKS
} from "../constants.ts";
// @ts-ignore
import DKG from "dkg.js";



const DkgClient = new DKG({
    environment: process.env.ENVIRONMENT,
    endpoint: process.env.OT_NODE_HOSTNAME,
    port: process.env.OT_NODE_PORT,
    blockchain: {
        name: process.env.BLOCKCHAIN_NAME,
        publicKey: process.env.PUBLIC_KEY,
        privateKey: process.env.PRIVATE_KEY,
    },
    maxNumberOfRetries: 300,
    frequency: 2,
    contentType: "all",
    nodeApiVersion: "/v1",
});



async function constructKnowledgeAsset(
    runtime: IAgentRuntime,
    userQuery: string,
    additionalContext: string,
    state?: State
) {
    // TODO: not only based on 1 query, but whole conversation
    const context = `
  You are tasked with creating a structured memory JSON-LD object for an AI agent. The memory represents the interaction captured via social media. Your goal is to extract all relevant information from the provided user query and additionalContext which contains previous user queries (only if relevant for the current user query) to populate the JSON-LD memory template provided below.

  ** Template **
  The memory should follow this JSON-LD structure:
  ${JSON.stringify(dkgMemoryTemplate)}

  ** Instructions **
  1. Extract the main idea of the user query and use it to create a concise and descriptive title for the memory. This should go in the "headline" field.
  2. Store the original post in "articleBody".
  3. Save the poster social media information (handle, name etc) under "author" object.
  4. For the "about" field:
     - Identify the key topics or entities mentioned in the user query and add them as Thing objects.
     - Use concise, descriptive names for these topics.
     - Where possible, create an @id identifier for these entities, using either a provided URL, or a well known URL for that entity. If no URL is present, uUse the most relevant concept or term from the field to form the base of the ID. @id fields must be valid uuids or URLs
  5. For the "keywords" field:
     - Extract relevant terms or concepts from the user query and list them as keywords.
     - Ensure the keywords capture the essence of the interaction, focusing on technical terms or significant ideas.
  6. Ensure all fields align with the schema.org ontology and accurately represent the interaction.
  7. Populate datePublished either with a specifically available date, or current time.

  ** Input **
  User Query: ${userQuery}
  Additional context: ${additionalContext}

  ** Output **
  Generate the memory in the exact JSON-LD format provided above, fully populated based on the input query.
  Make sure to only output the JSON-LD object. DO NOT OUTPUT ANYTHING ELSE, DONT ADD ANY COMMENTS OR REMARKS, JUST THE JSON LD CONTENT WRAPPED IN { }.
  `;
    const content = await generateText({
        runtime,
        context,
        modelClass: ModelClass.LARGE,
    });

    return JSON.parse(content.replace(/```json|```/g, ""));
}

export const dkgInsert: Action = {
    name: "NONE",
    similes: [
        "NO_ACTION",
        "NO_RESPONSE",
        "NO_REACTION",
        "RESPONSE",
        "REPLY",
        "DEFAULT",
    ],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        return true;
    },
    description:
    "DKG insert on tweet mention",
    handler: async (
        _runtime: IAgentRuntime,
        _message: Memory,
        _state: State,
        _options: {[key:string]:unknown},
        _callback: HandlerCallback,
    ): Promise<boolean> => {
        console.log("currentPost");
        console.log(_state.currentPost);

        const additionalContext = String(_state.recentMessageInteractions);
        const postKnowledgeGraph = await constructKnowledgeAsset(
            _runtime,
            String(_state.currentPost),
            additionalContext,
            _state
        );

        console.log('Publishing message to DKG');
        const createAssetResult = await DkgClient.asset.create(
            {
                public: postKnowledgeGraph
            },
            { epochsNum: 12 },
        );
        console.log('======================== ASSET CREATED');
        console.log(createAssetResult);

        return true;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "execute action DKG_INSERT", action: "DKG_INSERT" },
            },
            {
                user: "{{user2}}",
                content: { text: "DKG INSERT" },
            }
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "add to dkg", action: "DKG_INSERT" },
            },
            {
                user: "{{user2}}",
                content: { text: "DKG INSERT" },
            }
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "store in dkg", action: "DKG_INSERT" },
            },
            {
                user: "{{user2}}",
                content: { text: "DKG INSERT" },
            }
        ]
    ] as ActionExample[][],
} as Action;
