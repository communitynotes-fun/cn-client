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
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";

const navItems = [
	{
		title: "Dashboard",
		url: "#",
		icon: IconDashboard,
	},
	{
		title: "My Bets",
		url: "#",
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
							<a href="#">
								<IconInnerShadowTop className="!size-5" />
								<span className="text-base font-semibold">
									communitynotes.fun
								</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navItems} />
			</SidebarContent>
		</Sidebar>
	);
}
