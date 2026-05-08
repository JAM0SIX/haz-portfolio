import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/sections/Footer/Footer";
import styles from "./about.module.css";

type GalleryItem = {
  id: string;
  label: string;
  note: string;
  image: string;
};

type GallerySection = {
  id: string;
  heading: string;
  layout: "a" | "b" | "c" | "d" | "e";
  items: GalleryItem[];
};

const GALLERY_SECTIONS: readonly GallerySection[] = [
  {
    id: "award-winner",
    heading: "Award winner",
    layout: "c",
    items: [
      {
        id: "aw-01",
        label: "Frame / 01",
        note: "Industry recognition for interaction craft and execution quality.",
        image: "/projects/Philpotpearceshot.png",
      },
      {
        id: "aw-02",
        label: "Frame / 02",
        note: "Ceremony moments, presentation rehearsals, and final board snapshots.",
        image: "/projects/Lexisnexisshot.png",
      },
      {
        id: "aw-03",
        label: "Frame / 03",
        note: "The physical work that sat behind the digital outcomes.",
        image: "/projects/GWIshot.png",
      },
    ],
  },
  {
    id: "explorer",
    heading: "Explorer",
    layout: "b",
    items: [
      {
        id: "ex-01",
        label: "Frame / 01",
        note: "Field notes from museums, studios, and public spaces.",
        image: "/projects/Soundtrendshot.png",
      },
      {
        id: "ex-02",
        label: "Frame / 02",
        note: "Sketches and references gathered while moving through cities.",
        image: "/projects/Philpotpearceshot.png",
      },
      {
        id: "ex-03",
        label: "Frame / 03",
        note: "Material palettes observed in architecture and signage.",
        image: "/projects/GWIshot.png",
      },
      {
        id: "ex-04",
        label: "Frame / 04",
        note: "Unexpected details that eventually shaped product decisions.",
        image: "/projects/Lexisnexisshot.png",
      },
    ],
  },
  {
    id: "thrill-rider",
    heading: "Thrill rider",
    layout: "c",
    items: [
      {
        id: "tr-01",
        label: "Frame / 01",
        note: "High-speed weekends that reset perspective for Monday work.",
        image: "/projects/GWIshot.png",
      },
      {
        id: "tr-02",
        label: "Frame / 02",
        note: "Route maps, telemetry overlays, and movement studies.",
        image: "/projects/Soundtrendshot.png",
      },
      {
        id: "tr-03",
        label: "Frame / 03",
        note: "Motion blur, light trails, and edge-of-frame composition.",
        image: "/projects/Philpotpearceshot.png",
      },
    ],
  },
  {
    id: "photography-enthusiast",
    heading: "Photography enthusiast",
    layout: "d",
    items: [
      {
        id: "ph-01",
        label: "Frame / 01",
        note: "Portrait studies and scene composition experiments.",
        image: "/projects/Aboutme.png",
      },
      {
        id: "ph-02",
        label: "Frame / 02",
        note: "Lens tests focused on depth and natural contrast.",
        image: "/projects/Philpotpearceshot.png",
      },
      {
        id: "ph-03",
        label: "Frame / 03",
        note: "Post-processing passes balancing tone and texture.",
        image: "/projects/Lexisnexisshot.png",
      },
      {
        id: "ph-04",
        label: "Frame / 04",
        note: "Street captures with deliberate framing constraints.",
        image: "/projects/Soundtrendshot.png",
      },
    ],
  },
  {
    id: "traveller",
    heading: "Traveller",
    layout: "e",
    items: [
      {
        id: "tv-01",
        label: "Frame / 01",
        note: "Journeys that turn observation into design instinct.",
        image: "/projects/GWIshot.png",
      },
      {
        id: "tv-02",
        label: "Frame / 02",
        note: "Transit systems, maps, and patterns of public movement.",
        image: "/projects/Aboutme.png",
      },
      {
        id: "tv-03",
        label: "Frame / 03",
        note: "Hotel-desk sketchbooks and in-flight idea snapshots.",
        image: "/projects/Philpotpearceshot.png",
      },
    ],
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <main className={styles.page}>
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Back
          </Link>
          <h1 className={styles.title}>A personal gallery of interests and life</h1>
          <p className={styles.intro}>
            You would never read a 1000 of words about me, so I will let my photographs do the talking.
          </p>
        </header>

        <section className={styles.galleryRoot} aria-label="Gallery">
          <div className={styles.sections}>
            {GALLERY_SECTIONS.map((section, sectionIdx) => (
              <article
                key={section.id}
                className={`${styles.gallerySection} ${sectionIdx % 2 === 1 ? styles.gallerySectionDark : ""}`}
                aria-labelledby={`${section.id}-heading`}
              >
                <h3 id={`${section.id}-heading`} className={styles.sectionHeading}>
                  {section.heading}
                </h3>
                <div className={`${styles.galleryGrid} ${styles[`grid${section.layout.toUpperCase()}`]}`}>
                  {section.items.map((item, itemIdx) => (
                    <figure
                      key={item.id}
                      className={`${styles.galleryItem} ${styles[`item${section.layout.toUpperCase()}${itemIdx + 1}`]}`}
                    >
                      <div className={styles.galleryMedia}>
                        <Image
                          src={item.image}
                          alt={`${section.heading} ${item.label}`}
                          fill
                          sizes="(max-width: 900px) 100vw, 50vw"
                        />
                      </div>
                      <figcaption className={styles.galleryCaption}>
                        <span className={styles.galleryTag}>
                          {sectionIdx + 1}.{itemIdx + 1} / {item.label}
                        </span>
                        <p>{item.note}</p>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
