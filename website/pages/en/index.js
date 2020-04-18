/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const CompLibrary = require('../../core/CompLibrary.js');

const siteConfig = require(`${process.cwd()}/siteConfig.js`);

function docUrl(doc, language) {
  return `${siteConfig.baseUrl}docs/${language ? `${language}/` : ''}${doc}`;
}

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: '_self',
};

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
);

const ProjectTitle = () => (
  <React.Fragment>
    <h2 className="projectTitle">
      {siteConfig.title}
      <small>{siteConfig.tagline}</small>
    </h2>
    <Button href={docUrl('getting-started')}>Get Started</Button>
  </React.Fragment>
);

class HomeSplash extends React.Component {
  render() {
    return (
      <SplashContainer>
        <div className="inner">
          <img src={`${siteConfig.baseUrl}img/owl.png`} />
          <ProjectTitle />
        </div>
        <CompLibrary.Container padding={['top', 'bottom']}>
          <CompLibrary.GridBlock
            align="center"
            layout="threeColumn"
            contents={[
              {
                title: 'Maintainable',
                content: 'Write maintainable tests for your React Native apps',
                image: `${siteConfig.baseUrl}img/tools.png`,
                imageAlign: 'top',
              },
              {
                title: 'Reliable',
                content:
                  'Promotes testing public APIs and avoiding implementation details',
                image: `${siteConfig.baseUrl}img/hit.png`,
                imageAlign: 'top',
              },
              {
                title: 'Community Driven',
                content:
                  'Supported by React Native community and its core contributors',
                image: `${siteConfig.baseUrl}img/locomotive.png`,
                imageAlign: 'top',
              },
            ]}
          />
        </CompLibrary.Container>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const language = this.props.language || '';

    return <HomeSplash language={language} />;
  }
}

module.exports = Index;
