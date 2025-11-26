import { NextSeo } from "next-seo";

/**
 * About page – rewritten for an educational, brand‑safe crypto niche.
 */
export default function About() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <NextSeo
        title="About FinNews247 | Crypto Education & Market Analysis"
        description="Learn about FinNews247 – a U.S.-focused crypto publication providing educational explainers, market structure insights and regulatory coverage, without trading signals or investment advice."
        canonical="https://www.finnews247.com/about"
        openGraph={{
          title: "About FinNews247 | Crypto Education & Market Analysis",
          description:
            "FinNews247 is a crypto‑focused, English‑language publication dedicated to clear, brand‑safe education on digital assets, market structure and regulation.",
          url: "https://www.finnews247.com/about",
        }}
        additionalMetaTags={[
          {
            name: "keywords",
            content:
              "about finnews247, crypto education, digital assets research, crypto market analysis, blockchain news",
          },
        ]}
      />

      <h1 className="text-3xl font-bold">About FinNews247</h1>

      <p>
        <strong>FinNews247</strong> is a specialist publication committed to
        providing high‑quality, brand‑safe coverage of cryptocurrencies,
        blockchain technology and the broader digital‑asset markets. Our primary
        focus is on clear explanations, frameworks and context — not trading
        calls or get‑rich‑quick promises. We publish market explainers,
        long‑form features, exchange and app reviews, and infrastructure and
        altcoin research that help readers understand how the ecosystem
        actually works.
      </p>

      <h2 className="text-2xl font-semibold mt-4">Our Mission</h2>
      <p>
        Our mission is to demystify the world of crypto and deliver
        institutional‑grade context to everyday readers, especially in the U.S.
        and other English‑speaking markets. We believe everyone should have
        access to clear, unbiased information when thinking about financial
        decisions. To achieve this, we combine data analysis, on‑chain research,
        regulatory developments and market‑structure insights to explain the
        forces shaping crypto — highlighting both opportunities and risks
        without telling you what to buy or sell.
      </p>

      <h2 className="text-2xl font-semibold mt-4">Our Team</h2>
      <p>
        FinNews247 is run by a small team of markets professionals, researchers
        and content creators. Our contributors have experience across both
        traditional and digital finance, and our editors focus on turning complex
        topics into clear, easy‑to‑understand articles. We operate independently
        and are not owned or controlled by any exchange or token issuer, which
        allows us to remain unbiased in our coverage. Where appropriate, we
        collaborate with external subject‑matter experts to improve the accuracy
        and depth of our guides and reviews.
      </p>

      <h2 className="text-2xl font-semibold mt-4">Our Values</h2>
      <p>
        Transparency, integrity and education are at the heart of everything we
        do. We strive to publish information that is factual, well‑sourced and
        clearly labeled as news, analysis or opinion. We also emphasise{" "}
        <strong>risk awareness</strong>, helping newcomers and experienced
        readers alike understand the downsides and limitations of crypto
        products — not just the upside narratives. Whether you are looking for a
        plain‑English explainer on a new ETF, a guide to opening your first
        exchange account safely, or a deep dive on DeFi infrastructure, our goal
        is to be a trusted, brand‑safe companion on your learning journey.
      </p>

      <h2 className="text-2xl font-semibold mt-4">Brand‑Safety & Editorial Approach</h2>
      <p>
        FinNews247 is a crypto niche site, but we are deliberate about how we
        cover the space. We <strong>do not</strong> publish trading signals,
        entry/exit levels, price targets, or guaranteed‑return strategies. We{" "}
        <strong>do not</strong> encourage short‑term speculation, excessive
        leverage or gambling‑like behaviour. Instead, we focus on education,
        research and neutral analysis that can sit comfortably alongside
        mainstream brands and advertising partners.
      </p>

      <h2 className="text-2xl font-semibold mt-4">Disclaimer</h2>
      <p>
        FinNews247 provides content for educational and informational purposes
        only. We are not financial advisors and we do not offer personalised
        investment, trading, legal or tax advice. Nothing on this site should be
        interpreted as a recommendation to buy, sell or hold any asset, or to
        use any particular platform or service. Always conduct your own
        due diligence and consult a qualified professional before making
        financial decisions. Crypto markets are volatile and involve a high risk
        of loss; you should never invest more than you can afford to lose.
      </p>
    </div>
  );
}
