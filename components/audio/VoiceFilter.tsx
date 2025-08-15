import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter } from "lucide-react";

interface VoicesFilterProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  genderFilter: string;
  setGenderFilter: (val: string) => void;
}

export function VoicesFilter({ searchQuery, setSearchQuery, genderFilter, setGenderFilter }: VoicesFilterProps) {
  return (
    <div className="px-6 py-4 border-b bg-background/50 backdrop-blur-sm flex-shrink-0">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Tabs value={genderFilter} onValueChange={setGenderFilter}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="male" className="text-xs">Male</TabsTrigger>
              <TabsTrigger value="female" className="text-xs">Female</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
