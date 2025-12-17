let transaksi = JSON.parse(localStorage.getItem('trx')) || []
let notes = JSON.parse(localStorage.getItem('notes')) || []
let now = new Date()
let cm = now.getMonth()
let cy = now.getFullYear()

function buka(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'))
  document.getElementById(id).classList.add('active')
  document.querySelectorAll('.bottom-nav button').forEach(b => b.classList.remove('active'))
  btn.classList.add('active')
  if (id === 'kalender') setTimeout(renderCalendar, 50)
}

function tambah() {
  const n = Number(nominal.value)
  if (!n || n <= 0) return
  const d = new Date()
  const w = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  transaksi.push({ n, t: tipe.value, m: media.value, w })
  nominal.value = ''
  simpan()
}

function hapus(i) {
  if (confirm('Hapus transaksi?')) {
    transaksi.splice(i, 1)
    simpan()
  }
}

function simpan() {
  localStorage.setItem('trx', JSON.stringify(transaksi))
  render()
  renderCalendar()
}

function render() {
  let s = 0, c = 0
  list.innerHTML = ''
  transaksi.slice().reverse().forEach((x, i) => {
    const idx = transaksi.length - 1 - i
    const v = x.t === 'masuk' ? x.n : -x.n
    x.m === 'saldo' ? s += v : c += v
    list.innerHTML += `
    <li class="${x.t}">
      <div class="${x.t==='masuk'?'label-masuk':'label-keluar'}">
        ${x.t.toUpperCase()} ${x.m.toUpperCase()}<br>
        Rp ${x.n.toLocaleString('id-ID')}
      </div>
      <button class="hapus" onclick="hapus(${idx})">✕</button>
    </li>`
  })
  saldo.textContent = s.toLocaleString('id-ID')
  cash.textContent = c.toLocaleString('id-ID')
}

function simpanCatatan() {
  if (!note.value.trim()) return
  notes.push({ text: note.value.trim(), date: new Date().toISOString() })
  note.value = ''
  localStorage.setItem('notes', JSON.stringify(notes))
  renderNote()
}

function renderNote() {
  noteList.innerHTML = ''
  notes.slice().reverse().forEach((n, i) => {
    const idx = notes.length - 1 - i
    noteList.innerHTML += `
    <li>
      <div>${n.text}</div>
      <button class="hapus" onclick="hapusNote(${idx})">✕</button>
    </li>`
  })
}

function hapusNote(i) {
  if (confirm('Hapus catatan?')) {
    notes.splice(i, 1)
    localStorage.setItem('notes', JSON.stringify(notes))
    renderNote()
  }
}

function renderCalendar() {
  calendar.innerHTML = ''
  const monthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
  monthYear.textContent = `${monthNames[cm]} ${cy}`
  const first = new Date(cy, cm, 1).getDay()
  const days = new Date(cy, cm+1, 0).getDate()
  const today = new Date().toISOString().split('T')[0]

  for(let i=0; i<first; i++) calendar.innerHTML += '<div class="empty"></div>'
  for(let d=1; d<=days; d++) {
    const ds = `${cy}-${String(cm+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    const has = transaksi.some(x => x.w === ds)
    calendar.innerHTML += `<div class="${has?'has':''}" onclick="selectDate('${ds}')">${d}</div>`
  }
  
  // Highlight hari ini
  const todayDay = now.getDate()
  const todayMonth = now.getMonth()
  const todayYear = now.getFullYear()
  if(todayMonth === cm && todayYear === cy) {
    const todayCells = calendar.querySelectorAll('div:not(.empty)')
    if(todayCells[todayDay-1]) todayCells[todayDay-1].classList.add('today')
  }
}

function selectDate(d) {
  kalenderList.innerHTML = ''
  transaksi.filter(x => x.w === d).forEach(x => {
    kalenderList.innerHTML += `
    <li class="${x.t}">
      <span class="${x.t==='masuk'?'label-masuk':'label-keluar'}">
        ${x.t.toUpperCase()} ${x.m.toUpperCase()} - Rp ${x.n.toLocaleString('id-ID')}
      </span>
    </li>`
  })
}

function prevMonth() {
  cm--
  if(cm < 0) { cm = 11; cy-- }
  renderCalendar()
  selectDate('')
}

function nextMonth() {
  cm++
  if(cm > 11) { cm = 0; cy++ }
  renderCalendar()
  selectDate('')
}

// Inisialisasi
render()
renderNote()
renderCalendar()
