const API = 'http://localhost:8080';

function loadRooms() {
    fetch(API + '/rooms')
        .then(res => res.json())
        .then(data => {
            const rows = data.map(r => `
                <tr>
                    <td>${r.id}</td>
                    <td>${r.type}</td>
                    <td>${r.price}</td>
                    <td>
                        <button class="action-btn" onclick="editRoom(${r.id}, '${escapeHtml(r.type)}', ${r.price})">Edit</button>
                        <button class="action-btn danger" onclick="deleteRoom(${r.id})">Delete</button>
                    </td>
                </tr>
            `).join('');

            document.getElementById('list').innerHTML = `
                <table border="1" cellpadding="4">
                    <thead><tr><th>ID</th><th>Type</th><th>Price</th><th>Actions</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>`;
        })
        .catch(e => alert('Error: ' + e));
}

function saveRoom() {
    const id = document.getElementById('roomId').value;
    const type = document.getElementById('type').value;
    const price = parseFloat(document.getElementById('price').value || 0);

    const payload = { type, price };
    if (id) {
        // update
        fetch(API + '/rooms/' + id, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        }).then(() => { clearForm(); loadRooms(); })
          .catch(e => alert('Error: ' + e));
    } else {
        // create
        fetch(API + '/rooms', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        }).then(() => { clearForm(); loadRooms(); })
          .catch(e => alert('Error: ' + e));
    }
}

function editRoom(id, type, price) {
    document.getElementById('roomId').value = id;
    document.getElementById('type').value = type;
    document.getElementById('price').value = price;
}

function deleteRoom(id) {
    if (!confirm('Delete room id=' + id + '?')) return;
    fetch(API + '/rooms/' + id, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => loadRooms())
        .catch(e => alert('Error: ' + e));
}

function clearForm() {
    document.getElementById('roomId').value = '';
    document.getElementById('type').value = '';
    document.getElementById('price').value = '';
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
