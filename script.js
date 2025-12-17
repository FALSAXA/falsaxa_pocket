let transaksi = JSON.parse(localStorage.getItem('trx')) || []

function tambah() {
  const n = Number(document.getElementById('nominal').value)
  if (!n || n <= 0) return
  const d = new Date()
  const w = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  const tipe = document.getElementById('tipe').value
  const media = document.getElementById('media').value
  transaksi.push({ n, t: tipe, m: media, w })
  document.getElementById('nominal').value = ''
  simpan()
}

function hapus(i) {
  transaksi.splice(i, 1)
  simpan()
}

function simpan() {
  localStorage.setItem('trx', JSON.stringify(transaksi))
  render()
}

function render() {
  let s = 0, c = 0
  const list = document.getElementById('list')
  const saldoEl = document.getElementById('saldo')
  const cashEl = document.getElementById('cash')
  
  list.innerHTML = ''
  
  const sorted = [...transaksi].reverse()
  sorted.forEach((x, i) => {
    const originalIndex = transaksi.length - 1 - i
    const v = x.t === 'masuk' ? x.n : -x.n
    x.m === 'saldo' ? s += v : c += v
    
    list.innerHTML += `
    <li class="${x.t}">
      <div class="${x.t==='masuk'?'label-masuk':'label-keluar'}">
        ${x.t.toUpperCase()} ${x.m.toUpperCase()}<br>
        Rp ${x.n.toLocaleString('id-ID')}
      </div>
      <button class="hapus" onclick="hapus(${originalIndex})">✕</button>
    </li>`
  })
  
  saldoEl.textContent = s.toLocaleString('id-ID')
  cashEl.textContent = c.toLocaleString('id-ID')
}

render()

