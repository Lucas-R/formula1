import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Template from './Template/index.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Template />
  </StrictMode>,
)
