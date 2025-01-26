import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IAgentRuntime } from "@elizaos/core";
import { apiClient } from '../lib/api'; // Adjust the path accordingly

const TravelForm = ({ runtime }: { runtime: IAgentRuntime }) => {
    const [destination, setDestination] = useState('');
    const [startingPoint, setStartingPoint] = useState('');
    const [startingDate, setStartingDate] = useState('');
    const [endingDate, setEndingDate] = useState('');
    const [keywords, setKeywords] = useState('');
    const [response, setResponse] = useState('');

    const userId = 'user123'; // Replace with actual user ID from auth
    const roomId = 'room-' + uuidv4(); // Unique roomId for each chat

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!destination || !startingPoint || !startingDate || !endingDate || !keywords) {
            alert('Please enter all fields');
            return;
        }

        // Create message with travel details
        const messageData = {
            destination,
            startingPoint,
            startingDate,
            endingDate,
            keywords,
            roomId,
            userId,
            agentId: localStorage.getItem("selectedAgentId") || null,  // Ensure we have an agent ID
        };

        // Send travel data to API
        try {
            console.log("Pre", messageData);
            const agentResponse = await apiClient.sendTravelData(messageData); // Send data using the API client
            console.log("posle", messageData);
            setResponse(`Agent Response: ${agentResponse}`);
        } catch (error) {
            console.error('Error sending travel data:', error);
            setResponse('Sorry, there was an error while sending travel data.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Starting Point:
                    <input
                        type="text"
                        value={startingPoint}
                        onChange={(e) => setStartingPoint(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Destination:
                    <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Starting Date:
                    <input
                        type="date"
                        value={startingDate}
                        onChange={(e) => setStartingDate(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Ending Date:
                    <input
                        type="date"
                        value={endingDate}
                        onChange={(e) => setEndingDate(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Keywords:
                    <input
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                    />
                </label>
                <br />
                <button type="submit">Search Flights</button>
            </form>
            <div>{response}</div>
        </div>
    );
};

export default TravelForm;