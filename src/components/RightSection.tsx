"use client";

import React, { useState } from "react";
import styles from "@/styles/RightSection.module.css";
import chatgptlogo2 from "@/assets/chatgptlogo2.png";
import nouserlogo from "@/assets/nouserlogo.png";
import Image from "next/image";
import { HashLoader } from "react-spinners";

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

    return (
        <div className={styles.rightSection}>
            <div className={styles.rightin}>
                <div className={styles.chatgptversion}>
                    <p className={styles.text1}>Chat</p>
                </div>

                {allMessages.length > 0 ? (
                    <div className={styles.messages}>
                        {allMessages.map((msg, index) => (
                            <div key={index} className={styles.message}>
                                <Image src={msg.role === "user" ? nouserlogo : chatgptlogo2} width={50} height={50} alt="" />
                                <div className={styles.details}>
                                    <h2>{msg.role === "user" ? "You" : "CHATGPT Bot"}</h2>
                                    <p>{msg.parts[0].text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.nochat}>
                        <h1>How can I help you today?</h1>
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
                        />
                        {isSent ? (
                            <svg onClick={sendMessage} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                            </svg>
                        ) : (
                            <HashLoader color="#36d7b7" size={30} />
                        )}
                    </div>
                    <p>FeelWell BOT can make you sad too. So ask Question carefully😂</p>
                </div>
            </div>
        </div>
    );
};

export default RightSection;
