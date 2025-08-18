import type { ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import LandingPage from '@site/src/components/LandingPage';

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Professional Market Maker Integration`}
      description="Integrate your market making system with Jupiter's Request for Quote module. Provide competitive quotes with 10x lower computational costs and optimized gas efficiency."
      noFooter={false}
      wrapperClassName="jupiter-home-wrapper">
      <main>
        <LandingPage />
      </main>
    </Layout>
  );
}
