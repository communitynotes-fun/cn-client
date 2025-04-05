import { cookies } from "next/headers";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/header";
import { ActiveThemeProvider } from "@/components/layout/active-theme";
import {
	Geist,
	Geist_Mono,
	Instrument_Sans,
	Inter,
	Mulish,
	Noto_Sans_Mono,
	IBM_Plex_Mono,
} from "next/font/google";

import "@/app/globals.css";
import "@/app/theme.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { SiteFooter } from "@/components/layout/footer";
import { Metadata } from "next";
const META_THEME_COLORS = {
	light: "#ffffff",
	dark: "#09090b",
};

const fontSans = Geist({
	subsets: ["latin"],
	variable: "--font-sans",
});

const fontMono = IBM_Plex_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
	weight: ["400", "500", "600", "700"],
});

const fontGeistMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-geist-mono",
});

const fontInstrument = Instrument_Sans({
	subsets: ["latin"],
	variable: "--font-instrument",
});

const fontNotoMono = Noto_Sans_Mono({
	subsets: ["latin"],
	variable: "--font-noto-mono",
});

const fontMullish = Mulish({
	subsets: ["latin"],
	variable: "--font-mullish",
});

const fontInter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

const fontVariables = cn(
	fontSans.variable,
	fontMono.variable,
	fontGeistMono.variable,
	fontInstrument.variable,
	fontNotoMono.variable,
	fontMullish.variable,
	fontInter.variable
);
export const metadata: Metadata = {
	title: "Predict X Community Notes | communitynotes.fun",
	description: "Predict X community notes",
};

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const cookieStore = await cookies();

	const activeThemeValue = cookieStore.get("active_theme")?.value;

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
				<script
					dangerouslySetInnerHTML={{
						__html: `
            try {
              if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
              }
            } catch (_) {}
          `,
					}}
				/>
			</head>
			<body
				className={cn(
					"bg-background overscroll-none font-sans antialiased",
					activeThemeValue ? `theme-${activeThemeValue}` : "",
					fontVariables
				)}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
					enableColorScheme
				>
					<ActiveThemeProvider initialTheme={activeThemeValue}>
						<SidebarProvider
							defaultOpen={false}
							style={
								{
									"--sidebar-width": "calc(var(--spacing) * 72)",
								} as React.CSSProperties
							}
						>
							<AppSidebar variant="inset" />
							<SidebarInset>
								<SiteHeader />
								<div className="flex flex-1 flex-col">{children}</div>
								<SiteFooter />
							</SidebarInset>
						</SidebarProvider>
					</ActiveThemeProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
