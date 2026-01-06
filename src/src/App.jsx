import { useEffect, useState } from "react";

export default function App() {
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [contas, setContas] = useState(() => {
    return JSON.parse(localStorage.getItem("contas")) || [];
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("contas", JSON.stringify(contas));
  }, [contas]);

  const salvar = () => {
    if (!nome || !valor) return;
    if (editId) {
      setContas(contas.map(c => c.id === editId ? { ...c, nome, valor } : c));
      setEditId(null);
    } else {
      setContas([...contas, { id: Date.now(), nome, valor, pago: false }]);
    }
    setNome(""); setValor("");
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "auto" }}>
      <h2>Agenda de Contas</h2>

      <input placeholder="Nome" value={nome}
        onChange={e => setNome(e.target.value)} /><br/><br/>
      <input type="number" placeholder="Valor" value={valor}
        onChange={e => setValor(e.target.value)} /><br/><br/>

      <button onClick={salvar}>
        {editId ? "Salvar" : "Adicionar"}
      </button>

      <hr/>

      {contas.map(c => (
        <div key={c.id}>
          <b>{c.nome}</b> - R$ {c.valor}
          <button onClick={() => {
            setNome(c.nome); setValor(c.valor); setEditId(c.id);
          }}>✏️</button>
          <button onClick={() =>
            setContas(contas.map(x => x.id === c.id ? { ...x, pago: !x.pago } : x))
          }>
            {c.pago ? "✅" : "❌"}
          </button>
        </div>
      ))}
    </div>
  );
}
