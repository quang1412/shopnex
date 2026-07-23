"use client";

import { useState, useMemo } from "react";
// import { ProductCard } from "./product-card";
import { ProductCard } from "./product-item";
import { ProductFilters, type FilterState } from "./product-filters";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Card, CardHeader, CardContent, CardAction, CardTitle } from "../ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Product } from "@/lib/products";
import { Filter, X, Grid3X3, List } from "lucide-react";

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

interface ProductListingProps {
  products: Product[];
  categories: string[];
  initialSearchQuery?: string;
}

const sortItems = [
  { value: 'name', label: 'Tên A-Z' },
  { value: 'price-low', label: 'Giá: tăng dần' },
  { value: 'price-high', label: 'Giá: giảm dần' },
]

export function ProductListing({ products, categories, initialSearchQuery }: ProductListingProps) {
  const [sortBy, setSortBy] = useState<string | null>("name");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || "");
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 500],
    inStock: false,
    featured: false,
  });

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Apply search query filter
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase();
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    }

    // Apply filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.includes(product.category)
      );
    }

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) {
      filtered = filtered.filter(
        (product) =>
          Number(product.price) >= filters.priceRange[0] &&
          Number(product.price) <= filters.priceRange[1]
      );
    }

    if (filters.inStock) {
      filtered = filtered.filter((product) => product.inStock);
    }

    if (filters.featured) {
      filtered = filtered.filter((product) => product.featured);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, filters, sortBy, searchQuery]);

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 500],
      inStock: false,
      featured: false,
    });
    setSortBy("name");
  };

  // const hasActiveFilters =
  //   filters.categories.length > 0 ||
  //   filters.priceRange[0] > 0 ||
  //   filters.priceRange[1] < 500 ||
  //   filters.inStock ||
  //   filters.featured ||
  //   sortBy !== "name";

  return (
    <div className="space-y-4">
      {/* Filters Header */}
      <div className="flex flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Bộ lọc
          </Button>
          <span className="text-sm text-muted-foreground">
            {filteredAndSortedProducts.length} sản phẩm
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="xs"
              onClick={() => setViewMode("grid")}
              className="  "
            >
              <Grid3X3 className=" " />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="xs"
              onClick={() => setViewMode("list")}
              className="  "
            >
              <List className=" " />
            </Button>
          </div>

          {/* <Tabs defaultValue={viewMode} onValueChange={setViewMode}>
            <TabsList className="">
              <TabsTrigger value="grid" render={
                <Button size="icon" variant={viewMode === 'grid' ? "default" : "ghost"} ><Grid3X3 /></Button>
              } />
              <TabsTrigger value="list" render={
                <Button size="icon" variant={viewMode === 'list' ? "default" : "ghost"} ><List /></Button>
              } />
            </TabsList>
          </Tabs> */}

          {/* <ToggleGroup variant="default" defaultValue={[viewMode]} spacing={1}>
            <ToggleGroupItem value="grid" aria-label="Toggle grid" onClick={() => setViewMode("grid")}>
              <Grid3X3 />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="Toggle list" onClick={() => setViewMode("list")}>
              <List />
            </ToggleGroupItem>
          </ToggleGroup> */}

          {/* Sort */}
          <Select
            value={sortBy}
            onValueChange={setSortBy}
            items={sortItems}
          >
            <SelectTrigger className="w-35">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              {sortItems.map(({ label, value }) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
              {/* <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="price-low">
                Price: Low to High
              </SelectItem>
              <SelectItem value="price-high">
                Price: High to Low
              </SelectItem> */}
            </SelectContent>
          </Select>

          {/* {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="hidden sm:flex"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )} */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block">
          <ProductFilters
            categories={categories}
            onFiltersChange={setFilters}
            defaultFilter={filters}
            className="sticky top-8"
          />
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="lg:hidden col-span-full">
            <ProductFilters
              categories={categories}
              onFiltersChange={setFilters}
              defaultFilter={filters}
            />
          </div>
        )}

        {/* Products */}
        <div className="@container/main  lg:col-span-3">
          {filteredAndSortedProducts.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 @lg/main:grid-cols-3 @2xl/main:grid-cols-4 @3xl/main:grid-cols-4  gap-4"
                  : "space-y-4 flex flex-col"
              }
            >
              {filteredAndSortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <p className="text-muted-foreground">
                No products found matching your criteria.
              </p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="bg-transparent"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
