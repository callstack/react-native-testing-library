import * as React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
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
      <main>
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
          <div>
            Like the project? ⚛️{' '}
            <a href="https://callstack.com/careers/?utm_campaign=Senior_RN&utm_source=github&utm_medium=readme">
              Join the team
            </a>{' '}
            who does amazing stuff for clients and drives React Native Open
            Source! 🔥
          </div>
        </div>
      </main>
    </Layout>
  );
}
