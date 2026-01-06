import { useEffect, useState } from "react";

export default function App() {
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [meses, setMeses] = useState(1);
  const [contas, setContas] = useState(() => {
    const dados = localStorage.getItem("contas");
    return dados ? JSON.parse(dados) : [];
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("contas", JSON.stringify(contas));
  }, [contas]);

  function salvar() {
    if (!nome || !valor) return;

    if (editId) {
      setContas(
        contas.map((c) =>
          c.id === editId ? { ...c, nome, valor, meses } : c
        )
      );
      setEditId(null);
    } else {
      setContas([
        ...contas,
        {
          id: Date.now(),
          nome,
          valor,
          meses,
          pagos: Array.from({ length: meses }, () => false),
        },
      ]);
    }

    setNome("");
    setValor("");
    setMeses(1);
  }

  function editar(conta) {
    setNome(conta.nome);
    setValor(conta.valor);
    setMeses(conta.meses);
    setEditId(conta.id);
  }

  function togglePago(contaId, index) {
    setContas(
      contas.map((c) =>
        c.id === contaId
          ? {
              ...c,
              pagos: c.pagos.map((p, i) => (i === index ? !p : p)),
            }
          : c
      )
    );
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: 400, margin: "auto" }}>
      <h2>📒 Agenda de Contas</h2>

      <input
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Valor"
        type="number"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Quantidade de meses"
        type="number"
        min="1"
        value={meses}
        onChange={(e) => setMeses(Number(e.target.value))}
      />
      <br /><br />

      <button onClick={salvar}>
        {editId ? "Salvar edição" : "Adicionar"}
      </button>

      <hr />

      {contas.map((conta) => (
        <div key={conta.id} style={{ marginBottom: 15 }}>
          <strong>{conta.nome}</strong> — R$ {conta.valor}
          <br />

          {conta.pagos.map((pago, i) => (
            <label key={i} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={pago}
                onChange={() => togglePago(conta.id, i)}
              />
              Mês {i + 1}
            </label>
          ))}

          <button onClick={() => editar(conta)}>✏️ Editar</button>
        </div>
      ))}
    </div>
  );
}
