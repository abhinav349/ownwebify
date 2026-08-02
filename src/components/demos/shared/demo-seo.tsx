import { CreativeWorkJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

const BASE_URL = "https://ownwebify.com";

/** Per-demo structured data: what the page is, plus where it sits in the site. */
export function DemoSeo({
  name,
  type,
  slug,
  description,
}: {
  name: string;
  type: string;
  slug: string;
  description: string;
}) {
  const url = `${BASE_URL}/demos/${slug}`;

  return (
    <>
      <CreativeWorkJsonLd
        name={`${name} - ${type} Website Demo`}
        description={description}
        url={url}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: BASE_URL },
          { name: "Website Demos", url: `${BASE_URL}/demos` },
          { name: `${name} (${type})`, url },
        ]}
      />
    </>
  );
}
