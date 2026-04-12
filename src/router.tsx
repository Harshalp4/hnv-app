import { createBrowserRouter, Navigate } from 'react-router';
import { AppShell } from './components/layout/AppShell';
import { QuotationPage } from './modules/quotation/QuotationPage';
import { InvoicePage } from './modules/invoice/InvoicePage';
import { ProposalPage } from './modules/proposal/ProposalPage';
import { CompanyProfilePage } from './modules/companyProfile/CompanyProfilePage';
import { ClientHistoryPage } from './modules/clientHistory/ClientHistoryPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/quotation" replace /> },
      { path: 'quotation', element: <QuotationPage /> },
      { path: 'invoice', element: <InvoicePage /> },
      { path: 'proposal', element: <ProposalPage /> },
      { path: 'profile', element: <CompanyProfilePage /> },
      { path: 'history', element: <ClientHistoryPage /> },
    ],
  },
]);
