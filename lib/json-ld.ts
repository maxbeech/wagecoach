/**
 * Serializes a value for embedding inside an inline
 * `<script type="application/ld+json">` (or any inline script) via
 * `dangerouslySetInnerHTML`.
 *
 * `JSON.stringify` alone is not safe to drop straight into HTML: if any
 * interpolated string contains `</script`, `<!--`, or even a bare `<`, the
 * HTML parser can end the script element (or shift into the "script data
 * escaped state") in the middle of the JSON, corrupting the rest of the page.
 * If the leftover markup then contains a later `<script` sequence, the
 * browser can end up trying to execute plain JSON/text as JavaScript --
 * exactly the shape of a `SyntaxError: Invalid or unexpected token` thrown
 * from an inline script. See OWASP's guidance on serializing JSON for an
 * HTML context.
 *
 * Escaping every `<`, `>`, and `&` as their unicode-escape equivalents closes
 * this for good: JSON has no syntactic use for those characters, so this
 * never changes what `JSON.parse` reconstructs on the other end, and the
 * HTML parser can no longer find any tag-opening or tag-closing sequence
 * inside the script body. The line/paragraph separator characters -- valid
 * in a JSON string but treated as line terminators by some JS engines when a
 * JSON blob like this is later parsed as a plain script -- are escaped too,
 * defensively.
 *
 * This is the single place blog posts (and every other page that emits
 * JSON-LD from content-author-supplied strings) should serialize data for an
 * inline script tag.
 */

// Built from character codes rather than literal source escapes, so the
// line/paragraph separator characters never appear as raw bytes in this file
// -- a raw one of these in JS source is itself a line terminator, which is
// exactly the class of footgun this function exists to avoid re-introducing.
const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

const UNSAFE_CHARS = new RegExp(`[<>&${LINE_SEPARATOR}${PARAGRAPH_SEPARATOR}]`, "g");

const ESCAPES: Record<string, string> = {
  "<": "\\u003c",
  ">": "\\u003e",
  "&": "\\u0026",
  [LINE_SEPARATOR]: "\\u2028",
  [PARAGRAPH_SEPARATOR]: "\\u2029",
};

export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(UNSAFE_CHARS, (ch) => ESCAPES[ch]);
}
