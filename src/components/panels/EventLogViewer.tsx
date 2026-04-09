import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CopyAddress } from "@/components/CopyAddress";
import { Badge } from "@/components/ui/badge";

// Mock data for events — real implementation would use viem getLogs
const MOCK_EVENTS = Array.from({ length: 10 }, (_, i) => ({
  blockNumber: 40_000_000 + i * 100,
  from: `0x${(1234 + i).toString(16).padStart(40, "0")}`,
  to: `0x${(5678 + i).toString(16).padStart(40, "0")}`,
  amount: `${(Math.random() * 10000).toFixed(2)}`,
  txHash: `0x${(9999 + i).toString(16).padStart(64, "a")}`,
}));

const EVENT_TABS = [
  { id: "transfers", label: "Transfers" },
  { id: "presale", label: "Presale Buys" },
  { id: "swaps", label: "Swaps" },
  { id: "joins", label: "Joins" },
  { id: "nft-mints", label: "NFT Mints" },
];

export function EventLogViewer() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Showing last 50 events per tab (mock data)</p>
        <Button variant="outline" size="sm" onClick={() => setRefreshKey((k) => k + 1)}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="transfers" className="w-full">
        <TabsList className="bg-secondary border border-border">
          {EVENT_TABS.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {EVENT_TABS.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <Card className="bg-card border-border">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Block #</TableHead>
                      <TableHead className="text-muted-foreground">From</TableHead>
                      <TableHead className="text-muted-foreground">To</TableHead>
                      <TableHead className="text-muted-foreground">Amount</TableHead>
                      <TableHead className="text-muted-foreground">Tx Hash</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_EVENTS.map((event, i) => (
                      <TableRow key={i} className="border-border">
                        <TableCell className="font-mono text-xs text-gold">
                          {event.blockNumber.toLocaleString()}
                        </TableCell>
                        <TableCell><CopyAddress address={event.from} /></TableCell>
                        <TableCell><CopyAddress address={event.to} /></TableCell>
                        <TableCell className="font-mono text-sm text-foreground">{event.amount}</TableCell>
                        <TableCell>
                          <a
                            href={`https://bscscan.com/tx/${event.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs text-primary hover:underline"
                          >
                            {event.txHash.slice(0, 10)}...
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
