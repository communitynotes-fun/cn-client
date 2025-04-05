import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function shortenAddress(
	addr: string,
	version: "short" | "long" | "id" | "extra-short" = "short"
): string {
	if (!addr) return addr;
	if (addr.length <= (version === "short" ? 6 : 10)) return addr;

	if (version === "id") {
		return `#${addr.slice(0, 4)}...${addr.slice(-4)}`;
	} else if (version === "short") {
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	} else if (version === "long") {
		return `${addr.slice(0, 10)}...${addr.slice(-8)}`;
	} else if (version === "extra-short") {
		return `${addr.slice(0, 2)}...${addr.slice(-4)}`;
	} else {
		return addr;
	}
}

export const isSameAddress = (
	addressOne: string,
	addressTwo: string
): boolean => {
	return addressOne.toLowerCase() === addressTwo.toLowerCase();
};
