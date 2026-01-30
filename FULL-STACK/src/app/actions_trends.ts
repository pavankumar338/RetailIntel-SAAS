'use server'

const SERPAPI_KEY = process.env.SERPAPI_API_KEY;

export async function getMarketTrends(query: string) {
    if (!query) return { error: 'Query is required' };

    // If no API key, return mock data for demonstration
    if (!SERPAPI_KEY) {
        console.warn('SERPAPI_API_KEY is not defined. Returning mock data.');
        return {
            success: true,
            isMock: true,
            competitors: [
                { source: 'BigBasket', price: 120, title: query + ' premium pack' },
                { source: 'Amazon India', price: 115, title: query + ' (Pack of 2)' },
                { source: 'Flipkart Health', price: 125, title: query + ' - Organic' },
                { source: 'Reliance Smart', price: 110, title: query + ' Super Value' },
                { source: 'JioMart', price: 118, title: query + ' Fresh' },
            ],
            pricing_metrics: {
                min: 110,
                avg: 117.6,
                max: 125
            },
            news: [
                { title: 'The Rise of ' + query + ' in Modern Diet', source: 'Health Times', link: '#' },
                { title: 'New Startups Revolutionizing ' + query + ' Market', source: 'Business Weekly', link: '#' },
            ],
            videos: [
                { title: 'Top 10 ' + query + ' Reviewed', thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=225&fit=crop', views: '1.2M' },
                { title: 'How to make ' + query + ' at home', thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=225&fit=crop', views: '850K' },
            ]
        };
    }

    try {
        // Fetch Shopping for Price Comparison
        const shoppingRes = await fetch(`https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(query)}&api_key=${SERPAPI_KEY}&gl=in&hl=en`);
        const shoppingData = await shoppingRes.json();

        // Extract pricing metrics
        const competitors = shoppingData.shopping_results?.slice(0, 10).map((r: any) => ({
            source: r.source,
            price: r.extracted_price,
            title: r.title,
            thumbnail: r.thumbnail,
            link: r.link
        })) || [];

        const prices = competitors.map((c: any) => c.price).filter((p: number) => typeof p === 'number');
        const pricing_metrics = prices.length > 0 ? {
            min: Math.min(...prices),
            max: Math.max(...prices),
            avg: Number((prices.reduce((a: number, b: number) => a + b, 0) / prices.length).toFixed(2))
        } : null;

        // Fetch News
        const newsRes = await fetch(`https://serpapi.com/search.json?engine=google_news&q=${encodeURIComponent(query)}&api_key=${SERPAPI_KEY}&gl=in`);
        const newsData = await newsRes.json();

        // Fetch Videos
        const videoRes = await fetch(`https://serpapi.com/search.json?engine=google_videos&q=${encodeURIComponent(query)}&api_key=${SERPAPI_KEY}&gl=in`);
        const videoData = await videoRes.json();

        return {
            success: true,
            shopping_results: shoppingData.shopping_results || [],
            competitors,
            pricing_metrics,
            news: newsData.news_results?.slice(0, 5) || [],
            videos: videoData.video_results?.slice(0, 4) || []
        };
    } catch (error: any) {
        console.error('SerpAPI Error:', error);
        return { error: 'Failed to fetch market data from SerpAPI' };
    }
}

