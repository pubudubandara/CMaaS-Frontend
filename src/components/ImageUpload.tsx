import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from '../lib/cloudinary';

interface ImageUploadProps {
  value?: string; // Current image URL
  onChange: (url: string) => void;
  onDelete?: () => void;
  folder?: string; // Cloudinary folder
  maxSizeMB?: number;
  acceptedFormats?: string[];
  disabled?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  onDelete,
  folder = 'cmaas',
  maxSizeMB = 5,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  disabled = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string>('');
  const [preview, setPreview] = useState<string>(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    // Validate file type
    if (!acceptedFormats.includes(file.type)) {
      setError(`Invalid file type. Accepted formats: ${acceptedFormats.join(', ')}`);
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setUploading(true);
    try {
      const response = await uploadToCloudinary(file, folder);
      onChange(response.secure_url);
      setPreview(response.secure_url);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      setPreview(value || '');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!value) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this image?');
    if (!confirmDelete) return;

    setDeleting(true);
    setError('');

    try {
      const publicId = extractPublicId(value);
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
      
      setPreview('');
      onChange('');
      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      setError('Failed to delete image. Please try again.');
      console.error('Delete error:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      {/* Preview Area */}
      {preview ? (
        <div className="relative group">
          <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover"
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center gap-3">
              <button
                onClick={handleUploadClick}
                disabled={disabled || uploading || deleting}
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Upload size={16} />
                Replace
              </button>
              <button
                onClick={handleDelete}
                disabled={disabled || uploading || deleting}
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <X size={16} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Image info */}
          <div className="text-xs text-gray-500 mt-1">
            {value && <span className="truncate block">{value}</span>}
          </div>
        </div>
      ) : (
        /* Upload Area */
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={disabled || uploading}
          className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary-light/10 transition-all duration-200 flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Loader2 size={48} className="animate-spin text-primary" />
              <span className="text-sm font-medium">Uploading...</span>
            </>
          ) : (
            <>
              <ImageIcon size={48} />
              <div className="text-center">
                <p className="text-sm font-medium">Click to upload image</p>
                <p className="text-xs text-gray-400 mt-1">
                  Max size: {maxSizeMB}MB • Formats: JPG, PNG, WebP, GIF
                </p>
              </div>
            </>
          )}
        </button>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
          <X size={16} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Helper text */}
      <p className="text-xs text-gray-400">
        Images are stored securely in Cloudinary
      </p>
    </div>
  );
}
