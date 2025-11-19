import { supabase } from '../config/supabase';

const BUCKET_NAME = 'trade-images';

/**
 * Upload an image file to Supabase storage
 * @param tradeId - The ID of the trade to associate the image with
 * @param file - The image file to upload
 * @returns The public URL of the uploaded image or null if upload fails
 */
export async function uploadTradeImage(
  tradeId: string,
  file: File
): Promise<string | null> {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Create a unique filename: tradeId/timestamp_originalname
    const timestamp = Date.now();
    const fileName = `${tradeId}/${timestamp}_${file.name}`;

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    // Get public URL of uploaded image
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Failed to upload trade image:', error);
    return null;
  }
}

/**
 * Delete an image from Supabase storage
 * @param imageUrl - The public URL or file path of the image to delete
 * @returns True if deletion was successful, false otherwise
 */
export async function deleteTradeImage(imageUrl: string): Promise<boolean> {
  try {
    // Extract the file path from the URL if it's a full URL
    let filePath = imageUrl;
    if (imageUrl.includes('/storage/v1/object/public/')) {
      filePath = imageUrl.split('/storage/v1/object/public/trade-images/')[1];
    }

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete trade image:', error);
    return false;
  }
}

/**
 * Get all images for a specific trade
 * @param tradeId - The ID of the trade
 * @returns Array of public URLs for all images associated with the trade
 */
export async function getTradeImages(tradeId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(tradeId);

    if (error) {
      console.error('Error fetching trade images:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Generate public URLs for all images
    const imageUrls = data
      .filter(file => !file.name.startsWith('.')) // Filter out hidden files
      .map(file => {
        const { data: publicUrlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(`${tradeId}/${file.name}`);
        return publicUrlData.publicUrl;
      });

    return imageUrls;
  } catch (error) {
    console.error('Failed to get trade images:', error);
    return [];
  }
}

/**
 * Update an image (delete old and upload new)
 * @param tradeId - The ID of the trade
 * @param oldImageUrl - The URL of the image to replace
 * @param newFile - The new image file
 * @returns The public URL of the new image or null if update fails
 */
export async function updateTradeImage(
  tradeId: string,
  oldImageUrl: string,
  newFile: File
): Promise<string | null> {
  try {
    // Delete old image
    await deleteTradeImage(oldImageUrl);

    // Upload new image
    const newImageUrl = await uploadTradeImage(tradeId, newFile);

    return newImageUrl;
  } catch (error) {
    console.error('Failed to update trade image:', error);
    return null;
  }
}
