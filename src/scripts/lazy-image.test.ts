import assert from "node:assert/strict";
import test from "node:test";
import { type HTMLElement, type HTMLImageElement, Window } from "happy-dom";
import { initializeLazyImage } from "./lazy-image.ts";

function createLazyImage() {
    const window = new Window();
    const host = window.document.createElement("astro-lazy-image");
    host.innerHTML = `
        <img data-lazy-image-source class="opacity-0" alt="March 7th" />
        <span data-lazy-image-skeleton></span>
        <span data-lazy-image-error hidden>No se pudo cargar la imagen</span>
    `;
    window.document.body.append(host);
    initializeLazyImage(host as unknown as globalThis.HTMLElement);

    return {
        host,
        image: host.querySelector<HTMLImageElement>("[data-lazy-image-source]"),
        skeleton: host.querySelector<HTMLElement>("[data-lazy-image-skeleton]"),
        error: host.querySelector<HTMLElement>("[data-lazy-image-error]"),
        window,
    };
}

test("reveals image and removes skeleton after load", () => {
    const { host, image, skeleton, error, window } = createLazyImage();

    image?.dispatchEvent(new window.Event("load"));

    assert.equal(host.dataset.state, "loaded");
    assert.equal(image?.classList.contains("opacity-100"), true);
    assert.equal(skeleton?.hidden, true);
    assert.equal(error?.hidden, true);
});

test("replaces failed image with an accessible fallback", () => {
    const { host, image, skeleton, error, window } = createLazyImage();

    image?.dispatchEvent(new window.Event("error"));

    assert.equal(host.dataset.state, "error");
    assert.equal(image?.hidden, true);
    assert.equal(skeleton?.hidden, true);
    assert.equal(error?.hidden, false);
});
