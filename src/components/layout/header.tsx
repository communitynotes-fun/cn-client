"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/layout/mode-toggle";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { IconDashboard, IconListDetails } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar";
import { routes } from "@/lib/config";

export function SiteHeader() {
	const navigationItems = [
		{
			title: "Markets",
			url: routes.markets,
			icon: IconDashboard,
			startsWith: "/market",
		},
		{
			title: "My Positions",
			url: routes.myPositions,
			icon: IconListDetails,
			startsWith: routes.myPositions,
		},
	];

	const pathname = usePathname();

	return (
		<header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b">
			<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1 md:hidden" />
				<Separator
					orientation="vertical"
					className="mx-2 data-[orientation=vertical]:h-4 md:hidden"
				/>
				<h1 className="text-base font-medium">communitynotes.fun</h1>
				<Separator
					orientation="vertical"
					className="hidden md:block mx-2 data-[orientation=vertical]:h-4"
				/>
				<NavigationMenu className="hidden md:block">
					<NavigationMenuList>
						{navigationItems.map((item) => (
							<NavigationMenuItem key={item.url}>
								<Link href={item.url} legacyBehavior passHref>
									<NavigationMenuLink
										className={navigationMenuTriggerStyle()}
										active={
											pathname === item.url ||
											(item.startsWith &&
												pathname.startsWith(item.startsWith)) ||
											false
										}
									>
										<item.icon className="size-4" />
										{item.title}
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
						))}
					</NavigationMenuList>
				</NavigationMenu>
				<div className="ml-auto flex items-center gap-2">
					<ModeToggle />
					<Button
						variant="outline"
						asChild
						size="sm"
						className="hidden sm:flex"
					>
						<Link
							href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
							rel="noopener noreferrer"
							target="_blank"
							className="dark:text-foreground"
						>
							Connect Wallet
						</Link>
					</Button>
				</div>
			</div>
		</header>
	);
}
