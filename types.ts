
export interface ImageData {
  base64: string;
  mimeType: string;
}

export interface EditedImageResult {
  imageUrl?: string;
  mimeType?: string;
  text?: string;
}