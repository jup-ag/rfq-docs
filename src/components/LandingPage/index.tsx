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
                            🚀 NEW: JupiterZ v2 Now Available
                        </div>
                        <Heading as="h1" className={styles.title}>
                            Build Efficient Liquidity with JupiterZ
                        </Heading>
                        <p className={styles.subtitle}>
                            Next-generation Request for Quote system with gRPC streaming for real-time quotes and low-latency execution.
                            Trusted by 15,000 daily users and 15+ market makers with 100+ supported tokens.
                        </p>
                        <div className={styles.buttons}>
                            <a
                                className={styles.primaryButton}
                                href="/docs/v2/overview">
                                🚀 Explore V2
                            </a>
                            <a
                                className={styles.secondaryButton}
                                href="/docs/intro">
                                📚 V1 Documentation
                            </a>
                        </div>

                        {/* Stats Section */}
                        <div className={styles.stats}>
                            <div className={styles.stat}>
                                <div className={styles.statNumber}>$100M+</div>
                                <div className={styles.statLabel}>Daily Volume</div>
                            </div>
                            <div className={styles.stat}>
                                <div className={styles.statNumber}>30K</div>
                                <div className={styles.statLabel}>Daily Transactions</div>
                            </div>
                            <div className={styles.stat}>
                                <div className={styles.statNumber}>70ms</div>
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
                            What's New in V2?
                        </Heading>
                        <p className={styles.sectionSubtitle}>
                            Next-generation RFQ platform built on gRPC bidirectional streaming for ultra-low latency
                            and real-time quote management. Serving 15,000+ daily users with 15+ active market makers.
                        </p>
                    </div>

                    <div className={styles.featuresGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>⚡</div>
                            <h3 className={styles.featureTitle}>Real-time Streaming</h3>
                            <p className={styles.featureDescription}>
                                Bidirectional gRPC streams enable instant quote updates and swap notifications.
                                Lower latency with persistent connections vs HTTP webhooks.
                            </p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>📊</div>
                            <h3 className={styles.featureTitle}>Multi-level Orderbooks</h3>
                            <p className={styles.featureDescription}>
                                Submit custom bid/ask spreads with multiple price levels.
                                Tailor your pricing strategy with granular control.
                            </p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>👁️</div>
                            <h3 className={styles.featureTitle}>Last Look</h3>
                            <p className={styles.featureDescription}>
                                Review and sign transactions before execution. Full control over
                                which swaps to accept with built-in validation.
                            </p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🔧</div>
                            <h3 className={styles.featureTitle}>Official SDKs</h3>
                            <p className={styles.featureDescription}>
                                Production-ready Rust and Python SDKs with async support.
                                Type-safe APIs and built-in authentication handling.
                            </p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🔒</div>
                            <h3 className={styles.featureTitle}>Enterprise Grade</h3>
                            <p className={styles.featureDescription}>
                                Built-in TLS, JWT authentication, and health monitoring.
                                99.9% uptime SLA with robust error handling.
                            </p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🌍</div>
                            <h3 className={styles.featureTitle}>High Throughput</h3>
                            <p className={styles.featureDescription}>
                                Handle 30,000+ transactions daily with $100M+ in volume.
                                Support for 100+ tokens and trading pairs across Solana.
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
                            Ready to Get Started with V2?
                        </Heading>
                        <p className={styles.ctaSubtitle}>
                            Join the next generation of market makers providing liquidity on Jupiter with gRPC streaming
                        </p>
                        <div className={styles.buttons}>
                            <a
                                className={styles.primaryButton}
                                href="/docs/v2/getting-started">
                                🚀 Start with V2
                            </a>
                            <a
                                className={styles.secondaryButton}
                                href="/docs/v2/grpc-api">
                                📖 V2 API Reference
                            </a>
                        </div>
                        <div className={styles.ctaNote}>
                            Need help getting started? Join our{' '}
                            <a href="https://discord.gg/jup" target="_blank" rel="noopener noreferrer">
                                Discord community
                            </a>{' '}
                            for support. Still using V1?{' '}
                            <a href="/docs/intro">View V1 documentation</a>.
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
