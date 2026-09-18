import { safeJsonLd } from "../lib/json-ld.ts";
import { ok, eq, report } from "./_assert.mts";

// A blog post whose title/body contains a literal "</script>" must never be
// able to end the surrounding <script type="application/ld+json"> element
// early — that is exactly the injection shape behind WAGECOACH_WEB-1-style
// "SyntaxError: Invalid or unexpected token" reports from a corrupted page.
function assertSafeForInlineScript(value: unknown, label: string) {
  const serialized = safeJsonLd(value);

  ok(!/<\/script/i.test(serialized), `${label}: no literal "</script" sequence`);
  ok(!/<!--/.test(serialized), `${label}: no literal "<!--" sequence`);
  ok(!serialized.includes("<"), `${label}: no literal "<" of any kind (can't open or close a tag)`);

  // Simulate what the browser's HTML parser actually does: build the full
  // <script> element text and confirm scanning for "</script" (case
  // insensitive, the real terminator the HTML spec uses for raw text
  // elements) does not find one anywhere before the real closing tag.
  const html = `<script type="application/ld+json">${serialized}</script>`;
  const closingTagIndex = html.toLowerCase().indexOf("</script>");
  const bodyOnly = html.slice('<script type="application/ld+json">'.length, closingTagIndex);
  ok(!/<\/script/i.test(bodyOnly), `${label}: embedding in a real <script> tag doesn't expose an early terminator`);

  // Round-trips through JSON.parse to the exact original value — escaping
  // must be invisible to a JSON consumer (Google, Bing, etc. reading the
  // ld+json) even though it changes the raw bytes.
  eq(JSON.stringify(JSON.parse(serialized)), JSON.stringify(value), `${label}: JSON.parse round-trips to the original value`);
}

// Title containing a literal </script> that would otherwise close the tag early.
assertSafeForInlineScript(
  { "@type": "Article", headline: "Severance Pay Rules</script><script>alert(1)</script>" },
  "title with </script><script> payload",
);

// Body text containing backticks and a template-literal-looking payload.
assertSafeForInlineScript(
  { "@type": "FAQPage", mainEntity: [{ q: "What is `severance`?", a: "It's ${window.location} and \"quotes\" too." }] },
  "body with backticks, template-literal syntax, and quotes",
);

// A <!-- inside the content, which shifts raw-text script parsing into
// "script data escaped state" per the HTML spec until a matching -->.
assertSafeForInlineScript(
  { description: "Read more <!-- see appendix --> for details, then </script> if you dare." },
  "content with an HTML comment and a script terminator",
);

// Realistic post content: an employer's written policy, with the kind of
// apostrophes and straight quotes real posts use — should be untouched by
// the escaping (still human-readable JSON, not mangled).
assertSafeForInlineScript(
  {
    headline: "Severance Pay Rules: Are Employers Required to Pay It?",
    description: "Federal law does not require severance pay. Whether you are entitled to it depends on your contract, your employer's written policy, and the WARN Act.",
  },
  "ordinary post content with apostrophes",
);

// U+2028/U+2029 are valid JSON string characters but historically break JS
// string literals in some engines if this blob is ever consumed as script
// source rather than data; confirm they're escaped defensively too.
{
  const serialized = safeJsonLd({ text: "line one line two line three" });
  ok(!serialized.includes(" ") && !serialized.includes(" "), "U+2028/U+2029 are escaped, not embedded raw");
  eq(JSON.parse(serialized).text, "line one line two line three", "U+2028/U+2029 round-trip through JSON.parse");
}

report("json-ld");
