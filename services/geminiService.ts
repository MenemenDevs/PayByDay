
import { GoogleGenAI } from "@google/genai";
import { Transaction, Goal, UserStats } from "../types";

export const getFinancialAdvice = async (
  transactions: Transaction[],
  goals: Goal[],
  stats: UserStats,
  userMessage?: string
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const context = `
    User Stats: Level ${stats.level}, XP ${stats.xp}, Streak ${stats.streak}, Savings $${stats.totalSavings}.
    Current Goals: ${goals.map(g => `${g.title} ($${g.currentAmount}/$${g.targetAmount})`).join(', ')}.
    Recent Transactions: ${transactions.slice(0, 5).map(t => `${t.type} of $${t.amount} for ${t.category}`).join(', ')}.
  `;

  const prompt = userMessage 
    ? `The user says: "${userMessage}". Based on their financial context: ${context}. Give a cool, teen-friendly financial advice.`
    : `Analyze this teen's financial data and give them a short, motivating "PayByDay" tip to stay on budget today. Keep it under 50 words and use emojis. Context: ${context}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are the 'PayByDay Guide', a modern, high-energy financial mentor for Gen Z. You use helpful analogies from gaming and pop culture. You are supportive and emphasize consistency over perfection.",
        temperature: 0.9,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Stay focused on the grind! Every dollar saved is a step toward your next big quest. 💸";
  }
};
