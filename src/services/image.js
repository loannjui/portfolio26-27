import { createImageUrlBuilder } from "@sanity/image-url";
import { sanity } from "./sanity.js";

const builder = createImageUrlBuilder(sanity);

// Steps offered to the browser in a srcset. The CDN renders any width on
// demand, these are just the ones worth having it cache.
const WIDTHS = [400, 640, 900, 1200, 1600];

// Caps the srcset ladder, so it has to cover the widest an image is shown at
// on a high-density screen, not the widest CSS pixel count
const DEFAULT_WIDTH = 1600;

/**
 * The CDN serves SVG untouched: resizing and format conversion do nothing to
 * it, so a srcset would only repeat the very same URL five times.
 */
function isVector(source) {
  const id = source?.asset?._id ?? source?.asset?._ref ?? "";
  return id.endsWith("-svg");
}

function build(source, width, ratio) {
  let image = builder.image(source).width(width).auto("format");

  // Asking for a height is what makes the builder crop, and it crops around
  // the hotspot placed in the Studio instead of the middle of the image
  if (ratio) image = image.height(Math.round(width / ratio)).fit("crop");

  return image.url();
}

/**
 * URL of a Sanity image, resized and served as WebP/AVIF when the browser
 * takes it.
 *
 * @param {Object} source - Sanity image object: asset, hotspot and crop
 * @param {Object} [options]
 * @param {number} [options.width=1200] - Width in pixels
 * @param {number} [options.ratio] - width / height, crops when set
 * @returns {string} Empty when there is no image to show
 */
export function imageUrl(source, { width = DEFAULT_WIDTH, ratio = null } = {}) {
  if (!source?.asset) return "";
  if (isVector(source)) return builder.image(source).url();

  return build(source, width, ratio);
}

/**
 * The same image at several widths, for the browser to pick from.
 *
 * @returns {string|undefined} Undefined when a srcset would serve no purpose,
 *   so that the attribute is left out of the markup altogether
 */
export function imageSrcset(
  source,
  { width = DEFAULT_WIDTH, ratio = null } = {},
) {
  if (!source?.asset || isVector(source)) return undefined;

  const widths = [...WIDTHS.filter((step) => step < width), width];

  return widths
    .map((step) => `${build(source, step, ratio)} ${step}w`)
    .join(", ");
}

/**
 * Natural size of the image, or of its crop when a ratio is given, so the
 * browser can reserve the space before the file lands.
 */
export function imageSize(source, ratio = null) {
  const { width, height } = source?.asset?.dimensions ?? {};
  if (!width || !height) return {};

  return ratio
    ? { width, height: Math.round(width / ratio) }
    : { width, height };
}
