import { NextSeo } from "next-seo";

/**
 * About page provides a comprehensive overview of FinNews247.  We explain
 * our mission as a niche publication focused on crypto trading signals
 * and market coverage, introduce the team behind the content, and
 * outline the values that guide our reporting.  A disclaimer reminds
 * readers that nothing on the site constitutes financial advice.
 */
export default function About() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <NextSeo
        title="About FinNews247 | Crypto Trading Signals & Market Insights"
        description="Learn about FinNews247 – a niche platform delivering accurate crypto trading signals, market analysis and educational resources. Read about our mission, team and values."
        openGraph={{
          title: "About FinNews247 | Crypto Trading Signals & Market Insights",
          description:
            "FinNews247 is a niche publication dedicated to crypto trading signals and market news. Discover our mission, team and guiding principles.",
          url: "https://finnews247.com/about",
        }}
        additionalMetaTags={[{ name: "keywords", content: "about finnews247, crypto trading signals, fintech news team, mission" }]}
      />
      <h1 className="text-3xl font-bold">About FinNews247</h1>
      <p>
        <strong>FinNews247</strong> is a specialist publication committed to
        providing high‑quality information on cryptocurrencies, blockchain
        technology and the broader financial markets. Our primary focus is on
        delivering accurate, timely and actionable <em>crypto trading
        signals</em> – including entry points, targets and stop‑loss levels –
        to help traders navigate the fast‑moving digital asset landscape. In
        addition to signals, we publish market analyses, educational guides,
        exchange reviews and altcoin research to empower investors of all
        experience levels.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Our Mission</h2>
      <p>
        Our mission is to demystify the world of crypto and deliver
        institutional‑grade insights to everyday traders. We believe that
        everyone should have access to clear and unbiased information when
        making financial decisions. To achieve this, we combine technical
        analysis, fundamental research and market sentiment tools to produce
        trading signals and explain the rationale behind them. By pairing
        signals with broader market coverage, we provide the context readers
        need to understand not just <em>what</em> to trade, but <em>why</em>.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Our Team</h2>
      <p>
        FinNews247 is run by a small team of seasoned traders, financial
        analysts and content creators. Our analysts have years of experience
        trading in both traditional and digital markets, and our writers are
        passionate about breaking down complex topics into clear,
        easy‑to‑understand articles. We operate independently and are not
        affiliated with any exchange or token issuer, which allows us to
        remain unbiased in our coverage. We also collaborate with external
        subject matter experts to ensure the accuracy of our guides and
        reviews.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Our Values</h2>
      <p>
        Transparency, integrity and education are at the heart of everything
        we do. We strive to publish information that is factual and
        thoroughly researched, and we clearly disclose any potential
        conflicts of interest. We also prioritise educational content,
        helping newcomers understand the risks and opportunities inherent in
        crypto markets. Whether you are looking for the latest trading
        signal or a deep dive on a new DeFi protocol, our goal is to be
        your trusted companion in the journey toward financial literacy.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Disclaimer</h2>
      <p>
        FinNews247 provides information for educational and informational
        purposes only. We are not financial advisors and we do not offer
        personalised investment advice. The signals and analyses published
        on this site are based on our own research and should not be
        considered investment recommendations. Always conduct your own
        due diligence and consult a qualified professional before making
        investment decisions. Crypto markets are volatile and investing
        carries inherent risks; never invest more than you can afford to
        lose.
      </p>
    </div>
  );
}