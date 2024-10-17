// src/utils/imageProcessing.ts
export const imageProcessing = {
    resizeImage: async (file: File, maxWidth: number, maxHeight: number): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx!.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Canvas to Blob conversion failed'));
                    }
                }, file.type);
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    },

    convertToGrayscale: (imageData: ImageData): ImageData => {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;
            data[i + 1] = avg;
            data[i + 2] = avg;
        }
        return imageData;
    },

    applyThreshold: (imageData: ImageData, threshold: number): ImageData => {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            const value = avg > threshold ? 255 : 0;
            data[i] = value;
            data[i + 1] = value;
            data[i + 2] = value;
        }
        return imageData;
    },
};