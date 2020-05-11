import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from '../css/index.module.css';
import Feature from '../components/Feature';

const docUrl = (baseUrl, doc, lang) => {
  return `${baseUrl}docs/${lang ? `${lang}/` : ''}${doc}`;
};

export default function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  const renderFeatures = () => {
    const features = [
      {
        title: 'Maintainable',
        description: 'Write maintainable tests for your React Native apps',
        imgUrl: 'img/tools.png',
      },
      {
        title: 'Reliable',
        description:
          'Promotes testing public APIs and avoiding implementation details',
        imgUrl: 'img/hit.png',
      },
      {
        title: 'Community Driven',
        description:
          'Supported by React Native community and its core contributors',
        imgUrl: 'img/locomotive.png',
      },
    ];

    return features.map((feature, idx) => (
      <Feature
        key={idx}
        title={feature.title}
        description={feature.description}
        imgUrl={feature.imgUrl}
      />
    ));
  };

  return (
    <Layout title={`${siteConfig.title}`} description={siteConfig.tagline}>
      <main className="home-container">
        <div className={classnames(styles.container__inner)}>
          <img
            src={`${siteConfig.baseUrl}img/owl.png`}
            className={styles.logo}
          />
          <h1 className={styles.title}>{siteConfig.title}</h1>
          <p className={styles.subtitle}>{siteConfig.tagline}</p>
          <a
            href={docUrl(siteConfig.baseUrl, 'getting-started')}
            target="_self"
            className={styles.button}
          >
            Get Started
          </a>

          <div
            className={classnames('container', styles['features-container'])}
          >
            {renderFeatures()}
          </div>
        </div>
      </main>
    </Layout>
  );
}
