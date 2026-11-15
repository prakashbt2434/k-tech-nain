/**
 * Shrink an image in the browser and return it as a Base64 data URL, so it
 * can be stored directly in a Firestore document (no Cloud Storage needed).
 *
 * Firestore documents are limited to 1 MiB, and Base64 is ~33% larger than
 * the binary image, so keep results well under that.
 *
 * @param {File} file - PNG or JPEG image chosen by the user
 * @param {object} [options]
 * @param {number} [options.maxDimension=600] - longest side in pixels
 * @param {string} [options.type="image/png"] - output type; PNG keeps QR edges sharp
 * @returns {Promise<string>} data URL
 */
export async function imageToDataUrl(
  file,
  { maxDimension = 600, type = "image/png" } = {}
) {
  const sourceUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Could not read image"));
      image.src = sourceUrl;
    });

    const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);

    const ctx = canvas.getContext("2d");
    // White background so transparent PNGs stay scannable.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL(type);
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}

// Upper bound on stored data URL length (characters ≈ bytes), leaving room
// for the rest of the user document under Firestore's 1 MiB limit.
export const MAX_DATA_URL_LENGTH = 400 * 1024;
