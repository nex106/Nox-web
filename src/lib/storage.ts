import { ApkApp, UserSession } from '../types';
import { DEFAULT_APK_APPS } from '../data/defaultApps';

const STORAGE_KEY_APPS = 'nox_apk_apps_v1';
const STORAGE_KEY_USER = 'nox_user_session_v1';
const DB_NAME = 'NoxApkStoreDB';
const DB_VERSION = 1;
const STORE_NAME = 'apk_files';

export const ADMIN_EMAIL = 'obyda.cmch@gmail.com';

// Init IndexedDB for binary storage of APK files
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

// Store raw APK binary file in IndexedDB
export async function saveApkFileBlob(fileId: string, file: Blob): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(file, fileId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB write error:', err);
  }
}

// Get raw APK binary file from IndexedDB
export async function getApkFileBlob(fileId: string): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(fileId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB read error:', err);
    return null;
  }
}

// Delete APK file from IndexedDB
export async function deleteApkFileBlob(fileId: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(fileId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB delete error:', err);
  }
}

// Get all Apps
export function getStoredApps(): ApkApp[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_APPS);
    if (!data) {
      // First time - populate with default apps
      localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(DEFAULT_APK_APPS));
      return DEFAULT_APK_APPS;
    }
    const parsed = JSON.parse(data) as ApkApp[];
    return parsed;
  } catch (err) {
    console.error('Failed to load apps from localStorage', err);
    return DEFAULT_APK_APPS;
  }
}

// Save a new or updated app
export async function saveApp(app: ApkApp, apkFile?: File | null): Promise<ApkApp[]> {
  const currentApps = getStoredApps();
  let fileId = app.apkFileId;

  if (apkFile) {
    fileId = `apk_blob_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    await saveApkFileBlob(fileId, apkFile);
  }

  const updatedApp: ApkApp = {
    ...app,
    apkFileId: fileId,
  };

  const existingIndex = currentApps.findIndex(a => a.id === app.id);
  let newAppsList: ApkApp[];

  if (existingIndex >= 0) {
    newAppsList = [...currentApps];
    newAppsList[existingIndex] = updatedApp;
  } else {
    newAppsList = [updatedApp, ...currentApps];
  }

  localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(newAppsList));
  return newAppsList;
}

// Delete app by ID
export async function deleteApp(appId: string): Promise<ApkApp[]> {
  const currentApps = getStoredApps();
  const target = currentApps.find(a => a.id === appId);

  if (target?.apkFileId) {
    await deleteApkFileBlob(target.apkFileId);
  }

  const updatedList = currentApps.filter(a => a.id !== appId);
  localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(updatedList));
  return updatedList;
}

// Reset apps back to defaults
export function resetAppsToDefault(): ApkApp[] {
  localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(DEFAULT_APK_APPS));
  return DEFAULT_APK_APPS;
}

// User Session Storage
export function getSavedSession(): UserSession | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY_USER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: UserSession | null): void {
  if (session) {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(session));
  } else {
    localStorage.removeItem(STORAGE_KEY_USER);
  }
}

// Helper to trigger browser download of an APK
export async function triggerApkDownload(app: ApkApp, onProgress?: (pct: number) => void): Promise<void> {
  const sanitizeName = app.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const filename = `${sanitizeName}_${app.version.replace(/^v/, '')}.apk`;

  // Increment download count locally
  const allApps = getStoredApps();
  const idx = allApps.findIndex(a => a.id === app.id);
  if (idx >= 0) {
    allApps[idx].downloads += 1;
    localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(allApps));
  }

  let blob: Blob | null = null;

  if (app.apkFileId) {
    blob = await getApkFileBlob(app.apkFileId);
  }

  if (!blob) {
    // Generate valid downloadable Android APK package binary mock
    // Standard ZIP signature with APK AndroidManifest.xml headers
    const apkHeader = new Uint8Array([
      0x50, 0x4B, 0x03, 0x04, // Zip magic header
      0x14, 0x00, 0x08, 0x00,
      0x08, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00
    ]);
    
    // Add text contents indicating Android Package information
    const manifestInfo = `\n[Nox App Store Package]\nApp Name: ${app.name}\nPackage: ${app.packageName}\nVersion: ${app.version}\nDeveloper: ${app.developer}\nVerified Hash: SHA256-${Math.random().toString(36).substr(2, 16).toUpperCase()}\nSigned by: Nox Application Signing Key v2\n`;
    const manifestEncoder = new TextEncoder().encode(manifestInfo);
    
    const combined = new Uint8Array(apkHeader.length + manifestEncoder.length);
    combined.set(apkHeader);
    combined.set(manifestEncoder, apkHeader.length);

    blob = new Blob([combined], { type: 'application/vnd.android.package-archive' });
  }

  // Simulate smooth progress if callback provided
  if (onProgress) {
    for (let p = 10; p <= 100; p += 20) {
      onProgress(p);
      await new Promise(r => setTimeout(r, 80));
    }
  }

  // Trigger browser download anchor
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
