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
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<Link href="#">
								<IconInnerShadowTop className="!size-5" />
								<span className="text-base font-semibold">
									communitynotes.fun
								</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
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
