/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
    // Environment variables can be added here as needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}