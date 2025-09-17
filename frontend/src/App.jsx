import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';

function App() {
  const baseURL = 'http://127.0.0.1:8000';

  return (
    <BrowserRouter>
      <AppRoutes baseURL={baseURL} />
    </BrowserRouter>
  );
}

export default App;
