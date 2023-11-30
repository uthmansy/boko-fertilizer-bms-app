import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { AuthProvider } from "./contexts/authContext";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import { ItemsProvider } from "./contexts/itemsContext";
import { MenuProvider } from "./contexts/menuContext";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // Disable auto refetching globally
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ItemsProvider>
          <MenuProvider>
            <BrowserRouter>
              <main className='font-main bg-slate-400'>
                <Routes>
                  <Route
                    path='/*'
                    element={<PrivateRoute element={<Dashboard />} />}
                  />
                  <Route path='/login' element={<Login />} />
                </Routes>
              </main>
            </BrowserRouter>
          </MenuProvider>
        </ItemsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
