import type { Agent } from "../types/Agent";  // Assuming Agent type is correctly defined

const fetcher = async ({
    url,
    method,
    body,
    headers,
}: {
    url: string;
    method?: "GET" | "POST";
    body?: object | FormData;
    headers?: Record<string, string>; // Use Record for headers
}) => {
    const options: RequestInit = {
        method: method ?? "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(headers ?? {}), // Merge with provided headers if any
        },
    };

    if (method === "POST") {
        if (body instanceof FormData) {
            options.body = body;
        } else {
            options.body = JSON.stringify(body);
        }
    }
    console.log("Pre responsa")
    const response = await fetch(url, options);
    console.log("Posle responsa")
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching ${url}: `, errorText);
        throw new Error(errorText || 'Failed to fetch data');
    }

    // Log and parse as JSON
    const data = await response.json().catch((err) => {
        console.error(`Error parsing JSON from ${url}: ${err}`);
        throw new Error('Failed to parse JSON response');
    });
    console.log(`Fetched data from ${url}:`, data);
    return data;
};

export const apiClient = {
    fetchAgents: async (): Promise<Agent[]> => {
        try {
            const [response1, response2] = await Promise.all([
                fetcher({ url: "http://localhost:3000/agents" }),
                fetcher({ url: "http://localhost:3001/agents" }),
            ]);

            const extractAgents = (response: any): Agent[] => {
                if (Array.isArray(response)) {
                    return response;
                } else if (typeof response === 'object' && response.agents && Array.isArray(response.agents)) {
                    return response.agents; // Handle if agents are inside an object
                } else {
                    console.error("Unexpected response structure:", response);
                    throw new Error("Unexpected response structure.");
                }
            };

            const agents1 = extractAgents(response1);
            const agents2 = extractAgents(response2);

            return [...agents1, ...agents2];
        } catch (error) {
            console.error("Error fetching agents:", error);
            throw error;
        }
    },
    // New method to send travel data
    sendTravelData: async (data: {
        destination: string;
        startingPoint: string;
        startingDate: string;
        endingDate: string;
        keywords: string;
        roomId: string;
        userId: string;
        agentId: string | null; // agentId can be null
    }) => {
        console.log("Usao u send travel Data");
        return fetcher({
            url: `http://localhost:3001/agents/${localStorage.getItem("selectedAgentId")}/travel`, // or your actual endpoint
            method: "POST",
            body: data,
        });
    },
};