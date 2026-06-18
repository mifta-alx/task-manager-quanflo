import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from "@/components/ui/sonner"
import App from './App.tsx'
import {TooltipProvider} from "@/components/ui/tooltip";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <TooltipProvider>
         <App />
      </TooltipProvider>
      <Toaster position="top-right"/>
  </StrictMode>,
)
