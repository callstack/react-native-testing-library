/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import classnames from "classnames";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import withBaseUrl from "@docusaurus/withBaseUrl";
import styles from "./styles.module.css";

const logoMain = [
    {
        imageLogo: "img/owl.png"
    }
];

const features = [
    {
        title: <>Maintainable</>,
        imageUrl: "img/tools.png",
        description: <>Write maintainable tests for your React Native apps</>
    },
    {
        title: <>Reliable</>,
        imageUrl: "img/hit.png",
        description: (
            <>Promotes testing public APIs and avoiding implementation details</>
        )
    },
    {
        title: <>Community Driven</>,
        imageUrl: "img/locomotive.png",
        description: (
            <>Supported by React Native community and its core contributors</>
        )
    }
];

function Home() {
    const context = useDocusaurusContext();
    const { siteConfig = {} } = context;
    return (
        <Layout
            title={`${siteConfig.title}`}
            description="Description will go into a meta tag in <head />"
        >
            <header className={classnames(styles.heroBanner)}>
                <div className="container">
                    {logoMain.map(({ imageLogo }, id) => (
                        <div key={id} className={classnames("col col--4", styles.feature)}>
                            {imageLogo && (
                                <div className="text--center">
                                    <img
                                        className={styles.featureImage}
                                        src={withBaseUrl(imageLogo)}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                    <h1 className="hero__title">{siteConfig.title}</h1>
                    <p className="hero__subtitle">{siteConfig.tagline}</p>
                    <div className={styles.buttons}>
                        <Link
                            className={classnames(
                                "button button--outline button--secondary button--lg",
                                styles.getStarted
                            )}
                            to={withBaseUrl("docs/getting-started")}
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>
            <main>
                {features && features.length && (
                    <section className={styles.features}>
                        <div className="container">
                            <div className="row">
                                {features.map(({ imageUrl, title, description }, idx) => (
                                    <div
                                        key={idx}
                                        className={classnames("col col--4", styles.feature)}
                                    >
                                        {imageUrl && (
                                            <div className="text--center">
                                                <img
                                                    className={styles.featureImage}
                                                    src={withBaseUrl(imageUrl)}
                                                    alt={title}
                                                />
                                            </div>
                                        )}
                                        <h3 className="text--center">{title}</h3>
                                        <p className="text--center">{description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </Layout>
    );
}

export default Home;

