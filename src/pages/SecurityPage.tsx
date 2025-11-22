import React from 'react';
import { Shield, Lock, Eye, Server, FileText, AlertCircle, KeyRound, Database, CheckCircle2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import SEOHead from '../components/seo/SEOHead';

const SecurityPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Security & Compliance | Phaeton AI"
        description="Enterprise-grade security implementation including AES-256-GCM encryption, HIPAA compliance, multi-factor authentication, comprehensive audit logging, and healthcare-grade data protection."
        keywords="security, HIPAA compliance, encryption, data protection, healthcare security, MFA, audit logging, enterprise security"
        url="/security"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Security & Compliance',
            description: 'Enterprise-grade security measures and HIPAA compliance at Phaeton AI',
            url: 'https://phaetonai.ca/security',
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://phaetonai.ca'
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Security & Compliance',
                  item: 'https://phaetonai.ca/security'
                }
              ]
            }
          })}
        </script>
      </Helmet>

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="section-title mb-12">Security & Compliance</h1>

            {/* Compliance & Security Badges */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              {/* HIPAA Badge */}
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 mb-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 rounded-full shadow-lg border-2 border-green-200 flex items-center justify-center group hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <div className="text-center">
                      <Shield className="w-10 h-10 text-green-600 mx-auto mb-0.5" />
                      <span className="text-xs font-bold text-green-700 block leading-tight">HIPAA</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-700">Compliant</span>
              </div>

              {/* AES-256 Badge */}
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 mb-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full shadow-lg border-2 border-blue-200 flex items-center justify-center group hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <div className="text-center">
                      <Lock className="w-10 h-10 text-blue-600 mx-auto mb-0.5" />
                      <span className="text-xs font-bold text-blue-700 block leading-tight">AES-256</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-700">Encrypted</span>
              </div>

              {/* MFA Badge */}
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 mb-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100 rounded-full shadow-lg border-2 border-purple-200 flex items-center justify-center group hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <div className="text-center">
                      <KeyRound className="w-10 h-10 text-purple-600 mx-auto mb-0.5" />
                      <span className="text-xs font-bold text-purple-700 block leading-tight">MFA</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-700">Mandatory</span>
              </div>

              {/* Audit Logging Badge */}
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 mb-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100 rounded-full shadow-lg border-2 border-amber-200 flex items-center justify-center group hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <div className="text-center">
                      <FileText className="w-10 h-10 text-amber-600 mx-auto mb-0.5" />
                      <span className="text-xs font-bold text-amber-700 block leading-tight">Audit</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-700">6-Year Log</span>
              </div>

              {/* RLS Badge */}
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 mb-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-full shadow-lg border-2 border-indigo-200 flex items-center justify-center group hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <div className="text-center">
                      <Database className="w-10 h-10 text-indigo-600 mx-auto mb-0.5" />
                      <span className="text-xs font-bold text-indigo-700 block leading-tight">RLS</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-700">Database</span>
              </div>

              {/* SOC 2 Ready Badge */}
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 mb-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 rounded-full shadow-lg border-2 border-orange-200 flex items-center justify-center group hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <div className="text-center">
                      <CheckCircle2 className="w-10 h-10 text-orange-600 mx-auto mb-0.5" />
                      <span className="text-xs font-bold text-orange-700 block leading-tight">SOC 2</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-bold text-white">?</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-700">In Progress</span>
              </div>
            </div>

            <p className="text-gray-600 mb-8 text-center">Last Updated: November 2025</p>

            {/* Main Content */}
            <div className="prose prose-lg max-w-none">
              {/* Overview Section */}
              <section className="mb-8">
                <div className="flex items-center mb-6">
                  <Shield className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold m-0">Security Overview</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our platform implements enterprise-grade security specifically designed for healthcare environments. We exceed HIPAA compliance requirements with military-grade encryption, mandatory multi-factor authentication, comprehensive audit logging, and zero-trust architecture. Every feature is built with healthcare data protection as the primary concern.
                </p>
              </section>

              {/* Authentication & Access Control */}
              <section className="mb-8">
                <div className="flex items-center mb-6">
                  <KeyRound className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold m-0">Authentication & Access Control</h2>
                </div>

                <h3 className="text-xl font-semibold mt-6 mb-3">Enterprise Authentication</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Azure Active Directory (AAD) integration with MSAL for enterprise SSO</li>
                  <li>Automatic user profile synchronization with Azure AD</li>
                  <li>Support for multi-account management</li>
                  <li>Session creation with secure token rotation</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Multi-Factor Authentication (MFA)</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>MANDATORY MFA for all users accessing Protected Health Information (PHI)</li>
                  <li>Time-based One-Time Password (TOTP) implementation with 6-digit codes</li>
                  <li>160-bit Base32 secret generation for authenticator apps</li>
                  <li>QR code generation for easy authenticator setup</li>
                  <li>Backup codes for account recovery (10 codes per account)</li>
                  <li>MFA challenge tokens with 5-minute expiration</li>
                  <li>Automatic 30-minute account lockout after 3 failed MFA attempts</li>
                  <li>Emergency lockout clearing for administrative recovery</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Session Management</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>15-minute session expiration timeout</li>
                  <li>7-day refresh token validity window</li>
                  <li>IP address and User-Agent tracking for session security</li>
                  <li>Encrypted session storage</li>
                  <li>Automatic session monitoring with timeout callbacks</li>
                  <li>Session invalidation on logout with token cleanup</li>
                  <li>Proactive session timeout warnings before expiration</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Role-Based Access Control (RBAC)</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Four role tiers: Admin, Super User, Healthcare Provider, Staff</li>
                  <li>Permission-based access model with resource/action pairs</li>
                  <li>Fine-grained permission control for all resources</li>
                  <li>Cross-device permission synchronization</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">PHI Access Protection</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>PHI Access Guard component enforces MFA for all PHI access</li>
                  <li>Zero exceptions policy - ALL users must complete MFA verification</li>
                  <li>User-friendly access denial messages</li>
                  <li>Mandatory permission validation before data access</li>
                </ul>
              </section>

              {/* Encryption & Data Protection */}
              <section className="mb-8">
                <div className="flex items-center mb-6">
                  <Lock className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold m-0">Encryption & Data Protection</h2>
                </div>

                <h3 className="text-xl font-semibold mt-6 mb-3">Military-Grade Encryption (AES-256-GCM)</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>AES-256-GCM symmetric encryption standard (NIST 800-53 compliant)</li>
                  <li>PBKDF2 key derivation with 100,000 iterations</li>
                  <li>SHA-256 hashing algorithm for key generation</li>
                  <li>Random 96-bit Initialization Vector (IV) for each encryption</li>
                  <li>128-bit authentication tags (Galois/Counter Mode)</li>
                  <li>HIPAA-compliant encryption implementation throughout</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Field-Level Encryption</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Selective encryption of sensitive healthcare data fields</li>
                  <li>Encrypted data types: Call transcripts, SMS messages, Patient names, Call summaries</li>
                  <li>Object-level encryption/decryption with field targeting</li>
                  <li>Automatic fallback display for decryption failures</li>
                  <li>Backward compatibility with base64 encoding fallback</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Secure Storage & Session Data</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Encrypted localStorage wrapper with automatic expiration</li>
                  <li>Session data encryption with 15-minute auto-expiration</li>
                  <li>PHI data marking and encryption flags for audit compliance</li>
                  <li>Automatic cleanup of expired data every 5 minutes</li>
                  <li>Prefixed key naming for storage isolation</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">API Key & Credential Encryption</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>All API keys encrypted before storage</li>
                  <li>Keys decrypted on-demand for API calls only</li>
                  <li>Support for call and SMS agent credentials</li>
                  <li>Cross-device encrypted key synchronization</li>
                  <li>Secure credential initialization with validation</li>
                </ul>
              </section>

              {/* Database Security */}
              <section className="mb-8">
                <div className="flex items-center mb-6">
                  <Database className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold m-0">Database Security</h2>
                </div>

                <h3 className="text-xl font-semibold mt-6 mb-3">Row-Level Security (RLS)</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>RLS enabled on all user-facing tables (users, settings, profiles, logs, notes)</li>
                  <li>User profile access limited to own profiles only</li>
                  <li>User settings accessible exclusively by owner</li>
                  <li>Audit log insertion restricted to authenticated users, readable by admins only</li>
                  <li>System credentials protected with RLS policies</li>
                  <li>Note access restricted to creator with role-based exceptions</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Secure Database Design</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>UUID primary keys instead of sequential integers (prevents enumeration)</li>
                  <li>Encrypted sensitive fields (API keys stored encrypted)</li>
                  <li>Timestamp tracking on all records for audit trails</li>
                  <li>Foreign key constraints with CASCADE delete for referential integrity</li>
                  <li>Performance-optimized indexes for secure queries</li>
                  <li>Dedicated database isolation for CareXPS (not shared)</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Failed Login Tracking</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Dedicated failed_login_attempts table for security analysis</li>
                  <li>Tracks: Email, IP address, User Agent, Timestamp</li>
                  <li>Indexed for efficient forensic queries</li>
                  <li>Used for security analysis and lockout decisions</li>
                </ul>
              </section>

              {/* Audit Logging & Monitoring */}
              <section className="mb-8">
                <div className="flex items-center mb-6">
                  <FileText className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold m-0">Audit Logging & Monitoring</h2>
                </div>

                <h3 className="text-xl font-semibold mt-6 mb-3">HIPAA-Compliant Audit Trail (§ 164.312(b))</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Comprehensive audit trail for ALL PHI access and modifications</li>
                  <li>6-year minimum data retention capability</li>
                  <li>Unique audit ID (UUID) for every entry</li>
                  <li>High-precision timestamps with timezone tracking</li>
                  <li>Full user identification (ID, name, role)</li>
                  <li>Action classification (CREATE, READ, UPDATE, DELETE, VIEW, etc.)</li>
                  <li>Resource type and ID tracking</li>
                  <li>PHI access indicator flag for compliance reporting</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Network & Session Tracking</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Source IP address logging for all operations</li>
                  <li>User Agent (browser/device) tracking</li>
                  <li>Session ID association with each audit entry</li>
                  <li>Outcome status (SUCCESS, FAILURE, WARNING)</li>
                  <li>Detailed failure reasons for failed operations</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Searchable Audit Reports</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Date range filtering for time-based analysis</li>
                  <li>User-based searches for accountability tracking</li>
                  <li>Action-type filtering (data access, modifications, auth events)</li>
                  <li>Resource type filtering for data-specific searches</li>
                  <li>Outcome filtering to isolate failures and anomalies</li>
                  <li>PHI access filtering for sensitive data tracking</li>
                  <li>Source IP filtering for geographic analysis</li>
                  <li>Pagination support for large result sets</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Component-Level Logging</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Page view logging for user navigation tracking</li>
                  <li>User interaction tracking (button clicks, form submissions)</li>
                  <li>Session heartbeat monitoring every 5 minutes</li>
                  <li>Session start time tracking for duration analysis</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Incident Response & Detection</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Automated incident detection with severity classification</li>
                  <li>Detected incident types: MFA lockouts, login failures, suspicious locations, concurrent sessions, excessive PHI access, unauthorized exports, encryption failures</li>
                  <li>Severity levels: LOW, MEDIUM, HIGH, CRITICAL</li>
                  <li>Status tracking: OPEN, INVESTIGATING, RESPONDED, RESOLVED</li>
                  <li>Evidence collection and preservation for forensics</li>
                </ul>
              </section>

              {/* Input Validation & API Security */}
              <section className="mb-8">
                <div className="flex items-center mb-6">
                  <AlertCircle className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold m-0">Input Validation & API Security</h2>
                </div>

                <h3 className="text-xl font-semibold mt-6 mb-3">Comprehensive Input Validation</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>RFC 5322 compliant email validation</li>
                  <li>International phone number validation with E.164 format support</li>
                  <li>URL validation (http/https protocols only)</li>
                  <li>HTML sanitization and XSS prevention</li>
                  <li>SQL injection prevention with pattern detection</li>
                  <li>Path traversal protection (blocks .., //, \, null bytes)</li>
                  <li>Command injection prevention (shell metacharacter filtering)</li>
                  <li>Username validation (alphanumeric + underscore/hyphen)</li>
                  <li>Safe JSON parsing with error handling</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Rate Limiting</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Token bucket algorithm for smooth rate limiting</li>
                  <li>Per-user rate limiting with unique identifiers</li>
                  <li>Four preset levels:</li>
                </ul>
                <div className="pl-10 space-y-2 text-gray-700 mb-4">
                  <p>• <strong>Strict:</strong> 5 requests per 15 minutes (MFA, password reset)</p>
                  <p>• <strong>Moderate:</strong> 100 requests per minute (API operations)</p>
                  <p>• <strong>Generous:</strong> 300 requests per minute (frequent operations)</p>
                  <p>• <strong>Hourly:</strong> 60 requests per hour (expensive operations)</p>
                </div>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Automatic cleanup of inactive rate limit buckets</li>
                  <li>Violation tracking and monitoring for abuse patterns</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Error Handling & Security</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>User-friendly error messages without sensitive information disclosure</li>
                  <li>Stack trace sanitization to prevent information leakage</li>
                  <li>Secure error context preservation for debugging</li>
                  <li>MSAL error categorization and recovery mechanisms</li>
                  <li>MFA-specific error handling with user guidance</li>
                  <li>Network error detection and graceful fallback</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Content Security Policy (CSP)</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Nonce generation for inline scripts</li>
                  <li>CSP directives for healthcare compliance</li>
                  <li>Clickjacking prevention (frame-ancestors 'none')</li>
                  <li>Plugin blocking (object-src 'none')</li>
                  <li>HTTPS enforcement (upgrade-insecure-requests)</li>
                  <li>Mixed content prevention (block-all-mixed-content)</li>
                  <li>CSP violation reporting and logging</li>
                </ul>
              </section>

              {/* Password & Credential Management */}
              <section className="mb-8">
                <div className="flex items-center mb-6">
                  <KeyRound className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold m-0">Password & Credential Management</h2>
                </div>

                <h3 className="text-xl font-semibold mt-6 mb-3">Strong Password Policy</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Minimum 12 characters (increased from 8 for healthcare compliance)</li>
                  <li>Maximum 128 characters (DoS prevention)</li>
                  <li>Required character types: uppercase, lowercase, numbers, special characters</li>
                  <li>Blocks common weak passwords (password, 123456, qwerty, admin, etc.)</li>
                  <li>Prevents sequential characters (abc, 123)</li>
                  <li>Prevents repeated characters (aaa, 111)</li>
                  <li>Password strength validation (weak/medium/strong ratings)</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Secure Credential Storage</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>All API credentials encrypted before database storage</li>
                  <li>Bulletproof credential initialization with validation</li>
                  <li>Cross-device credential synchronization</li>
                  <li>Refresh tokens encrypted before storage</li>
                  <li>Token rotation on every session refresh</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Account Lockout Protection</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Automated lockout after 3 failed login attempts</li>
                  <li>Automated MFA lockout after 3 failed challenges</li>
                  <li>30-minute lockout period with automatic recovery</li>
                  <li>Lockout persistence across browser sessions</li>
                  <li>Emergency lockout clearing for administrators</li>
                  <li>Formatted time display for user notifications</li>
                </ul>
              </section>

              {/* Secure Logging & Data Handling */}
              <section className="mb-8">
                <div className="flex items-center mb-6">
                  <Eye className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold m-0">Secure Logging & Data Handling</h2>
                </div>

                <h3 className="text-xl font-semibold mt-6 mb-3">HIPAA-Compliant Logging Service</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>PHI filtering in all logs (automatic PII redaction)</li>
                  <li>Filtered patterns: SSN, credit cards, emails, phone numbers, dates, secrets</li>
                  <li>Environment-aware log levels (DEBUG in dev, WARN in production)</li>
                  <li>Component-based logging with context</li>
                  <li>Session tracking without exposing full IDs</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">System Integrity Monitoring</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>System configuration integrity checking</li>
                  <li>Audit log integrity verification</li>
                  <li>Database integrity compromise detection</li>
                  <li>Unauthorized modification detection</li>
                  <li>Baseline deviation monitoring</li>
                  <li>File integrity violation tracking</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Transmission Security</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>HTTPS enforcement on all connections</li>
                  <li>SSL/TLS certificate validation and monitoring</li>
                  <li>Mixed content prevention</li>
                  <li>Insecure request blocking</li>
                  <li>Secure header validation</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Security Monitoring & Context</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Real-time encryption status monitoring</li>
                  <li>Session security tracking (timeout, expiration)</li>
                  <li>HTTPS verification on all connections</li>
                  <li>Web Crypto API availability checks</li>
                  <li>Encryption status updates every 30 seconds</li>
                  <li>Periodic compliance metrics refresh</li>
                </ul>
              </section>

              {/* SOC 2 & Compliance Roadmap */}
              <section className="mb-8">
                <div className="flex items-center mb-6">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold m-0">SOC 2 & Compliance Roadmap</h2>
                </div>

                <h3 className="text-xl font-semibold mt-6 mb-3">SOC 2 Compliance Status</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We are actively working toward SOC 2 Type II compliance. Currently, our platform implements all required security controls and frameworks that form the foundation of SOC 2 compliance.
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-3">Understanding SOC 2 Status</h3>
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-4">
                  <p className="text-gray-700 mb-2"><strong>SOC 2 Ready (Controls Implemented):</strong></p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>All required security controls are fully implemented and operational</li>
                    <li>System is functioning with all SOC 2 Trust Service Criteria in place</li>
                    <li>No formal third-party audit has been conducted yet</li>
                  </ul>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-600 p-4 mb-4">
                  <p className="text-gray-700 mb-2"><strong>SOC 2 Compliant (Audit Completed):</strong></p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Third-party auditor has conducted and completed a SOC 2 Type II audit</li>
                    <li>Requires minimum 6 months of operational history demonstrating consistent control execution</li>
                    <li>Results in a SOC 2 audit report with auditor attestation</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold mt-6 mb-3">Our Roadmap to Full Compliance</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Current:</strong> All security controls implemented and monitoring active</li>
                  <li><strong>Phase 1:</strong> 6-month operational history collection (CC, A1, A2, C1 controls)</li>
                  <li><strong>Phase 2:</strong> Engagement of qualified SOC 2 Type II auditor</li>
                  <li><strong>Phase 3:</strong> Complete audit process and obtain SOC 2 compliance certification</li>
                  <li><strong>Ongoing:</strong> Annual re-audits and continuous control improvements</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Why This Matters</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  SOC 2 compliance demonstrates that our organization has designed and implemented effective security controls to protect customer data and ensure service continuity. We're committed to achieving formal SOC 2 Type II certification to provide you with third-party verified assurance of our security practices.
                </p>
              </section>

              {/* Contact & Support */}
              <section>
                <div className="flex items-center mb-6">
                  <FileText className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold m-0">Questions & Support</h2>
                </div>

                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have questions about our security measures, HIPAA compliance implementation, or need additional information about how we protect your healthcare data, please don't hesitate to contact us.
                </p>

                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-semibold mb-4">Contact Our Security Team</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Security Inquiries:</strong> security@phaetonai.ca</li>
                    <li><strong>General Inquiries:</strong> contactus@phaetonai.com</li>
                    <li><strong>Support Center:</strong> Visit our <a href="/support" className="text-blue-600 hover:text-blue-500 underline">support page</a></li>
                  </ul>
                </div>

                <p className="text-gray-700 leading-relaxed mt-6 text-sm">
                  For detailed information about how we collect, use, and protect your personal data, please review our <a href="/privacy" className="text-blue-600 hover:text-blue-500 underline">Privacy Policy</a> and <a href="/terms" className="text-blue-600 hover:text-blue-500 underline">Terms of Service</a>.
                </p>
              </section>

              {/* Last Updated */}
              <section className="border-t border-gray-200 pt-8 mt-8">
                <p className="text-sm text-gray-600">
                  <strong>Last Updated:</strong> November 2025
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Our security implementation is continuously reviewed, updated, and enhanced to maintain the highest standards of healthcare data protection and HIPAA compliance. We are committed to maintaining the highest levels of security and transparency with our users.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SecurityPage;
