# Milestone 1 website fixes

## Updated files
- `index.html`: rebuilt homepage copy and structure, removed public placeholders and sarcastic copy, corrected the Google review link, strengthened insurance verification language, added urgent symptom guidance, improved CTAs, and updated metadata/schema.
- `schedule.html`: replaced the disabled placeholder with a working appointment-request form using the existing Formspree endpoint; added privacy restrictions, confirmation language, office hours, and emergency guidance.
- `headache-chiropractor-newnan.html`: replaced the duplicated sciatica page with unique headache-specific content, metadata, canonical URL, FAQ schema, evaluation details, and headache red-flag guidance.
- `services.html`: expanded visit-experience information, added emergency/red-flag guidance, and changed scheduling claims to truthful appointment-request language.
- `about.html`: removed the visible photo-placeholder asset and replaced it with a finished branded doctor profile panel until an approved headshot file is supplied.
- `script.js`: improved mobile navigation accessibility and added GA4 tracking for phone clicks, direction clicks, appointment-request clicks, and form submissions.
- `style.css`: added responsive styles for the appointment form, profile panel, review actions, insurance verification steps, safety notices, and keyboard focus states.
- Remaining HTML pages: standardized the analytics ID, changed “Schedule Online” labels to “Request Appointment,” repaired the Google review URL placeholder, and normalized mobile-menu accessibility attributes.

## Important operational note
The appointment form sends only basic scheduling information through the same Formspree endpoint already used by the contact page. It explicitly prohibits PHI and does not claim HIPAA compliance. The office must confirm every requested date/time by phone or email.

## Still needed later
- Replace the branded doctor profile panel with the approved professional headshot when the final image file is available.
- Add verified review excerpts only after confirming permission and exact wording.
- Complete unique-content expansion for the remaining individual service pages.
- Validate the live deployment with Lighthouse, WAVE, GA4 DebugView, Search Console, and real mobile devices.

## Logo correction pass
- Replaced oversized full advertising artwork in headers and footers with a clean approved horizontal logo.
- Removed white image boxes by creating transparent approved-brand PNG assets.
- Replaced square logo usage with a transparent approved monogram/signature version.
- Standardized logo sizing on desktop, tablet, and mobile.
- Preserved the full approved logo for Open Graph and structured-data images.
