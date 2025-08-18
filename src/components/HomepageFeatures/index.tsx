import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy Integration',
    Svg: require('@site/static/img/jupiter-ag-jup-logo.svg').default,
    description: (
      <>
        Simple webhook-based API with three endpoints. Get started quickly with
        our comprehensive documentation and sample implementations.
      </>
    ),
  },
  {
    title: 'High Performance',
    Svg: require('@site/static/img/jupiter-ag-jup-logo.svg').default,
    description: (
      <>
        RFQ fills are 10x less computationally intensive than AMM swaps.
        Provide competitive quotes with 250ms response time requirements.
      </>
    ),
  },
  {
    title: 'Battle Tested',
    Svg: require('@site/static/img/jupiter-ag-jup-logo.svg').default,
    description: (
      <>
        Audited by Offside Labs and used by Jupiter's ecosystem of market makers.
        Proven order engine program deployed on Solana mainnet.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
