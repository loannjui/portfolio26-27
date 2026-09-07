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
      },
      _type == "table" => {
        columns[]{ _key, name },
        rows[]{
          _key,
          cells[]{
            _key,
            value,
            "imageUrl": image->image.asset->url,
            "imageAlt": image->alt
          }
        }
      }
    }`;

// Thumbnail projects
export const PROJECT_CARD = `
  _id,
  title,
  "slug": slug.current,
  "coverUrl": coverImage.asset->url,
  date`;

// Array "sections"
export const SECTIONS = `
  sections[]{
    _key,
    _type,
    title,
    subtitle,
${SECTION_CONTENT},
    _type == "projectsSection" => {
      projects[]->{${PROJECT_CARD}
      }
    }
  }`;

// Home and sections
export const homeQuery = `
*[_type == "page" && slug.current == "/"][0]{
  title,${SECTIONS}
}`;

// About hero section, filtered by subtitle
const aboutSectionQuery = (subtitle) => `
*[_type == "page" && slug.current == "about"][0]
  .sections[_type == "section" && subtitle == "${subtitle}"][0]{
    _key,
    _type,
    title,
    subtitle,
${SECTION_CONTENT}
  }`;

// Home about
export const aboutHomeQuery = aboutSectionQuery("home");

// About page
export const aboutHeroQuery = aboutSectionQuery("about_page");

export const whatICanDoQuery = `
*[_type == "page" && slug.current == "about"][0]
  .sections[_type == "section" && title == "What I can do"][0]{
    _key,
    _type,
    title,
    subtitle,
${SECTION_CONTENT}
  }`;

// Contact page
export const contactQuery = `
*[_type == "page" && slug.current == "contact"][0]
  .sections[_type == "section"][0]{
    _key,
    _type,
    title,
    subtitle,
${SECTION_CONTENT}
  }`;

// Image called by title
export const mediaByTitleQuery = `
*[_type == "media" && title == $title][0]{
  "url": image.asset->url,
  alt
}`;
