import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import Fuse from 'fuse.js';

const transcriptMessages = [
  // {
  //   text: "Hi. I",
  //   type: "partial"
  // },
  // {
  //   text: "Hi. I'm UAI Lecturer.",
  //   type: "partial"
  // },
  // {
  //   text: "Hi. I'm you AI lecturer for today. You",
  //   type: "partial"
  // },
  // {
  //   text: "Hi. I'm you AI lecturer for today.",
  //   type: "final"
  // },
  // {
  //   text: "You can interrupt me at",
  //   type: "partial"
  // },
  // {
  //   text: "You can interrupt me at any time and ask",
  //   type: "partial"
  // },
  // {
  //   text: "You can interrupt me at any time and ask related questions",
  //   type: "partial"
  // },
  // {
  //   text: "You can interrupt me at any time and ask related questions to our topic.",
  //   type: "final"
  // },
  // {
  //   text: "Let me know when you are",
  //   type: "partial"
  // },
  // {
  //   text: "Let me know when you are ready to start.",
  //   type: "final"
  // },
  {
    text: "Hello and welcome",
    type: "partial"
  },
  {
    text: "Hello, and welcome.",
    type: "final"
  },
  {
    text: "Today, we're",
    type: "partial"
  },
  {
    text: "Today, we're diving into 1 of the most",
    type: "partial"
  },
  {
    text: "Today, we're diving into 1 of the most exciting and",
    type: "partial"
  },
  {
    text: "Today, we're diving into 1 of the most exciting and transformative",
    type: "partial"
  },
  {
    text: "Today, we're diving into 1 of the most exciting and transformative technologies of our time,",
    type: "partial"
  },
  {
    text: "Today, we're diving into 1 of the most exciting and transformative technologies of our time,",
    type: "partial"
  },
  {
    text: "Today, we're diving into 1 of the most exciting and transformative technologies of our time, artificial intelligence",
    type: "partial"
  },
  {
    text: "Today, we're diving into 1 of the most exciting and transformative technologies of our time, artificial intelligence.",
    type: "partial"
  },
  {
    text: "Today, we're diving into 1 of the most exciting and transformative technologies of our time, artificial intelligence, or AI.",
    type: "final"
  },
  {
    text: "Whether you've heard",
    type: "partial"
  },
  {
    text: "Whether you've heard about ChatGPT,",
    type: "partial"
  },
  {
    text: "Whether you've heard about ChatGPT, self drive",
    type: "partial"
  },
  {
    text: "Whether you've heard about ChatGPT, self driving cars, or",
    type: "partial"
  },
  {
    text: "Whether you've heard about ChatGPT, self driving",
    type: "final"
  },
  {
    text: "cars, or Netflix",
    type: "partial"
  },
  {
    text: "cars, or Netflix recommendations,",
    type: "partial"
  },
  {
    text: "cars, or Netflix recommendations, AI is everywhere.",
    type: "partial"
  },
  {
    text: "cars, or Netflix recommendations, AI is everywhere.",
    type: "partial"
  },
  {
    text: "cars, or Netflix recommendations, AI is everywhere.",
    type: "final"
  },
  {
    text: "Shaping how we live",
    type: "partial"
  },
  {
    text: "Shaping how we live, work, and think.",
    type: "partial"
  },
  {
    text: "Shaping how we live, work, and think.",
    type: "final"
  },
  {
    text: "At its core,",
    type: "partial"
  },
  {
    text: "At its core,",
    type: "final"
  },
  {
    text: "artificial",
    type: "partial"
  },
  {
    text: "artificial intelligence,",
    type: "partial"
  },
  {
    text: "artificial intelligence refers to the ability",
    type: "partial"
  },
  {
    text: "artificial intelligence refers to the ability of machines to",
    type: "partial"
  },
  {
    text: "artificial intelligence refers to the ability of machines to perform tasks",
    type: "partial"
  },
  {
    text: "artificial intelligence refers to the ability of machines to perform tasks",
    type: "final"
  },
  {
    text: "that normally",
    type: "partial"
  },
  {
    text: "that normally require human intelligence.",
    type: "partial"
  },
  {
    text: "that normally require human intelligence.",
    type: "partial"
  },
  {
    text: "that normally require human intelligence",
    type: "partial"
  },
  {
    text: "that normally require human intelligence. This includes",
    type: "partial"
  },
  {
    text: "that normally require human intelligence. This includes understanding",
    type: "partial"
  },
  {
    text: "that normally require human intelligence This includes understanding language,",
    type: "final"
  },
  {
    text: "recognizing",
    type: "partial"
  },
  {
    text: "recognizing images,",
    type: "partial"
  },
  {
    text: "recognizing images, solving problems,",
    type: "partial"
  },
  {
    text: "recognizing images, solving problems,",
    type: "partial"
  },
  {
    text: "recognizing images, solving problems, and even learning from",
    type: "partial"
  },
  {
    text: "recognising images, solving problems, and even learning from experience.",
    type: "final"
  }
];

const lectureText = `**[Intro - 30 seconds]**

Hello and welcome!  
Today, we're diving into one of the most exciting and transformative technologies of our time — **Artificial Intelligence**, or AI. Whether you've heard about ChatGPT, self-driving cars, or Netflix recommendations, AI is everywhere — shaping how we live, work, and think.

---

**[1. What is AI? - 1 min]**

At its core, **Artificial Intelligence** refers to the ability of machines to perform tasks that normally require human intelligence. This includes understanding language, recognizing images, solving problems, and even learning from experience.

We often break AI down into three categories:
- **Narrow AI**, which is designed for specific tasks, like facial recognition.
- **General AI**, which would be capable of understanding or learning anything a human can.
- And **Superintelligent AI**, a hypothetical future where machines surpass human intelligence across the board.

---

**[2. A Brief History - 2 mins]**

AI isn't as new as it seems. The concept dates back to ancient myths — think of mechanical servants or talking statues. But the modern field began in the 1950s.

- In **1956**, at Dartmouth College, a group of scientists gathered and coined the term *Artificial Intelligence*.  
- In the **1970s and 80s**, AI faced "winters" — periods of disappointment due to limited computing power.  
- But by the **2010s**, thanks to Big Data, more powerful GPUs, and new algorithms, AI experienced a massive leap forward. That's when we saw breakthroughs in image recognition, natural language processing, and robotics.

---

**[3. How AI Works - 3 mins]**

So, how does AI actually work?

At the heart of modern AI is **Machine Learning** — where we train a system on data so it can learn patterns and make predictions.

Imagine teaching a machine to recognize cats in pictures. You give it thousands of labeled images — some with cats, some without — and it starts to learn what makes a cat a cat. This is **supervised learning**.

Other types include:
- **Unsupervised learning** — where the AI finds patterns without labels.
- **Reinforcement learning** — where an AI learns through trial and error, like training a robot to walk or teaching an AI to win at chess.

One of the most powerful techniques today is **Deep Learning**, which uses artificial neural networks — inspired by the human brain — to handle complex tasks like voice recognition and even creating music or art.

---

**[4. Real-World Applications - 3 mins]**

AI is not just a research topic — it's in your pocket, your home, your car, and your workplace.

- **Smartphones** use AI for voice assistants like Siri and Google Assistant.
- **Healthcare** uses AI to detect diseases in X-rays or personalize treatments.
- **Finance** uses it for fraud detection and algorithmic trading.
- **Self-driving cars** rely on AI to make split-second driving decisions.
- **Creative tools** use AI to help generate text, images, videos, and even code.

Even the recommendations you see on YouTube or Spotify are powered by AI models predicting what you might like next.

---

**[5. Ethical Questions - 3 mins]**

But with great power comes big questions.

AI raises many ethical concerns:
- **Bias and fairness**: If AI is trained on biased data, it can make unfair decisions — in hiring, policing, lending.
- **Job displacement**: Some jobs may be automated away. How do we prepare for that?
- **Privacy**: AI can analyze huge amounts of personal data. Who controls it? How is it used?
- **Autonomy and control**: What happens when AI systems become too complex for even their creators to fully understand?

There's also concern about **AI alignment** — making sure that AI systems actually do what humans *want*, especially as they become more powerful.

---

**[6. The Future of AI - 2 mins]**

Looking ahead, AI will likely play a role in:
- **Personalized education** — learning tailored to each student.
- **Climate modeling** — helping to predict and mitigate environmental risks.
- **Scientific discovery** — like helping researchers find new materials or drugs.
- And maybe even **general AI** — systems that reason and learn like humans.

But the key will be developing AI **responsibly** — with transparency, regulation, and human values at the center.

---

**[Conclusion - 30 seconds]**

So that's a quick tour of Artificial Intelligence — where it came from, how it works, what it can do, and where it's heading.

AI is not just a tech topic. It's a human topic. Its future depends on how *we*, as a society, choose to use it.

Thanks for listening — and I hope this gave you a solid starting point to explore AI even further!`

// Define types for transcript messages
type TranscriptMessage = {
  text: string;
  type: 'partial' | 'final';
};

// Type assertion for transcriptMessages
const typedTranscriptMessages: TranscriptMessage[] = transcriptMessages as TranscriptMessage[];

// Props for LectureDisplay component
type LectureDisplayProps = {
  transcriptMessages: TranscriptMessage[];
  debugMode?: boolean;
};

// Component to display lecture text with highlighting
const LectureDisplay: React.FC<LectureDisplayProps> = ({ transcriptMessages, debugMode = false }) => {
  // console.log('transcriptMessages', transcriptMessages)
  const [finalMessages, setFinalMessages] = useState<TranscriptMessage[]>([]);
  const [partialMessage, setPartialMessage] = useState<TranscriptMessage | null>(null);
  const [currentHighlightedPhrase, setCurrentHighlightedPhrase] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const fuseRef = useRef<Fuse<string> | null>(null);

  // Process transcript messages to track current partial and final messages
  useEffect(() => {
    // Find the last partial message (currently being pronounced)
    const lastPartialIndex = transcriptMessages.reduce((lastIndex, message, index) => {
      if (message.type === 'partial') {
        return index;
      }
      return lastIndex;
    }, -1);

    // Get all final messages (already pronounced)
    const finalMsgs = transcriptMessages.filter(msg => msg.type === 'final');
    setFinalMessages(finalMsgs);

    // Get the current partial message if it exists
    if (lastPartialIndex >= 0) {
      const currentPartial = transcriptMessages[lastPartialIndex];
      setPartialMessage(currentPartial);
      
      // Update the current highlighted phrase when a new partial message is found
      if (currentPartial.text) {
        setCurrentHighlightedPhrase(currentPartial.text);
      }
    } else {
      setPartialMessage(null);
      // Don't reset the current highlighted phrase here to preserve it
    }
  }, [transcriptMessages]);

  // Function to find the best match for a phrase in text using Fuse.js
  const findBestMatch = (text: string, phrase: string): { match: string | null, score: number } => {
    if (!phrase || !text) {
      return { match: null, score: 1 };
    }

    // If we don't have a Fuse instance yet, create one
    if (!fuseRef.current) {
      // Configure Fuse.js with appropriate options
      const options = {
        includeScore: true,
        threshold: 0.3, // Lower threshold means more strict matching
        minMatchCharLength: 3, // Minimum characters that must match
        findAllMatches: false, // Only return the best match
      };
      
      // Create a new Fuse instance with the text as the searchable content
      fuseRef.current = new Fuse([text], options);
    }

    // Search for the phrase in the text
    const results = fuseRef.current.search(phrase);
    
    // If we found a match, return it
    if (results.length > 0) {
      return { 
        match: results[0].item, 
        score: results[0].score || 1 
      };
    }
    
    // If no match was found, return null
    return { match: null, score: 1 };
  };

  // Function to render text with appropriate styling
  const renderTextWithHighlighting = (text: string) => {
    // If there's no current highlighted phrase, just render the text normally
    if (!currentHighlightedPhrase) {
      return <Text>{text}</Text>;
    }
    
    // First try exact match with current highlighted phrase
    if (text.includes(currentHighlightedPhrase)) {
      // If the phrase is in the text, highlight it
      const parts = text.split(currentHighlightedPhrase);
      
      return (
        <Text>
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              {index === 0 ? (
                <Text className="text-gray-400">{part}</Text>
              ) : (
                <Text>{part}</Text>
              )}
              {index < parts.length - 1 && (
                <Text className="text-blue-500 font-bold">{currentHighlightedPhrase}</Text>
              )}
            </React.Fragment>
          ))}
        </Text>
      );
    }
    
    // If no exact match, try fuzzy matching with Fuse.js
    const { match, score } = findBestMatch(text, currentHighlightedPhrase);
    
    // If we found a good match (score < 0.3 means good match)
    if (match && score < 0.3) {
      // Split the text by the matched phrase
      const parts = text.split(match);
      
      return (
        <Text>
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              {index === 0 ? (
                <Text className="text-gray-400">{part}</Text>
              ) : (
                <Text>{part}</Text>
              )}
              {index < parts.length - 1 && (
                <Text className="text-blue-500 font-bold">{match}</Text>
              )}
            </React.Fragment>
          ))}
        </Text>
      );
    }
    
    // If the phrase is not in the text, check if any final messages are in the text
    const finalPhrases = finalMessages.map(msg => msg.text);
    
    for (const phrase of finalPhrases) {
      if (text.includes(phrase)) {
        // If a final phrase is in the text, highlight it
        const parts = text.split(phrase);
        
        return (
          <Text>
            {parts.map((part, index) => (
              <React.Fragment key={index}>
                {index === 0 ? (
                  <Text className="text-gray-400">{part}</Text>
                ) : (
                  <Text>{part}</Text>
                )}
                {index < parts.length - 1 && (
                  <Text className="text-gray-400">{phrase}</Text>
                )}
              </React.Fragment>
            ))}
          </Text>
        );
      }
    }
    
    // If no matching phrase is found in the text, just render the text normally
    // but add a debug indicator to show the last highlighted phrase
    return (
      <Text>
        {text}
        {debugMode && currentHighlightedPhrase && (
          <Text className="text-xs text-gray-400"> (Last highlight: "{currentHighlightedPhrase}")</Text>
        )}
      </Text>
    );
  };

  // Split lecture text into paragraphs
  const paragraphs = lectureText.split('\n\n');

  return (
    <View className="flex-1">
      {/* Current message indicator */}
      {partialMessage && (
        <View className="bg-blue-100 p-3 mb-2 rounded-lg">
          <Text className="text-blue-800 font-medium">Currently speaking:</Text>
          <Text className="text-blue-600">{partialMessage.text}</Text>
        </View>
      )}
      
      {/* Debug information */}
      {debugMode && (
        <View className="bg-gray-100 p-2 mb-2 rounded-lg">
          <Text className="text-gray-800">Debug Info:</Text>
          <Text className="text-gray-600">Partial Messages: {transcriptMessages.filter(m => m.type === 'partial').length}</Text>
          <Text className="text-gray-600">Final Messages: {finalMessages.length}</Text>
          <Text className="text-gray-600">Current Partial: {partialMessage?.text || 'None'}</Text>
        </View>
      )}
      
      <ScrollView 
        ref={scrollViewRef}
        className="p-4"
        onContentSizeChange={() => {
          // Auto-scroll to the bottom when content changes
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }}
      >
        {paragraphs.map((paragraph, index) => (
          <View key={index} className="mb-4">
            {renderTextWithHighlighting(paragraph)}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// Demo component to simulate speech progression
const LectureDemo: React.FC = () => {
  const [activeMessages, setActiveMessages] = useState<TranscriptMessage[]>([]);
  const [displayIndex, setDisplayIndex] = useState<number>(0);
  const currentIndexRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(500); // ms between messages
  const [debugMode, setDebugMode] = useState<boolean>(false);

  // Function to add the next message
  const addNextMessage = () => {
    console.log('Adding message at index:', currentIndexRef.current);
    
    if (currentIndexRef.current < typedTranscriptMessages.length) {
      // Add the current message to activeMessages
      setActiveMessages(prev => [...prev, typedTranscriptMessages[currentIndexRef.current]]);
      
      // Increment the currentIndex
      currentIndexRef.current += 1;
      setDisplayIndex(currentIndexRef.current);
    } else {
      // Reset when we reach the end
      setActiveMessages([]);
      currentIndexRef.current = 0;
      setDisplayIndex(0);
    }
  };

  // Function to go to the previous message
  const goToPreviousMessage = () => {
    if (currentIndexRef.current > 0) {
      // Stop playback if it's running
      if (isPlaying) {
        togglePlayback();
      }
      
      // Remove the last message
      setActiveMessages(prev => prev.slice(0, -1));
      
      // Decrement the currentIndex
      currentIndexRef.current -= 1;
      setDisplayIndex(currentIndexRef.current);
    }
  };

  // Function to go to the next message
  const goToNextMessage = () => {
    if (currentIndexRef.current < typedTranscriptMessages.length) {
      // Stop playback if it's running
      if (isPlaying) {
        togglePlayback();
      }
      
      // Add the next message
      addNextMessage();
    }
  };

  // Start or stop the simulation
  const togglePlayback = () => {
    if (isPlaying) {
      // Stop playback
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPlaying(false);
    } else {
      // Start playback
      intervalRef.current = setInterval(() => {
        addNextMessage();
      }, playbackSpeed);
      setIsPlaying(true);
    }
  };

  // Change playback speed
  const changeSpeed = () => {
    // Cycle through speeds: 500ms -> 300ms -> 200ms -> 500ms
    const newSpeed = playbackSpeed === 500 ? 300 : (playbackSpeed === 300 ? 200 : 500);
    setPlaybackSpeed(newSpeed);
    
    // Restart interval with new speed if playing
    if (isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        addNextMessage();
      }, newSpeed);
    }
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Debug effect to log changes to activeMessages
  useEffect(() => {
    if (debugMode) {
      console.log('Active messages updated:', activeMessages.length);
      console.log('Last message:', activeMessages[activeMessages.length - 1]?.text);
    }
  }, [activeMessages, debugMode]);

  // Calculate progress percentage
  const progressPercentage = (displayIndex / typedTranscriptMessages.length) * 100;

  return (
    <View className="flex-1">
      <View className="p-4 bg-gray-100">
        <View className="flex-row justify-between items-center mb-2">
          <Button 
            title="Prev" 
            onPress={goToPreviousMessage}
            disabled={currentIndexRef.current === 0}
          />
          <Button 
            title={isPlaying ? "Pause" : "Play"} 
            onPress={togglePlayback} 
          />
          <Button 
            title="Next" 
            onPress={goToNextMessage}
            disabled={currentIndexRef.current >= typedTranscriptMessages.length}
          />
        </View>
        
        <View className="flex-row justify-between items-center mb-2">
          <Button 
            title={`Speed: ${playbackSpeed}ms`} 
            onPress={changeSpeed} 
          />
          <Button 
            title={debugMode ? "Hide Debug" : "Show Debug"} 
            onPress={() => setDebugMode(!debugMode)} 
          />
        </View>
        
        <View className="h-2 bg-gray-200 rounded-full mb-2">
          <View 
            className="h-2 bg-blue-500 rounded-full" 
            style={{ width: `${progressPercentage}%` }} 
          />
        </View>
        
        <Text className="text-center text-gray-600">
          {isPlaying ? "Speech in progress..." : "Press Play to start"}
        </Text>
        
        <Text className="text-center text-gray-500 mt-1">
          {displayIndex} / {typedTranscriptMessages.length} messages
        </Text>
      </View>
      
      <LectureDisplay 
        transcriptMessages={activeMessages} 
        debugMode={debugMode}
      />
    </View>
  );
};

export default LectureDemo;