// Web3 & Blockchain Literacy Curriculum
import type { ProgramCurriculum } from '../../types';

export const web3Curriculum: ProgramCurriculum = {
    title: 'Web3 & Blockchain Literacy',
    description: 'Digital identity, verifiable credentials, and decentralized systems.',
    sections: [
        {
            id: 'overview',
            title: 'Program Overview',
            icon: '🔗',
            content: [
                { type: 'heading', content: 'Understanding the Decentralized Web' },
                { type: 'paragraph', content: 'Web3 isn\'t just about cryptocurrency. It\'s a fundamental shift in how we manage identity, ownership, and trust online. This program teaches practical Web3 literacy—from securing a wallet to understanding verifiable credentials.' },
                { type: 'heading', content: 'What You\'ll Learn' },
                {
                    type: 'list', content: [
                        'How blockchains work (without the hype)',
                        'Wallet security and digital identity',
                        'NFTs, tokens, and what they\'re actually useful for',
                        'Verifiable credentials and proof of skill'
                    ]
                }
            ]
        },
        {
            id: 'module-1',
            title: 'Module 1: Wallets, Safety, Digital Identity',
            icon: '🔐',
            content: [
                { type: 'heading', content: 'Your Keys, Your Identity' },
                { type: 'paragraph', content: 'In Web3, your wallet is your identity. Losing access means losing everything. This module teaches you to manage digital identity safely.' }
            ],
            subSections: [
                {
                    id: '1-1',
                    title: '1.1 What is a Blockchain?',
                    content: [
                        { type: 'heading', content: 'The Shared Ledger' },
                        { type: 'paragraph', content: 'A blockchain is a shared database that nobody owns but everyone can verify. Imagine a public spreadsheet where every change is permanent, timestamped, and visible to all.' },
                        {
                            type: 'list', content: [
                                'Decentralized: No single point of control',
                                'Immutable: Changes can\'t be erased',
                                'Transparent: Anyone can verify the record',
                                'Trustless: You don\'t need to trust any one party'
                            ]
                        }
                    ]
                },
                {
                    id: '1-2',
                    title: '1.2 Wallet Fundamentals',
                    content: [
                        { type: 'heading', content: 'Public and Private Keys' },
                        { type: 'paragraph', content: 'Your wallet has two parts: a public key (like an email address—safe to share) and a private key (like a password—never share). Understanding this distinction is essential.' },
                        { type: 'heading', content: 'Wallet Security Rules' },
                        {
                            type: 'list', content: [
                                'Never share your seed phrase with anyone',
                                'Never enter your seed phrase online',
                                'Write it down on paper, store it safely',
                                'Use a separate wallet for testing/learning'
                            ]
                        }
                    ]
                },
                {
                    id: '1-3',
                    title: '1.3 Digital Identity Concepts',
                    content: [
                        { type: 'heading', content: 'Self-Sovereign Identity' },
                        { type: 'paragraph', content: 'Today, companies like Google and Facebook own your digital identity. Web3 enables "self-sovereign identity"—you control your data and decide who sees what.' },
                        { type: 'paragraph', content: 'Your wallet address can become a portable identity across applications, carrying your reputation, credentials, and history without a central authority.' }
                    ]
                }
            ]
        },
        {
            id: 'module-2',
            title: 'Module 2: Tokens, NFTs, and SBTs',
            icon: '🎨',
            content: [
                { type: 'heading', content: 'Digital Ownership' },
                { type: 'paragraph', content: 'Tokens represent ownership on a blockchain. This module cuts through the hype to explain what tokens actually are and aren\'t useful for.' }
            ],
            subSections: [
                {
                    id: '2-1',
                    title: '2.1 What Are Tokens?',
                    content: [
                        { type: 'heading', content: 'Fungible vs Non-Fungible' },
                        { type: 'paragraph', content: 'A dollar bill is fungible—any dollar is equal to any other dollar. A painting is non-fungible—each one is unique. Tokens work the same way.' },
                        {
                            type: 'list', content: [
                                'Fungible tokens: Cryptocurrencies, loyalty points',
                                'Non-fungible tokens (NFTs): Art, collectibles, certificates',
                                'Semi-fungible: Game items, tickets'
                            ]
                        }
                    ]
                },
                {
                    id: '2-2',
                    title: '2.2 NFTs Beyond Art',
                    content: [
                        { type: 'heading', content: 'Practical Applications' },
                        { type: 'paragraph', content: 'NFTs got famous for expensive art, but the technology is useful for much more: event tickets, membership cards, certificates, licenses, and proof of ownership.' },
                        { type: 'heading', content: 'Real-World NFT Uses' },
                        {
                            type: 'list', content: [
                                'Concert tickets that can\'t be counterfeited',
                                'Software licenses tied to your identity',
                                'Academic credentials that can\'t be faked',
                                'Property deeds and ownership records'
                            ]
                        }
                    ]
                },
                {
                    id: '2-3',
                    title: '2.3 Soulbound Tokens (SBTs)',
                    content: [
                        { type: 'heading', content: 'Non-Transferable Credentials' },
                        { type: 'paragraph', content: 'Some things shouldn\'t be sellable—like your degree or professional license. "Soulbound Tokens" are NFTs that can\'t be transferred, perfect for credentials and reputation.' },
                        { type: 'paragraph', content: 'Your ZEN certification could be an SBT—permanently attached to your wallet address as proof of your achievement.' }
                    ]
                }
            ]
        },
        {
            id: 'module-3',
            title: 'Module 3: Verifiable Credentials',
            icon: '✅',
            content: [
                { type: 'heading', content: 'Proof in the Digital Age' },
                { type: 'paragraph', content: 'How do you prove you graduated from a school? Today, you rely on paper diplomas and phone calls. Verifiable credentials make proof instant and unforgeable.' }
            ],
            subSections: [
                {
                    id: '3-1',
                    title: '3.1 The Problem with Traditional Credentials',
                    content: [
                        { type: 'heading', content: 'Trust, But Verify' },
                        { type: 'paragraph', content: 'Fake degrees are a massive problem. Employers can\'t easily verify claims. Background checks are slow and expensive. The current system is broken.' },
                        {
                            type: 'list', content: [
                                '30% of resumes contain some falsification',
                                'Background checks take days or weeks',
                                'International credentials are nearly impossible to verify',
                                'Diploma mills issue fake degrees'
                            ]
                        }
                    ]
                },
                {
                    id: '3-2',
                    title: '3.2 How Verifiable Credentials Work',
                    content: [
                        { type: 'heading', content: 'Cryptographic Proof' },
                        { type: 'paragraph', content: 'A verifiable credential is digitally signed by the issuer (like a university). Anyone can instantly verify the signature is genuine without contacting the issuer.' },
                        { type: 'heading', content: 'The Flow' },
                        {
                            type: 'list', content: [
                                '1. Issuer creates and signs the credential',
                                '2. Holder stores it in their wallet',
                                '3. Verifier checks the signature instantly',
                                '4. No need to contact the issuer'
                            ]
                        }
                    ]
                },
                {
                    id: '3-3',
                    title: '3.3 Proof of Skill',
                    content: [
                        { type: 'heading', content: 'Skills, Not Just Degrees' },
                        { type: 'paragraph', content: 'Verifiable credentials can prove specific skills, not just broad degrees. Completed a Python course? There\'s a credential. Passed a safety certification? There\'s a credential.' },
                        { type: 'paragraph', content: 'This enables micro-credentials and stackable certifications that better reflect actual abilities.' }
                    ]
                }
            ]
        },
        {
            id: 'module-4',
            title: 'Module 4: Real-World Applications',
            icon: '🌍',
            content: [
                { type: 'heading', content: 'Web3 in Practice' },
                { type: 'paragraph', content: 'Theory matters, but application matters more. This module explores how Web3 technologies are being used in education, employment, and trust networks.' }
            ],
            subSections: [
                {
                    id: '4-1',
                    title: '4.1 Education and Credentialing',
                    content: [
                        { type: 'heading', content: 'The Future of Academic Records' },
                        { type: 'paragraph', content: 'Universities are starting to issue blockchain-based diplomas. Students maintain a portable record of all their learning—formal and informal—in one wallet.' },
                        {
                            type: 'list', content: [
                                'MIT issues blockchain diplomas',
                                'European Union exploring digital credential standards',
                                'Skills-based hiring becomes verifiable',
                                'Lifelong learning records'
                            ]
                        }
                    ]
                },
                {
                    id: '4-2',
                    title: '4.2 Employment and Hiring',
                    content: [
                        { type: 'heading', content: 'Trust in the Job Market' },
                        { type: 'paragraph', content: 'Imagine applying for a job and having all your credentials instantly verified. No waiting for background checks. No fraudulent claims. This is what verifiable credentials enable.' }
                    ]
                },
                {
                    id: '4-3',
                    title: '4.3 Building Trust Networks',
                    content: [
                        { type: 'heading', content: 'Reputation That Travels' },
                        { type: 'paragraph', content: 'In the current internet, your reputation is trapped in platforms. Your Uber rating doesn\'t transfer to Airbnb. Web3 enables portable reputation systems.' },
                        { type: 'heading', content: 'Trust Applications' },
                        {
                            type: 'list', content: [
                                'Cross-platform reputation scores',
                                'Verified reviews that can\'t be faked',
                                'Professional endorsements on-chain',
                                'Community membership and governance'
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};
