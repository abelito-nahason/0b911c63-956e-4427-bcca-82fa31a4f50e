'use client'
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import MainPage from "./components/MainPage";

export default function Home() {
  const queryClient = new QueryClient()

  // const makeApiCall = async () => {
  //   tableData.getData({page: 1, pageSize: 10})
  // }
  
  
  return (
    <QueryClientProvider client={queryClient}>
      <MainPage/>
    </QueryClientProvider>
  );
}

