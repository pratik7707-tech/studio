
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, ChevronDown, MoreVertical, X } from 'lucide-react';
import { UnfpaLogo, QuantumPlusLogo } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '../ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';


type NavItem = 'RRP Plan' | 'Partner Implementation' | 'Integrated Budget' | 'Admin';

export function Header() {
  const [activeNav, setActiveNav] = useState<NavItem>('Integrated Budget');
  const pathname = usePathname();

  const navItems: NavItem[] = [
    'RRP Plan',
    'Partner Implementation',
    'Integrated Budget',
    'Admin'
  ];

  const adminMenuItems = [
    { label: 'Manage IP', href: '#' },
    { label: 'OFA Migration Dashboard', href: '#' },
    { label: 'OFA Summary Dashboard', href: '#' },
    { label: 'RRP Monitoring', href: '#' },
    { label: 'Mandatory Tasks', href: '#' },
    { label: 'Manage Strategic Plan', href: '#' },
    { label: 'Manage Standard Initiative', href: '/manage-standard-initiatives' },
    { label: 'Manage Budget Envelope', href: '#' },
    { label: 'Manage Programme Output', href: '#' }
  ];

  useEffect(() => {
    if (pathname === '/') {
      setActiveNav('Integrated Budget');
    } else if (adminMenuItems.some(item => item.href === pathname)) {
      setActiveNav('Admin');
    }
  }, [pathname, adminMenuItems]);

  const navLinks: { [key in NavItem]?: string } = {
    'Integrated Budget': '/',
  };

  return (
    <>
      <header className="bg-white sticky top-0 z-20 shadow-sm">
        <div className="border-t-4 border-yellow-400" />
        <div className="container mx-auto px-4 md:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className='flex items-center gap-2'>
              <UnfpaLogo className="h-8 w-auto" />
              <QuantumPlusLogo className="h-8" />
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium h-full">
              {navItems.map((item) => {
                const link = navLinks[item];
                const buttonContent = (
                  <button
                    onClick={() => setActiveNav(item)}
                    className={cn(
                      "h-full flex items-center border-b-2 transition-colors",
                      activeNav === item
                        ? "text-primary font-semibold border-primary"
                        : "text-gray-600 border-transparent hover:text-primary"
                    )}
                  >
                    {item}
                  </button>
                );

                if (item === 'Admin') {
                  return (
                    <DropdownMenu key={item}>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={cn(
                            "h-full flex items-center border-b-2 transition-colors",
                            activeNav === item
                              ? "text-primary font-semibold border-primary"
                              : "text-gray-600 border-transparent hover:text-primary"
                          )}
                        >
                          {item}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {adminMenuItems.map((adminItem) => (
                          <DropdownMenuItem key={adminItem.label} asChild>
                            <Link href={adminItem.href}>{adminItem.label}</Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )
                }

                if (link) {
                  return <Link key={item} href={link} legacyBehavior passHref>{buttonContent}</Link>;
                }

                return <div key={item}>{buttonContent}</div>;
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Notifications</h3>
                </div>
                <ScrollArea className="h-64">
                   <Accordion type="single" collapsible defaultValue="item-1">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>No New Role Request(s)</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground p-4">
                          No notifications available
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </ScrollArea>
              </PopoverContent>
            </Popover>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>PS</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm font-medium">Pratik Shendkar</span>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className="bg-card border-b sticky top-[84px] z-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className='flex items-center gap-4'>
                <h1 className="text-2xl font-extrabold font-headline text-foreground">Integrated Budget</h1>
                <Badge variant="secondary" className="text-sm font-medium">Draft</Badge>
            </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Select defaultValue="v1">
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Version" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="v1">V1</SelectItem>
                <SelectItem value="v2" disabled>V2</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="2026-29">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026-29">Budget 2026-29</SelectItem>
                <SelectItem value="2025-28" disabled>2025-28</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="B0002">
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="B0002">B0002-Corp HQ - Management and Admin</SelectItem>
                <SelectItem value="B0001">B0001-Executive Office</SelectItem>
                <SelectItem value="B0010">B0010-Ethics Office</SelectItem>
                <SelectItem value="B0100">B0100-Office of Audit and Investigation Services</SelectItem>
                <SelectItem value="B0101">B0101-Evaluation Office</SelectItem>
                <SelectItem value="B0110">B0110-Division for Human Resources</SelectItem>
                <SelectItem value="B1100">B1100-Humanitarian Response Division</SelectItem>
                <SelectItem value="B1140">B1140-Programme Division</SelectItem>
                <SelectItem value="B1400">B1400-Regional Office/ESA Region</SelectItem>
                <SelectItem value="B1420">B1420-Regional Office/WCA Region</SelectItem>
                <SelectItem value="B1600">B1600-Asia and Pacific Regional Office</SelectItem>
                <SelectItem value="B1700">B1700-Latin America/Caribbean Regional Office</SelectItem>
                <SelectItem value="B1800">B1800-Arab States Regional Office</SelectItem>
                <SelectItem value="B1900">B1900-EECA Regional Office</SelectItem>
                <SelectItem value="B2100">B2100-Division for Management Services</SelectItem>
                <SelectItem value="B2107">B2107-Supply Chain Management Unit</SelectItem>
                <SelectItem value="B2108">B2108-Information Technology Solutions Office</SelectItem>
                <SelectItem value="B2230">B2230-Division for External Relations</SelectItem>
                <SelectItem value="B2300">B2300-Office of Security Coordinator</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
