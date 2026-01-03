import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PostProvider } from "@/contexts/PostContext";
import { AdminProvider } from "@/contexts/AdminContext";
import Index from "./pages/Index";
import ProductPage from "./pages/ProductPage";
import AddProductPage from "./pages/AddProductPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import RankingsPage from "./pages/RankingsPage";
import LoginPage from "./pages/LoginPage";
import CommunityFeedPage from "./pages/CommunityFeedPage";
import ScannerPage from "./pages/ScannerPage";
import CategoryViewPage from "./pages/CategoryViewPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PostProvider>
      <AdminProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MobileLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/product" element={<ProductPage />} />
                <Route path="/product/:barcode" element={<ProductPage />} />
                <Route path="/add-product" element={<AddProductPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/rankings" element={<RankingsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/feed" element={<CommunityFeedPage />} />
                <Route path="/scan" element={<ScannerPage />} />
                <Route path="/category/:category" element={<CategoryViewPage />} />
                <Route path="/article/:slug" element={<ArticleDetailPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MobileLayout>
          </BrowserRouter>
        </TooltipProvider>
      </AdminProvider>
    </PostProvider>
  </QueryClientProvider>
);

export default App;
