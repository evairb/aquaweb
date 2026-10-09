import filtros from "../../../assets/img/equipamentos/filtros.jpg";
import aquecedores from "../../../assets/img/equipamentos/aquecedores.jpg";
import iluminacao from "../../../assets/img/equipamentos/iluminacao.jpg";
import co2 from "../../../assets/img/equipamentos/co2.jpg";
import substrato from "../../../assets/img/equipamentos/substrato.jpg";
import bombas from "../../../assets/img/equipamentos/bombas.jpg";

export interface CategoriaEquipamentoItem {
  id: string;
  label: string;
  descricao: string;
  href: string;
  imagem: string;
}

export const CATEGORIAS: CategoriaEquipamentoItem[] = [
  { id: "filtros", label: "Filtros", descricao: "Interno, canister, HOB e sump", href: "/equipamentos/filtros", imagem: filtros },
  { id: "aquecedores", label: "Aquecedores", descricao: "Controle de temperatura", href: "/equipamentos/aquecedores", imagem: aquecedores },
  { id: "iluminacao", label: "Iluminação", descricao: "Luminárias e espectro", href: "/equipamentos/iluminacao", imagem: iluminacao },
  { id: "co2", label: "Sistemas de CO₂", descricao: "Pressurizado e DIY", href: "/equipamentos/co2", imagem: co2 },
  { id: "substrato", label: "Substratos", descricao: "Inerte, nutritivo e solo ativo", href: "/equipamentos/substrato", imagem: substrato },
  { id: "bombas", label: "Bombas/Circuladores", descricao: "Circulação e retorno", href: "/equipamentos/bombas", imagem: bombas },
]