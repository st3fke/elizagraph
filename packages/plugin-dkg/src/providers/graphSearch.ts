import { DKG } from "dkg.js";
import { elizaLogger } from "@elizaos/core"; // Logovanje, obavezno koristi log funkcije
import { generateText } from "@elizaos/core";  // Za korišćenje OpenAI generativnih funkcija

// Kreiranje instance DKG klijenta
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

// Funkcija za pretragu destinacija u DKG-u
export const dkgSearch = async (query: string) => {
  try {
    // Upit prema DKG-u
    const result = await DkgClient.query(query);
    elizaLogger.log("DKG Search Result:", result);

    return result;  // Vraća rezultate pretrage
  } catch (error) {
    elizaLogger.error("Error occurred during DKG search:", error);
    throw error;  // Vraća grešku ako dođe do problema sa pretragom
  }
};

// Funkcija koja pretražuje destinacije prema imenu
export const searchDestinationByName = async (destinationName: string) => {
  const query = `
    SELECT ?destination WHERE {
      ?destination a schema:TouristDestination ;
                  schema:name ?name .
      FILTER(CONTAINS(LCASE(?name), LCASE("${destinationName}")))
    }
  `;

  return await dkgSearch(query);  // Poziva pretragu sa upitom
};

// Proverava postojanje destinacije u DKG-u
export const checkDestinationExistence = async (destinationName: string): Promise<boolean> => {
  const result = await searchDestinationByName(destinationName);
  return result.length > 0;  // Ako destinacija postoji, vraća true
};

// Generiše nove podatke o destinaciji koristeći OpenAI
export const generateNewDestination = async (destination: string, season: string, keywords: string) => {
  const prompt = `
    Generate a detailed tourist destination description for a location named "${destination}".
    Include information about the season "${season}", relevant activities, and the following keywords: "${keywords}".
  `;

  const generatedText = await generateText({
    runtime: null,  // Možeš proslediti runtime, ako je potrebno
    context: prompt,
    modelClass: "large", // Možeš promeniti model prema potrebi
  });

  return JSON.parse(generatedText);  // Pretpostavljamo da OpenAI vraća JSON format koji možemo direktno koristiti
};

// Funkcija za unos novih destinacija u DKG
export const insertNewDestination = async (destinationData: any) => {
  try {
    const result = await DkgClient.asset.create({
      public: destinationData,  // Ubacivanje podataka o destinaciji u DKG
    });
    elizaLogger.log("New destination added to DKG: ", result);
  } catch (error) {
    elizaLogger.error("Error inserting new destination: ", error);
  }
};

// Glavni tok za proveru i unos novih destinacija
export const handleNewDestination = async (destinationName: string, season: string, keywords: string) => {
  const exists = await checkDestinationExistence(destinationName);

  if (exists) {
    elizaLogger.log(`Destinacija ${destinationName} već postoji u DKG-u.`);
  } else {
    // Ako destinacija ne postoji, generiši nove podatke
    const newDestinationData = await generateNewDestination(destinationName, season, keywords);
    await insertNewDestination(newDestinationData);  // Unos nove destinacije u DKG
    elizaLogger.log(`Novi podaci za destinaciju ${destinationName} su uspešno uneseni u DKG.`);
  }
};
