"use client";

import * as React from "react";
import {
	IconDashboard,
	IconInnerShadowTop,
	IconListDetails,
} from "@tabler/icons-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { routes } from "@/lib/config";
import { NavSecondary } from "../nav-secondary";
import Link from "next/link";
import { BrandLogo } from "../product/logo";
const navItems = [
	{
		title: "Markets",
		url: routes.markets,
		icon: IconDashboard,
	},
	{
		title: "My Positions",
		url: routes.myPositions,
		icon: IconListDetails,
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<Link href="#" className="w-full">
					<BrandLogo className="!h-8 !w-auto" />
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navItems} />
			</SidebarContent>
			<SidebarFooter>
				<NavSecondary items={[]} />
			</SidebarFooter>
		</Sidebar>
	);
}
