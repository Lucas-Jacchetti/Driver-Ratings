import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy-policy-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gray-900 text-gray-200 px-4 py-12">
      <div class="max-w-3xl mx-auto">
        <a routerLink="/" class="text-sm text-red-400 hover:text-red-300">&larr; Back</a>

        <h1 class="text-3xl font-bold text-white mt-4 mb-2">Privacy Policy</h1>
        <p class="text-sm text-gray-400 mb-10">Last updated: September 21, 2026</p>

        <div class="space-y-8 leading-relaxed">
          <section>
            <h2 class="text-xl font-semibold text-white mb-2">1. Who we are</h2>
            <p>
              Driver Ratings is a site for rating Formula 1 drivers after each race, where users
              can score drivers, follow season statistics, and join communities. This policy
              explains what data we collect, how we use it, and what rights you have over it.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-2">2. What data we collect</h2>
            <p class="mb-2">We only collect what is necessary for the site to work:</p>
            <ul class="list-disc list-inside space-y-1">
              <li>
                <strong class="text-white">Google sign-in data:</strong> when you sign in with your
                Google account, we receive your name, email address, and a unique identifier for
                your Google account. We never receive your Google password, nor any other data
                from your account (emails, files, contacts, etc.).
              </li>
              <li>
                <strong class="text-white">Usage data:</strong> the ratings you give to drivers, the
                communities you create or join, and the date your account was created.
              </li>
              <li>
                <strong class="text-white">Authentication cookies:</strong> we use a cookie to keep
                you signed in between visits, and a token to protect against CSRF attacks. These
                cookies are strictly necessary for login to work and are not used for tracking or
                advertising.
              </li>
            </ul>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-2">3. How we use your data</h2>
            <ul class="list-disc list-inside space-y-1">
              <li>To identify you and keep your session active on the site.</li>
              <li>To associate the ratings you submit with your account.</li>
              <li>To calculate average ratings, both globally and within the communities you belong to.</li>
              <li>To display your name to other members of a community you have joined.</li>
            </ul>
            <p class="mt-2">We do not use your data for advertising, and we do not sell it to third parties.</p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-2">4. Who we share data with</h2>
            <p class="mb-2">We do not share your personal data with third parties for commercial purposes. We rely on the following services to operate the site:</p>
            <ul class="list-disc list-inside space-y-1">
              <li><strong class="text-white">Google:</strong> for authentication (Sign in with Google).</li>
              <li><strong class="text-white">Neon (database) and Amazon Web Services (AWS):</strong> to store data and host the site. These providers have technical access to the data stored on their servers, but do not use it for their own purposes.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-2">5. How long we keep your data</h2>
            <p>
              We keep your data for as long as your account exists. If you request account
              deletion, we remove your personal data (name and email) within a reasonable time
              frame, and may retain anonymized rating records for statistical purposes.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-2">6. Your rights</h2>
            <p class="mb-2">You may, at any time:</p>
            <ul class="list-disc list-inside space-y-1">
              <li>Request a copy of the data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your account and associated data.</li>
              <li>Revoke Driver Ratings' access to your Google account at any time, directly from your Google Account settings.</li>
            </ul>
            <p class="mt-2">To exercise any of these rights, contact us using the email address below.</p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-2">7. Security</h2>
            <p>
              We take reasonable technical measures to protect your data, including encrypted
              (HTTPS) connections between your browser and our servers, and secure
              token-based authentication. No system is completely immune to failure, but we are
              committed to acting quickly if a security incident is identified.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-2">8. Changes to this policy</h2>
            <p>
              We may update this policy from time to time. The date at the top of this page
              reflects the most recent version. Significant changes will be communicated to
              registered users.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-2">9. Contact</h2>
            <p>
              Questions about this policy or your data can be sent to:
              <a href="mailto:lucas.jacchetti&#64;gmail.com" class="text-red-400 hover:text-red-300">lucas.jacchetti&#64;gmail.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  `,
})
export class PrivacyPolicyPageComponent {}