import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/app/AppLayout";
import { Home } from "./pages/Home";
import { Panfletos } from "./pages/Panfletos";
import { Videos } from "./pages/Videos";
import { Materiais } from "./pages/Materiais";
import { Desafios } from "./pages/Desafios";
import { VideoDetalhe } from "./pages/VideoDetalhe";
import { MaterialLeitura } from "./pages/MaterialLeitura";
import { Instalar } from "./pages/Instalar";
import { NotFound } from "./pages/NotFound";

// admin
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminConteudos } from "./pages/admin/AdminConteudos";
import { AdminDesafios } from "./pages/admin/AdminDesafios";

export function RoutesApp() {
    return (
        <BrowserRouter>
            <Routes>
                {/* app público: cabeçalho + barra inferior */}
                <Route element={<AppLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/panfletos" element={<Panfletos />} />
                    <Route path="/videos" element={<Videos />} />
                    <Route path="/videos/:id" element={<VideoDetalhe />} />
                    <Route path="/materiais" element={<Materiais />} />
                    <Route path="/materiais/:id" element={<MaterialLeitura />} />
                    <Route path="/desafios" element={<Desafios />} />
                    {/* fora da barra inferior: é uma página para compartilhar o link de instalação */}
                    <Route path="/instalar" element={<Instalar />} />
                    <Route path="*" element={<NotFound />} />
                </Route>

                {/* painel admin */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminConteudos />} />
                    <Route path="desafios" element={<AdminDesafios />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
