// src/hooks/useAzureSpeech.ts
"use client";
import { useCallback } from 'react';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

const useAzureSpeech = () => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(
        process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY!,
        process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION!
    );

    const startListening = useCallback((onRecognized: (text: string) => void) => {
        const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
        const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

        recognizer.recognizing = (s, e) => {
            console.log(`RECOGNIZING: Text=${e.result.text}`);
        };

        recognizer.recognized = (s, e) => {
            if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
                onRecognized(e.result.text);
            } else if (e.result.reason === sdk.ResultReason.NoMatch) {
                console.log('NOMATCH: Speech could not be recognized.');
            }
        };

        recognizer.canceled = (s, e) => {
            console.log(`CANCELED: Reason=${e.reason}`);
            if (e.reason === sdk.CancellationReason.Error) {
                console.log(`CANCELED: ErrorCode=${e.errorCode}`);
                console.log(`CANCELED: ErrorDetails=${e.errorDetails}`);
            }
        };

        recognizer.sessionStarted = (s, e) => {
            console.log(`Session${s} started event${e}.`);
        };

        recognizer.sessionStopped = (s, e) => {
            console.log(`Session${s} stopped event${e}.`);
        };

        recognizer.startContinuousRecognitionAsync();

        return () => {
            recognizer.stopContinuousRecognitionAsync();
        };
    }, []);

    const stopListening = useCallback(() => {
        // Implement stop listening logic
    }, []);

    const synthesizeSpeech = useCallback(async (text: string): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
            synthesizer.speakTextAsync(
                text,
                (result) => {
                    if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                        resolve(new Blob([result.audioData], { type: 'audio/wav' }));
                    } else {
                        reject(new Error('Speech synthesis canceled'));
                    }
                    synthesizer.close();
                },
                (error) => {
                    reject(error);
                    synthesizer.close();
                }
            );
        });
    }, []);

    return { startListening, stopListening, synthesizeSpeech };
};

export default useAzureSpeech;