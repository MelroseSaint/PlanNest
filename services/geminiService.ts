import { GoogleGenAI } from "@google/genai";
import { Activity, AgeGroup } from '../types';

const AI_CACHE_KEY = 'dpb_ai_cache_v1';

// Offline Fallback Data: Guarantees the app works 100% offline with zero setup
const OFFLINE_FALLBACKS: Record<string, Partial<Activity>[]> = {
  'Infant': [
    { title: 'Sensory Bottles', type: 'Sensory', objective: 'Visual tracking and auditory stimulation', description: 'Fill clear bottles with water, glitter, and beads. Seal tight.', materials: 'Plastic bottles, water, glitter, glue' },
    { title: 'Texture Touch', type: 'Sensory', objective: 'Tactile exploration', description: 'Let infants touch different fabrics (soft, rough, bumpy).', materials: 'Fabric scraps' },
    { title: 'Mirror Play', type: 'General', objective: 'Self-recognition and social emotional development', description: 'Tummy time in front of a low mirror.', materials: 'Unbreakable mirror' }
  ],
  'Toddler': [
    { title: 'Color Sorting', type: 'General', objective: 'Color recognition and fine motor skills', description: 'Sort large pom-poms into matching colored bowls.', materials: 'Pom-poms, colored bowls' },
    { title: 'Bubble Chase', type: 'Outdoor', objective: 'Gross motor movement and hand-eye coordination', description: 'Blow bubbles and encourage children to pop them.', materials: 'Bubbles' },
    { title: 'Playdough Fun', type: 'Art', objective: 'Fine motor strength and creativity', description: 'Free manipulation of playdough.', materials: 'Playdough, plastic tools' }
  ],
  'Preschool': [
    { title: 'Nature Collage', type: 'Art', objective: 'Creativity and nature appreciation', description: 'Glue collected leaves and sticks onto paper.', materials: 'Nature items, glue, paper' },
    { title: 'Shape Scavenger Hunt', type: 'General', objective: 'Shape recognition', description: 'Find items in the room that match specific shapes.', materials: 'None' },
    { title: 'Freeze Dance', type: 'Music', objective: 'Listening skills and self-regulation', description: 'Dance when music plays, freeze when it stops.', materials: 'Music player' }
  ],
  'Pre-K': [
      { title: 'Letter Tracing', type: 'Literacy', objective: 'Letter recognition and writing skills', description: 'Trace letters in sand or shaving cream.', materials: 'Trays, sand/shaving cream' },
      { title: 'Simple Science: Sink or Float', type: 'General', objective: 'Scientific inquiry and prediction', description: 'Predict and test which items sink or float in water.', materials: 'Water bin, various objects' },
      { title: 'Obstacle Course', type: 'Gross Motor', objective: 'Gross motor planning and balance', description: 'Navigate through a simple course.', materials: 'Cones, tunnel, balance beam' }
  ],
  'Grade School': [
      { title: 'Journal Writing', type: 'Literacy', objective: 'Creative writing and reflection', description: 'Write or draw about a specific prompt.', materials: 'Journals, pencils' },
      { title: 'Team Building Game', type: 'General', objective: 'Cooperation and communication', description: 'Group challenges to solve a problem together.', materials: 'Varies' },
      { title: 'Art Project', type: 'Art', objective: 'Fine motor skills and artistic expression', description: 'Multi-step art project.', materials: 'Art supplies' }
  ]
};

const getOfflineFallback = (ageGroup: string): Partial<Activity>[] => {
  // Normalize age group key
  const key = Object.keys(OFFLINE_FALLBACKS).find(k => ageGroup.includes(k)) || 'Toddler';
  return OFFLINE_FALLBACKS[key];
};

export interface AiResponse {
    activities: Partial<Activity>[];
    source: 'ai' | 'cache' | 'offline';
}

// We wrap the API call to handle potential offline states or missing keys gracefully
export const GeminiService = {
  suggestActivities: async (
    ageGroup: string,
    topic: string,
    currentMaterials: string
  ): Promise<AiResponse> => {
    
    // 1. Check Cache
    // Create a simple key based on parameters to retrieve previous answers
    const cacheKeyStr = `${ageGroup}_${topic}_${currentMaterials}`.toLowerCase().replace(/[^a-z0-9]/g, '');
    try {
        const cachedData = localStorage.getItem(AI_CACHE_KEY);
        if (cachedData) {
            const cache = JSON.parse(cachedData);
            if (cache[cacheKeyStr]) {
                console.log("Serving AI suggestions from local cache");
                return { activities: cache[cacheKeyStr], source: 'cache' };
            }
        }
    } catch (e) {
        console.error("Cache read error", e);
    }

    // 2. Try API
    // Safe access to process.env
    let apiKey: string | undefined;
    try {
        if (typeof process !== 'undefined' && process.env) {
            apiKey = process.env.API_KEY;
        }
    } catch(e) {
        // process not defined
    }

    // Only attempt if API Key exists and we are likely online
    if (apiKey && navigator.onLine) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        
        const prompt = `
          You are a helpful assistant for a daycare teacher.
          Suggest 3 simple, low-prep activities for children in the age group: ${ageGroup}.
          The theme or topic is: ${topic}.
          Available materials (optional context): ${currentMaterials}.
          
          Return the response strictly as a JSON array of objects with these keys:
          - title (string)
          - objective (string: compliance-safe, educational goal)
          - description (string: brief instructions)
          - materials (string: list of items)
          - type (string: e.g., Art, Sensory, Outdoor, Music)
          
          Do not include markdown code blocks. Just the raw JSON.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const text = response.text;
        if (text) {
          const data = JSON.parse(text);
          
          const formatted = data.map((item: any) => ({
            ...item,
            id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ageGroup: ageGroup as AgeGroup,
            isTemplate: false
          }));

          // Save to cache
          try {
             const cachedData = localStorage.getItem(AI_CACHE_KEY);
             const cache = cachedData ? JSON.parse(cachedData) : {};
             cache[cacheKeyStr] = formatted;
             
             // Simple cache management: prevent unlimited growth
             if (JSON.stringify(cache).length > 500000) { 
                 localStorage.removeItem(AI_CACHE_KEY); 
             } else {
                 localStorage.setItem(AI_CACHE_KEY, JSON.stringify(cache));
             }
          } catch (e) {
              console.error("Cache write error", e);
          }

          return { activities: formatted, source: 'ai' };
        }
      } catch (error) {
        console.warn("Gemini API failed or offline. Falling back to local templates.", error);
        // Fall through to offline return
      }
    } else {
        console.warn("No API Key configured or offline. Using offline templates.");
    }

    // 3. Offline Fallback
    // Guaranteed return so the teacher is never left with an error screen
    const fallbacks = getOfflineFallback(ageGroup).map(item => ({
        ...item,
        id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ageGroup: ageGroup as AgeGroup,
        isTemplate: false
    }));

    return { activities: fallbacks, source: 'offline' };
  }
};