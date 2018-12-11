/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const {
  MarkdownBlock,
  Container,
  GridBlock,
} = require('../../core/CompLibrary.js');

const siteConfig = require(`${process.cwd()}/siteConfig.js`);

function imgUrl(img) {
  return `${siteConfig.baseUrl}img/${img}`;
}

function docUrl(doc, language) {
  return `${siteConfig.baseUrl}docs/${language ? `${language}/` : ''}${doc}`;
}

function pageUrl(page, language) {
  return siteConfig.baseUrl + (language ? `${language}/` : '') + page;
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

// const Logo = props => (
//   <div className="projectLogo">
//     <img src={props.img_src} alt="Project Logo" />
//   </div>
// );

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
        {/* <Logo img_src={imgUrl('docusaurus.svg')} /> */}
        <div className="inner">
          <ProjectTitle />
        </div>
      </SplashContainer>
    );
  }
}

const Block = props => (
  <Container
    padding={['bottom', 'top']}
    id={props.id}
    background={props.background}
  >
    <GridBlock align="center" contents={props.children} layout={props.layout} />
  </Container>
);

const Features = () => (
  <Block layout="fourColumn">
    {[
      {
        content:
          'Built on top of `react-test-renderer`, letting you always be up to date with latest React features',
        // image: imgUrl('docusaurus.svg'),
        imageAlign: 'top',
        title: 'Lightweight',
      },
      {
        content:
          'Prevents you from testing implementation details because we stand this is a very bad practice',
        // image: imgUrl('docusaurus.svg'),
        imageAlign: 'top',
        title: 'Opinionated',
      },
    ]}
  </Block>
);

const FeatureCallout = () => (
  <div
    className="productShowcaseSection paddingBottom"
    style={{ textAlign: 'center' }}
  >
    <h2>Feature Callout</h2>
    <MarkdownBlock>These are features of this project</MarkdownBlock>
  </div>
);

class Index extends React.Component {
  render() {
    const language = this.props.language || '';

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <Features />
          {/* <FeatureCallout /> */}
          {/* <LearnHow /> */}
        </div>
      </div>
    );
  }
}

module.exports = Index;
