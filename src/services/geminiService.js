import axios from 'axios';
import { GEMINI_MODELS } from '../utils/config';
import { parseGeminiJson } from '../utils/helpers';

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 2000;

function getApiKey() {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeGeminiError(error) {
  const status = error.response?.status;
  const apiMessage = error.response?.data?.error?.message;
  if (status === 429) {
    return new Error('AI rate limit reached. Wait 1–2 minutes and try again.');
  }
  if (apiMessage) return new Error(apiMessage);
  if (!error.response) return new Error('Network error. Check your connection.');
  return new Error(error.message || 'AI service error.');
}

async function callGemini(body, { timeout = 90000 } = {}) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('AI service is temporarily unavailable.');

  let lastError = new Error('AI service is temporarily unavailable.');

  for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const url = `${GEMINI_BASE_URL}/models/${model}:generateContent?key=${apiKey}`;
        return await axios.post(url, body, { timeout, headers: { 'Content-Type': 'application/json' } });
      } catch (error) {
        lastError = normalizeGeminiError(error);
        const status = error.response?.status;
        if (status === 429 && attempt < MAX_RETRIES - 1) {
          await sleep(INITIAL_RETRY_DELAY_MS * 2 ** attempt);
          continue;
        }
        if (status === 404 || status === 429) break;
        throw lastError;
      }
    }
  }
  throw lastError;
}

function extractText(response) {
  return response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
}

function buildPlannerPrompt(goal) {
  return `You are an expert software architect. Create a complete project plan.

Project idea: "${goal}"

Infer the best technology stack from the user's description. If they mention specific tools or languages, use those. Otherwise recommend the most suitable stack for the project.

Return JSON with:
- title, summary, techStack (array), estimatedDuration
- roadmap: 3-5 phases (name, description, duration, order)
- tasks: grouped by phase. Each phase 2-4 meaningful tasks (title, description, status="todo")
- database: description + 2-4 tables with fields (name, type, description)
- apis: 4-6 endpoints (method, path, description)
- folderStructure: description + 5-8 folders (path, purpose)
- deployment: platform, description, steps (array)
- bestPractices: 5-6 items (title, description)

Keep text concise. Tasks = phase-level work, not tiny steps.`;
}

const PLAN_JSON_SCHEMA = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    summary: { type: 'STRING' },
    techStack: { type: 'ARRAY', items: { type: 'STRING' } },
    estimatedDuration: { type: 'STRING' },
    roadmap: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          name: { type: 'STRING' },
          description: { type: 'STRING' },
          duration: { type: 'STRING' },
          order: { type: 'INTEGER' },
        },
        required: ['name', 'description', 'duration', 'order'],
      },
    },
    tasks: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          phase: { type: 'STRING' },
          items: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                title: { type: 'STRING' },
                description: { type: 'STRING' },
                status: { type: 'STRING' },
              },
              required: ['title', 'description'],
            },
          },
        },
        required: ['phase', 'items'],
      },
    },
    database: {
      type: 'OBJECT',
      properties: {
        description: { type: 'STRING' },
        tables: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              name: { type: 'STRING' },
              description: { type: 'STRING' },
              fields: {
                type: 'ARRAY',
                items: {
                  type: 'OBJECT',
                  properties: {
                    name: { type: 'STRING' },
                    type: { type: 'STRING' },
                    description: { type: 'STRING' },
                  },
                  required: ['name', 'type'],
                },
              },
            },
            required: ['name', 'fields'],
          },
        },
      },
      required: ['description', 'tables'],
    },
    apis: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          method: { type: 'STRING' },
          path: { type: 'STRING' },
          description: { type: 'STRING' },
        },
        required: ['method', 'path', 'description'],
      },
    },
    folderStructure: {
      type: 'OBJECT',
      properties: {
        description: { type: 'STRING' },
        folders: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: { path: { type: 'STRING' }, purpose: { type: 'STRING' } },
            required: ['path', 'purpose'],
          },
        },
      },
      required: ['description', 'folders'],
    },
    deployment: {
      type: 'OBJECT',
      properties: {
        platform: { type: 'STRING' },
        description: { type: 'STRING' },
        steps: { type: 'ARRAY', items: { type: 'STRING' } },
      },
      required: ['platform', 'steps'],
    },
    bestPractices: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: { title: { type: 'STRING' }, description: { type: 'STRING' } },
        required: ['title', 'description'],
      },
    },
  },
  required: ['title', 'summary', 'roadmap', 'tasks', 'database', 'apis', 'folderStructure', 'deployment', 'bestPractices'],
};

export async function generateProjectPlan(goal) {
  const contents = [{ parts: [{ text: buildPlannerPrompt(goal) }] }];
  const structured = {
    temperature: 0.5,
    maxOutputTokens: 8192,
    responseMimeType: 'application/json',
    responseSchema: PLAN_JSON_SCHEMA,
  };

  let response;
  try {
    response = await callGemini({ contents, generationConfig: structured });
  } catch {
    response = await callGemini({ contents, generationConfig: { temperature: 0.5, maxOutputTokens: 8192 } });
  }

  const text = extractText(response);
  if (!text) throw new Error('No response from Gemini. Please try again.');

  const plan = parseGeminiJson(text);
  const required = ['title', 'summary', 'roadmap', 'tasks', 'database', 'apis', 'folderStructure', 'deployment', 'bestPractices'];
  const missing = required.filter((k) => !plan[k]);
  if (missing.length) throw new Error(`AI response missing: ${missing.join(', ')}`);

  return plan;
}
