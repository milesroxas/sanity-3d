# Next.js 15 with Sanity CMS Starter Template

A Next.js starter template with `Next.js 15`, `Tailwind CSS`, `shadcn/ui`, and `Sanity CMS` with `Live Editing`.

[Docs](https://schemaui.com/docs) | [Components](https://schemaui.com/components) | [Demo](https://schemaui-starter.vercel.app/)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fserge-0v%2Fnext-js-sanity-starter&env=NEXT_PUBLIC_SITE_URL,NEXT_PUBLIC_SITE_ENV,NEXT_PUBLIC_SANITY_API_VERSION,NEXT_PUBLIC_SANITY_PROJECT_ID,NEXT_PUBLIC_SANITY_DATASET,SANITY_API_READ_TOKEN,RESEND_API_KEY,RESEND_AUDIENCE_ID&demo-title=Next.js%20Sanity%20Starter&demo-description=Next.js%20Sanity%20Starter%20by%20Schema%20UI&demo-url=https%3A%2F%2Fschemaui-starter.vercel.app)

This starter is a part of [Schema UI](https://schemaui.com) project, which is a collection of components for building websites with Sanity CMS and Next.js.

Setup locally with Sanity CLI:

1. Install the Sanity CLI:

```bash
pnpm install -g @sanity/cli
```

2. Create a new Sanity project with the template:

```bash
pnpm create sanity@latest --template https://github.com/serge-0v/next-js-sanity-starter
```

Command above will create a new Sanity project, add API Read Token, CORS origin http://localhost:3000, write all the environment variables (except RESEND_API_KEY and RESEND_AUDIENCE_ID) and clone the repository and install dependencies locally.

Proceed to the [After Installation](#after-installation) section.

Setup manually:

You can clone the repository and start building your website with the components.

Create a new `Sanity project` at [sanity.io](https://www.sanity.io/manage).

Add `http://localhost:3000` to the `CORS Origins` in your Sanity project settings.

1. Clone the repository:

```bash
git clone git@github.com:serge-0v/next-js-sanity-starter.git
```

2. Rename the `example.env.local` file to `.env.local` and add your `Sanity project ID` to `NEXT_PUBLIC_SANITY_PROJECT_ID` and `development` dataset to `NEXT_PUBLIC_SANITY_DATASET` to the file.

```bash
cd next-js-sanity-starter
mv example.env.local .env.local
```

3. Create and copy token from the `API` section with Viewer permissions in your Sanity project settings.

4. Install the dependencies:

```bash
pnpm install
```

## After Installation

1. You can create a demo page with the following command (`produciton` is the default dataset name from Sanity):

```bash
pnpx sanity dataset import demo.tag.gz produciton
```

2. Start the development server:

```bash
pnpm dev
```

3. Open the browser and go to `http://localhost:3000` to see the demo page.

4. Your Sanity admin is available at `http://localhost:3000/studio`.

5. Once you're ready to deploy your website, make sure you add live url to the `CORS Origins` in your Sanity project settings.

6. Deploy your website to Vercel by creating a new project and adding your `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` dataset to the environment variables.

All environment variables:

- `NEXT_PUBLIC_SITE_URL` - your website url. For example, `https://yourwebsite.com` without trailing slash.

- `NEXT_PUBLIC_SITE_ENV` - development or production. Used for metadata. For example, if you deploy and want to have staging website on subdomain `dev.yourwebsite.com` and don't want search engines to index it, you can set this variable to `development`.

- `NEXT_PUBLIC_SANITY_API_VERSION` - your Sanity API version. You don't have to use specific dates, any past or present date is valid, and today's date will always give you the latest version - no need to check release history. For example: `YYYY-MM-DD`.

- `NEXT_PUBLIC_SANITY_PROJECT_ID` - your Sanity project ID. For example, `abc12345`.

- `NEXT_PUBLIC_SANITY_DATASET` - your Sanity dataset name. For example, `production`.

- `SANITY_API_READ_TOKEN` - your Sanity read token for Next.js to fetch data.

- `RESEND_API_KEY` - your RESEND api key for the newsletter form.

- `RESEND_AUDIENCE_ID` - your RESEND audience id for the newsletter form to store contacts.
