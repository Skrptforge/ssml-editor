/**
 * Helper function to parse the fact-checking response and extract corrections
 */
export function parseFactCheckResponse(responseText: string) {
  try {
    // Extract the XML content from the response
    const xmlMatch = responseText.match(/<script-fact-correction-response>([\s\S]*?)<\/script-fact-correction-response>/);

    if (!xmlMatch) {
      console.warn('No XML correction response found in the text');
      return [];
    }

    const xmlContent = xmlMatch[1];

    // Extract individual corrections
    const correctionMatches = xmlContent.matchAll(/<script-fact-correction>([\s\S]*?)<\/script-fact-correction>/g);

    const corrections = [];

    for (const match of correctionMatches) {
      const correctionXml = match[1];

      // Extract individual fields
      const blockIdMatch = correctionXml.match(/<block-id>(.*?)<\/block-id>/);
      const justificationMatch = correctionXml.match(/<justification>(.*?)<\/justification>/);
      const updatedContentMatch = correctionXml.match(/<updated-content>(.*?)<\/updated-content>/);
      const severityMatch = correctionXml.match(/<severity>(.*?)<\/severity>/);

      if (blockIdMatch && justificationMatch && updatedContentMatch && severityMatch) {
        corrections.push({
          blockId: blockIdMatch[1].trim(),
          justification: justificationMatch[1].trim(),
          updatedContent: updatedContentMatch[1].trim(),
          severity: severityMatch[1].trim() as 'low' | 'medium' | 'high'
        });
      }
    }

    return corrections;
  } catch (error) {
    console.error('Error parsing fact check response:', error);
    return [];
  }
}

/**
 * Type definition for fact check corrections
 */
export type FactCheckCorrection = {
  blockId: string;
  justification: string;
  updatedContent: string;
  severity: 'low' | 'medium' | 'high';
};
