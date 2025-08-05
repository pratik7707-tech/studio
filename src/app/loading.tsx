
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white sticky top-0 z-20 shadow-sm">
        <div className="border-t-4 border-yellow-400" />
        <div className="container mx-auto px-4 md:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-6">
                 <div className='flex items-center gap-2'>
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <div className="hidden md:flex items-center gap-6 text-sm font-medium h-full">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-28" />
                    <Skeleton className="h-6 w-16" />
                </div>
            </div>
             <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </div>
        </div>
      </header>
        <div className="bg-card border-b sticky top-[84px] z-10">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 h-20 flex items-center justify-between">
                <div className='flex items-center gap-4'>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-6 w-16" />
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-36" />
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-10" />
                </div>
            </div>
        </div>
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid gap-6 mb-6 md:grid-cols-3">
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
        </div>
        
        <div className="grid grid-cols-1">
            <Skeleton className="h-96 rounded-lg" />
        </div>
      </main>
    </div>
  );
}
