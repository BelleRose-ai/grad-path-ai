
import { GoogleGenAI, GenerateContentResponse, Chat, Type } from "@google/genai";
import { UserProfile, EvaluationResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set. Please set it to use the Gemini API.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const modelName = 'gemini-2.5-flash';

// This defines the structure we expect from the AI for robust parsing.
const evaluationSchema = {
  type: Type.OBJECT,
  properties: {
    matchStrength: {
      type: Type.STRING,
      description: "The student's match strength, e.g., 'Exceptional Fit (Likely Admission)', 'Strong Candidate (High Chance)', etc."
    },
    overallAssessment: {
      type: Type.STRING,
      description: "Detailed, candid explanation of the match strength, justifying the rating based on the university's inferred standards. Max 3-4 sentences."
    },
    strengths: {
      type: Type.ARRAY,
      description: "List of key strengths that align with what the target university likely values for the target program. Limit to 3-4 points.",
      items: { type: Type.STRING },
    },
    areasForImprovement: {
      type: Type.ARRAY,
      description: "List of critical areas for improvement. Limit to 3-4 points.",
      items: {
        type: Type.OBJECT,
        properties: {
          area: {
            type: Type.STRING,
            description: "The area needing improvement, e.g., 'CGPA for Tier-1 Program', 'Lack of Specialized Research'."
          },
          suggestion: {
            type: Type.STRING,
            description: "Specific, actionable, and critical advice for improvement."
          },
        },
        required: ["area", "suggestion"],
      },
    },
    alternativeUniversities: {
      type: Type.ARRAY,
      description: "List of 2-3 well-justified alternative university suggestions.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "University Name" },
          program: { type: Type.STRING, description: "Suggested Program" },
          reasoning: {
            type: Type.STRING,
            description: "Why this university/program is a more realistic or better fit."
          },
        },
        required: ["name", "program", "reasoning"],
      },
    },
    scholarshipOutlook: {
      type: Type.STRING,
      description: "Honest assessment of scholarship prospects at the target university and advice for improvement."
    },
  },
  required: [
    "matchStrength",
    "overallAssessment",
    "strengths",
    "areasForImprovement",
    "alternativeUniversities",
    "scholarshipOutlook",
  ],
};


const constructSystemInstruction = (profile: UserProfile): string => {
    return `You are an expert university admissions counselor. Your task is to provide a **blunt, realistic, and deeply analytical** evaluation of a student's profile against their chosen university and program.
**Crucially, your evaluation must reflect the specific expectations, typical selectivity, academic rigor, and vision of ${profile.targetUniversity} for the ${profile.targetProgram}.** Use your knowledge to infer these standards.
Do not sugarcoat your feedback. The student needs an honest understanding of their standing. Clearly differentiate between excellent, good, average (mid), and poor profiles *relative to the specified institution*.

If the profile is genuinely exceptional for ${profile.targetUniversity}, 'areasForImprovement' can be minimal or focus on maintaining excellence.
If the profile is weak for ${profile.targetUniversity}, be very direct about the gap and necessary improvements.
Ensure all suggestions are actionable and highly relevant to the student's major and their target program at ${profile.targetUniversity}.
Be concise, constructive, but above all, **realistic and direct**.
The 'overallAssessment' should be a direct summary of their chances. Detailed points should be in 'strengths' and 'areasForImprovement'.
Limit 'strengths' to 3-4 highly relevant points.
Limit 'areasForImprovement' to 3-4 critical areas.
Limit 'alternativeUniversities' to 2-3 well-justified suggestions.
For 'matchStrength', use one of the following: 'Exceptional Fit (Likely Admission)', 'Strong Candidate (High Chance)', 'Competitive Applicant (Good Chance)', 'Average Applicant (Fair Chance)', 'Below Average (Uphill Battle)', 'Significant Mismatch (Very Low Chance)', 'Poor Fit (Unlikely Admission)'.
`;
}

const constructUserPrompt = (profile: UserProfile): string => {
    return `Here is the student's profile for evaluation:
Student Profile:
- CGPA: ${profile.cgpa} out of ${profile.cgpaScale}
- Intended Major: ${profile.major}
- Academic Achievements: ${profile.academicAchievements || 'Not specified'}
- Awards and Honors: ${profile.awardsAndHonors || 'Not specified'}
- Standardized Test Scores: ${profile.testScores || 'Not specified'}
- Extracurricular Activities: ${profile.extracurricularActivities || 'Not specified'}

Target University:
- Name: ${profile.targetUniversity}
- Program: ${profile.targetProgram}

Please evaluate this profile based on the system instructions and return the result in the specified JSON format.
`;
}


export const evaluateUserProfile = async (profile: UserProfile): Promise<EvaluationResult> => {
  const systemInstruction = constructSystemInstruction(profile);
  const userPrompt = constructUserPrompt(profile);

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: evaluationSchema,
        temperature: 0.3,
        topP: 0.8,
        topK: 30,
      },
    });
    
    const jsonStr = response.text.trim();

    try {
      const parsedData = JSON.parse(jsonStr) as EvaluationResult;
      if (!parsedData.matchStrength || !parsedData.overallAssessment) {
          throw new Error("Received malformed JSON response from API: missing essential fields.");
      }
      return parsedData;
    } catch (e) {
      console.error("Failed to parse JSON response:", e, "Raw response:", jsonStr);
      throw new Error(`The AI's response was not in the expected format. Please try again. Raw response: ${jsonStr.substring(0, 200)}...`);
    }

  } catch (error) {
    console.error("Error calling Gemini API for evaluation:", error);
    if (error instanceof Error) {
        if (error.message.includes("API_KEY_INVALID") || error.message.includes("API key not valid")) {
             throw new Error("Invalid API Key. Please check your API key configuration.");
        }
    }
    throw new Error("An error occurred while communicating with the AI evaluation service.");
  }
};

export const initializeChatSession = (profile: UserProfile, evaluation: EvaluationResult): Chat => {
  const systemInstruction = `You are GradPath AI, an expert university admissions counselor.
The user, ${profile.fullName || 'the student'}, has just received a **direct and realistic** evaluation of their academic profile.
Key Profile Details:
- Target University: ${profile.targetUniversity}
- Target Program: ${profile.targetProgram}
- CGPA: ${profile.cgpa} out of ${profile.cgpaScale}
- Major: ${profile.major}

Initial Evaluation Summary:
- Match Strength: ${evaluation.matchStrength}
- Overall Assessment: ${evaluation.overallAssessment}
- Key Strengths: ${(evaluation.strengths && evaluation.strengths.length > 0) ? evaluation.strengths.join(', ') : 'Not specified'}
- Areas for Improvement: ${(evaluation.areasForImprovement && evaluation.areasForImprovement.length > 0) ? evaluation.areasForImprovement.map(a => `${a.area}: ${a.suggestion}`).join('; ') : 'None specified'}

Your role now is to continue the conversation by answering the user's follow-up questions. Maintain the **blunt, realistic, yet supportive** tone. Provide specific, actionable advice. Refer to their profile and the previous evaluation details when relevant. Keep your responses concise and focused on the user's questions. Do not refer to yourself as an AI language model; maintain your persona as GradPath AI.`;

  const chat = ai.chats.create({
    model: modelName,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.6, // Slightly more conversational for chat, but still grounded
    },
    // No initial history needed if systemInstruction is comprehensive
  });
  return chat;
};

export const sendChatMessageToSession = async (chat: Chat, message: string): Promise<GenerateContentResponse> => {
  try {
    const response = await chat.sendMessage({ message });
    return response;
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw new Error("An error occurred while communicating with the AI chat service.");
  }
};
