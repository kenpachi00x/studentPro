
import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

const filieres = ["Développement", "Cyber", "Infrastructure"];
const niveaux = ["Niveau 1", "Niveau 2"];

function App() {
  const [students, setStudents] = useState(
    () => JSON.parse(localStorage.getItem("students") || "[]")
  );
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const addStudent = (s) =>
    setStudents([...students, { ...s, id: Date.now() }]);

  const updateStudent = (s) =>
    setStudents(students.map((x) => x.id === s.id ? s : x));

  const deleteStudent = (id) => {
    if (confirm("Supprimer cet étudiant ?")) {
      setStudents(students.filter((s) => s.id !== id));
    }
  };

  return (
    <>
      <nav className="navbar">
        <h2>🎓 StudentPro</h2>
        <div>
          <Link to="/">Accueil</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/students">Étudiants</Link>
          <Link to="/add">Ajouter</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard students={students} />} />
        <Route path="/students" element={
          <Students
            students={students}
            onDelete={deleteStudent}
            onSelect={setSelected}
          />
        } />
        <Route path="/add" element={<Form onSave={addStudent} />} />
        <Route path="/edit" element={
          <Form student={selected} onSave={updateStudent} />
        } />
        <Route path="/details" element={<Details student={selected} />} />
      </Routes>
    </>
  );
}

function Home() {
  return (
    <div className="home">
      <h1>Bienvenue sur StudentPro</h1>
      <p>Application de gestion des étudiants</p>
      <Link to="/dashboard" className="btn">Commencer</Link>
    </div>
  );
}

function Dashboard({ students }) {
  return (
    <div className="container">
      <h1>Dashboard</h1>
      <div className="cards">
        <div className="card">
          <h3>Total étudiants</h3>
          <h1>{students.length}</h1>
        </div>
        {filieres.map((f) => (
          <div className="card" key={f}>
            <h3>{f}</h3>
            <h1>{students.filter((s) => s.filiere === f).length}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}

function Students({ students, onDelete, onSelect }) {
  const [search, setSearch] = useState("");

  const filtered = students.filter((s) =>
    `${s.nom} ${s.prenom} ${s.filiere} ${s.niveau}`
      .toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <div className="title-row">
        <h1>Liste des étudiants</h1>
        <Link to="/add" className="btn">+ Ajouter</Link>
      </div>

      <input
        className="search"
        placeholder="Rechercher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Filière</th>
              <th>Niveau</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td>{s.nom}</td>
                <td>{s.prenom}</td>
                <td>{s.filiere}</td>
                <td>{s.niveau}</td>
                <td>
                  <Link to="/details" className="action"
                    onClick={() => onSelect(s)}>Détails</Link>
                  <Link to="/edit" className="action"
                    onClick={() => onSelect(s)}>Modifier</Link>
                  <button className="delete"
                    onClick={() => onDelete(s.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr><td colSpan="5">Aucun étudiant trouvé.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Form({ student, onSave }) {
  const [form, setForm] = useState({
    nom: "", prenom: "", filiere: "", niveau: ""
  });

  useEffect(() => {
    setForm(student || {
      nom: "", prenom: "", filiere: "", niveau: ""
    });
  }, [student]);

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onSave(form);
    alert(student ? "Modification réussie !" : "Étudiant ajouté !");
  };

  return (
    <div className="form-container">
      <h1>{student ? "Modifier" : "Ajouter"} un étudiant</h1>
      <form onSubmit={submit}>
        <label>Nom</label>
        <input name="nom" value={form.nom} onChange={change} required />

        <label>Prénom</label>
        <input name="prenom" value={form.prenom} onChange={change} required />

        <label>Filière</label>
        <select name="filiere" value={form.filiere} onChange={change} required>
          <option value="">Choisir une filière</option>
          {filieres.map((f) => <option key={f}>{f}</option>)}
        </select>

        <label>Niveau</label>
        <select name="niveau" value={form.niveau} onChange={change} required>
          <option value="">Choisir le niveau</option>
          {niveaux.map((n) => <option key={n}>{n}</option>)}
        </select>

        <button className="btn">Enregistrer</button>
        <Link to="/students" className="back">Retour</Link>
      </form>
    </div>
  );
}

function Details({ student }) {
  if (!student) return <div className="container">Aucun étudiant sélectionné.</div>;

  return (
    <div className="form-container">
      <h1>Détails de l'étudiant</h1>
      <p><strong>Nom :</strong> {student.nom}</p>
      <p><strong>Prénom :</strong> {student.prenom}</p>
      <p><strong>Filière :</strong> {student.filiere}</p>
      <p><strong>Niveau :</strong> {student.niveau}</p>
      <Link to="/students" className="btn">Retour</Link>
    </div>
  );
}

export default App;
