import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, formatDimensions, type Availability, type Product } from "../../data/productformat";

type ProductTabsProps = {
  product: Product;
  categoryName?: string | null;
  availability: Availability;
};

export function ProductTabs({ product, categoryName, availability }: ProductTabsProps) {
  const paragraphs = (product.long_description ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const specs: [string, string][] = [
    ["SKU", product.sku],
    ["Category", categoryName ?? "—"],
    ["Dimensions", formatDimensions(product)],
    ["Availability", availability.label],
    ["Tags", product.tags.join(", ") || "—"],
    ["Listed on", formatDate(product.createdAt)],
    ["Last updated", formatDate(product.updatedAt)],
  ];

  return (
    <Tabs defaultValue="specifications" className="gap-6 flex flex-col w-full">
      <TabsList>
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="specifications">Specifications</TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="w-full space-y-4 text-base leading-relaxed text-muted-foreground">
        {paragraphs.length > 0 ? (
          paragraphs.map((text, index) => <p dangerouslySetInnerHTML={{ __html: text }} key={index} />)
        ) : (
          <p>No detailed description yet.</p>
        )}
      </TabsContent>

      <TabsContent value="specifications" className="w-full space-y-4 text-base leading-relaxed text-muted-foreground">
        <Table>
          <TableBody>
            {specs.map(([label, value]) => (
              <TableRow key={label}>
                <TableCell className="w-40 font-medium text-foreground">{label}</TableCell>
                <TableCell className="text-muted-foreground">{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  );
}