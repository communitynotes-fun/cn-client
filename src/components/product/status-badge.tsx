import { Badge } from "@/components/ui/badge";
import { IconCircleCheckFilled, IconLoader } from "@tabler/icons-react";

interface StatusBadgeProps {
	status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
	return (
		<Badge
			variant="outline"
			className="text-muted-foreground px-1.5 py-1 gap-2"
		>
			{status === "Resolved" ? (
				<IconCircleCheckFilled className="text-green-500 dark:text-green-400 !size-5" />
			) : (
				<IconLoader className="text-orange-500 dark:text-orange-400 !size-5" />
			)}
			{status}
		</Badge>
	);
}
