import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Za generisanje roomId

const TravelForm = ({ runtime }) => {
    const [destination, setDestination] = useState('');
    const [startingPoint, setStartingPoint] = useState('');
    const [startingDate, setStartingDate] = useState('');
    const [endingDate, setEndingDate] = useState('');
    const [keywords, setKeywords] = useState('');
    const [response, setResponse] = useState('');

    // Pretpostavljamo da je korisnik ulogovan
    const userId = 'user123'; // Ovo bi došlo sa autentifikacije
    const roomId = 'room-' + uuidv4(); // Generisani roomId za svaki novi chat

    // Funkcija za slanje podataka agentu i dobijanje odgovora
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!destination || !startingPoint || !startingDate || !endingDate || !keywords) {
            alert('Please enter all fields');
            return;
        }

        // Kreiranje poruke sa destinacijom, početnom destinacijom, datumom početka, datumom kraja i dodatnim podacima
        const message = {
            content: {
                text: `${startingPoint}`,
                destination: `${destination}`,
                dateStarting: `${startingDate}`,
                dateEnding: `${endingDate}`,
                keywords: `${keywords}`,
            },
            roomId,  // Jedinstveni identifikator sobe
            userId,  // Jedinstveni identifikator korisnika
            agentId: localStorage.getItem("selectedAgentId"),  // Jedinstveni identifikator agenta (ako ga imaš)
        };

        // Pretpostavljamo da imamo funkciju koja može da dobije context od agenta
        const state = await runtime.composeState(message);

        // Pomoću runtime.getContextProvider možemo pozvati agenta sa potrebnim podacima
        try {
            const agentResponse = await runtime.getContextProvider('flightProvider').get(runtime, message, state);
            setResponse(agentResponse); // Postavljamo odgovor u stanje za prikaz
        } catch (error) {
            console.error('Error getting response from agent:', error);
            setResponse('Sorry, there was an error while fetching the response.');
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