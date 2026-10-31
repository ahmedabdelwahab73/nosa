import { Check, Minus, ShieldCheck } from "lucide-react";
import { DASHBOARD_ROLES } from "@nosa/contracts";
import { Panel } from "@/shared/components/panel";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { NAV_ITEMS } from "../../lib/nav-items";

/** Which dashboard sections each role opens. Built from NAV_ITEMS, so it can't drift from the real menu. */
export async function PermissionsMatrix() {
  const dict = await getDictionary();
  const { matrix, roleHints } = dict.dashboard.team;

  return (
    <Panel title={matrix.title} icon={<ShieldCheck />}>
      <p className="-mt-2 text-sm text-muted-foreground">{matrix.subtitle}</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{matrix.screen}</TableHead>
            {DASHBOARD_ROLES.map((role) => (
              <TableHead key={role} className="text-center">
                {dict.dashboard.roles[role]}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {NAV_ITEMS.map((item) => (
            <TableRow key={item.key}>
              <TableCell className="font-medium">{dict.dashboard.nav[item.key]}</TableCell>
              {DASHBOARD_ROLES.map((role) => {
                const allowed = item.roles.includes(role);
                return (
                  <TableCell key={role} className="text-center">
                    {allowed ? (
                      <Check className="mx-auto size-4 text-success" aria-label={matrix.yes} />
                    ) : (
                      <Minus className="mx-auto size-4 text-muted-foreground/50" aria-label={matrix.no} />
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
        {DASHBOARD_ROLES.map((role) => (
          <li key={role}>
            <span className="font-medium text-foreground">{dict.dashboard.roles[role]}:</span> {roleHints[role]}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
