import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import {
    AgentRuntime,
    elizaLogger,
    getEnvVariable,
    validateCharacterConfig,
} from "@elizaos/core";

import { REST, Routes } from "discord.js";
import { DirectClient } from ".";
import { stringToUuid } from "@elizaos/core";

export function createApiRouter(
    agents: Map<string, AgentRuntime>,
    directClient: DirectClient
) {
    const router = express.Router();

    router.use(cors());
    router.use(bodyParser.json());
    router.use(bodyParser.urlencoded({ extended: true }));
    router.use(
        express.json({
            limit: getEnvVariable("EXPRESS_MAX_PAYLOAD") || "100kb",
        })
    );

    router.get("/", (req, res) => {
        res.send("Welcome, this is the REST API!");
    });

    router.get("/hello", (req, res) => {
        res.json({ message: "Hello World!" });
    });

    router.get("/agents", (req, res) => {
        const agentsList = Array.from(agents.values()).map((agent) => ({
            id: agent.agentId,
            name: agent.character.name,
            clients: Object.keys(agent.clients),
        }));
        console.log(agentsList);
        res.json({ agents: Array.isArray(agentsList) ? agentsList : [] });
        // Proveri da li je agentsList niz, inače pošaljite prazan niz

    });

    router.get("/agents/:agentId", (req, res) => {
        const agentId = req.params.agentId;
        const agent = agents.get(agentId);

        if (!agent) {
            res.status(404).json({ error: "Agent not found" });
            return;
        }

        res.json({
            id: agent.agentId,
            character: agent.character,
        });
    });

    router.post("/agents/:agentId/set", async (req, res) => {
        console.log('Received travel data:', req.body);
        const {
            destination,
            startingPoint,
            startingDate,
            endingDate,
            keywords,
            roomId,
            userId,
            agentId
        } = req.body;

        // Basic validation
        if (!destination || !startingPoint || !startingDate || !endingDate || !keywords || !roomId || !userId) {

            res.status(400).json({ message: 'All fields are required.' });
            return
        }

        try {
            // Here you would handle the travel data
            // For instance, you might save it to a database or call another service
            console.log("Received travel details:", req.body);

            // Mock response: You may want to replace this logic with actual processing
            const travelResponse = {
                message: 'Travel details received successfully!',
                data: req.body
            };

            // Send response back to the client
            res.status(200).json(travelResponse);
        } catch (error) {
            console.error("Error processing travel details:", error);
            res.status(500).json({ error: 'Failed to process travel details.' });
        }
    });

    router.post("/sendTravelDetails", async (req, res) => {
        console.log('Received travel data:', req.body);
        const {
            destination,
            startingPoint,
            startingDate,
            endingDate,
            keywords,
            roomId,
            userId,
            agentId
        } = req.body;


        if (!destination || !startingPoint || !startingDate || !endingDate || !keywords || !roomId || !userId) {

            res.status(400).json({ message: 'All fields are required.' });
            return
        }

        try {

            console.log("Received travel details:", req.body);

            const travelResponse = {
                message: 'Travel details received successfully!',
                data: req.body
            };


            res.status(200).json(travelResponse);
        } catch (error) {
            console.error("Error processing travel details:", error);
            res.status(500).json({ error: 'Failed to process travel details.' });
        }
    });
    router.get("/agents/:agentId/channels", async (req, res) => {
        const agentId = req.params.agentId;
        const runtime = agents.get(agentId);

        if (!runtime) {
            res.status(404).json({ error: "Runtime not found" });
            return;
        }

        const API_TOKEN = runtime.getSetting("DISCORD_API_TOKEN") as string;
        const rest = new REST({ version: "10" }).setToken(API_TOKEN);

        try {
            const guilds = (await rest.get(Routes.userGuilds())) as Array<any>;

            res.json({
                id: runtime.agentId,
                guilds: guilds,
                serverCount: guilds.length,
            });
        } catch (error) {
            console.error("Error fetching guilds:", error);
            res.status(500).json({ error: "Failed to fetch guilds" });
        }
    });

    router.get("/agents/:agentId/:roomId/memories", async (req, res) => {
        const agentId = req.params.agentId;
        const roomId = stringToUuid(req.params.roomId);
        let runtime = agents.get(agentId);

        // if runtime is null, look for runtime with the same name
        if (!runtime) {
            runtime = Array.from(agents.values()).find(
                (a) => a.character.name.toLowerCase() === agentId.toLowerCase()
            );
        }

        if (!runtime) {
            res.status(404).send("Agent not found");
            return;
        }

        try {
            const memories = await runtime.messageManager.getMemories({
                roomId,
            });
            const response = {
                agentId,
                roomId,
                memories: memories.map((memory) => ({
                    id: memory.id,
                    userId: memory.userId,
                    agentId: memory.agentId,
                    createdAt: memory.createdAt,
                    content: {
                        text: memory.content.text,
                        action: memory.content.action,
                        source: memory.content.source,
                        url: memory.content.url,
                        inReplyTo: memory.content.inReplyTo,
                        attachments: memory.content.attachments?.map(
                            (attachment) => ({
                                id: attachment.id,
                                url: attachment.url,
                                title: attachment.title,
                                source: attachment.source,
                                description: attachment.description,
                                text: attachment.text,
                                contentType: attachment.contentType,
                            })
                        ),
                    },
                    embedding: memory.embedding,
                    roomId: memory.roomId,
                    unique: memory.unique,
                    similarity: memory.similarity,
                })),
            };

            res.json(response);
        } catch (error) {
            console.error("Error fetching memories:", error);
            res.status(500).json({ error: "Failed to fetch memories" });
        }
    });


    return router;
}
