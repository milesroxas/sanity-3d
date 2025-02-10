# Schema UI - Next.js Sanity Starter Template

This starter is a part of [Schema UI](https://schemaui.com) project, a comprehensive page builder that provides production-ready React components with pre-built Sanity schemas and GROQ queries, enabling rapid development of content-driven websites with Sanity CMS and Next.js.

![Screenshot of Sanity Studio using Presentation Tool to do Visual Editing](https://cdn.sanity.io/images/a03xrv11/production/e83fee6a672a9df53548878eccddc0f962d1cac8-1920x931.webp)

[![Next.js][next-js]][next-js-url] [![Sanity][sanity]][sanity-url] [![React][react]][react-url] [![Typescript][typescript]][typescript-url] [![Tailwind][tailwind]][tailwind-url] [![Shadcn][shadcn]][shadcn-url]

[Docs](https://schemaui.com/docs) | [Components](https://schemaui.com/docs/components) | [Demo](https://starter.schemaui.com)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fserge-0v%2Fnext-js-sanity-starter&env=NEXT_PUBLIC_SITE_URL,NEXT_PUBLIC_SITE_ENV,NEXT_PUBLIC_SANITY_API_VERSION,NEXT_PUBLIC_SANITY_PROJECT_ID,NEXT_PUBLIC_SANITY_DATASET,SANITY_API_READ_TOKEN,RESEND_API_KEY,RESEND_AUDIENCE_ID&demo-title=Next.js%20Sanity%20Starter&demo-description=Next.js%20Sanity%20Starter%20by%20Schema%20UI&demo-url=https%3A%2F%2Fstarter.schemaui.com)

## Getting Started

### Installing the template

#### 1. Initialize template with Sanity CLI

Run the command in your Terminal to initialize this template on your local computer:

```bash
npm create sanity@latest -- --template serge-0v/next-js-sanity-starter
```

See the documentation if you are [having issues with the CLI](https://www.sanity.io/help/cli-errors).

This command will:

- Create a new Sanity project
- Add API Read Token
- Configure CORS origin for http://localhost:3000
- Set up environment variables
- Clone the repository
- Install dependencies

#### 2. Run the template locally

Start the development servers:

```bash
pnpm dev
```

#### 3. Open the app and sign in to the Studio

- Open the Next.js app at [http://localhost:3000](http://localhost:3000)
- Open the Studio running locally in your browser on [http://localhost:3000/studio](http://localhost:3000/studio). You should now see a screen prompting you to log in to the Studio. Use the same service (Google, GitHub, or email) that you used when you logged in to the CLI.

### Adding content with Sanity

#### 1. Import Sample Data (Optional)

Import the demo dataset to get started with sample content:

```bash
npx sanity dataset import sample-data.tar.gz production --replace
```

#### 2. Publish your first document

The template comes pre-defined with a schema containing `Author`, `Category`, `FAQ`, `Page`, `Post`, and `Testimonial` document types.

From the Studio, click "+ Create" and select the `Page` document type. Go ahead and create and publish the document.

Your content should now appear in your Next.js app ([http://localhost:3000](http://localhost:3000))

#### 3. Extending the Sanity schema

The schema for the `Page` document type is defined in the `sanity/schemas/document/page.ts` file. You can [add more document types](https://www.sanity.io/docs/schema-types) to the schema to suit your needs.

#### 4. Adding new components

This template includes all components from the [Schema UI](https://schemaui.com/docs/components) library. Visit [Schema UI Docs](https://schemaui.com/docs/how-to-use) to learn how to add new components.

### Deploying your application

#### 1. Configure CORS settings

Add your production URL to the CORS Origins in your Sanity project settings to allow your deployed site to communicate with Sanity.

#### 2. Deploy to Vercel

Deploy your website to Vercel:

1. Create a new repository on [GitHub](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github).
2. Push your code to GitHub
3. Create a [new Vercel project](https://vercel.com/new)
4. Connect your GitHub repository and import the project
5. Copy the environment variables from the `.env.local` file and paste them to your Vercel project settings. Vercel supports pasting all variables at once.
6. Deploy

### Inviting collaborators

Now that you've deployed your Next.js application and Sanity Studio, you can optionally invite a collaborator to your Studio. Open up [Manage](https://www.sanity.io/manage), select your project and click "Invite project members"

They will be able to access the deployed Studio, where you can collaborate together on creating content.

### Configuring Resend (optional)

To use the newsletter form, you need to configure Resend.

1. Create a new [Resend account](https://resend.com/signup)
2. Create a new [API key](https://resend.com/api-keys)
3. Copy the [audience](https://resend.com/audiences) id
4. Set the API key and audience ID in the Vercel project settings or in the `.env.local` file

## Sanity TypeGen

To generate the types, run the following command:

```bash
npx sanity schema extract
```

This will generate `schema.json` file in the root of the project.

To generate the types, run the following command:

```bash
npx sanity typegen generate
```

This will generate the types in the `sanity.types.ts` file in the root of the project.

## Environment variables

All environment variables and their descriptions:

- `NEXT_PUBLIC_SITE_URL` - your website url. For example, `https://yourwebsite.com` without trailing slash.
- `NEXT_PUBLIC_SITE_ENV` - specifies the environment type (development/production) and affects metadata configuration. Setting this to "development" prevents search engine indexing, which is useful for staging environments (e.g., `dev.yourwebsite.com`).
- `NEXT_PUBLIC_SANITY_API_VERSION` - your Sanity API version. You don't have to use specific dates, any past or present date is valid, and today's date will always give you the latest version - no need to check release history. For example: YYYY-MM-DD.
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - your Sanity project ID. For example, abc12345.
- `NEXT_PUBLIC_SANITY_DATASET` - your Sanity dataset name. For example, production.
- `SANITY_API_READ_TOKEN` - your Sanity read token for Next.js to fetch data.
- `RESEND_API_KEY` - your RESEND api key for the newsletter form.
- `RESEND_AUDIENCE_ID` - your RESEND audience id for the newsletter form to store contacts.

## Examples

New i18n example added as separate branch at [example/i18n](https://github.com/serge-0v/next-js-sanity-starter/tree/example/i18n). Example is fully integrated with the template.

[Preview i18n example Live](https://starter-i18n.schemaui.com/en)

[react-url]: https://reactjs.org/
[next-js-url]: https://nextjs.org/
[typescript-url]: https://www.typescriptlang.org/
[tailwind-url]: https://tailwindcss.com/
[shadcn-url]: https://ui.shadcn.com/
[sanity-url]: https://www.sanity.io/
[react]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[next-js]: https://img.shields.io/badge/Next.js-20232A?style=for-the-badge&logo=Next.js
[typescript]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[tailwind]: https://img.shields.io/badge/Tailwind_CSS-20232A?style=for-the-badge&logo=tailwindcss&logoColor=319795
[shadcn]: https://img.shields.io/badge/shadcn/ui-20232A?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiBjbGFzcz0iaC02IHctNiI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIGZpbGw9Im5vbmUiPjwvcmVjdD48bGluZSB4MT0iMjA4IiB5MT0iMTI4IiB4Mj0iMTI4IiB5Mj0iMjA4IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMzIiPjwvbGluZT48bGluZSB4MT0iMTkyIiB5MT0iNDAiIHgyPSI0MCIgeTI9IjE5MiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjMyIj48L2xpbmU+PC9zdmc+&logoColor=ffffff
[sanity]: https://img.shields.io/badge/Sanity-20232A?style=for-the-badge&logo=sanity&logoColor=F97316
