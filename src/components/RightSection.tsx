"use client";  // Make sure this is at the very top of the file

import React, { useState } from "react";
import styles from "@/styles/RightSection.module.css";
import chatgptlogo2 from "@/assets/chatgptlogo2.png";
import nouserlogo from "@/assets/nouserlogo.png";
import Image from "next/image";
import PuffLoader from "react-spinners/PuffLoader";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API;

const RightSection = () => {
    const trainingPrompt = [
        {
            role: "user",
            parts: [{ text: "This is Introductory dialogue for any prompt..." }],
        },
        { role: "model", parts: [{ text: "okay" }] },
        {
            role: "user",
            parts: [{ text: "Special Dialogue 1..." }],
        },
        { role: "model", parts: [{ text: "okay" }] },
        {
            role: "user",
            parts: [{ text: "Special Dialogue 2..." }],
        },
        { role: "model", parts: [{ text: "okay" }] },
    ];

    const [message, setMessage] = useState("");
    const [isSent, setIsSent] = useState(true);
    const [allMessages, setAllMessages] = useState<{ role: string; parts: { text: string }[] }[]>([]);

    const sendMessage = async () => {
        if (message.trim() === "") return; // Don't send empty messages

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
            const messagesToSend = [
                ...trainingPrompt,
                ...allMessages,
                { role: "user", parts: [{ text: message }] },
            ];

            setIsSent(false);
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: messagesToSend }),
            });

            if (!res.ok) {
                throw new Error("Failed to fetch response");
            }

            const resJson = await res.json();
            setIsSent(true);

            const responseMessage = resJson.candidates[0]?.content?.parts[0]?.text || "No response received";

            const newAllMessages = [
                ...allMessages,
                { role: "user", parts: [{ text: message }] },
                { role: "model", parts: [{ text: responseMessage }] },
            ];

            setAllMessages(newAllMessages);
            setMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
            setIsSent(true);
        }
    };

    // Function to handle the "Enter" key press
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && isSent) {
            e.preventDefault(); // Prevent the default "Enter" key behavior (e.g., new line)
            sendMessage();
        }
    };

    return (
        <div className={styles.rightSection}>
            <div className={styles.rightin}>
                <div className={styles.chatgptversion}>
                    <p className={styles.text1}>Share your Feelings</p>
                </div>

                {allMessages.length > 0 ? (
                    <div className={styles.messages}>
                        {allMessages.map((msg, index) => (
                            <div key={index} className={styles.message}>
                                <Image src={msg.role === "user" ? nouserlogo : chatgptlogo2} width={50} height={50} alt="" />
                                <div className={styles.details}>
                                    <h2>{msg.role === "user" ? "You" : "FeelWell Bot"}</h2>
                                    <p>{msg.parts[0].text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.nochat}>
                        <h1>Talk to me and feel Good</h1>
                    </div>
                )}

                <div className={styles.bottomsection}>
                    <div className={styles.messagebar}>
                        <input
                            type="text"
                            placeholder={isSent ? "Message CHATGPT Bot..." : "Sending..."}
                            onChange={(e) => setMessage(e.target.value)}
                            value={message}
                            disabled={!isSent}
                            onKeyDown={handleKeyDown} // Listen for the "Enter" key press
                        />
                        {isSent ? (
                            <svg onClick={sendMessage} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                            </svg>
                        ) : (
                            <PuffLoader size={60} color="#FFFFFF" /> // Specify the size and color of the loader
                        )}
                    </div>
                    <p>FeelWell BOT can make you sad too. So ask Question carefully😂</p>
                </div>
            </div>
        </div>
    );
};

export default RightSection;
