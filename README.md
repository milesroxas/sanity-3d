# Next.js 15 with Sanity CMS Starter Template

A Next.js starter template with `Next.js 15`, `Tailwind CSS`, `shadcn/ui`, and `Sanity CMS` with `Live Editing`.

This starter is a part of [Schema UI](https://schemaui.com) project, which is a collection of components for building websites with Sanity CMS.

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

or with `npm`:

```bash
npm install
```

5. You can create a demo page with the following command (`development` is the dataset name, make sure you created the `development` dataset in your Sanity project):

```bash
npx sanity dataset import demo.tag.gz development
```

6. Start the development server:

```bash
pnpm dev
```

or with `npm`:

```bash
npm run dev
```

6. Open the browser and go to `http://localhost:3000` to see the demo page.

7. Your Sanity admin is available at `http://localhost:3000/studio`.

8. Once you're ready to deploy your website, make sure you add live url to the `CORS Origins` in your Sanity project settings.

9. If you created `developemnt` dataset, you can export it to the `production` dataset with the following command:

```bash
npx sanity dataset export development development.tag.gz
npx sanity dataset import development.tag.gz production
```

10. Deploy your website to Vercel by creating a new project and adding your `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` dataset to the environment variables.
