"use server";

import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import type {
  CreateInitialScriptResponse,
  EditScriptResponse,
} from "@/lib/types/script-response";

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
  updates: z.array(
    z.object({
      blockId: z.string(),
      content: z.string(),
    })
  ),
});

/**
 * Server function to create initial script using Google Gemini
 */
export async function createInitialScript(
  prompt: string
): Promise<CreateInitialScriptResponse> {
  const apiKey = process.env.GOOGLE_API_KEY;
  console.log("working till here - 1");

  if (!apiKey) {
    throw new Error("Missing Google API key. Set process.env.GOOGLE_API_KEY");
  }

  console.log("working till here 2");
  const google = createGoogleGenerativeAI({ apiKey });
  const model = google("models/gemini-2.5-flash-lite");

  const { object } = await generateObject({
    model,
    schema: CreateInitialScriptSchema,
    prompt: `You are a world-class YouTube content strategist and scriptwriter. Your expertise lies in creating viral, retention-focused content that keeps viewers glued to their screens. Create a masterful script for: "${prompt}"

🎯 STRATEGIC FRAMEWORK:
Create 2-8 strategically structured segments that build momentum and maximize watch time. Each segment must have both compelling content AND a descriptive name.

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
• Each block must : 200-300 words total (Hook: 150-200, Conclusion: 150-200)
• Individual text segments: 25-30 words each not more than that
• Total 4 segments each block
• Target: 1500-2000 words total for optimal 8-10 minute pacing

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
• Use sensory details to make abstract concepts vivid

🎬 OUTPUT REQUIREMENTS:
Return blocks with both content and strategic naming:

{
    "block1": {
        "texts": [
            "What if I told you that one of the most famous psychological theories ever conceived might be completely wrong? We're talking about the Oedipus complex, the idea that young boys harbor unconscious desires for their mothers and see their fathers as rivals. It sounds scandalous, right? But hold on, because the truth behind this Freudian concept is far more complex and, frankly, a lot less dramatic than you've been led to believe. Get ready, because we're about to unravel a century-old mystery, and the answer might just shatter everything you thought you knew about childhood development.",
            "This isn't just ancient history; it's about understanding the very foundations of human psychology. Is this universal truth or a convenient, albeit shocking, fiction? We’re diving deep into the mind, questioning one of Freud’s most controversial claims. Stick around, because by the end of this video, you'll see childhood, family dynamics, and even yourself in a completely new light. The real story behind the Oedipus complex is waiting."
        ],
        "name": "Hook: The Freudian Fiction?"
    },
    "block2": {
        "texts": [
            "So, what exactly is this Oedipus complex? Sigmund Freud, the father of psychoanalysis, proposed it as a central stage in psychosexual development. He believed around the ages of 3 to 6, boys develop an unconscious sexual desire for their mother and feel intense jealousy and rivalry towards their father, whom they perceive as an obstacle. To resolve this anxiety, Freud argued, boys eventually identify with their father, internalizing his traits and adopting the male gender role.",
            "This entire drama, Freud posited, was rooted in an ancient Greek myth about King Oedipus, who unknowingly killed his father and married his mother. The theory suggests this primal conflict is an inherent part of growing up, a universal experience shaping our personalities and relationships. But here's the kicker: was Freud observing a fundamental human truth, or was he projecting his own theories onto a limited sample size, creating a narrative that simply sounded compelling?"
        ],
        "name": "Setup: Freud's Shocking Theory Explained"
    },
    "block5": {
        "texts": [
            "Consider the evidence from modern psychology and neuroscience. While Freud's specific narrative of sexual desire and rivalry is largely unsubstantiated in its literal interpretation, the underlying themes of attachment, separation, and forming one's identity within the family unit are undeniably powerful. We see strong emotional bonds form between children and primary caregivers, and yes, sometimes this involves navigating complex feelings towards parental figures and other significant adults.",
            "Neuroscience highlights the critical role of early attachment in brain development, influencing how we form relationships throughout life. The intense emotions and attachments children feel are real, but they manifest in diverse ways, shaped by culture, individual temperament, and specific family environments, not solely by an innate, Oedipal drive. The real impact lies in understanding the *patterns* of attachment, not enforcing a rigid, outdated script."
        ],
        "name": "Evidence: Modern Perspectives & Attachment"
    },
    "block6": {
        "texts": [
            "But what if there's a different way to look at it? Some argue that Freud’s core idea wasn't about literal incestuous desire, but a metaphorical representation of the child's struggle for independence and identity. The 'rivalry' might symbolize the necessary push-pull as a child moves from dependency on parents to establishing their own self. The 'desire' for the mother could represent the primal bond, the security a child seeks, and the eventual identification with the father figure is about adopting societal roles and expectations.",
            "This interpretation shifts the focus from a potentially problematic sexual undertone to a more universal developmental task. It acknowledges the profound impact parents have on a child's socialization and identity formation, without insisting on a universally prescribed, sexually charged drama. It suggests Freud might have been describing a real psychological process, but cloaked it in language that was both sensational and, perhaps, culturally myopic."
        ],
        "name": "Twist: The Metaphorical Interpretation"
    },
    "block7": {
        "texts": [
            "The implications of this re-evaluation are huge. If the Oedipus complex isn't a universal biological truth, it frees us from a potentially damaging and overly rigid framework for understanding child development and mental health. It encourages a more nuanced, culturally sensitive approach, recognizing that families and identity formation vary enormously across the globe.",
            "This means we can move beyond pathologizing normal variations in childhood experiences. Instead of asking if a child has 'successfully' navigated the Oedipus complex, we can focus on fostering secure attachments, supporting healthy emotional development, and understanding the unique family dynamics at play. It’s about celebrating diversity in human experience, not forcing it into a Freudian mold. This shift has profound impacts on parenting, education, and therapy."
        ],
        "name": "Impact: Reconsidering Development & Identity"
    },
    "block8": {
        "texts": [
            "So, is the Oedipus complex truth or lie? The overwhelming consensus among modern psychologists and anthropologists is that Freud's theory, as a universal, biologically driven stage involving literal desires, is largely a myth – a product of its time and cultural context. However, the *themes* Freud touched upon – the intense bonds within families, the process of forming an identity, navigating relationships with parental figures, and striving for independence – are absolutely real and critically important.",
            "Freud's genius was in highlighting these crucial developmental processes, even if his specific explanation was flawed. Understanding this distinction allows us to appreciate the enduring questions about human nature without being bound by outdated, overly prescriptive theories. What are your thoughts on this? Did Freud get it fundamentally wrong, or is there a kernel of truth we're still uncovering? Let us know in the comments below, and don't forget to like and subscribe for more deep dives into the mysteries of the mind!"
        ],
        "name": "Conclusion: Myth vs. Meaning"
    }
}

🔥 QUALITY MANDATE:
Every word must serve retention. Every segment must advance the narrative. Every transition must compel the next click. Create content so engaging that viewers forget they're watching an educational video.`,
  });

  // Filter out undefined blocks to return only the blocks that were actually generated
  const filteredObject = Object.fromEntries(
    Object.entries(object).filter(([_, value]) => value !== undefined)
  ) as CreateInitialScriptResponse;

  return filteredObject;
}

/**
 * Server function to edit script using Google Gemini
 */
export async function editScript(prompt: string): Promise<EditScriptResponse> {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error("Missing Google API key. Set process.env.GOOGLE_API_KEY");
  }

  const google = createGoogleGenerativeAI({ apiKey });
  const model = google("gemini-2.5-flash-lite");

  const { object } = await generateObject({
    model,
    schema: EditScriptSchema,
    prompt: `Generate an edit script response based on this prompt: ${prompt}

Analyze the requested changes and return an array of updates. Each update should specify:
- blockId: The ID of the block to update (e.g., "block1", "block2")
- content: The new text content for that block

Example format:
{
  "updates": [
    {
      "blockId": "block1",
      "content": "Updated text for block 1"
    },
    {
      "blockId": "block3", 
      "content": "Updated text for block 3"
    }
  ]
}`,
  });

  // Convert the array format back to the expected object format
  const editResponse: EditScriptResponse = {};
  object.updates.forEach((update) => {
    editResponse[update.blockId] = update.content;
  });

  return editResponse;
}
