// GROQ REQUESTS & fragments

// Section content
export const SECTION_CONTENT = `
    content[]{
      _key,
      _type,
      _type == "textBlock" => { title, content },
      _type == "reference" => {
        "url": @->image.asset->url,
        "alt": @->alt,
        "caption": @->caption
      }
    }`;

// Array "sections"
export const SECTIONS = `
  sections[]{
    _key,
    _type,
    title,
    subtitle,
${SECTION_CONTENT}
  }`;

// Thumbnail projects
export const PROJECT_CARD = `
  _id,
  title,
  "slug": slug.current,
  "coverUrl": coverImage.asset->url`;

// Home and sections
export const homeQuery = `
*[_type == "page" && slug.current == "/"][0]{
  title,${SECTIONS}
}`;

// Four most recent projects
export const recentProjectsQuery = `
*[_type == "project"] | order(date desc)[0...4]{${PROJECT_CARD}
}`;
