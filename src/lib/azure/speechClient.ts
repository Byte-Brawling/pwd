// src/lib/azure/speechClient.ts
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.AZURE_SPEECH_KEY!,
    process.env.AZURE_SPEECH_REGION!
);

export const speechClient = new sdk.SpeechRecognizer(speechConfig);