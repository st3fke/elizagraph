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
  DKG_EXPLORER_LINKS,
  ACTIONS,
} from "../constants.ts";  // Ako su ti potrebni dodatni importi
import { DKG } from "dkg.js";  // DKG klijent
import { checkDestinationExistence, generateNewDestination, insertNewDestination } from "../utils/dkg-functions.ts"; // Funkcije za rad sa DKG

// Kreiranje DKG klijenta
const DkgClient = new DKG({
  environment: process.env.ENVIRONMENT,
  endpoint: process.env.OT_NODE_HOSTNAME,
  port: process.env.OT_NODE_PORT,
  blockchain: {
    name: process.env.BLOCKCHAIN_NAME,
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY,
  },
});

export const dkgInsert: Action = {
  name: "Insert New Destination",  // Naziv akcije
  similes: ["ADD_DESTINATION", "NEW_DESTINATION", "INSERT_DESTINATION"],
  validate: async (_runtime: IAgentRuntime, _message: Memory) => {
    return true;
  },
  description: "Add new destination or season to the DKG",
  handler: async (
    _runtime: IAgentRuntime,
    _message: Memory,
    _state: State,
    _options: { [key: string]: unknown },
    _callback: HandlerCallback
  ): Promise<boolean> => {
    const destinationName = String(_state.destinationName);  // Preuzimanje unete destinacije
    const season = String(_state.season);  // Preuzimanje sezone
    const keywords = String(_state.keywords);  // Preuzimanje ključnih reči

    // Provera da li destinacija već postoji u DKG-u
    const exists = await checkDestinationExistence(destinationName);
    if (exists) {
      elizaLogger.log("info", `Destination ${destinationName} already exists.`);
      return true;  // Ako destinacija već postoji, završavamo
    }

    // Generisanje novih podataka o destinaciji
    const newDestinationData = await generateNewDestination(
        _runtime,   // Prosleđujemo runtime objekat
        destinationName,  // Naziv destinacije
        season,  // Sezona
        keywords  // Ključne reči
      );

    // Ubacivanje novih podataka u DKG
    await insertNewDestination(newDestinationData);

    elizaLogger.log("info", `New destination ${destinationName} added to DKG.`);
    return true;
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: { text: "add new destination to DKG", action: "Insert New Destination" },
      },
      {
        user: "{{user2}}",
        content: { text: "New destination added to DKG" },
      },
    ],
  ] as ActionExample[][],
};
