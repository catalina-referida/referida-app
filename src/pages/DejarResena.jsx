import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'

const STEPS = [
  { key: 'task', question: '¿Qué hizo?', type: 'text', placeholder: 'Ej: Instaló un tomacorriente en la cocina' },
  { key: 'rating', question: '¿Qué puntaje le das?', type: 'stars' },
  { key: 'respectful', question: '¿Cómo fue el trato?', type: 'options', options: [
    { value: 'respetuoso', label: 'Respetuoso', desc: 'Se comportó de manera profesional', emoji: '😊' },
    { value: 'normal', label: 'Normal', desc: 'Sin problemas, pero sin destacar', emoji: '😐' },
    { value: 'incomodo', label: 'Incómodo', desc: 'Me sentí incómoda', emoji: '😤' },
  ]},
  { key: 'on_time', question: '¿Llegó a la hora?', type: 'yesno', yesLabel: 'Sí, puntual', noLabel: 'No, llegó tarde' },
  { key: 'was_alone', question: '¿Estabas sola en casa?', type: 'yesno', yesLabel: 'Sí, estaba sola', noLabel: 'No, había alguien más' },
  { key: 'would_return', question: '¿Lo volvés a llamar?', type: 'yesno', yesLabel: 'Sí, sin dudarlo', noLabel: 'No lo llamaría de nuevo' },
  { key: 'comment', question: 'Contanos más', type: 'textarea', placeholder: 'Lo que querés que sepan los demás...' },
]

export default function DejarResena() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({ rating: 5 })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const current = STEPS[step]
  const total = STEPS.length

  function setAnswer(key, value) { setAnswers(prev => ({ ...prev, [key]: value })) }
  function next() { if (step < total - 1) setStep(step + 1); else submit() }
  function prev() { if (step > 0) setStep(step - 1) }

  async function submit() {
    setLoading(true)
    const { error } = await supabase.from('reviews').insert({
      provider_id: id, user_id: user.id, task: answers.task, rating: answers.rating,
      respectful: answers.respectful, on_time: answers.on_time === true,
      was_alone: answers.was_alone === true, would_return: answers.would_return === true,
      comment: answers.comment, tags: buildTags(answers),
    })
    if (!error) {
      const { data: allReviews } = await supabase.from('reviews').select('rating').eq('provider_id', id)
      if (allReviews?.length) {
        const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
        await supabase.from('providers').update({ rating: Math.round(avg * 10) / 10 }).eq('id', id)
      }
      setDone(true)
    }
    setLoading(false)
  }

  function buildTags(a) {
    const tags = []
    if (a.on_time === true) tags.push('Puntual')
    if (a.respectful === 'respetuoso') tags.push('Respetuoso')
    if (a.would_return === true) tags.push('Recomendado')
    return tags
  }

  const canContinue = () => {
    if (current.type === 'text' || current.type === 'textarea') return true
    if (current.type === 'stars') return answers.rating > 0
    if (current.type === 'options') return !!answers[current.key]
    if (current.type === 'yesno') return answers[current.key] !== undefined
    return true
  }

  if (done) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: '#111', letterSpacing: -1, marginBottom: 8 }}>¡Gracias por tu reseña!</h1>
      <p style={{ fontSize: 14, color: '#888', marginBottom: 32, lineHeight: 1.6 }}>Tu experiencia ayuda a otras personas a tomar mejores decisiones.</p>
      <button className="btn" onClick={() => navigate(`/proveedor/${id}`)}>Ver el perfil</button>
      <button className="btn btn-ghost" style={{ marginTop: 10 }} onClick={() => navigate('/home')}>Ir al inicio</button>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ padding: '14px 22px 0' }}>
        <div className="progress-bar">{STEPS.map((_, i) => <div key={i} className={`progress-step ${i <= step ? 'done' : ''}`} />)}</div>
        <div style={{ fontSize: 11, color: '#BBB', marginBottom: 16 }}>Pregunta {step + 1} de {total}</div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#111', letterSpacing: -0.5, lineHeight: 1.2, marginBottom: 28 }}>{current.question}</h1>
      </div>
      <div className="page" style={{ paddingTop: 0 }}>
        {current.type === 'text' && <input className="input" placeholder={current.placeholder} value={answers[current.key] || ''} onChange={e => setAnswer(current.key, e.target.value)} />}
        {current.type === 'textarea' && <textarea className="input" placeholder={current.placeholder} value={answers[current.key] || ''} onChange={e => setAnswer(current.key, e.target.value)} rows={4} style={{ resize: 'none' }} />}
        {current.type === 'stars' && (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', padding: '16px 0' }}>
            {[1,2,3,4,5].map(n => <span key={n} onClick={() => setAnswer('rating', n)} style={{ fontSize: 40, cursor: 'pointer', color: n <= (answers.rating || 0) ? '#E8622A' : '#DDD' }}>★</span>)}
          </div>
        )}
        {current.type === 'options' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {current.options.map(opt => (
              <div key={opt.value} onClick={() => setAnswer(current.key, opt.value)} style={{ border: answers[current.key] === opt.value ? '2px solid #E8622A' : '1.5px solid #EEE', borderRadius: 12, padding: '14px 16px', background: answers[current.key] === opt.value ? '#FFF0E8' : '#F8F8F8', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <span style={{ fontSize: 22 }}>{opt.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{opt.label}</div>
                  <div style={{ fontSize: 11, color: '#888' }}>{opt.desc}</div>
                </div>
                {answers[current.key] === opt.value && <span style={{ color: '#E8622A', fontWeight: 700 }}>✓</span>}
              </div>
            ))}
          </div>
        )}
        {current.type === 'yesno' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div onClick={() => setAnswer(current.key, true)} style={{ border: answers[current.key] === true ? '2px solid #E8622A' : '1.5px solid #EEE', borderRadius: 12, padding: '16px', background: answers[current.key] === true ? '#FFF0E8' : '#F8F8F8', textAlign: 'center', fontSize: 15, fontWeight: 600, color: answers[current.key] === true ? '#E8622A' : '#555', cursor: 'pointer' }}>{current.yesLabel}</div>
            <div onClick={() => setAnswer(current.key, false)} style={{ border: answers[current.key] === false ? '2px solid #E8622A' : '1.5px solid #EEE', borderRadius: 12, padding: '16px', background: answers[current.key] === false ? '#FFF0E8' : '#F8F8F8', textAlign: 'center', fontSize: 15, fontWeight: 600, color: answers[current.key] === false ? '#E8622A' : '#555', cursor: 'pointer' }}>{current.noLabel}</div>
          </div>
        )}
        <div style={{ marginTop: 28 }}>
          <button className="btn" onClick={next} disabled={!canContinue() || loading}>
            {loading ? 'Publicando...' : step === total - 1 ? 'Publicar reseña ✓' : 'Siguiente →'}
          </button>
          {step > 0 && <div style={{ textAlign: 'center', marginTop: 12 }}><span onClick={prev} style={{ fontSize: 13, color: '#888', cursor: 'pointer' }}>← Anterior</span></div>}
        </div>
      </div>
    </div>
  )
}