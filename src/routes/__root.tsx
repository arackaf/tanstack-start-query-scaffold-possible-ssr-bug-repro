import { HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import Header from "../components/Header";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import appCss from "../styles.css?url";

import type { QueryClient, UseQueryOptions } from "@tanstack/react-query";

interface MyRouterContext {
  queryClient: QueryClient;
}

const queryOptions: UseQueryOptions = {
  queryKey: ["a", "b", "c"],
  queryFn: async () => {
    console.log("============================");
    console.log("FETCHING DATA in ROOT");
    console.log("============================");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return +new Date();
  },
  staleTime: 1000 * 10,
  gcTime: 1000 * 10,
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
  loader: async ({ context, cause, route, location }) => {
    context.queryClient.ensureQueryData(queryOptions);
  },
  notFoundComponent: ({ isNotFound, routeId, data }) => {
    console.log({ isNotFound, routeId, data });
    return <div>Not Found</div>;
  },
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Header />
        {children}
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
