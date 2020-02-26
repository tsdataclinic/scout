import React from 'react';
import './AboutPage.scss';

export default function AboutPage() {
    return (
        <div className="about-page">
            <section>
                <h1>Scout</h1>
                <section>
                    <h2>What is Scout?</h2>
                    <p>
                        Scout is a tool to make it easier to navigate Open Data
                        Portals and find groups of related datasets. It sits on
                        top of Socrata Open Data portals and provides tools that
                        augment those data portals and make more obscure
                        datasets more descoverable
                    </p>
                </section>
                <section>
                    <h2>What cities does Scout support?</h2>
                    <p>
                        Scout currently only works with the New York City open
                        data portal, however we are planning to release versions
                        for other cities in the near future. In addition we are
                        planning on making suggestions for datasets from other
                        citie.
                    </p>
                </section>

                <section>
                    <h2>
                        How do the thematically similar recomendations work?
                    </h2>
                    <p>
                        Scout tries to surface datasets that have a similar
                        theme to the one you are currently looking at. It does
                        this using a technique called Doc2Vec which builds a
                        mapping of each of the dataset names and descriptions
                        and uses these mappings to find documents that have a
                        similar meaning.
                    </p>
                </section>
                <section>
                    <h2>How can I contribute to Scout?</h2>
                    <p>
                        Scout is a tool to make it easier to navigate Open Data
                        Portals and find groups of related datasets. It sits on
                        top of Socrata Open Data portals and provides tools that
                        augment those data portals and make more obscure
                        datasets more descoverable
                    </p>
                </section>
            </section>

            <section>
                <h1>Data Clinic</h1>
                <section>
                    <h2>What is the Data Clinic?</h2>
                    <p>
                        We bring Two Sigma’s people, data science skills, and
                        technological know-how to help our partners to use data
                        and tech more effectively.
                    </p>

                    <p>
                        We share our scientific process and source the right
                        talent from within Two Sigma to address your unique
                        challenges.
                    </p>

                    <p>
                        We can help optimize and automate daily operations,
                        translate data into insights, or demonstrate potential
                        for even greater change in the service of your
                        community.
                    </p>
                </section>
            </section>
            <section>
                <h1>Two Sigma</h1>
                <section>
                    <h2>What is Two Sigma?</h2>
                    <p>
                        We’re not your typical investment manager. We follow
                        principles of technology and innovation as much as
                        principles of investment management. Fields like machine
                        learning and distributed computing guide us. Since 2001,
                        we’ve searched for ways that these kinds of technologies
                        can make us better at what we do. We never stop
                        researching and developing.
                    </p>
                    <p>
                        In the process, we work to help real people. Through our
                        investors, we support the retirements of millions around
                        the world. And we help fund breakthrough research,
                        education and a wide range of charities and foundations.
                    </p>
                </section>
            </section>
        </div>
    );
}
