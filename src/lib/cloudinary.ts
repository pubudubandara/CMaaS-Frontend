// Cloudinary configuration and utilities
export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
};

export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
}

/**
 * Upload an image to Cloudinary
 * @param file - The image file to upload
 * @param folder - Optional folder path in Cloudinary
 * @returns Promise with the upload response
 */
export const uploadToCloudinary = async (
  file: File,
  folder?: string
): Promise<CloudinaryUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  
  if (folder) {
    formData.append('folder', folder);
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Delete an image from Cloudinary
 * @param publicId - The public ID of the image to delete
 * @returns Promise with the deletion result
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    // Generate timestamp
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // For client-side deletion, we need to use the unsigned upload preset
    // Or implement a backend endpoint for secure deletion
    // For now, we'll use the destroy endpoint with upload preset
    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', cloudinaryConfig.apiKey);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/destroy`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Cloudinary delete error:', error);
      throw new Error('Failed to delete image from Cloudinary');
    }

    const data = await response.json();
    
    if (data.result !== 'ok') {
      throw new Error('Failed to delete image from Cloudinary');
    }
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    throw error;
  }
};

/**
 * Get optimized image URL with transformations
 * @param publicId - The public ID of the image
 * @param transformations - Cloudinary transformation options
 * @returns Optimized image URL
 */
export const getOptimizedImageUrl = (
  publicId: string,
  transformations?: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'crop';
    quality?: 'auto' | number;
    format?: 'auto' | 'jpg' | 'png' | 'webp';
  }
): string => {
  const baseUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload`;
  
  if (!transformations) {
    return `${baseUrl}/${publicId}`;
  }

  const transforms: string[] = [];
  
  if (transformations.width) transforms.push(`w_${transformations.width}`);
  if (transformations.height) transforms.push(`h_${transformations.height}`);
  if (transformations.crop) transforms.push(`c_${transformations.crop}`);
  if (transformations.quality) transforms.push(`q_${transformations.quality}`);
  if (transformations.format) transforms.push(`f_${transformations.format}`);
  
  const transformString = transforms.join(',');
  return `${baseUrl}/${transformString}/${publicId}`;
};

/**
 * Extract public ID from Cloudinary URL
 * @param url - The Cloudinary image URL
 * @returns The public ID
 */
export const extractPublicId = (url: string): string => {
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return '';
    
    const pathParts = parts[1].split('/');
    // Remove version if present (v1234567890)
    const filteredParts = pathParts.filter(part => !part.startsWith('v'));
    
    // Remove file extension
    const lastPart = filteredParts[filteredParts.length - 1];
    const publicIdWithoutExt = lastPart.replace(/\.[^/.]+$/, '');
    
    filteredParts[filteredParts.length - 1] = publicIdWithoutExt;
    
    return filteredParts.join('/');
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return '';
  }
};
