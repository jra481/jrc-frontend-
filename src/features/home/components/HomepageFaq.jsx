import { FAQ_ITEMS } from "../../../config/seo";
import "../styles/HomepageFaq.css";

export default function HomepageFaq() {
    return (
        <section className="homepage-faq" aria-labelledby="homepage-faq-title">
            <div className="homepage-faq-heading">
                <p className="homepage-faq-eyebrow">QUICK ANSWERS</p>
                <h2 id="homepage-faq-title">Automotive parts questions, answered.</h2>
                <p>Clear information for product enquiries, sourcing, and cross-border supply.</p>
            </div>
            <div className="homepage-faq-list">
                {FAQ_ITEMS.map((item) => (
                    <details key={item.question}>
                        <summary>{item.question}</summary>
                        <p>{item.answer}</p>
                    </details>
                ))}
            </div>
        </section>
    );
}
