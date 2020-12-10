import * as React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from '../css/index.module.css';

export default function Feature(props) {
  const imgUrl = useBaseUrl(props.imgUrl);
  return (
    <div className={classnames('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img
            className={styles['feature-image']}
            src={imgUrl}
            alt={props.title}
          />
        </div>
      )}

      <h3 className={styles['feature-title']}>{props.title}</h3>
      <p className={styles['feature-description']}>{props.description}</p>
    </div>
  );
}

Feature.propTypes = {
  imgUrl: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
