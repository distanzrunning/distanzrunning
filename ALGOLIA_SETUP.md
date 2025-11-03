# Algolia Search Setup Guide

This guide will walk you through setting up Algolia search for your Distanz Running website.

## Overview

The implementation uses:
- **Algolia** for search indexing and queries
- **Sanity webhooks** to sync content automatically
- **React InstantSearch** for the UI
- Keyboard shortcut support (⌘K / Ctrl+K)

## Step 1: Create Algolia Account

1. Go to [https://www.algolia.com/](https://www.algolia.com/)
2. Sign up for a free account
3. Create a new application (e.g., "Distanz Running")

## Step 2: Get Algolia Credentials

In your Algolia dashboard:

1. Go to **Settings** → **API Keys**
2. Copy the following:
   - **Application ID**
   - **Search-Only API Key** (for frontend)
   - **Admin API Key** (for backend indexing)

3. Go to **Search** → **Index**
4. Create a new index called `distanz_content` (or choose your own name)

## Step 3: Configure Environment Variables

Add these to your Vercel environment variables (or `.env.local` for local development):

```env
# Algolia Configuration
NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id_here
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_search_only_key_here
ALGOLIA_ADMIN_API_KEY=your_admin_key_here
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=distanz_content

# Optional: For manual reindexing protection
REINDEX_SECRET=choose_a_random_secret_string
```

⚠️ **Important Security Notes:**
- `NEXT_PUBLIC_*` variables are exposed to the browser - only use Search-Only API Key
- `ALGOLIA_ADMIN_API_KEY` should NEVER be prefixed with `NEXT_PUBLIC_`
- Keep your Admin API Key secret and only use it server-side

## Step 4: Set Up Sanity Webhook

This automatically syncs content to Algolia when you publish/update content in Sanity.

1. Go to your Sanity project dashboard: [https://www.sanity.io/manage](https://www.sanity.io/manage)
2. Select your project → **API** → **Webhooks**
3. Click **Create webhook**
4. Configure:
   - **Name:** Algolia Sync
   - **URL:** `https://your-domain.com/api/algolia-sync`
     - For staging: `https://distanzrunning.vercel.app/api/algolia-sync`
     - For production: `https://distanzrunning.com/api/algolia-sync`
   - **Dataset:** production (or your dataset name)
   - **Trigger on:** Create, Update, Delete
   - **Filter:**
     ```groq
     _type in ["post", "gearPost", "raceGuide"]
     ```
   - **Projection:** (leave default or use)
     ```json
     {
       "_id": _id,
       "_type": _type
     }
     ```
   - **HTTP method:** POST
   - **API version:** v2021-06-07 (or latest)

5. Click **Save**

## Step 5: Initial Content Indexing

After setting up the webhook, you need to do an initial index of all existing content:

1. Make sure your environment variables are deployed to Vercel
2. Trigger a full reindex by visiting:
   ```
   https://your-domain.com/api/algolia-sync?secret=YOUR_REINDEX_SECRET
   ```
3. This will index all published posts, gear posts, and race guides

You can verify the indexing:
- Go to Algolia dashboard → **Search** → Your index
- You should see all your content listed

## Step 6: Configure Algolia Index Settings (Optional but Recommended)

In Algolia dashboard → Your index → **Configuration**:

### Searchable Attributes
Set the order of importance:
```
1. title
2. excerpt
3. category
4. location
```

### Custom Ranking (optional)
Add these to boost newer content:
```
1. desc(publishedAt)
```

### Facets (for filtering - future enhancement)
```
- _type
- category
```

## Step 7: Test the Search

1. Deploy your changes to Vercel
2. Visit your site
3. Click the search button or press ⌘K (Mac) / Ctrl+K (Windows)
4. Try searching for your content

## Usage

### For Users
- Click the "Search" button in the navbar
- Or press **⌘K** (Mac) or **Ctrl+K** (Windows) anywhere on the site
- Type to search across articles, gear reviews, and race guides
- Press **ESC** to close

### For Developers

The search component is located at `/src/components/Search.tsx`

To customize what gets indexed, edit `/src/app/api/algolia-sync/route.ts`:

```typescript
async function transformDocument(doc: any) {
  // Add or remove fields here
  return {
    objectID: doc._id,
    title: doc.title,
    // ... add more fields
  }
}
```

## Troubleshooting

### Search returns no results
1. Check that environment variables are set correctly in Vercel
2. Verify the index name matches `NEXT_PUBLIC_ALGOLIA_INDEX_NAME`
3. Run the reindex endpoint to populate content
4. Check Algolia dashboard to see if records exist

### Webhook not triggering
1. Check Sanity webhook logs in Sanity dashboard
2. Verify the webhook URL is correct and accessible
3. Check the GROQ filter matches your content types
4. Look at Vercel function logs for errors

### Content not updating in search
1. Check Sanity webhook is active
2. Verify the webhook URL is using your production domain
3. Test the webhook manually from Sanity dashboard
4. Check Vercel function logs for the `/api/algolia-sync` endpoint

## Manual Reindexing

If you need to manually reindex all content (e.g., after changing what fields are indexed):

```bash
curl "https://your-domain.com/api/algolia-sync?secret=YOUR_REINDEX_SECRET"
```

## Cost Considerations

Algolia free tier includes:
- 10,000 search requests/month
- 10,000 records
- 100,000 operations (indexing)

For most blogs, this is more than sufficient. Monitor usage in Algolia dashboard.

## Next Steps (Future Enhancements)

- Add filters by content type (Articles, Gear, Races)
- Add category filtering
- Implement search analytics
- Add autocomplete suggestions
- Mobile search optimization

## Resources

- [Algolia Documentation](https://www.algolia.com/doc/)
- [React InstantSearch](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react/)
- [Sanity Webhooks](https://www.sanity.io/docs/webhooks)
