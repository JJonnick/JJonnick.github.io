/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly PUBLIC_HSR_TERMS_LOCALE?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}