import { Lecture, LectureSection } from '@/apollo/__generated__/graphql';
import { View, ScrollView } from 'react-native';
import { Message, MessageTypeEnum, MessageRoleEnum } from './conversation';
import { Text } from '@/components/ui/Text';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Fuse from 'fuse.js';

// Define type for transcript messages
type TranscriptMessage = {
  text: string;
};

export default function LectureContent({ lecture, messages }: { lecture: Lecture, messages: Message[] }) {
  const [transcriptMessages, setTranscriptMessages] = useState<TranscriptMessage[]>([]);
  const [currentHighlightedPhrase, setCurrentHighlightedPhrase] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const fuseRef = useRef<Fuse<string> | null>(null);

  // Memoize the cleaned current highlighted phrase to avoid recalculating it on every render
  const cleanedHighlightedPhrase = useMemo(() => {
    if (!currentHighlightedPhrase) return '';
    return currentHighlightedPhrase.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ').replace(/\s+/g, ' ').trim();
  }, [currentHighlightedPhrase]);

  // Memoize the transcript phrases to avoid recalculating them on every render
  const transcriptPhrases = useMemo(() => {
    return transcriptMessages.map(msg => msg.text);
  }, [transcriptMessages]);

  // Memoize the cleaned transcript phrases to avoid recalculating them on every render
  const cleanedTranscriptPhrases = useMemo(() => {
    return transcriptPhrases.map(phrase =>
      phrase.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ').replace(/\s+/g, ' ').trim()
    );
  }, [transcriptPhrases]);

  // Process messages to track transcript messages
  useEffect(() => {
    // Convert Message[] to TranscriptMessage[]
    const processedMessages: TranscriptMessage[] = messages
      .filter(msg =>
        msg.type === MessageTypeEnum.TRANSCRIPT &&
        msg.role === MessageRoleEnum.ASSISTANT
      )
      .map(msg => {
        // Type assertion to access transcript
        const transcriptMsg = msg as any;
        return {
          text: transcriptMsg.transcript
        };
      });

    setTranscriptMessages(processedMessages);

    // Update the current highlighted phrase with the latest message
    if (processedMessages.length > 0) {
      const latestMessage = processedMessages[processedMessages.length - 1];
      if (latestMessage.text) {
        setCurrentHighlightedPhrase(latestMessage.text);
      }
    }
  }, [messages]);

  // Optimized function to find the best match for a phrase in text
  const findBestMatch = useCallback((text: string, phrase: string): { match: string | null, score: number } => {
    if (!phrase || !text) {
      return { match: null, score: 1 };
    }

    // Simple direct substring match first - much faster than Fuse.js for exact matches
    const cleanText = text.toLowerCase();
    const cleanPhrase = phrase.toLowerCase();

    // Try direct substring match first (fastest)
    const directMatchIndex = cleanText.indexOf(cleanPhrase);
    if (directMatchIndex >= 0) {
      // Extract the original text segment that corresponds to the match
      const originalPhrase = text.substring(
        directMatchIndex,
        directMatchIndex + cleanPhrase.length
      );

      return {
        match: originalPhrase,
        score: 0
      };
    }

    // If no direct match, try with punctuation removed (still faster than Fuse.js)
    const cleanTextNoPunct = cleanText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ').replace(/\s+/g, ' ').trim();
    const cleanPhraseNoPunct = cleanPhrase.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ').replace(/\s+/g, ' ').trim();

    const noPunctMatchIndex = cleanTextNoPunct.indexOf(cleanPhraseNoPunct);
    if (noPunctMatchIndex >= 0) {
      // Find the corresponding position in the original text
      let originalIndex = 0;
      let cleanTextIndex = 0;

      // Find the position in the original text that corresponds to the match in the cleaned text
      while (cleanTextIndex < noPunctMatchIndex && originalIndex < text.length) {
        if (!/[.,\/#!$%\^&\*;:{}=\-_`~()]/.test(text[originalIndex])) {
          cleanTextIndex++;
        }
        originalIndex++;
      }

      // Find the length of the original phrase
      let originalLength = 0;
      let cleanPhraseIndex = 0;

      while (cleanPhraseIndex < cleanPhraseNoPunct.length && originalIndex + originalLength < text.length) {
        if (!/[.,\/#!$%\^&\*;:{}=\-_`~()]/.test(text[originalIndex + originalLength])) {
          cleanPhraseIndex++;
        }
        originalLength++;
      }

      // Extract the original phrase from the text
      const originalPhrase = text.substring(originalIndex, originalIndex + originalLength);

      return {
        match: originalPhrase,
        score: 0.1
      };
    }

    // Only use Fuse.js as a last resort for fuzzy matching
    // This is the most expensive operation, so we only do it if necessary
    const options = {
      includeScore: true,
      threshold: 0.5,
      minMatchCharLength: 2,
      findAllMatches: false,
      ignoreLocation: true,
      useExtendedSearch: true,
      isCaseSensitive: false,
    };

    // Create a new Fuse instance with the cleaned text as the searchable content
    const fuse = new Fuse([cleanTextNoPunct], options);

    // Search for the cleaned phrase in the cleaned text
    const results = fuse.search(cleanPhraseNoPunct);

    // If we found a match, return it
    if (results.length > 0) {
      // Find the original text that corresponds to the matched cleaned text
      const matchIndex = cleanTextNoPunct.indexOf(results[0].item);
      if (matchIndex >= 0) {
        // Find the corresponding position in the original text
        let originalIndex = 0;
        let cleanIndex = 0;

        // Find the position in the original text that corresponds to the match in the cleaned text
        while (cleanIndex < matchIndex && originalIndex < text.length) {
          if (!/[.,\/#!$%\^&\*;:{}=\-_`~()]/.test(text[originalIndex])) {
            cleanIndex++;
          }
          originalIndex++;
        }

        // Extract the original text segment
        const originalTextSegment = text.substring(
          Math.max(0, originalIndex - 5),
          Math.min(text.length, originalIndex + results[0].item.length + 5)
        );

        return {
          match: originalTextSegment,
          score: results[0].score || 1
        };
      }

      return {
        match: results[0].item,
        score: results[0].score || 1
      };
    }

    // If no match was found, return null
    return { match: null, score: 1 };
  }, []);

  // Optimized function to render text with appropriate styling
  const renderTextWithHighlighting = useCallback((text: string) => {
    // If there's no current highlighted phrase, just render the text normally
    if (!currentHighlightedPhrase) {
      return <Text className="text-lg">{text}</Text>;
    }

    // Try direct substring match first (fastest)
    const cleanText = text.toLowerCase();
    const cleanPhrase = currentHighlightedPhrase.toLowerCase();

    // Try direct substring match first
    if (cleanText.includes(cleanPhrase)) {
      const index = cleanText.indexOf(cleanPhrase);
      const originalPhrase = text.substring(index, index + cleanPhrase.length);

      // Split the text by the original phrase
      const parts = text.split(originalPhrase);

      return (
        <Text>
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              {index === 0 ? (
                <Text className="text-gray-400 text-lg">{part}</Text>
              ) : (
                <Text className="text-lg">{part}</Text>
              )}
              {index < parts.length - 1 && (
                <Text className="text-blue-500 text-lg">{originalPhrase}</Text>
              )}
            </React.Fragment>
          ))}
        </Text>
      );
    }

    // Try with punctuation removed
    const cleanTextNoPunct = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ').replace(/\s+/g, ' ').trim();

    if (cleanTextNoPunct.includes(cleanedHighlightedPhrase)) {
      // Find the position of the cleaned phrase in the cleaned text
      const cleanIndex = cleanTextNoPunct.indexOf(cleanedHighlightedPhrase);

      // Find the corresponding position in the original text
      let originalIndex = 0;
      let cleanTextIndex = 0;

      while (cleanTextIndex < cleanIndex && originalIndex < text.length) {
        if (!/[.,\/#!$%\^&\*;:{}=\-_`~()]/.test(text[originalIndex])) {
          cleanTextIndex++;
        }
        originalIndex++;
      }

      // Find the length of the original phrase
      let originalLength = 0;
      let cleanPhraseIndex = 0;

      while (cleanPhraseIndex < cleanedHighlightedPhrase.length && originalIndex + originalLength < text.length) {
        if (!/[.,\/#!$%\^&\*;:{}=\-_`~()]/.test(text[originalIndex + originalLength])) {
          cleanPhraseIndex++;
        }
        originalLength++;
      }

      // Extract the original phrase from the text
      const originalPhrase = text.substring(originalIndex, originalIndex + originalLength);

      // Split the text by the original phrase
      const parts = text.split(originalPhrase);

      return (
        <Text>
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              {index === 0 ? (
                <Text className="text-gray-400 text-lg">{part}</Text>
              ) : (
                <Text className="text-lg">{part}</Text>
              )}
              {index < parts.length - 1 && (
                <Text className="text-blue-500 text-lg">{originalPhrase}</Text>
              )}
            </React.Fragment>
          ))}
        </Text>
      );
    }

    // If no exact match, try fuzzy matching with Fuse.js
    const { match, score } = findBestMatch(text, currentHighlightedPhrase);

    // If we found a good match (score < 0.5 means good match)
    if (match && score < 0.5) {
      // Split the text by the matched phrase
      const parts = text.split(match);

      return (
        <Text>
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              {index === 0 ? (
                <Text className="text-gray-400 text-lg">{part}</Text>
              ) : (
                <Text className="text-lg">{part}</Text>
              )}
              {index < parts.length - 1 && (
                <Text className="text-blue-500 text-lg">{match}</Text>
              )}
            </React.Fragment>
          ))}
        </Text>
      );
    }

    // If the phrase is not in the text, check if any transcript messages are in the text
    // This is the most expensive part, so we only do it if necessary
    for (let i = 0; i < cleanedTranscriptPhrases.length; i++) {
      const cleanTranscriptPhrase = cleanedTranscriptPhrases[i];

      if (cleanTextNoPunct.includes(cleanTranscriptPhrase)) {
        // Find the position of the cleaned phrase in the cleaned text
        const cleanIndex = cleanTextNoPunct.indexOf(cleanTranscriptPhrase);

        // Find the corresponding position in the original text
        let originalIndex = 0;
        let cleanTextIndex = 0;

        while (cleanTextIndex < cleanIndex && originalIndex < text.length) {
          if (!/[.,\/#!$%\^&\*;:{}=\-_`~()]/.test(text[originalIndex])) {
            cleanTextIndex++;
          }
          originalIndex++;
        }

        // Find the length of the original phrase
        let originalLength = 0;
        let cleanPhraseIndex = 0;

        while (cleanPhraseIndex < cleanTranscriptPhrase.length && originalIndex + originalLength < text.length) {
          if (!/[.,\/#!$%\^&\*;:{}=\-_`~()]/.test(text[originalIndex + originalLength])) {
            cleanPhraseIndex++;
          }
          originalLength++;
        }

        // Extract the original phrase from the text
        const originalPhrase = text.substring(originalIndex, originalIndex + originalLength);

        // Split the text by the original phrase
        const parts = text.split(originalPhrase);

        return (
          <Text>
            {parts.map((part, index) => (
              <React.Fragment key={index}>
                {index === 0 ? (
                  <Text className="text-gray-400 text-lg">{part}</Text>
                ) : (
                  <Text className="text-lg">{part}</Text>
                )}
                {index < parts.length - 1 && (
                  <Text className="text-gray-400 text-lg">{originalPhrase}</Text>
                )}
              </React.Fragment>
            ))}
          </Text>
        );
      }
    }

    // If no matching phrase is found in the text, just render the text normally
    return <Text className="text-lg">{text}</Text>;
  }, [currentHighlightedPhrase, cleanedHighlightedPhrase, cleanedTranscriptPhrases, findBestMatch]);

  // Memoize the rendered lecture sections to avoid re-rendering them on every render
  const renderedSections = useMemo(() => {
    return lecture.sections.map((section: LectureSection) => {
      return (
        <View key={section.title}>
          <Text className='text-2xl mb-2'>{section.title}</Text>
          <View className='mb-4'>
            {renderTextWithHighlighting(section.content)}
          </View>
        </View>
      );
    });
  }, [lecture.sections, renderTextWithHighlighting]);

  return (
    <ScrollView
      ref={scrollViewRef}
      className="p-4"
      onContentSizeChange={() => {
        // Auto-scroll to the bottom when content changes
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }}
    >
      {/* Display the latest transcript message */}
      {transcriptMessages.length > 0 && (
        <Text>{(transcriptMessages[transcriptMessages.length - 1] as any)?.text}</Text>
      )}
      {renderedSections}
    </ScrollView>
  );
}