"use client";

import Head from "next/head";

export default function FontComparisonPage() {
  const sampleContent = {
    heading: "The Art of the Long Run",
    subheading:
      "How elite marathoners train their minds to embrace the suffering and find flow in the final miles",
    author: "James Mitchell",
    date: "January 15, 2026",
    body: `The marathon is not a race against others—it's a conversation with yourself. Somewhere around mile 20, when your glycogen stores are depleted and your legs are screaming for relief, the real race begins. This is where champions are made, not on the podium, but in the quiet battle between the voice that says "stop" and the one that whispers "keep going."

Elite marathoners spend years learning to navigate this internal landscape. They train not just their bodies but their minds, developing mental frameworks that transform suffering into something almost meditative. Eliud Kipchoge calls it "running with joy." For others, it's about compartmentalizing—breaking the impossible distance into manageable chunks.

The science backs this up. Studies show that elite endurance athletes process discomfort differently than recreational runners. Their brains have literally rewired themselves to interpret pain signals as information rather than alarm bells. This isn't about ignoring pain—it's about changing your relationship with it.`,
  };

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Eczar:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Libre+Franklin:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Google Fonts import via style tag for client component */}
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Eczar:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Libre+Franklin:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap");
        `}</style>

        <div className="max-w-7xl mx-auto px-8 py-12">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">
            Font Pairing Comparison
          </h1>
          <p className="text-gray-600 mb-12">
            Compare three typography combinations for Distanz
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Option 1: EB Garamond + Inter */}
            <div className="border border-gray-200 rounded-lg p-8 bg-gray-50">
              <div className="mb-6 pb-4 border-b border-gray-300">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Option 1
                </span>
                <h2 className="text-lg font-semibold text-gray-900 mt-1">
                  EB Garamond + Inter
                </h2>
                <p className="text-sm text-gray-500">Current pairing</p>
              </div>

              <article>
                <h3
                  style={{
                    fontFamily: '"EB Garamond", Georgia, serif',
                    fontSize: "32px",
                    lineHeight: 1.15,
                    fontWeight: 500,
                    color: "#111",
                    marginBottom: "12px",
                  }}
                >
                  {sampleContent.heading}
                </h3>
                <p
                  style={{
                    fontFamily: '"EB Garamond", Georgia, serif',
                    fontSize: "20px",
                    lineHeight: 1.4,
                    fontWeight: 400,
                    color: "#444",
                    marginBottom: "16px",
                    fontStyle: "italic",
                  }}
                >
                  {sampleContent.subheading}
                </p>
                <p
                  style={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: "14px",
                    lineHeight: 1.5,
                    color: "#666",
                    marginBottom: "24px",
                  }}
                >
                  By <span style={{ fontWeight: 500 }}>{sampleContent.author}</span>{" "}
                  · {sampleContent.date}
                </p>
                <div
                  style={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: "16px",
                    lineHeight: 1.7,
                    color: "#333",
                  }}
                >
                  {sampleContent.body.split("\n\n").map((para, i) => (
                    <p key={i} style={{ marginBottom: "16px" }}>
                      {para}
                    </p>
                  ))}
                </div>
              </article>
            </div>

            {/* Option 2: EB Garamond + Libre Franklin */}
            <div className="border border-gray-200 rounded-lg p-8 bg-gray-50">
              <div className="mb-6 pb-4 border-b border-gray-300">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Option 2
                </span>
                <h2 className="text-lg font-semibold text-gray-900 mt-1">
                  EB Garamond + Libre Franklin
                </h2>
                <p className="text-sm text-gray-500">Classic + Warm sans</p>
              </div>

              <article>
                <h3
                  style={{
                    fontFamily: '"EB Garamond", Georgia, serif',
                    fontSize: "32px",
                    lineHeight: 1.15,
                    fontWeight: 500,
                    color: "#111",
                    marginBottom: "12px",
                  }}
                >
                  {sampleContent.heading}
                </h3>
                <p
                  style={{
                    fontFamily: '"EB Garamond", Georgia, serif',
                    fontSize: "20px",
                    lineHeight: 1.4,
                    fontWeight: 400,
                    color: "#444",
                    marginBottom: "16px",
                    fontStyle: "italic",
                  }}
                >
                  {sampleContent.subheading}
                </p>
                <p
                  style={{
                    fontFamily: '"Libre Franklin", sans-serif',
                    fontSize: "14px",
                    lineHeight: 1.5,
                    color: "#666",
                    marginBottom: "24px",
                  }}
                >
                  By <span style={{ fontWeight: 500 }}>{sampleContent.author}</span>{" "}
                  · {sampleContent.date}
                </p>
                <div
                  style={{
                    fontFamily: '"Libre Franklin", sans-serif',
                    fontSize: "16px",
                    lineHeight: 1.7,
                    color: "#333",
                  }}
                >
                  {sampleContent.body.split("\n\n").map((para, i) => (
                    <p key={i} style={{ marginBottom: "16px" }}>
                      {para}
                    </p>
                  ))}
                </div>
              </article>
            </div>

            {/* Option 3: Eczar + Libre Franklin */}
            <div className="border border-gray-200 rounded-lg p-8 bg-gray-50">
              <div className="mb-6 pb-4 border-b border-gray-300">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Option 3
                </span>
                <h2 className="text-lg font-semibold text-gray-900 mt-1">
                  Eczar + Libre Franklin
                </h2>
                <p className="text-sm text-gray-500">Bold serif + Warm sans</p>
              </div>

              <article>
                <h3
                  style={{
                    fontFamily: '"Eczar", Georgia, serif',
                    fontSize: "32px",
                    lineHeight: 1.15,
                    fontWeight: 600,
                    color: "#111",
                    marginBottom: "12px",
                  }}
                >
                  {sampleContent.heading}
                </h3>
                <p
                  style={{
                    fontFamily: '"Eczar", Georgia, serif',
                    fontSize: "20px",
                    lineHeight: 1.4,
                    fontWeight: 400,
                    color: "#444",
                    marginBottom: "16px",
                  }}
                >
                  {sampleContent.subheading}
                </p>
                <p
                  style={{
                    fontFamily: '"Libre Franklin", sans-serif',
                    fontSize: "14px",
                    lineHeight: 1.5,
                    color: "#666",
                    marginBottom: "24px",
                  }}
                >
                  By <span style={{ fontWeight: 500 }}>{sampleContent.author}</span>{" "}
                  · {sampleContent.date}
                </p>
                <div
                  style={{
                    fontFamily: '"Libre Franklin", sans-serif',
                    fontSize: "16px",
                    lineHeight: 1.7,
                    color: "#333",
                  }}
                >
                  {sampleContent.body.split("\n\n").map((para, i) => (
                    <p key={i} style={{ marginBottom: "16px" }}>
                      {para}
                    </p>
                  ))}
                </div>
              </article>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-12 p-6 bg-gray-100 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Quick Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h3 className="font-medium mb-2">EB Garamond + Inter</h3>
                <p className="text-gray-600">
                  Safe, professional, ubiquitous. Inter is everywhere but extremely well-optimized for screens.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">EB Garamond + Libre Franklin</h3>
                <p className="text-gray-600">
                  Classic elegance with warmer body text. More distinctive than Inter, still highly readable.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Eczar + Libre Franklin</h3>
                <p className="text-gray-600">
                  Bolder, more contemporary feel. Eczar has strong personality - less traditional, more assertive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
