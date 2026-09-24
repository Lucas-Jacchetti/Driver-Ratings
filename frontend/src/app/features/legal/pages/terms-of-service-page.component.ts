import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms-of-service-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gray-900 text-gray-200 px-4 py-12">
      <div class="max-w-3xl mx-auto">
        <a routerLink="/" class="text-sm text-red-400 hover:text-red-300">&larr; Back</a>

        <h1 class="text-3xl font-bold text-white mt-4 mb-2">Terms of Service</h1>
        <p class="text-sm text-gray-400 mb-10">Last updated: September 21, 2026</p>

        <div class="space-y-8 leading-relaxed">
          <section>
            <h2 class="text-xl font-semibold text-white mb-2">1. Acceptance of these terms</h2>
            <p>
              By creating an account or using Driver Ratings, you agree to these Terms of Service
              and to our <a routerLink="/privacy" class="text-red-400 hover:text-red-300">Privacy Policy</a>.
              If you do not agree with any part of these terms, please do not use the site.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-2">2. What Driver Ratings is</h2>
            <p>
              Driver Ratings is an independent, unofficial, fan-made site for Formula 1 fans to
              rate driver performance after each race. The site has no affiliation, sponsorship,
              or official connection with Formula 1, the FIA, any team, driver, or official body
              of the sport. Driver names, numbers, and race results used on the site are publicly
              available information used solely for informational and entertainment purposes.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-2">3. Creating an account</h2>
            <p>
              Access to the site is provided exclusively through Google sign-in. You are
              responsible for maintaining control of your Google account and for any activity
              carried out through it on Driver Ratings.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-2">4. Expected conduct</h2>
            <p class="mb-2">By using the site, you agree not to:</p>
            <ul class="list-disc list-inside space-y-1">
              <li>Create communities or use names containing offensive, discriminatory, or unlawful content.</li>
              <li>Attempt to manipulate ratings fraudulently (e.g., using multiple accounts to inflate scores).</li>
              <li>Attempt to access administrative areas or other users' data without authorization.</li>
              <li>Use the site for any unlawful purpose or in a way that infringes on the rights of others.</li>
            </ul>
            <p class="mt-2">
              We reserve the right to suspend or delete accounts that violate these conditions.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-2">5. Communities</h2>
            <p>
              Users may create public or private communities. The creator of a private community
              is responsible for controlling who they share the access code with. We are not
              responsible for access codes that a user chooses to share publicly.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-2">6. User-submitted content</h2>
            <p>
              The ratings and reviews you submit are your responsibility. By submitting them, you
              grant us permission to display them, whether aggregated or individually, within the
              site itself (for example, in rankings and statistics).
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-2">7. Service availability</h2>
            <p>
              Driver Ratings is provided "as is", with no guarantee of continuous availability.
              This is a personal/educational project, and the service may be temporarily
              unavailable for maintenance, or discontinued altogether, without a mandatory advance
              notice. We will make reasonable efforts to give advance notice in case of
              discontinuation.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-2">8. Limitation of liability</h2>
            <p>
              The site is provided free of charge and on a non-commercial basis. We are not
              liable for any damages arising from the use or inability to use the site, including
              data loss or service interruptions.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-2">9. Account termination</h2>
            <p>
              You may request the deletion of your account and your data at any time by
              contacting us at the email address below. We may also terminate accounts that
              violate these terms.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-2">10. Changes to these terms</h2>
            <p>
              We may update these terms from time to time. The date at the top of this page
              reflects the most recent version. Continued use of the site after an update
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-white mb-2">11. Contact</h2>
            <p>
              Questions about these terms can be sent to:
              <a href="mailto:lucas.jacchetti&#64;gmail.com" class="text-red-400 hover:text-red-300">lucas.jacchetti&#64;gmail.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  `,
})
export class TermsOfServicePageComponent {}