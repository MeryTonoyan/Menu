const $ = s => document.querySelector(s)

fetch('http://localhost:3008/categories').then(res => res.json()).then((data) => {
    $('#category-list').innerHTML = data.map(res => `
        <li class="nav-item">
            <a class="nav-link cat-item" data-id="${res.id}">
                ${res.name}
            </a>
        </li>
    `).join("")
})

$('#category-list').onclick = function (e) {
    let el = e.target.closest('.cat-item')
    if (!el) return
    let id = +el.getAttribute('data-id')

    document.querySelectorAll('.cat-item').forEach(i =>
        i.classList.remove('active'))
        el.classList.add('active')

    fetch('http://localhost:3008/categories/' + id).then(res => res.json()).then((data) => {
        $('#page-title').innerHTML = `${data.name}`
    })

    fetch('http://localhost:3008/products/' + id).then(res => res.json()).then((data) => {
        $('#count-badge').innerHTML = `${data.length} հատ`
        $('#product-list').innerHTML = data.map(res => `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="product-title">
                        <div class="name">${res.name}</div>
                        <span class="badge">Ներկա ID: #${res.cat_id}</span>
                    </div>
                    <div class="btn-group-wrap">
                        <button class="btn btn-danger btn-sm me-2" data-action="delete" data-id="${res.id}">Ջնջել</button>
                        <hr>
                        <p class="small text-muted w-100">Տեղափոխել դեպի՝</p>
                        <button class="btn-move" data-pid="${res.id}" data-to="1">Մրգեր</button>
                        <button class="btn-move" data-pid="${res.id}" data-to="2">Բանջարեղեն</button>
                        <button class="btn-move" data-pid="${res.id}" data-to="3">Միսեր</button>
                        <button class="btn-move" data-pid="${res.id}" data-to="4">Հացամթերք</button>
                    </div>
                </div>
            </div>
        `).join('')
    })
}

$('#product-list').onclick = function (e) {
    let btn = e.target

    if (btn.getAttribute('data-action') === 'delete') {
        let id = btn.getAttribute('data-id')
        fetch('http://localhost:3008/product/' + id, { method: 'DELETE' }).then(res => {
            if (res.ok) btn.closest('.card').remove()
        })
    }

    if (btn.classList.contains('btn-move')) {
        let productId = btn.getAttribute('data-pid')
        let newCatId = btn.getAttribute('data-to')

        fetch('http://localhost:3008/product/move', {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: productId, cat_id: newCatId })
        }).then(res => {
            if (res.ok) {
                // Տեղափոխելուց հետո ապրանքը ջնջում ենք ներկա ցուցակից
                btn.closest('.card').style.opacity = '0.5'
                setTimeout(() => btn.closest('.card').remove(), 300)
            }
        })
    }
}