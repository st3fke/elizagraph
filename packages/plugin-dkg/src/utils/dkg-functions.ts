import { DKG } from "dkg.js";  // Import DKG klijenta
import { generateText, elizaLogger, IAgentRuntime } from "@elizaos/core";  // Generisanje teksta koristeći OpenAI

// Proverava postojanje destinacije u DKG-u
export const checkDestinationExistence = async (destinationName: string): Promise<boolean> => {
  const query = `
    SELECT ?destination WHERE {
      ?destination a schema:TouristDestination ;
                  schema:name ?name .
      FILTER(CONTAINS(LCASE(?name), LCASE("${destinationName}")))
    }
  `;

  try {
    const result = await DKG.graphSearch(query);
    return result.length > 0;  // Ako destinacija postoji, vraća true
  } catch (error) {
    elizaLogger.error("Error searching for destination: ", error);
    return false;  // U slučaju greške vraća false
  }
};

// Generiše nove podatke o destinaciji koristeći OpenAI
export const generateNewDestination = async (runtime: IAgentRuntime, destination: string, season: string, keywords: string) => {
    const context = `
      Generate a detailed tourist destination description for a location named "${destination}".
      Include information about the season "${season}", relevant activities, and the following keywords: "${keywords}".
    `;

    try {
      // Pozivamo generateText sa ispravnim argumentima
      const generatedText = await generateText({
        runtime: runtime,  // Prosleđujemo runtime objekat
        context: context,  // Kontekst generativnog prompta
        modelClass: "text-davinci-003",  // Koristi odgovarajući model (npr. text-davinci-003)
        tools: {},  // Ako treba, dodaj alate (ako je potrebno, prazno za sada)
        maxSteps: 10,  // Možeš dodati korake ako je potrebno
      });

      return JSON.parse(generatedText);  // Pretpostavljamo da OpenAI vraća JSON format koji možemo direktno koristiti
    } catch (error) {
      elizaLogger.error("Error generating new destination: ", error);
      throw new Error("Error generating new destination");
    }
  };

// Funkcija za unos novih destinacija u DKG
export const insertNewDestination = async (destinationData: any) => {
  try {
    const result = await DKG.asset.create({
      public: destinationData,  // Ubacivanje podataka o destinaciji u DKG
    });
    elizaLogger.log("New destination added to DKG: ", result);
  } catch (error) {
    elizaLogger.error("Error inserting new destination: ", error);
  }
};
