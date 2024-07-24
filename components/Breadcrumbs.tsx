"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";

function Breadcrumbs() {
  const path = usePathname();
  const pathSegments = path.split("/");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>

        {pathSegments.map((pathSegment, index) => {
          if (!pathSegment) return null;

          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegment.length - 1;

          return (
            <Fragment key={pathSegment}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{pathSegment}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{pathSegment}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
export default Breadcrumbs;
