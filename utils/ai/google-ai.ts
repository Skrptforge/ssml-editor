"use server";

import { generateObject } from "ai";
import { createGoogleGenerativeAI, GoogleGenerativeAIProviderMetadata } from "@ai-sdk/google";
import { z } from "zod";
import type {
  ScriptResponse,
  EditResponse,
  VerifyResponse,
} from "@/lib/types/script-response";
import type { Block } from "@/lib/types/block";
import { generateText } from "ai";
import {
  parseFactCheckResponse,
  type FactCheckCorrection,
} from "@/utils/parsing";

// Dynamic schema that matches the updated interface with name field
const CreateInitialScriptSchema = z.object({
  block1: z.object({
    texts: z.array(z.string()),
    name: z.string(),
  }),
  block2: z.object({
    texts: z.array(z.string()),
    name: z.string(),
  }),
  block3: z
    .object({
      texts: z.array(z.string()),
      name: z.string(),
    })
    .optional(),
  block4: z
    .object({
      texts: z.array(z.string()),
      name: z.string(),
    })
    .optional(),
  block5: z
    .object({
      texts: z.array(z.string()),
      name: z.string(),
    })
    .optional(),
  block6: z
    .object({
      texts: z.array(z.string()),
      name: z.string(),
    })
    .optional(),
  block7: z
    .object({
      texts: z.array(z.string()),
      name: z.string(),
    })
    .optional(),
  block8: z
    .object({
      texts: z.array(z.string()),
      name: z.string(),
    })
    .optional(),
});

// For edit operations, we can use a more flexible approach
const EditScriptSchema = z.object({
  operations: z.array(
    z.object({
      operation: z.enum(["create", "update", "delete"]),
      createOperationValue: z
        .object({
          content: z.string(),
          idBefore: z.string().optional(),
        })
        .optional(),
      updateOperationValue: z
        .object({
          blockId: z.string(),
          content: z.string(),
        })
        .optional(),
      deleteOperationValue: z
        .object({
          blockId: z.string(),
        })
        .optional(),
    })
  ),
});

/**
 * Server function to create initial script using Google Gemini
 */
export async function createInitialScript(
  prompt: string
): Promise<ScriptResponse> {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error("Missing Google API key. Set process.env.GOOGLE_API_KEY");
  }

  const google = createGoogleGenerativeAI({ apiKey });
  const model = google("gemini-2.5-flash");

  const { object } = await generateObject({
    model,
    schema: CreateInitialScriptSchema,
    prompt: `You are a world-class YouTube content strategist and scriptwriter. Your expertise lies in creating viral, retention-focused content that keeps viewers glued to their screens. Create a masterful script for: "${prompt}"
    
    
NOTE : DON'T EVER CRITISISE ANYTHING RELATED TO ANY RELIGEON OR ANY HISTORICAL HINDU FIGURE  
🎯 STRATEGIC FRAMEWORK:
Create 2-8 strategically structured segments that build momentum and maximize watch time. Each segment must have both compelling content AND a descriptive name.
Please don't use sophisticated wordings keep it simple as we do it in youtube, it should be more human.

MANDATORY SEGMENTS:
• Block 1: "Hook" - Create an irresistible opening that makes scrolling impossible
• Final Block: "Conclusion" - Deliver a satisfying payoff while driving engagement

DYNAMIC MIDDLE SEGMENTS (choose what serves your story):
• "Setup" - Essential background/context
• "Revelation" - Major plot twist or key discovery  
• "Deep Dive" - Detailed analysis or explanation
• "Evidence" - Proof, examples, or case studies
• "Twist" - Unexpected angle or counterpoint
• "Impact" - Real-world implications or consequences
• "Backstory" - Historical context or origin story

📝 PREMIUM WRITING STANDARDS:

WORD PRECISION:
• Each block must : 200-300 words total (Hook: 150-200, Conclusion: 150-200) unless specified in user prompt
• Individual text segments: 20-30 words each not more than that unless specified in the user prompt
• Total 10 segments each block unless specified in the user prompt
• Target: 1500-2000 words total for optimal 8-10 minute pacing unless specified in the user prompt

PSYCHOLOGICAL ENGAGEMENT:
• Write like you're revealing secrets to a fascinated friend
• Use "cliffhanger" language: "But what happened next will shock you..."
• Deploy curiosity gaps: "The real reason? It's not what you think..."
• Include "pattern interrupts": unexpected facts that reset attention
• Build emotional investment through relatable analogies

RETENTION TECHNIQUES:
• Start segments with transitional hooks: "Now here's where it gets crazy..."
• End segments with forward momentum: "But the story doesn't end there..."
• Sprinkle in "social proof": "Scientists couldn't believe what they found..."
• Don't start with "Hey everyone today I am going..." this is really cliche and turns off the audience
• Hook should be very crisp and to the point no jargon and implying to a substance not signal

🎬 OUTPUT REQUIREMENTS:
Return blocks with both content and strategic naming:

{
    "block1": {
        "texts": [
            "20-30 words (unless specified in user prompt)",
            "20-30 words (unless specified in user prompt)",
        ],
        "name": "Hook: An interesting quest?"
    },
    "block2": {
        "texts": [
            "20-30 words (unless specified in user prompt)",
            "20-30 words (unless specified in user prompt)",
            "20-30 words (unless specified in user prompt)",
            "20-30 words (unless specified in user prompt)",
            "20-30 words (unless specified in user prompt)",
            "20-30 words (unless specified in user prompt)",
            "20-30 words (unless specified in user prompt)",
        ],
        "name": "Hook: An interesting quest?"
    },
     "block3": {
        "texts": [
            "20-30 words (unless specified in user prompt)",
            "20-30 words (unless specified in user prompt)",
            "20-30 words (unless specified in user prompt)",
            "20-30 words (unless specified in user prompt)",
            "20-30 words (unless specified in user prompt)",
            "20-30 words (unless specified in user prompt)",
            "20-30 words (unless specified in user prompt)",
            "20-30 words (unless specified in user prompt)",
        ],
        "name": "Hook: An interesting quest?"
    },
     "block3": {
        "texts": [
            "20-30 words (unless specified in user prompt)",
            "20-30 words (unless specified in user prompt)",
            "20-30 words (unless specified in user prompt)",
            "20-30 words (unless specified in user prompt)",
            "20-30 words (unless specified in user prompt)",
            "20-30 words (unless specified in user prompt)",
        ],
        "name": "Hook: An interesting quest?"
    },....and so on

}

🔥 QUALITY MANDATE:
Every word must serve retention. Every segment must advance the narrative. Every transition must compel the next click. Create content so engaging that viewers forget they're watching an educational video.`,
  });
  // Filter out undefined blocks to return only the blocks that were actually generated
  const filteredObject = Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined)
  ) as ScriptResponse;

  return filteredObject;
}

/**
 * Server function to edit script using Google Gemini
 */
export async function editScript(
  prompt: string,
  blocks: Block[]
): Promise<EditResponse> {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error("Missing Google API key. Set process.env.GOOGLE_API_KEY");
  }

  const google = createGoogleGenerativeAI({ apiKey });
  const model = google("gemini-2.5-flash");

  // Convert blocks to a readable format for the AI
  const blocksText = blocks
    .map(
      (block, index) => `Block ${index + 1} (ID: ${block.id}):\n${block.text}`
    )
    .join("\n\n");

  const { object } = await generateObject({
    model,
    schema: EditScriptSchema,
    prompt: `You are a world-class YouTube content strategist and scriptwriter. You need to edit an existing script based on the user's request.

EDITING REQUEST: "${prompt}"

CURRENT SCRIPT BLOCKS:
${blocksText}

🎯 EDITING GUIDELINES:
- Analyze the current blocks and the editing request
- Return operations to modify the script (create, update, or delete blocks)
- For CREATE operations: specify content and optionally idBefore (to insert before a specific block)
- For UPDATE operations: specify blockId and new content
- For DELETE operations: specify blockId to remove
- Maintain the same high-quality standards as the original script
- Each text segment should remain 20-30 words unless specified in user prompt
- Preserve the retention-focused, engaging tone
- Only modify what the user specifically requests

📝 QUALITY STANDARDS:
- Maintain psychological engagement techniques
- Keep cliffhanger language and curiosity gaps
- Ensure smooth narrative flow between segments
- Preserve the viral, retention-focused approach
- Don't use sophisticated wording - keep it YouTube-friendly

WORD PRECISION:
• Each block must : 200-300 words total (Hook: 150-200, Conclusion: 150-200) unless specified in the user prompt
• Individual text segments: 20-30 words each not more than that unless specified in the user prompt
• Total 10 segments each block unless specified in the user prompt
• Target: 1500-2000 words total for optimal 8-10 minute pacing unless specified in user prompt

NOTE: DON'T EVER CRITICISE ANYTHING RELATED TO ANY RELIGION OR ANY HISTORICAL HINDU FIGURE

🎬 OUTPUT REQUIREMENTS:
Return an array of operations:

[
  {
    "operation": "create",
    "createOperationValue": {
      "content": "New block content here...",
      "idBefore": "block2" // optional - insert before this block ID
    }
  },
  {
    "operation": "update", 
    "updateOperationValue": {
      "blockId": "block1",
      "content": "Updated content for block 1..."
    }
  },
  {
    "operation": "delete",
    "deleteOperationValue": {
      "blockId": "block3"
    }
  }
]

Make the requested changes while maintaining the script's viral potential and engagement factor.`,
  });

  return object.operations;
}

/**
 * Server function to fact-check script blocks using Google Gemini with URL Context (Batch Processing)
 */
export async function factCheckBlocksBatch(blocks?: Block[]) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey || !blocks) {
    throw new Error("Missing Google API key. Set process.env.GOOGLE_API_KEY");
  }

  const google = createGoogleGenerativeAI({ apiKey });
  const model = google("gemini-2.5-flash");
  const blocksText = blocks
    .map(
      (block, index) => `Block ${index + 1} (ID: ${block.id}):\n${block.text}`
    )
    .join("\n\n");

  const { text, sources, providerMetadata } = await generateText({
    model: model,
    tools: {
      google_search: google.tools.googleSearch({}),
    },
    prompt: `You are a world-class information checker and verifier. You need to check the facts of an existing script based on the user's request.

    CURRENT SCRIPT BLOCKS:
${blocksText}

🎯 CORRECTION GUIDELINES:
- Analyze the current blocks and the editing request
- Return the updations to be done on the mis-information or wrong facts.
- Maintain the same high-quality standards as the original script
- Preserve the retention-focused, engaging tone
- Only modify blocks that have mis-leading information or factually incorrect or any problematic block that could get creator in trouble.
- The severity of the issue can be categorized as low, medium, or high based on its potential impact on the audience.

📝 QUALITY STANDARDS:
- Maintain psychological engagement techniques
- Keep cliffhanger language and curiosity gaps
- Ensure smooth narrative flow between segments
- Preserve the viral, retention-focused approach
- Don't use sophisticated wording - keep it YouTube-friendly

NOTE: DON'T EVER CRITICISE ANYTHING RELATED TO ANY RELIGION OR ANY HISTORICAL HINDU FIGURE

🎬 OUTPUT REQUIREMENTS:
Return the response in following form : 

This is the response from ai ....
<script-fact-correction-response>
  <script-fact-correction>
    <block-id>block1</block-id>
    <justification>Updated content for block 1...</justification>
    <updated-content>New content for block 1...</updated-content>
    <severity>high</severity>
  </script-fact-correction>
</script-fact-correction-response>
some gibberish after that....
Make the requested changes while maintaining the script's viral potential and engagement factor.`,
  });

  // Parse the response to extract corrections
  const corrections = parseFactCheckResponse(text);

  return { corrections, sources, providerMetadata };
}
