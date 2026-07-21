export interface ApkApp {
  id: string;
  name: string;
  packageName: string;
  version: string;
  size: string; // e.g. "45.2 MB"
  sizeBytes?: number;
  icon: string; // Base64 or image URL or Lucide icon name placeholder
  category: ApkCategory;
  description: string;
  developer: string;
  rating: number; // e.g. 4.8
  downloads: number;
  uploadedAt: string;
  isFeatured?: boolean;
  minAndroidVersion?: string; // e.g. "Android 8.0+"
  changelog?: string;
  screenshots?: string[];
  apkFileId?: string; // Reference for IndexedDB binary storage if uploaded
  directDownloadUrl?: string; // Optional direct download URL or fallback
}

export type ApkCategory = 
  | 'All'
  | 'Games'
  | 'Cyber Tools'
  | 'Utilities'
  | 'Media & Video'
  | 'Emulators'
  | 'Productivity'
  | 'Custom Mods';

export interface UserSession {
  email: string;
  name: string;
  avatar: string;
  isAdmin: boolean;
  loggedInAt: string;
}

export interface UploadFormData {
  name: string;
  packageName: string;
  version: string;
  category?: ApkCategory;
  developer: string;
  description: string;
  minAndroidVersion: string;
  changelog: string;
  icon: string; // Base64 or URL
  screenshots?: string[]; // Array of base64/URLs (up to 10)
  isFeatured: boolean;
  apkFile: File | null;
}
