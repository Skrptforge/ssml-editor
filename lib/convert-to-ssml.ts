import { Block } from "./types";

/**
 * Converts a Block object to SSML (Speech Synthesis Markup Language) string
 * @param block - The block object to convert
 * @returns SSML string representation of the block
 */
export function blockToSSML(block: Block): string {
  let ssml = '';
  let content = block.text;

  // Handle phoneme markup (innermost layer)
  if (block.phoneme) {
    content = `<phoneme alphabet="${block.phoneme.alphabet}" ph="${block.phoneme.ph}">${content}</phoneme>`;
  }

  // Handle emphasis markup
  if (block.emphasis) {
    content = `<emphasis level="${block.emphasis.level}">${content}</emphasis>`;
  }

  // Handle prosody markup
  if (block.prosody) {
    const prosodyAttrs: string[] = [];
    
    if (block.prosody.rate) {
      prosodyAttrs.push(`rate="${block.prosody.rate}"`);
    }
    if (block.prosody.pitch) {
      prosodyAttrs.push(`pitch="${block.prosody.pitch}"`);
    }
    if (block.prosody.volume) {
      prosodyAttrs.push(`volume="${block.prosody.volume}"`);
    }

    if (prosodyAttrs.length > 0) {
      content = `<prosody ${prosodyAttrs.join(' ')}>${content}</prosody>`;
    }
  }

  // Add the content
  ssml += content;

  // Handle break (comes after the content)
  if (block.break) {
    ssml += `<break time="${block.break.time}s"/>`;
  }

  return ssml;
}

/**
 * Converts an array of Block objects to a complete SSML document
 * @param blocks - Array of blocks to convert
 * @param options - Optional configuration for the SSML document
 * @returns Complete SSML document string
 */
export function blocksToSSML(
  blocks: Block[], 
  options: {
    lang?: string;
    voice?: string;
    wrapInSpeak?: boolean;
  } = {}
): string {
  const { lang = 'en-US', voice, wrapInSpeak = true } = options;
  
  const blockSSMLs = blocks.map(block => blockToSSML(block));
  const content = blockSSMLs.join('');

  if (!wrapInSpeak) {
    return content;
  }

  const speakAttrs: string[] = [`version="1.0"`, `xmlns="http://www.w3.org/2001/10/synthesis"`];
  
  if (lang) {
    speakAttrs.push(`xml:lang="${lang}"`);
  }

  let ssml = `<speak ${speakAttrs.join(' ')}>`;
  
  if (voice) {
    ssml += `<voice name="${voice}">${content}</voice>`;
  } else {
    ssml += content;
  }
  
  ssml += '</speak>';
  
  return ssml;
}

/**
 * Escapes special XML characters in text content
 * @param text - Text to escape
 * @returns Escaped text safe for XML/SSML
 */
export function escapeSSMLText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
