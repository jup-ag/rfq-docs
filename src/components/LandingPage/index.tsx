import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

export default function LandingPage(): ReactNode {
    return (
        <div className={styles.landing}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container">
                    <div className={styles.heroContent}>
                        <div className={styles.badge}>
                            ⚡ Powered by Jupiter Exchange
                        </div>
                        <Heading as="h1" className={styles.title}>
                            Build Efficient Liquidity with JupiterZ
                        </Heading>
                        <p className={styles.subtitle}>
                            Integrate your market making system with Jupiter's Request for Quote module.
                            Provide competitive quotes with 10x lower computational costs and optimized gas efficiency.
                        </p>
                        <div className={styles.buttons}>
                            <a
                                className={styles.primaryButton}
                                href="/docs/intro">
                                📚 Get Started
                            </a>
                            <a
                                className={styles.secondaryButton}
                                href="https://github.com/jup-ag/rfq-webhook-toolkit">
                                💻 View on GitHub
                            </a>
                        </div>

                        {/* Stats Section */}
                        <div className={styles.stats}>
                            <div className={styles.stat}>
                                <div className={styles.statNumber}>10x</div>
                                <div className={styles.statLabel}>Lower Costs</div>
                            </div>
                            <div className={styles.stat}>
                                <div className={styles.statNumber}>99%</div>
                                <div className={styles.statLabel}>Uptime</div>
                            </div>
                            <div className={styles.stat}>
                                <div className={styles.statNumber}>50ms</div>
                                <div className={styles.statLabel}>Avg Response</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className={styles.features}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <Heading as="h2" className={styles.sectionTitle}>
                            Why Choose Jupiter RFQ?
                        </Heading>
                        <p className={styles.sectionSubtitle}>
                            Built for professional market makers who demand performance, reliability, and efficiency
                        </p>
                    </div>

                    <div className={styles.featuresGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>⚡</div>
                            <h3 className={styles.featureTitle}>Lightning Fast</h3>
                            <p className={styles.featureDescription}>
                                Ultra-low latency quote responses with average processing times under 50ms.
                                Built for high-frequency trading environments.
                            </p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>�</div>
                            <h3 className={styles.featureTitle}>Cost Efficient</h3>
                            <p className={styles.featureDescription}>
                                Reduce computational costs by 10x compared to traditional AMM interactions.
                                Optimize gas usage with batch processing.
                            </p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🔒</div>
                            <h3 className={styles.featureTitle}>Secure & Reliable</h3>
                            <p className={styles.featureDescription}>
                                Enterprise-grade security with 99.9% uptime SLA. Robust error handling
                                and automatic failover mechanisms.
                            </p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🔧</div>
                            <h3 className={styles.featureTitle}>Easy Integration</h3>
                            <p className={styles.featureDescription}>
                                Simple webhook-based integration with comprehensive documentation.
                                Get up and running in under 30 minutes.
                            </p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>📊</div>
                            <h3 className={styles.featureTitle}>Real-time Analytics</h3>
                            <p className={styles.featureDescription}>
                                Monitor performance with detailed metrics and insights.
                                Track quote success rates and optimize strategies.
                            </p>
                            <div className={styles.featureLink}>
                                <a
                                    href="https://dune.com/raccoons/jupiterz"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.analyticsLink}>
                                    📈 View Live Dashboard
                                </a>
                            </div>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🌍</div>
                            <h3 className={styles.featureTitle}>Global Scale</h3>
                            <p className={styles.featureDescription}>
                                Support for multiple tokens and trading pairs across Solana.
                                Scale to handle millions of quotes per day.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className={styles.cta}>
                <div className="container">
                    <div className={styles.ctaContent}>
                        <Heading as="h2" className={styles.ctaTitle}>
                            Ready to Get Started?
                        </Heading>
                        <p className={styles.ctaSubtitle}>
                            Join the ecosystem of professional market makers providing liquidity on Jupiter
                        </p>
                        <div className={styles.buttons}>
                            <a
                                className={styles.primaryButton}
                                href="/docs/intro">
                                🚀 Start Building
                            </a>
                            <a
                                className={styles.secondaryButton}
                                href="/docs/api/overview">
                                📖 API Reference
                            </a>
                        </div>
                        <div className={styles.ctaNote}>
                            Need help getting started? Join our{' '}
                            <a href="https://discord.gg/jup" target="_blank" rel="noopener noreferrer">
                                Discord community
                            </a>{' '}
                            for support and discussions.
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
