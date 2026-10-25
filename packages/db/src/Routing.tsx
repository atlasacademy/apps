import { Children, ComponentType, ReactElement, ReactNode, isValidElement, useMemo } from "react";
import { Navigate, To, useLocation, useNavigate } from "react-router-dom";

import { matchRoute } from "./RoutingMatch";

export interface RouteComponentProps {
    history: { push: (to: To) => void; replace: (to: To) => void };
    location: ReturnType<typeof useLocation>;
}

export function useHistory(): RouteComponentProps["history"] {
    const navigate = useNavigate();
    return useMemo(
        () => ({
            push: (to: To) => {
                void navigate(to);
            },
            replace: (to: To) => {
                void navigate(to, { replace: true });
            },
        }),
        [navigate]
    );
}

// Keep class-based pages on the same Router 7 navigation context as links and hooks.
export function withRouter<P extends RouteComponentProps>(Component: ComponentType<P>) {
    return function RoutedComponent(props: Omit<P, keyof RouteComponentProps>) {
        const history = useHistory();
        const location = useLocation();
        return <Component {...(props as P)} history={history} location={location} />;
    };
}

interface RouteProps {
    path: string;
    exact?: boolean;
    sensitive?: boolean;
    render?: (props: RouteComponentProps & { match: { params: Record<string, string> } }) => ReactNode;
    component?: ComponentType;
}

// Route definitions are evaluated in order to preserve constrained URLs and search fallbacks.
export function Route(_props: RouteProps) {
    return null;
}

export function Switch({ children }: { children: ReactNode }) {
    const location = useLocation();
    const history = useHistory();
    for (const child of Children.toArray(children)) {
        if (!isValidElement<RouteProps>(child)) continue;
        const { path, sensitive, render, component: Component } = (child as ReactElement<RouteProps>).props;
        const params = matchRoute(path, location.pathname, sensitive);
        if (params === null) continue;
        return render ? render({ history, location, match: { params } }) : Component ? <Component /> : null;
    }
    return null;
}

export function Redirect({ to }: { to: To }) {
    return <Navigate to={to} replace />;
}
