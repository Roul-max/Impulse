import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { ShopAssistant } from './ShopAssistant';
import { Footer } from './Footer';
import { AnnouncementBar } from './AnnouncementBar';
import { BottomNav } from './BottomNav';
import { ExitIntent } from './ExitIntent';
import { CompareTray } from './CompareTray';

export const Layout = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-dark-bg font-body text-gray-900 dark:text-gray-100 transition-colors duration-200 pb-16 md:pb-0">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ShopAssistant />
      <BottomNav />
      <ExitIntent />
      <CompareTray />
    </div>
  );
};