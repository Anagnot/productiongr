/**
 * Renders a JSON-LD <script> with safe escaping. Pass a schema.org object
 * (or an @graph). Used for page-level structured data (breadcrumbs, products,
 * services, case studies) on top of the site-wide Organization graph.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
