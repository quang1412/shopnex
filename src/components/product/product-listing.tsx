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
import { Filter, X, Grid3X3, List, XIcon } from "lucide-react";

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
  { value: 'name', label: 'Tên: a-z' },
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

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 500 ||
    filters.inStock ||
    filters.featured ||
    sortBy !== "name";

  return (
    <div className="space-y-4">

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



        {/* Products */}
        <div className="@container/grid-view lg:col-span-3 space-y-4">

          {/* Filters Header */}
          <div className="flex flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                // size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={"lg:hidden "}
              >
                {(showFilters ? <XIcon className="h-4 w-4 mr-2" /> : <Filter className="h-4 w-4 mr-2" />)}
                Bộ lọc
              </Button>
              <span className="text-sm text-muted-foreground">
                {filteredAndSortedProducts.length} sản phẩm
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex border rounded-lg p-0.5 ">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="  "
                >
                  <Grid3X3 className=" " />
                  <span className="hidden sm:block">Grid</span>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="  "
                >
                  <List className=" " />
                  <span className="hidden sm:block">List</span>
                </Button>
              </div>

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
                </SelectContent>
              </Select>
            </div>
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

          {filteredAndSortedProducts.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 @xl/grid-view:grid-cols-3 @4xl/grid-view:grid-cols-4  gap-4"
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
