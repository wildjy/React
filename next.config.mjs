const repoName = "React";

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "export",
	trailingSlash: true,
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		unoptimized: true,
	},
	basePath: `/${repoName}`,
	assetPrefix: `/${repoName}/`,
};

export default nextConfig;
