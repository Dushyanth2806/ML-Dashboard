import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import SupervisedLearning from "./pages/SupervisedLearning.jsx";
import UnsupervisedLearning from "./pages/UnsupervisedLearning.jsx";
import LinearRegression from "./pages/LinearRegression.jsx";
import StockPrediction from "./pages/StockPrediction.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/supervised" element={<SupervisedLearning />} />
          <Route path="/supervised/linear-regression" element={<LinearRegression />} />
          <Route path="/stock-prediction" element={<StockPrediction />} />
          <Route path="/unsupervised" element={<UnsupervisedLearning />} />
          <Route
            path="*"
            element={
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <h2>Page not found</h2>
                <p>The page you're looking for doesn't exist.</p>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
