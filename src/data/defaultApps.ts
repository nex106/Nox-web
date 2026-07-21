import { ApkApp } from '../types';

export const DEFAULT_APK_APPS: ApkApp[] = [
  {
    id: 'nox-cyberpunk-odyssey',
    name: 'Cyberpunk Odyssey',
    packageName: 'com.nox.cyberpunk.odyssey',
    version: 'v3.4.1',
    size: '128.5 MB',
    sizeBytes: 134742016,
    icon: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop&q=80',
    category: 'Games',
    description: 'An open-world futuristic sci-fi RPG with ray-traced neon visuals, fast-paced mech combat, and deep cybernetic customisation.',
    developer: 'Nox Studio Interactive',
    rating: 4.9,
    downloads: 142800,
    uploadedAt: '2026-07-15',
    isFeatured: true,
    minAndroidVersion: 'Android 10.0+',
    changelog: 'Added Neon City Chapter 5, upgraded Vulkan rendering engine, fixed high-refresh rate display bug.',
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 'nox-speed-booster',
    name: 'Nox OS Turbo & Cleaner',
    packageName: 'com.nox.tools.turbocleaner',
    version: 'v2.8.0',
    size: '18.4 MB',
    sizeBytes: 19293798,
    icon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    category: 'Utilities',
    description: 'Extreme kernel-level optimization tool for high-FPS mobile gaming, RAM garbage collection, and battery thermal cooling.',
    developer: 'Nox Systems Lab',
    rating: 4.8,
    downloads: 389200,
    uploadedAt: '2026-07-10',
    isFeatured: true,
    minAndroidVersion: 'Android 8.0+',
    changelog: 'Added AI Thermal Throttling Bypass, automatic background cache purge, GPU boost mode for Snapdragon 8 Gen 3.',
    screenshots: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'nox-shadow-blade',
    name: 'Shadow Blade: Zero',
    packageName: 'com.nox.games.shadowblade',
    version: 'v4.1.2',
    size: '86.2 MB',
    sizeBytes: 90387456,
    icon: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80',
    category: 'Games',
    description: 'High-octane cyberpunk ninja action platformer. Hack through corporate drones with energy katana and shadow dashes.',
    developer: 'Aether Games',
    rating: 4.7,
    downloads: 98400,
    uploadedAt: '2026-07-08',
    isFeatured: false,
    minAndroidVersion: 'Android 9.0+',
    changelog: 'New Boss Arena added. Adjusted dash cooldown speed and unlocked 120 FPS display mode.',
    screenshots: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'nox-aether-player',
    name: 'Aether Audio Engine Pro',
    packageName: 'com.nox.audio.aetherpro',
    version: 'v1.9.5',
    size: '24.1 MB',
    sizeBytes: 25270681,
    icon: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=80',
    category: 'Media & Video',
    description: 'FLAC lossless audio player with 32-band parametric equalizer, spatial 3D audio synthesis, and visualizer themes.',
    developer: 'SoundWave Cyber Corp',
    rating: 4.9,
    downloads: 215000,
    uploadedAt: '2026-06-28',
    isFeatured: true,
    minAndroidVersion: 'Android 8.1+',
    changelog: 'Support for Hi-Res Bluetooth LDAC streaming, customized neon waveform widgets.',
    screenshots: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'nox-retro-emulator-x',
    name: 'RetroMatrix Ultimate Emulator',
    packageName: 'com.nox.emulators.retromatrix',
    version: 'v5.0.1',
    size: '64.8 MB',
    sizeBytes: 67947724,
    icon: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&auto=format&fit=crop&q=80',
    category: 'Emulators',
    description: 'All-in-one handheld retro console emulator supporting PS2, PSP, GameCube, N64, and arcade classics with bluetooth gamepad pairing.',
    developer: 'OpenEmulate Devs',
    rating: 4.9,
    downloads: 512000,
    uploadedAt: '2026-07-01',
    isFeatured: true,
    minAndroidVersion: 'Android 9.0+',
    changelog: 'Improved PS2 JIT compiler performance by 35%. Added custom shader support for CRT monitor bloom.',
    screenshots: [
      'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'nox-cyber-vpn',
    name: 'GhostNet Stealth VPN & Proxy',
    packageName: 'com.nox.cyber.ghostnet',
    version: 'v3.1.0',
    size: '31.0 MB',
    sizeBytes: 32505856,
    icon: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&auto=format&fit=crop&q=80',
    category: 'Cyber Tools',
    description: 'Encrypted WireGuard VPN client with built-in DNS-over-HTTPS, ping acceleration for low gaming latency, and zero logs policy.',
    developer: 'GhostLabs Network',
    rating: 4.8,
    downloads: 640000,
    uploadedAt: '2026-07-12',
    isFeatured: false,
    minAndroidVersion: 'Android 8.0+',
    changelog: 'Upgraded WireGuard protocol version. Added automated low-latency gaming server selector.',
    screenshots: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'nox-pixel-horizon',
    name: 'Pixel Horizon: Tactical Cyber War',
    packageName: 'com.nox.games.pixelhorizon',
    version: 'v2.0.4',
    size: '92.6 MB',
    sizeBytes: 97100000,
    icon: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=200&auto=format&fit=crop&q=80',
    category: 'Games',
    description: 'Turn-based tactical squad strategy game set in a pixelated dystopian megacity. Control hackers, snipers, and cyborg commandos.',
    developer: 'Neon Pixel Co.',
    rating: 4.6,
    downloads: 78300,
    uploadedAt: '2026-06-18',
    isFeatured: false,
    minAndroidVersion: 'Android 7.0+',
    changelog: 'Added 8 new playable agent units and 15 campaign missions.',
    screenshots: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'nox-hex-editor',
    name: 'HexX Code & APK Modder Tool',
    packageName: 'com.nox.tools.hexx',
    version: 'v1.4.0',
    size: '12.8 MB',
    sizeBytes: 13421772,
    icon: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&auto=format&fit=crop&q=80',
    category: 'Cyber Tools',
    description: 'Advanced Android developer tool for inspecting APK manifests, reverse engineering DEX bytecodes, and editing hex values.',
    developer: 'HexX Lab',
    rating: 4.7,
    downloads: 45200,
    uploadedAt: '2026-07-02',
    isFeatured: false,
    minAndroidVersion: 'Android 9.0+',
    changelog: 'Added smali decompiler syntax highlighting and direct zip alignment viewer.',
    screenshots: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80'
    ]
  }
];
