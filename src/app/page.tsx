"use client";

import React, {useState} from "react";

type FormState = { success: boolean, message: string } | undefined;

export default function Home() {
    const [userPrompt, setUserPrompt] = useState('');
    const [botResponse, setBotResponse] = useState<FormState>(undefined);

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUserPrompt(event.target.value);
        setBotResponse(undefined);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (userPrompt.trim() === '') {
            console.log("No prompt specified.");
            setBotResponse({success: false, message: "Please enter a message for translation."});
            return;
        }

        console.log(`User prompt: ${userPrompt}`)
        const response = await fetch('/api/chatbot', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({userPrompt})
        });

        if (response.ok) {
            const assistantResponse = await response.text();
            console.log(`Bot response: ${assistantResponse}`);
            setBotResponse({success: true, message: assistantResponse});
        } else {
            setBotResponse({success: false, message: response.statusText})
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen">
            <form className="w-full max-w-md text-center p-5" onSubmit={handleSubmit}>
                <textarea
                    className="w-full mb-3 border rounded text-black"
                    placeholder="What would you like to translate?"
                    rows={6}
                    value={userPrompt}
                    onChange={handleInputChange}
                />
                <br/>
                <button
                    type="submit"
                    className="p-2 bg-blue-500 text-white rounded">
                    Ask
                </button>
            </form>
            {botResponse != undefined && (
                <div className={"text-black max-w-md"}>
                    <h2 className="pt-4 font-bold">Original</h2>
                    <p>{userPrompt}</p>
                    {
                        botResponse.success ? (
                            <>
                                <h2 className="pt-4 font-bold">Translation</h2>
                                <p>{botResponse.message}</p>
                            </>
                        ) : (
                            <>
                                <h2 className="pt-4 font-bold text-red-700">Error</h2>
                                <p>{botResponse.message}</p>
                            </>
                        )
                    }
                </div>
            )}
        </div>
    );
}

