import type { ReactElement } from 'react';

export type FruitIconComponent = (props: { color: string }) => ReactElement;

const strokeProps = (color: string) => ({
    viewBox: '0 0 40 40',
    width: 28,
    height: 28,
    fill: 'none' as const,
    stroke: color,
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
});

export function AppleIcon({ color }: { color: string }): ReactElement {
    return (
        <svg {...strokeProps(color)}>
            <path d="M20 15c-6 0-10.5 4.8-10.5 11.5S13.5 36 18 36c1.7 0 2.3-.9 2-2 -.3 1.1.3 2 2 2 4.5 0 8.5-3.8 8.5-9.5S26 15 20 15Z" />
            <path d="M20 15c-.3-3 .8-5.3 3-6.6" />
            <path d="M22.2 9c1.8-1.1 3.8-.2 3.8 1.7-1.9.4-3.1-.2-3.8-1.7Z" fill={color} stroke="none" />
        </svg>
    );
}

export function OrangeIcon({ color }: { color: string }): ReactElement {
    return (
        <svg {...strokeProps(color)}>
            <circle cx="20" cy="21" r="11" />
            <path d="M20 10v4M20 28v4M9 21h4M27 21h4" />
            <rect x="18" y="5.5" width="4" height="3" rx="1" fill={color} stroke="none" />
        </svg>
    );
}

export function BananaIcon({ color }: { color: string }): ReactElement {
    return (
        <svg {...strokeProps(color)}>
            <path d="M10.5 26c6 5 17 3.4 20.6-6.4 1.4-3.8 1.3-7 .5-9-.6 5.2-3.6 9.6-9 12.6-4.7 2.6-8.5 2.6-12.1 2.8Z" />
            <path d="M9.5 25.5c-1.1 1-1.2 2.4-.2 3.6" />
        </svg>
    );
}

export function GrapeIcon({ color }: { color: string }): ReactElement {
    return (
        <svg {...strokeProps(color)}>
            <path d="M20 7v4" />
            <path d="M15 8c2 0 3.5 1.5 3.5 3.5S17 15 15 15" fill="none" />
            <circle cx="16" cy="16" r="3.4" />
            <circle cx="24" cy="16" r="3.4" />
            <circle cx="12" cy="22" r="3.4" />
            <circle cx="20" cy="22" r="3.4" />
            <circle cx="28" cy="22" r="3.4" />
            <circle cx="16" cy="28" r="3.4" />
            <circle cx="24" cy="28" r="3.4" />
            <circle cx="20" cy="33.5" r="3.4" />
        </svg>
    );
}

export function StrawberryIcon({ color }: { color: string }): ReactElement {
    return (
        <svg {...strokeProps(color)}>
            <path d="M20 15c-6.5 0-10 5-10 10 0 6 5.5 11 10 11s10-5 10-11c0-5-3.5-10-10-10Z" />
            <path d="M20 15l-4-5M20 15l4-5M20 15v-3" />
            <circle cx="16.5" cy="22" r="0.6" fill={color} stroke="none" />
            <circle cx="23.5" cy="22" r="0.6" fill={color} stroke="none" />
            <circle cx="20" cy="26" r="0.6" fill={color} stroke="none" />
            <circle cx="15.5" cy="28" r="0.6" fill={color} stroke="none" />
            <circle cx="24.5" cy="28" r="0.6" fill={color} stroke="none" />
        </svg>
    );
}

export function WatermelonIcon({ color }: { color: string }): ReactElement {
    return (
        <svg {...strokeProps(color)}>
            <path d="M8 16c4.5 12 19.5 12 24 0" />
            <path d="M8 16c4.5 9 19.5 9 24 0" strokeDasharray="1.5 2.5" />
            <path d="M8 16C10 10 14.5 6 20 6s10 4 12 10" />
            <circle cx="17" cy="20" r="0.6" fill={color} stroke="none" />
            <circle cx="20" cy="24" r="0.6" fill={color} stroke="none" />
            <circle cx="23" cy="20" r="0.6" fill={color} stroke="none" />
        </svg>
    );
}

export function PineappleIcon({ color }: { color: string }): ReactElement {
    return (
        <svg {...strokeProps(color)}>
            <path d="M15 12c1-3 3-5.5 5-7 2 1.5 4 4 5 7" />
            <path d="M17 12c0-3 .8-5.5 1.5-7M23 12c0-3-.8-5.5-1.5-7" />
            <path d="M13.5 15c0-1.7 3-3 6.5-3s6.5 1.3 6.5 3v11c0 4-3 8-6.5 8s-6.5-4-6.5-8Z" />
            <path d="M13.8 18.5c1.8 1 4 1.5 6.2 1.5s4.4-.5 6.2-1.5M13.8 23.5c1.8 1 4 1.5 6.2 1.5s4.4-.5 6.2-1.5" />
        </svg>
    );
}

export function MangoIcon({ color }: { color: string }): ReactElement {
    return (
        <svg {...strokeProps(color)}>
            <path d="M14 14c-2.5 3-3.5 7-2 11 1.6 4.4 5.8 7 9.5 6.3 4-.8 7-4.7 6.7-9.5-.3-5-4-9.5-9-11-1.8-.5-3.6-.3-5.2 1.2Z" />
            <path d="M22 10.5c1.5-1.5 3.2-2 4.5-1.7" />
        </svg>
    );
}

export function CherryIcon({ color }: { color: string }): ReactElement {
    return (
        <svg {...strokeProps(color)}>
            <path d="M21 8c2 3 3 6 2.5 9M21 8c-1 4-.5 7 1 9.5" />
            <circle cx="14.5" cy="26" r="5" />
            <circle cx="24" cy="27.5" r="5" />
        </svg>
    );
}

export function LemonIcon({ color }: { color: string }): ReactElement {
    return (
        <svg {...strokeProps(color)}>
            <path d="M9 21c0-4 5-9.5 11-9.5S31 17 31 21s-5 9.5-11 9.5S9 25 9 21Z" />
            <path d="M9 21c-1.3-.3-2.2-.9-2.2-1.6M31 21c1.3-.3 2.2-.9 2.2-1.6" />
        </svg>
    );
}

export function PeachIcon({ color }: { color: string }): ReactElement {
    return (
        <svg {...strokeProps(color)}>
            <path d="M20 14c-5.8 0-10 4.8-10 10.5S15 34 19 34c.6 0 1.1-.3 1-1.1-.1.8.4 1.1 1 1.1 4 0 9-4.8 9-9.5S25.8 14 20 14Z" />
            <path d="M20 14v9" />
            <path d="M20 12c0-2 1-3.5 2.5-4.3" />
        </svg>
    );
}

export function PearIcon({ color }: { color: string }): ReactElement {
    return (
        <svg {...strokeProps(color)}>
            <path d="M19.5 9c-1.6 0-2.6 1.6-2.2 3.2.3 1.2 1 2 .7 3.3-2.8 1.2-5 4.6-5 9 0 5.5 4 9.5 8 9.5s8-4 8-9.5c0-4.4-2.2-7.8-5-9-.3-1.3.4-2.1.7-3.3.4-1.6-.6-3.2-2.2-3.2Z" />
            <path d="M19.5 9c-.6-1.3-.3-2.7.8-3.6" />
        </svg>
    );
}

export function KiwiIcon({ color }: { color: string }): ReactElement {
    return (
        <svg {...strokeProps(color)}>
            <circle cx="20" cy="20" r="11.5" />
            <circle cx="20" cy="20" r="6.5" fill="none" strokeDasharray="0.5 3" />
            <circle cx="20" cy="20" r="1" fill={color} stroke="none" />
            {Array.from({ length: 10 }).map((_, i) => {
                const angle = (i / 10) * Math.PI * 2;
                const x = 20 + Math.cos(angle) * 4.5;
                const y = 20 + Math.sin(angle) * 4.5;
                return <circle key={i} cx={x} cy={y} r="0.5" fill={color} stroke="none" />;
            })}
        </svg>
    );
}

export function PlumIcon({ color }: { color: string }): ReactElement {
    return (
        <svg {...strokeProps(color)}>
            <circle cx="20" cy="22" r="11" />
            <path d="M20 11c0-2 .8-3.6 2.3-4.6" />
            <path d="M14 15c2.5-1.5 4-3.8 4-6.5" strokeDasharray="0.5 2.5" opacity="0.6" />
        </svg>
    );
}

export function BlueberryIcon({ color }: { color: string }): ReactElement {
    return (
        <svg {...strokeProps(color)}>
            <circle cx="20" cy="23" r="9" />
            <path d="M15 15l1.5 2.5M20 13.5V16M25 15l-1.5 2.5" />
            <path d="M16.5 15.5h7l-1 2.5h-5Z" />
        </svg>
    );
}

/** Convenience lookup, if you want to select an icon by fruit name (e.g. from a select input) */
export const FRUIT_ICONS: Record<string, FruitIconComponent> = {
    apple: AppleIcon,
    orange: OrangeIcon,
    banana: BananaIcon,
    grape: GrapeIcon,
    strawberry: StrawberryIcon,
    watermelon: WatermelonIcon,
    pineapple: PineappleIcon,
    mango: MangoIcon,
    cherry: CherryIcon,
    lemon: LemonIcon,
    peach: PeachIcon,
    pear: PearIcon,
    kiwi: KiwiIcon,
    plum: PlumIcon,
    blueberry: BlueberryIcon,
};
