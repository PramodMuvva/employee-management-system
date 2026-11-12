import { useEffect, useState } from 'react'

const API = 'http://localhost:8080/api/employees'
const emptyForm = { name: '', email: '', department: '', salary: '' }

export default function App() {
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  async function loadEmployees() {
    setLoading(true)
    try {
      const response = await fetch(API)
      if (!response.ok) throw new Error('Could not load employees')
      setEmployees(await response.json())
      setMessage('')
    } catch (error) {
      setMessage(`${error.message}. Is the Spring Boot backend running?`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadEmployees() }, [])

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    const payload = { ...form, salary: Number(form.salary) }
    const url = editingId ? `${API}/${editingId}` : API
    try {
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(Object.values(error).join(', ') || 'Request failed')
      }
      setForm(emptyForm)
      setEditingId(null)
      setMessage(editingId ? 'Employee updated successfully.' : 'Employee added successfully.')
      await loadEmployees()
    } catch (error) {
      setMessage(error.message)
    }
  }

  function startEdit(employee) {
    setEditingId(employee.id)
    setForm({
      name: employee.name,
      email: employee.email,
      department: employee.department || '',
      salary: String(employee.salary),
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function deleteEmployee(id) {
    if (!window.confirm('Delete this employee?')) return
    try {
      const response = await fetch(`${API}/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Could not delete employee')
      setMessage('Employee deleted successfully.')
      await loadEmployees()
    } catch (error) {
      setMessage(error.message)
    }
  }

  const filtered = employees.filter(employee =>
    `${employee.name} ${employee.email} ${employee.department || ''}`
      .toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="page">
      <header className="topbar">
        <div><div className="eyebrow">WORKSPACE / PEOPLE</div><h1>Employee Management</h1><p>Manage your team records in one place.</p></div>
        <div className="count"><strong>{employees.length}</strong><span>Total employees</span></div>
      </header>

      {message && <div className="message" role="status">{message}</div>}

      <section className="panel">
        <div className="section-heading"><div><div className="eyebrow">EMPLOYEE DETAILS</div><h2>{editingId ? 'Update employee' : 'Add a new employee'}</h2></div></div>
        <form onSubmit={handleSubmit} className="form-grid">
          <label>Full name<input name="name" value={form.name} onChange={updateField} placeholder="e.g. Pramod Muvva" required maxLength="100" /></label>
          <label>Email address<input name="email" type="email" value={form.email} onChange={updateField} placeholder="name@example.com" required /></label>
          <label>Department<input name="department" value={form.department} onChange={updateField} placeholder="e.g. Engineering" /></label>
          <label>Salary<input name="salary" type="number" min="0.01" step="0.01" value={form.salary} onChange={updateField} placeholder="e.g. 30000" required /></label>
          <div className="form-actions">
            <button className="primary" type="submit">{editingId ? 'Save changes' : 'Add employee'}</button>
            {editingId && <button className="secondary" type="button" onClick={() => { setEditingId(null); setForm(emptyForm) }}>Cancel</button>}
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="section-heading list-heading"><div><div className="eyebrow">DIRECTORY</div><h2>All employees</h2></div><input className="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees..." /></div>
        {loading ? <p className="empty">Loading employees...</p> : filtered.length === 0 ? <p className="empty">No employees found. Add your first employee above.</p> : (
          <div className="table-wrap"><table><thead><tr><th>EMPLOYEE</th><th>DEPARTMENT</th><th>SALARY</th><th>ACTIONS</th></tr></thead><tbody>
            {filtered.map(employee => <tr key={employee.id}>
              <td><strong>{employee.name}</strong><small>{employee.email}</small></td>
              <td>{employee.department || '—'}</td>
              <td>₹{Number(employee.salary).toLocaleString('en-IN')}</td>
              <td className="actions"><button className="text-button" onClick={() => startEdit(employee)}>Edit</button><button className="text-button danger" onClick={() => deleteEmployee(employee.id)}>Delete</button></td>
            </tr>)}
          </tbody></table></div>
        )}
      </section>
      <footer>Employee Management System · React + Spring Boot + PostgreSQL</footer>
    </main>
  )
}
