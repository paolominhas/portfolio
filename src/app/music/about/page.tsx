import StaffLines from "@/components/music/StaffLines";

export const metadata = {
  title: "About",
  description: "About the arrangements on this site, and who they're for.",
};

export default function MusicAboutPage() {
  return (
    <section className="pt-40 pb-24 px-6 md:px-16 max-w-2xl mx-auto">
      <StaffLines className="w-32 mb-6 opacity-70" />
      <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-stone-900 mb-8">
        About
      </h1>
      <div className="prose prose-stone max-w-none prose-p:text-stone-600 prose-p:leading-relaxed">
        <p>
          I play and help run concerts for the Edinburgh University Chamber
          Orchestra, and most of the arrangements here started as a practical
          problem: a piece that suits the room, the occasion, or the players
          available that week, but not in its original scoring.
        </p>
        <p>
          Each arrangement page lists the ensemble it was made for, when (and
          if) it's been performed, and a short programme note on the choices
          involved in rescoring it.
        </p>
        <p>
          Get in touch via{" "}
          <a href="https://paolo.org.uk/contact">the main site</a> if you'd
          like a piece arranged for a specific ensemble.
        </p>
      </div>
    </section>
  );
}
