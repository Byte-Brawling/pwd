// src/utils/audio.ts
export const audio = {
    createAudioContext: (): AudioContext => {
        return new (window.AudioContext || (window as any).webkitAudioContext)();
    },

    createAudioBufferFromBlob: async (blob: Blob): Promise<AudioBuffer> => {
        const arrayBuffer = await blob.arrayBuffer();
        const audioContext = audio.createAudioContext();
        return await audioContext.decodeAudioData(arrayBuffer);
    },

    playAudioBuffer: (audioBuffer: AudioBuffer): void => {
        const audioContext = audio.createAudioContext();
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
    },

    recordAudio: async (timeLimit: number = 5000): Promise<Blob> => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks: Blob[] = [];

        return new Promise((resolve, reject) => {
            mediaRecorder.addEventListener('dataavailable', (event) => {
                audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener('stop', () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                resolve(audioBlob);
            });

            mediaRecorder.start();

            setTimeout(() => {
                mediaRecorder.stop();
                stream.getTracks().forEach(track => track.stop());
            }, timeLimit);
        });
    },
};