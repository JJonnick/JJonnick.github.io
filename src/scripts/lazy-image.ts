export function initializeLazyImage(host: HTMLElement): () => void {
    const image = host.querySelector<HTMLImageElement>("[data-lazy-image-source]");
    const skeleton = host.querySelector<HTMLElement>("[data-lazy-image-skeleton]");
    const error = host.querySelector<HTMLElement>("[data-lazy-image-error]");

    if (!image || !skeleton || !error) return () => undefined;

    const showImage = () => {
        host.dataset.state = "loaded";
        image.hidden = false;
        image.classList.remove("opacity-0");
        image.classList.add("opacity-100");
        skeleton.hidden = true;
        error.hidden = true;
    };

    const showError = () => {
        host.dataset.state = "error";
        image.hidden = true;
        skeleton.hidden = true;
        error.hidden = false;
    };

    host.dataset.state = "loading";
    image.addEventListener("load", showImage);
    image.addEventListener("error", showError);

    if (image.complete) {
        if (image.naturalWidth > 0) showImage();
        else showError();
    }

    return () => {
        image.removeEventListener("load", showImage);
        image.removeEventListener("error", showError);
    };
}
