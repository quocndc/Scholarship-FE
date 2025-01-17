export const Stripes = ({ intent = 'primary', id }: { intent?: string; id: string }) => {
    return (
        <pattern id={id} patternUnits="userSpaceOnUse" width="4" height="4">
            <rect width="4" height="4" fill={`var(--dv-${intent})`} opacity={0.3} />
            <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke={`var(--dv-${intent})`} opacity={0.6} strokeWidth="1" />
        </pattern>
    );
};

export const Dots = ({ intent = 'primary', id }: { intent?: string; id: string }) => {
    return (
        <pattern id={id} patternUnits="userSpaceOnUse" width="6" height="6">
            <circle cx="3" cy="3" r="2" fill={`var(--dv-${intent})`} />
        </pattern>
    );
};

export const LinearGradient = ({ intent = 'primary', id }: { intent?: string; id: string }) => {
    return (
        <linearGradient x1={0} y1={0} x2={0} y2={1} id={id}>
            <stop offset="5%" stopColor={`var(--dv-${intent})`} stopOpacity={0.3} />
            <stop className="text-white dark:text-gray-950" offset="95%" stopColor="currentColor" stopOpacity={0} />
        </linearGradient>
    );
};

export const DotCartesianGrid = ({ id, opacity = 0.5 }: { id: string; opacity?: number }) => {
    return (
        <pattern id={id} patternUnits="userSpaceOnUse" width="8" height="8">
            <circle cx="2" cy="2" r="1" opacity={opacity} fill="var(--ui-border-color)" />
        </pattern>
    );
};
