/**
 * SPECIMEN SLOTS: the places on the site that will show a transparent cut-out
 * image once a file exists for them.
 *
 * To fill a slot, put a file named after its id in public/images/specimens/,
 * e.g. public/images/specimens/main-hero.webp. Accepted: .webp, .png, .avif
 * (these keep transparency; .jpg cannot). Nothing else needs editing: the
 * layouts look in that folder at build time and an empty slot renders nothing.
 *
 * `shape` is the proportion the slot is laid out for; other proportions still
 * work (the image is never cropped or stretched) but may sit differently.
 * To see every slot outlined on the live pages, add ?specimens=show to a URL,
 * or open paolo.org.uk/specimens for the checklist.
 */
export interface SpecimenSlot {
  id: string;
  site: "main" | "physics" | "web";
  page: string;
  where: string;
  shape: "portrait" | "square" | "landscape";
  /** What would suit the slot. Suggestions only. */
  idea: string;
  /** Meaningful description for screen readers; leave "" for decoration. */
  alt: string;
}

export const SPECIMEN_SLOTS: SpecimenSlot[] = [
  { id: "main-hero", site: "main", page: "/", where: "Right of the headline, above the channels", shape: "portrait", idea: "You, cut out, or one object that stands for the work (a detector part, an instrument)", alt: "" },
  { id: "main-projects", site: "main", page: "/projects", where: "Right of the Projects heading", shape: "landscape", idea: "A laptop or phone showing one of the builds, cut out", alt: "" },
  { id: "main-contact", site: "main", page: "/contact", where: "Under the email links, left column", shape: "square", idea: "Something light: a paper plane, a telephone, a cello scroll", alt: "" },
  { id: "main-footer", site: "main", page: "every page", where: "Right of the large name in the footer", shape: "square", idea: "A small signature object", alt: "" },
  { id: "physics-research", site: "physics", page: "/research", where: "Right of the Research heading", shape: "landscape", idea: "The prototype TPC or a detector component, cut out", alt: "" },
  { id: "physics-simulations", site: "physics", page: "/simulations", where: "Right of the Simulations heading", shape: "square", idea: "A rendered lattice or a frame from the Ising model, cut to a shape", alt: "" },
  { id: "physics-articles", site: "physics", page: "/articles", where: "Right of the Articles heading", shape: "square", idea: "A notebook, a chalk diagram", alt: "" },
  { id: "physics-hibeam", site: "physics", page: "/hibeam", where: "Right of the HIBEAM title", shape: "portrait", idea: "The ESS target, a beamline element or the TPC", alt: "" },
  { id: "physics-footer", site: "physics", page: "every page", where: "Right of the large name in the footer", shape: "square", idea: "A small physics object", alt: "" },
  { id: "web-hero", site: "web", page: "/", where: "Top right of the blueprint, beside the headline", shape: "portrait", idea: "A phone or browser window showing a site you built, cut out and slightly rotated", alt: "" },
  { id: "web-portfolio", site: "web", page: "/portfolio", where: "Right of the Selected work heading", shape: "landscape", idea: "Two or three device screens overlapping", alt: "" },
  { id: "web-footer", site: "web", page: "every page", where: "Right of the large name in the footer", shape: "square", idea: "A small object: cursor, key, plug", alt: "" },
];
