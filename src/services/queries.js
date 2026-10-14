// GROQ queries & reusable fragments

// Everything the image URL builder needs: the asset id to address the file,
// and the hotspot and crop the editor set in the Studio. Dimensions come
// along so the browser can reserve the space before the file lands.
export const IMAGE = `{
    "asset": asset->{
      _id,
      "dimensions": metadata.dimensions
    },
    hotspot,
    crop
  }`;

// Section content
export const SECTION_CONTENT = `
    content[]{
      _key,
      _type,
      _type == "textBlock" => { title, content },
      _type == "reference" => {
        "image": @->image${IMAGE},
        "alt": @->alt,
        "caption": @->caption
      },
      _type == "embed" => { url, title, aspectRatio, caption },
      _type == "button" => { label, url },
      _type == "table" => {
        columns[]{ _key, name },
        rows[]{
          _key,
          cells[]{
            _key,
            value,
            "image": image->image${IMAGE},
            "imageAlt": image->alt,
            link{
              "type": reference->_type,
              "slug": reference->slug.current,
              url,
              newTab
            }
          }
        }
      }
    }`;

// Fields used by project thumbnails
export const PROJECT_CARD = `
  _id,
  title,
  "slug": slug.current,
  "cover": coverImage${IMAGE},
  date,
  endDate`;

// The "sections" array of a page
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

// Home page with its sections
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

// About block shown on the home page
export const aboutHomeQuery = aboutSectionQuery("home");

// About hero shown on the about page
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

export const aboutProjectQuery = `
*[_type == "page" && slug.current == "about"][0]
  .sections[_type == "section" && title == "This project"][0]{
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

// 404 page, shown for any unknown URL
export const notFoundQuery = `
*[_type == "page" && slug.current == "404"][0]
  .sections[_type == "section"][0]{
    _key,
    _type,
    title,
    subtitle,
${SECTION_CONTENT}
  }`;

// Every project, newest first
export const allProjectsQuery = `
*[_type == "project"]|order(date desc){${PROJECT_CARD}
}`;

// Projects page
export const projectsQuery = `
*[_type == "page" && slug.current == "projects"][0]
  .sections[_type == "section"][0]{
    _key,
    _type,
    title,
    subtitle,
${SECTION_CONTENT}
  }`;

// Single image looked up by its title
export const mediaByTitleQuery = `
*[_type == "media" && title == $title][0]{
  "image": image${IMAGE},
  alt
}`;

// Single project with its sections, looked up by slug.
// A project only ever holds plain sections, never a projectsSection.
export const projectQuery = `
*[_type == "project" && slug.current == $slug][0]{${PROJECT_CARD},
  "excerpt": coalesce(excerpt, ""),
  "externalUrl": coalesce(externalUrl, ""),
  "externalUrlLabel": coalesce(externalUrlLabel, ""),
  "skills": coalesce(skills, []),
  "category": coalesce(category, ""),
  sections[]{
    _key,
    title,
    subtitle,
${SECTION_CONTENT}
  }
}`;
