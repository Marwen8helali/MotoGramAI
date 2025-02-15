import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export function useImageUpload() {
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImages([...images, result.assets[0].uri]);
      }
    } catch (err) {
      setError("Erreur lors de la sélection de l'image");
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const createFormData = (additionalData?: Record<string, any>) => {
    const formData = new FormData();

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    images.forEach((uri, index) => {
      const filename = uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename || "");
      const type = match ? `image/${match[1]}` : "image";

      formData.append("photos", {
        uri,
        name: filename,
        type,
      } as any);
    });

    return formData;
  };

  return {
    images,
    isUploading,
    error,
    pickImage,
    removeImage,
    createFormData,
  };
} 