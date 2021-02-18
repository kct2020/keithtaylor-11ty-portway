const CleanCSS = require( "clean-css" );
const markdownIt = require( "markdown-it" );
const rssPlugin = require( "@11ty/eleventy-plugin-rss" );

module.exports = config =>
{
	config.addPassthroughCopy( "src/icons" );
	config.addPassthroughCopy({ "src/static": "/" });

	config.addPlugin( rssPlugin, {
		posthtmlRenderOptions: {}
	});

	/* Filters & Shortcodes */
	config.addFilter( "cssmin", code =>
	{
		return new CleanCSS({})
			.minify( code )
			.styles;
	});

	config.addShortcode( "date", date =>
	{
		return date.toLocaleDateString( [], {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
	});

	config.addFilter( "sortPages", pages =>
	{
		return pages.sort( (pageA, pageB) =>
		{
			let sortPageA = pageA.data.sort || 0;
			let sortPageB = pageB.data.sort || 0;

			return sortPageA - sortPageB;
		});
	});

	/* Markdown configuration */
	let markdownOptions = {
		html: true,
		breaks: false,
		typographer: true,
	};

	let markdownLibrary = markdownIt( markdownOptions )
		.disable( "code" );

	markdownLibrary.use( require( "markdown-it-anchor" ) );
	markdownLibrary.use( require( "markdown-it-attrs" ) );

	config.setLibrary( "md", markdownLibrary );

	return {
		dir: {
			input: "src",
			output: "dist",
		},

		markdownTemplateEngine: "njk",
		templateFormats: ["njk", "md"],
	};
};
